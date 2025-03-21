import {type ShikiTransformer} from 'shiki/core';

type TransformerOptions = {
  dataName?: string;
};

export function transformerMetaFilename(
  options?: TransformerOptions,
): ShikiTransformer {
  const {dataName = 'data-filename'} = options ?? {};

  return {
    name: '@rechunk/transformers:meta-filename',
    pre(node) {
      const {meta} = this.options;
      if (!meta?.__raw) return;

      const [, filename] = meta.__raw.match(/filename=(\S+)/) ?? [];
      if (!filename) return;

      node.properties[dataName] = filename;
    },
  };
}
