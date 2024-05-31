import {
  type X2jOptions,
  XMLBuilder,
  type XmlBuilderOptions,
  XMLParser,
} from 'fast-xml-parser';
import fs from 'fs';

/**
 * Update the content of the file with new content.
 *
 * This function synchronously replacing content of the file with new one.
 *
 * @param {string} path - The path to file.
 * @param {RegExp | string} content - The RegExp or string of the searching content.
 * @param {string} newContent - The new content for searching group.
 * @returns {void}
 * @throws Will throw an error if the file will not contain such content
 */
export function updateFile(
  path: string,
  content: RegExp | string,
  newContent: string,
): void {
  if (!doesKeywordExist(path, content)) {
    throw new Error(`[ReChunk]: couldn't find ${content} in ${path}`);
  }

  const fileContent = fs.readFileSync(path, {
    encoding: 'utf8',
  });

  fs.writeFileSync(path, fileContent.replace(content, newContent));
}

/**
 * Checks if the keyword exists in the file.
 *
 * This function synchronously if the keyword exists in the file.
 *
 * @param {string} path - The path to file.
 * @param {RegExp | string} keyword - The RegExp or string of the searching content.
 * @returns {boolean} - THe Boolean value that depends on whether the keyword exists in the file.
 * @throws Will throw an error if the path will reference the directory or an error will occur when reading the file.
 */
export function doesKeywordExist(
  path: string,
  keyword: RegExp | string,
): boolean {
  try {
    const fileContent = fs.readFileSync(path, {
      encoding: 'utf8',
    });

    return typeof keyword === 'string'
      ? fileContent.includes(keyword)
      : keyword.test(fileContent);
  } catch {
    throw new Error(`[ReChunk]: cannot find file by this path - ${path}`);
  }
}

/**
 * Parses and modifies the XML file.
 *
 * This function provides the given callback with the parsed data
 * and writes the new data back to the file.
 *
 * @param {string} path - The path to `xml` file.
 * @param {function(T): void} callback - Callback with the parsed data of the XML file.
 * @param {Object} [options] - Optional property for parsing and building XML file.
 * @param {X2jOptions} [options.parse] - Configuration for parse XML file.
 * @param {XmlBuilderOptions} [options.build] - Configuration for build XML file.
 * @template T
 * @returns {void}
 */
export function withXml<T>(
  path: string,
  callback: (xml: T) => void,
  options?: {
    parse?: X2jOptions;
    build?: XmlBuilderOptions;
  },
): void {
  const baseOptions = {
    attributeNamePrefix: '',
    attributesGroupName: '_attribute_name',
    textNodeName: '_attribute_value',
    ignoreAttributes: false,
    indentBy: '    ',
  };

  const xml = new XMLParser({
    isArray: tagName => ['string'].indexOf(tagName) !== -1,
    ...baseOptions,
    ...options?.parse,
  }).parse(fs.readFileSync(path));

  callback(xml);
  fs.writeFileSync(
    path,
    new XMLBuilder({
      format: true,
      ...baseOptions,
      ...options?.build,
    }).build(xml),
  );
}

/**
 * Represents utils type for parsing the strings array in the `strings.xml` file.
 */
export type StringArrayElementsType = {
  resources: {
    string?: Array<{
      _attribute_value: string;
      _attribute_name: {name: string};
    }>;
  };
};
