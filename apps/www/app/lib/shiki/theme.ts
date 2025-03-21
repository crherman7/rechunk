import {createHighlighterCore} from 'shiki/core';
import {createJavaScriptRegexEngine} from 'shiki/engine/javascript';

function createShikiTheme() {
  return createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [import('@shikijs/themes/github-light')],
    langs: [
      import('@shikijs/langs/js'),
      import('@shikijs/langs/ts'),
      import('@shikijs/langs/jsx'),
      import('@shikijs/langs/tsx'),
      import('@shikijs/langs/html'),
      import('@shikijs/langs/css'),
      import('@shikijs/langs/json'),
      import('@shikijs/langs/diff'),
      import('@shikijs/langs/mdx'),
      import('@shikijs/langs/markdown'),
      import('@shikijs/langs/prisma'),
      import('@shikijs/langs/shellscript'),
      import('@shikijs/langs/bash'),
    ],
  });
}

let shikiTheme: Awaited<ReturnType<typeof createShikiTheme>> | undefined;
export async function getShikiTheme() {
  if (shikiTheme) return shikiTheme;

  const theme = await createShikiTheme();
  shikiTheme = theme;
  return theme;
}
