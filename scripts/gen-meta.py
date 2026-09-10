#!/usr/bin/env python3
"""
gen-meta.py — 从 dsh 会话树提取生成遥测，输出 YAML frontmatter 片段。

给定一个根会话 ID（或自动选取 cwd 下最近的顶层会话），递归收集所有
子代理会话，累加 token / step 统计，提取 model / duration / skills /
prompt，输出可直接粘贴进文章 frontmatter 的 YAML 片段；--write 直接
回写文章 frontmatter。

prompt 字段 = 根会话中用户发过的所有消息（用户的 co-author 完整记录）：
  - source.kind == 'user' 的 user/message 文本，按时间排序
  - 排除系统注入：<system-reminder>、compaction checkpoint、
    'dsh just restarted*'（重启后自动续跑）、裸 'continue'（恢复机制）
  - 并入 ask_user_question 的问答选择（用户的显式决策，问→答配对）

model 字段 = 会话树全部 request/header 出现过的模型（按请求数降序，
' + ' 连接）——多模型/跨代路由的会话如实呈现。

Usage:
  python3 scripts/gen-meta.py [--session <id>] [--cwd <dir>] [--write <article.md>]

  --session <id>   根会话 ID（默认：自动选取最新活动的 depth=0 会话）
  --cwd <dir>      项目目录（默认：当前工作目录）
  --write <file>   直接回写文章 frontmatter（而非打印 YAML 片段）

退出码 0=成功，1=找不到会话，2=解析错误。
"""

import sys, json, os, glob, re, subprocess, argparse, collections


def _zstd_lines(filepath):
    """流式解压 session.jsonl.zstd，逐行 yield。"""
    proc = subprocess.Popen(
        ['zstd', '-dc', filepath],
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
    )
    for raw in proc.stdout:
        line = raw.decode('utf-8', errors='replace').strip()
        if line:
            yield line
    proc.wait()


def _zstd_decode(filepath):
    """解压 session.jsonl.zstd，返回事件列表（跳过坏行）。"""
    events = []
    for line in _zstd_lines(filepath):
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return events


def read_header(filepath):
    """只读会话首行 header 事件。"""
    for line in _zstd_lines(filepath):
        try:
            obj = json.loads(line)
            return obj.get('data', obj)
        except json.JSONDecodeError:
            continue
    return None


def build_tree(session_dir):
    """扫描目录下所有会话，建 parent→[(child_id, path)] 映射。"""
    tree = collections.defaultdict(list)
    for filepath in glob.glob(os.path.join(session_dir, '*/session.jsonl.zstd')):
        h = read_header(filepath)
        if not h:
            continue
        sid = h.get('id')
        parent = h.get('parentSession')
        tree[parent or ''].append((sid, filepath))
    return tree


def collect_descendants(root_id, tree):
    """BFS 收集 root_id 的所有后代会话（递归含子代理的子代理）。"""
    result = []
    seen = set()
    queue = [root_id]
    while queue:
        cur = queue.pop(0)
        if cur in seen:
            continue
        seen.add(cur)
        for child_id, child_path in tree.get(cur, []):
            result.append((child_id, child_path))
            queue.append(child_id)
    return result


# ——————————————— 用户消息过滤规则 ———————————————

# 重启/恢复机制自动注入的续跑消息（非用户键入）
HUMAN_EXCLUDE_EXACT = {'continue'}
HUMAN_EXCLUDE_PREFIXES = ('dsh just restarted',)


def _is_human_message(text):
    """判断一段 user/message 文本是否为真人输入。"""
    t = text.strip()
    if not t:
        return False
    if '<system-reminder>' in t:
        return False
    if t.startswith('This is an automatically generated checkpoint'):
        return False
    if t in HUMAN_EXCLUDE_EXACT:
        return False
    if any(t.startswith(p) for p in HUMAN_EXCLUDE_PREFIXES):
        return False
    return True


_SKILL_CONTENT_RE = re.compile(r'<skill_content name="([^"]+)">')


def extract(events, is_root=False):
    """从单个会话的事件流提取指标与用户消息。"""
    models = collections.Counter()
    tok_in = tok_out = 0
    steps = 0
    skills = []
    first_turn = last_turn = None
    human_msgs = []   # (time, text) —— 仅根会话有真人消息
    questions = {}    # callId -> {qid: question} —— ask_user_question 配对

    for e in events:
        t = e.get('type')
        d = e.get('data', {})

        if t == 'request/header':
            cfg = d.get('header', {}).get('config', {})
            mdl = cfg.get('model', '')
            if mdl:
                models[mdl] += 1

        elif t == 'assistant/chunk':
            chunk = d.get('chunk', {})
            if chunk.get('type') == 'usage':
                u = chunk.get('usage', {})
                tok_in += u.get('inputTokens', 0)
                tok_out += u.get('outputTokens', 0)

        elif t == 'step/end':
            steps += 1

        elif t == 'turn/start' and first_turn is None:
            first_turn = e.get('time')

        elif t == 'turn/end':
            last_turn = e.get('time')

        elif t == 'tool/call':
            name = d.get('name')
            if name == 'skill':
                try:
                    args = json.loads(d.get('arguments', '{}'))
                    sn = args.get('name')
                    if sn and sn not in skills:
                        skills.append(sn)
                except json.JSONDecodeError:
                    pass
            elif name == 'ask_user_question':
                try:
                    args = json.loads(d.get('arguments', '{}'))
                    qs = {q.get('id'): q.get('question', '') for q in args.get('questions', [])}
                    questions[d.get('callId')] = qs
                except (json.JSONDecodeError, AttributeError):
                    pass

        elif t == 'tool/result':
            msg = d.get('message', {})
            src = msg.get('source', {})
            call_id = src.get('callId')
            if src.get('kind') == 'tool' and call_id in questions:
                for c in (msg.get('content') or []):
                    if c.get('type') != 'tool-result':
                        continue
                    for cc in (c.get('content') or []):
                        if cc.get('type') != 'text':
                            continue
                        try:
                            ans = json.loads(cc.get('text', '{}'))
                        except json.JSONDecodeError:
                            continue
                        parts = []
                        for a in ans.get('answers', []):
                            sel = ' / '.join(a.get('selected', []))
                            q = questions[call_id].get(a.get('id'), a.get('id', ''))
                            if sel:
                                parts.append(f'{q} → {sel}')
                        if parts:
                            human_msgs.append(
                                (e.get('time'), '【问答决策】' + '；'.join(parts))
                            )

        elif t == 'user/message':
            kind = d.get('source', {}).get('kind')
            texts = [c.get('text', '') for c in (d.get('content') or []) if c.get('type') == 'text']
            # 斜杠命令展开的技能（skill_content 注入，任意 kind）→ skills 列表
            for txt in texts:
                m = _SKILL_CONTENT_RE.match(txt.strip())
                if m and m.group(1) not in skills:
                    skills.append(m.group(1))
            # 真人消息（仅根会话收录）
            if kind == 'user':
                joined = '\n'.join(x for x in texts if x.strip())
                if _is_human_message(joined):
                    human_msgs.append((e.get('time'), joined.strip()))

    duration = int((last_turn - first_turn) / 1000) if first_turn and last_turn else 0

    return {
        'models': models,
        'tokens_in': tok_in,
        'tokens_out': tok_out,
        'steps': steps,
        'first_turn': first_turn,
        'last_turn': last_turn,
        'duration_s': duration,
        'skills': skills,
        'human_msgs': sorted(human_msgs, key=lambda x: x[0] or 0),
    }


def yaml_escape_string(s):
    """转义 YAML 字符串值——长文本用 block scalar，短文本用引号。"""
    if not s:
        return '""'
    if len(s) > 80 or '\n' in s:
        lines = s.split('\n')
        block = '\n'.join(f'  {line}'.rstrip() for line in lines)
        return f'|-\n{block}'
    return f"'{s.replace(chr(39), chr(39)*2)}'"


# ——————————————— frontmatter 回写 ———————————————

# --write 时会被脚本覆盖的字段（其余字段不动）
PATCH_KEYS = {'model', 'duration_s', 'steps', 'tokens_in', 'tokens_out', 'agents', 'skills', 'prompt'}


def _render_fm_value(key, meta):
    if key == 'skills':
        inner = ', '.join(meta['skills'])
        return f'skills: [{inner}]'
    if key == 'prompt':
        return 'prompt: ' + yaml_escape_string(meta['prompt'])
    return f'{key}: {meta[key]}'


def patch_frontmatter(path, meta):
    """把 meta 中的字段回写进文章 frontmatter，其余行保持原样。"""
    with open(path, encoding='utf-8') as f:
        text = f.read()
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not m:
        raise RuntimeError(f'frontmatter 未找到: {path}')
    lines = m.group(1).split('\n')
    out, i, replaced = [], 0, set()
    while i < len(lines):
        line = lines[i]
        km = re.match(r'^([a-zA-Z_]+):', line)
        key = km.group(1) if km else None
        if key in PATCH_KEYS:
            out.append(_render_fm_value(key, meta))
            replaced.add(key)
            # 跳过该字段的块值行（列表/块标量的缩进续行）
            i += 1
            while i < len(lines) and not re.match(r'^([a-zA-Z_]+):', lines[i]):
                i += 1
            continue
        out.append(line)
        i += 1
    missing = PATCH_KEYS - replaced
    if missing:
        raise RuntimeError(f'frontmatter 缺少字段: {sorted(missing)}')
    new_text = '---\n' + '\n'.join(out) + '\n---\n' + text[m.end():]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    return sorted(replaced)


def main():
    ap = argparse.ArgumentParser(description='Extract generation telemetry from dsh session tree.')
    ap.add_argument('--session', help='Root session ID (default: latest active depth-0 session)')
    ap.add_argument('--cwd', default=os.getcwd(), help='Project directory (default: CWD)')
    ap.add_argument('--write', metavar='ARTICLE_MD',
                    help='Patch the article frontmatter in place instead of printing YAML')
    args = ap.parse_args()

    # 将 cwd 编码为 dsh session 目录名：去首 / → --，每个 / → -，末尾 --
    cwd = os.path.abspath(args.cwd)
    if cwd.startswith('/'):
        dir_name = '--' + cwd[1:].replace('/', '-') + '--'
    else:
        dir_name = cwd.replace('/', '-') + '--'

    dsh_home = os.environ.get('DSH_HOME', os.path.expanduser('~/.dsh'))
    session_dir = os.path.join(dsh_home, 'sessions', dir_name)

    if not os.path.isdir(session_dir):
        print(f'# ERROR: session dir not found: {session_dir}', file=sys.stderr)
        print(f'#   (cwd={cwd}, dir_name={dir_name})', file=sys.stderr)
        print(f'#   pass --cwd or --session explicitly', file=sys.stderr)
        sys.exit(1)

    tree = build_tree(session_dir)

    # 选根会话
    root_id = args.session
    if not root_id:
        # 最新活动的 depth=0 会话（按文件 mtime——正在写入的会话 mtime 最新）
        roots = []
        for filepath in glob.glob(os.path.join(session_dir, '*/session.jsonl.zstd')):
            h = read_header(filepath)
            if h and not h.get('parentSession'):
                roots.append((os.path.getmtime(filepath), h.get('id'), filepath))
        if not roots:
            print('# ERROR: no depth-0 session found', file=sys.stderr)
            sys.exit(1)
        roots.sort(reverse=True)
        _, root_id, root_path = roots[0]
    else:
        matches = glob.glob(os.path.join(session_dir, f'*{root_id}*', 'session.jsonl.zstd'))
        if not matches:
            print(f'# ERROR: session {root_id} not found in {session_dir}', file=sys.stderr)
            sys.exit(1)
        root_path = matches[0]

    descendants = collect_descendants(root_id, tree)

    root_events = _zstd_decode(root_path)
    root = extract(root_events, is_root=True)

    children = []
    for cid, cpath in descendants:
        cev = _zstd_decode(cpath)
        children.append(extract(cev))

    # 聚合
    models = root['models']
    for c in children:
        models.update(c['models'])
    skills = list(dict.fromkeys(root['skills'] + [s for c in children for s in c['skills']]))
    steps = root['steps'] + sum(c['steps'] for c in children)
    tok_in = root['tokens_in'] + sum(c['tokens_in'] for c in children)
    tok_out = root['tokens_out'] + sum(c['tokens_out'] for c in children)

    # prompt = 根会话全部用户消息（含问答决策），时间序，'——' 分隔
    prompt = '\n\n——\n\n'.join(text for _, text in root['human_msgs'])

    model_str = ' + '.join(m for m, _ in models.most_common())

    meta = {
        'model': model_str or 'unknown',
        'duration_s': root['duration_s'],
        'steps': steps,
        'tokens_in': tok_in,
        'tokens_out': tok_out,
        'agents': 1 + len(children),
        'skills': skills,
        'prompt': prompt,
    }

    if args.write:
        patched = patch_frontmatter(args.write, meta)
        joined = ', '.join(patched)
        print(f'# patched {args.write}: {joined}')
        print(f'#   user messages: {len(root["human_msgs"])}, models: {model_str}')
        return

    print(f'# root: {root_id} ({len(root_events)} events)')
    print(f'# descendants: {len(children)} subagent sessions')
    print(f'# session dir: {session_dir}')
    print(f'# user messages: {len(root["human_msgs"])}')
    for k in ('model', 'duration_s', 'steps', 'tokens_in', 'tokens_out', 'agents'):
        print(f'{k}: {meta[k]!r}')
    print('skills:')
    for s in skills:
        print(f'  - {s}')
    print('prompt: ' + yaml_escape_string(prompt))


if __name__ == '__main__':
    main()
