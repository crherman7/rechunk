import {type ShikiTransformer} from 'shiki/core';

type TransformerOptions = {
  dataName?: string;
};

export function transformerMetaLineNumbers(
  options?: TransformerOptions,
): ShikiTransformer {
  const {dataName = 'data-line-number'} = options ?? {};

  return {
    name: '@rechunk/transformers:meta-line-numbers',
    pre(node) {
      const {meta} = this.options;

      if (meta?.__raw?.includes('nonumber')) return;

      node.properties[dataName] = true;
      const code = node.children.find(
        it => it.type === 'element' && it.tagName === 'code',
      );

      if (code?.type === 'element' && code.children.length) {
        let count = 1;

        code.children.forEach(it => {
          if (
            it.type === 'element' &&
            it.tagName === 'span' &&
            typeof it.properties?.class === 'string' &&
            it.properties?.class.includes('line')
          ) {
            it.properties[dataName] = count;
            count++;
          }
        });
      }
    },
  };
}
