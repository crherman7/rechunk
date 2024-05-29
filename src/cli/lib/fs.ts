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
