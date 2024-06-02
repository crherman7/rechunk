import {
  type X2jOptions,
  XMLBuilder,
  type XmlBuilderOptions,
  XMLParser,
} from 'fast-xml-parser';
import fs from 'fs';
import plist, {type PlistJsObj} from 'simple-plist';

/**
 * Parses and modifies the `Info.plist` file.
 *
 * This function provides the given callback with the parsed data
 * and writes the new data back to the file.
 *
 * @param {string} path - The path to `Info.plist` file.
 * @param {function(T): void} callback - Callback with the parsed data of the `Info.plist` file.
 * @template T
 * @returns {void}
 */
export function withPlist<T>(path: string, callback: (plist: T) => T): void {
  plist.writeFileSync(path, callback(plist.readFileSync(path)) as PlistJsObj);
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
