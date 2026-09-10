/**
 * rehype-math-katex —— 在构建期使用 KaTeX 将 $...$ 和 $$...$$ 渲染为静态 MathML / HTML
 * 支持内联公式 $...$ 与块级公式 $$...$$
 */
import { visit } from 'unist-util-visit';
import type { Root, Element, ElementContent, Text } from 'hast';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const katex = require('katex');

// 匹配 $$...$$ (块级) 和 $...$ (行内，避免匹配转义 \$)
const MATH_BLOCK_RE = /\$\$([\s\S]+?)\$\$/;
const MATH_INLINE_RE = /(?<!\\)\$([^\$\n]+?)(?<!\\)\$/;

export function rehypeMathKatex() {
  return (tree: Root) => {
    function renderMathToHast(tex: string, displayMode: boolean): ElementContent | null {
      try {
        const html = katex.renderToString(tex.trim(), {
          displayMode,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
        // 将生成的 KaTeX HTML 作为 raw/element 节点包装
        return {
          type: 'element',
          tagName: displayMode ? 'div' : 'span',
          properties: {
            className: [displayMode ? 'katex-display-block' : 'katex-inline-block'],
          },
          children: [
            {
              type: 'raw' as any,
              value: html,
            },
          ],
        };
      } catch (e) {
        console.error('KaTeX error on:', tex, e);
        return { type: 'text', value: (displayMode ? `$$${tex}$$` : `$${tex}$`) };
      }
    }

    function splitTextForMath(node: Text): ElementContent[] {
      const parts: ElementContent[] = [];
      let rest = node.value;
      let guard = 0;

      while (rest.length > 0 && guard++ < 100) {
        const blockMatch = rest.match(MATH_BLOCK_RE);
        const inlineMatch = rest.match(MATH_INLINE_RE);

        const useBlock = blockMatch !== null && (inlineMatch === null || (blockMatch.index ?? 0) <= (inlineMatch.index ?? 0));
        const m = useBlock ? blockMatch : inlineMatch;

        if (m === null || m.index === undefined) {
          parts.push({ type: 'text', value: rest });
          break;
        }

        if (m.index > 0) {
          parts.push({ type: 'text', value: rest.slice(0, m.index) });
        }

        const rendered = renderMathToHast(m[1], useBlock);
        if (rendered) {
          parts.push(rendered);
        }

        rest = rest.slice(m.index + m[0].length);
      }
      return parts;
    }

    function processChildren(children: ElementContent[]): ElementContent[] {
      const out: ElementContent[] = [];
      for (const node of children) {
        if (node.type === 'text') {
          out.push(...splitTextForMath(node));
        } else if (node.type === 'element') {
          if (node.tagName === 'code' || node.tagName === 'pre' || node.tagName === 'svg' || node.tagName === 'math') {
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

    visit(tree, 'element', (el: Element) => {
      // 避免在 pre/code/script/style 里面处理
      if (['pre', 'code', 'script', 'style'].includes(el.tagName)) return;
      el.children = processChildren(el.children);
    });

    return tree;
  };
}
