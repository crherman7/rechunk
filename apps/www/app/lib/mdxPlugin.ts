import mdx from '@mdx-js/rollup';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeFormat from 'rehype-format';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

import {getShikiTheme, shikiTransformers} from './shiki';

export async function mdxPlugin() {
  return mdx({
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      remarkGfm,
      remarkParse,
      remarkFrontmatter,
      remarkMdxFrontmatter,
      remarkRehype,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeFormat,
      rehypeAutolinkHeadings,
      [
        rehypeShikiFromHighlighter,
        await getShikiTheme(),
        {
          theme: 'github-light',
          cssVariablePrefix: '--shiki-',
          inline: 'tailing-curly-colon',
          transformers: shikiTransformers,
        },
      ],
    ],
  });
}
