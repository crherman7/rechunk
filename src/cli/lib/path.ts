import fs from 'fs';
import {globSync} from 'glob';
import path from 'path';

/**
 * Retrieves the ios path from the project root.
 *
 * This function checks for the presence of `ios` directory in the
 * root directory of the project. If the file exists, it reads and returns
 * the path to `ios` directory.
 *
 * @param {string} [dir=process.cwd()] - The directory to start searching for the ios directory. Defaults to the current working directory.
 * @returns {string} - The path to the iso directory.
 * @throws Will throw an error if the `ios` directory is not found.
 */
export function getIOSPath(dir: string = process.cwd()): string {
  const iosPath = path.resolve(dir, 'ios');

  if (!fs.existsSync(iosPath)) {
    throw new Error('[ReChunk]: cannot find path for ios directory.');
  }

  return iosPath;
}

/**
 * Retrieves the Info.plist path from the project root.
 *
 * This function checks for the presence of `Info.plist` file in ios directory of the project.
 * If the file exists, it reads and returns the path to `Info.plist` file.
 *
 * @param {string} [dir=getIOSPath()] - The ios directory to start searching for the `Info.plist` file. Defaults to the path to ios directory.
 * @returns {string} - The path to the `Info.plist` file.
 * @throws Will throw an error if the `Info.plist` file is not found.
 */
export function getInfoPlistPath(dir: string = getIOSPath()): string {
  const infoPlistPath = globSync(`${dir}/**/Info.plist`, {
    ignore: [
      '**/Pods/**',
      '**/Build/**',
      '**/DerivedData/**',
      '**/*-tvOS*/**',
      '**/*Tests/**/Info.plist',
    ],
  })[0];

  if (!fs.existsSync(infoPlistPath)) {
    throw new Error('[ReChunk]: cannot find path for Info.plist file.');
  }

  return infoPlistPath;
}

/**
 * Retrieves the android path from the project root.
 *
 * This function checks for the presence of `android` directory in the
 * root directory of the project. If the file exists, it reads and returns
 * the path to `android` directory.
 *
 * @param {string} [dir=process.cwd()] - The directory to start searching for the android directory. Defaults to the current working directory.
 * @returns {string} - The path to the android directory.
 * @throws Will throw an error if the `android` directory is not found.
 */
export function getAndroidPath(dir: string = process.cwd()): string {
  const androidPath = path.resolve(dir, 'android');

  if (!fs.existsSync(androidPath)) {
    throw new Error('[ReChunk]: cannot find path for android directory.');
  }

  return androidPath;
}

/**
 * Retrieves the strings.xml path from the project root.
 *
 * This function checks for the presence of `strings.xml` file in android directory of the project.
 * If the file exists, it reads and returns the path to `strings.xml` file.
 *
 * @param {string} [dir=getAndroidPath()] - The android directory to start searching for the `strings.xml` file. Defaults to the path to ios directory.
 * @returns {string} - The path to the `strings.xml` file.
 * @throws Will throw an error if the `strings.xml` file is not found.
 */
export function getStringsXmlPath(dir: string = getAndroidPath()): string {
  const stringsXmlPath = path.resolve(
    dir,
    'app',
    'src',
    'main',
    'res',
    'values',
    'strings.xml',
  );

  if (!fs.existsSync(stringsXmlPath)) {
    throw new Error(
      '[ReChunk]: cannot find path for strings.xml file in android directory.',
    );
  }

  return stringsXmlPath;
}