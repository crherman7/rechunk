import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import {type ShikiTransformer} from 'shiki/core';

import {transformerMetaFilename} from './metaFilename';
import {transformerMetaLineNumbers} from './metaLimenumbers';

const matchAlgorithm = {matchAlgorithm: 'v3'} as const;

export const shikiTransformers: ShikiTransformer[] = [
  transformerNotationDiff(matchAlgorithm),
  transformerNotationHighlight(matchAlgorithm),
  transformerNotationWordHighlight(matchAlgorithm),
  transformerMetaWordHighlight(),
  transformerMetaHighlight(),
  transformerMetaLineNumbers(),
  transformerMetaFilename(),
];
