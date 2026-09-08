/**
 * rehype-annotations —— v2 模板的两个正文语法（站长点名保留）
 *
 * 1. 荧光划线   `==text==`   → <mark class="pen">text</mark>
 *    纯语义元素 + CSS 动效（滚动到位时黄色从左向右扫过）。
 *
 * 2. 侧栏批注   `^[text]`    → <sup class="sn-ref">N</sup> + 段落后的
 *    <aside class="sidenote">。桌面端浮入右侧注栏，窄屏折叠为行内注。
 *
 * 工程约束（依据 260908-motion-tech.research.md §6.2）：
 * - 不做逐字 span 拆分（读屏实测翻车）；只做元素级标记，DOM 完好。
 * - 跳过 code / pre / a / mark 内部，避免与代码内容冲突。
 * - 编号 per-document 递增。
 */

import { visit } from 'unist-util-visit';
import type { Root, Element, ElementContent, Text } from 'hast';

const PEN_RE = /==([^=]+)==/;
const NOTE_RE = /\^\[([^\]]+)\]/;

interface Note {
  n: number;
  content: string;
}

export function rehypeAnnotations() {
  return (tree: Root) => {
    let counter = 0;
    const pendingNotes: Note[] = [];

    /** 递归处理某个元素的内容数组 */
    function processChildren(children: ElementContent[]): ElementContent[] {
      const out: ElementContent[] = [];
      for (const node of children) {
        if (node.type === 'text') {
          out.push(...splitText(node));
        } else if (node.type === 'element') {
          if (node.tagName === 'code' || node.tagName === 'pre' || node.tagName === 'mark' || node.tagName === 'sup') {
            out.push(node);
            continue;
          }
          node.children = processChildren(node.children);
          out.push(node);
        } else {
          out.push(node);
        }
      }
      return out;
    }

    /** 把一个文本节点按 ==…== 与 ^[…] 切开 */
    function splitText(node: Text): ElementContent[] {
      const parts: ElementContent[] = [];
      let rest = node.value;
      let guard = 0;
      while (rest.length > 0 && guard++ < 100) {
        const pen = rest.match(PEN_RE);
        const note = rest.match(NOTE_RE);
        // 取先出现者
        const useNote = note !== null && (pen === null || (note.index ?? 0) < (pen.index ?? 0));
        const m = useNote ? note : pen;
        if (m === null || m.index === undefined) {
          parts.push({ type: 'text', value: rest });
          break;
        }
        if (m.index > 0) parts.push({ type: 'text', value: rest.slice(0, m.index) });
        if (useNote) {
          counter += 1;
          parts.push({
            type: 'element',
            tagName: 'sup',
            properties: { className: ['sn-ref'], id: `sn-ref-${counter}`, 'aria-describedby': `sn-${counter}` },
            children: [{ type: 'text', value: String(counter) }],
          });
          pendingNotes.push({ n: counter, content: m[1] });
        } else {
          parts.push({
            type: 'element',
            tagName: 'mark',
            properties: { className: ['pen'] },
            children: [{ type: 'text', value: m[1] }],
          });
        }
        rest = rest.slice(m.index + m[0].length);
      }
      return parts;
    }

    // 段后附加 sidenote（作为兄弟节点插入——aside 不能嵌在 p 里）
    const insertions: { parent: any; index: number; node: ElementContent }[] = [];

    visit(tree, 'element', (el: Element, index, parent) => {
      if (el.tagName !== 'p' || !parent) return;
      pendingNotes.length = 0;
      el.children = processChildren(el.children);
      for (const note of pendingNotes) {
        insertions.push({
          parent: parent as Element,
          index: (index ?? 0) + 1,
          node: {
            type: 'element',
            tagName: 'aside',
            properties: { className: ['sidenote'], id: `sn-${note.n}`, role: 'note' },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['sn-ref-echo'] },
                children: [{ type: 'text', value: String(note.n) }],
              },
              { type: 'text', value: ` ${note.content}` },
            ],
          },
        });
      }
    });

    // 逆文档序插入，保证前面的索引不失效
    for (const ins of insertions.reverse()) {
      ins.parent.children.splice(ins.index, 0, ins.node);
    }

    return tree;
  };
}
