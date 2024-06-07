declare module 'find-babel-config' {
  /**
   * Asynchronously finds the Babel configuration file starting from a given directory and searching up the directory tree to a specified depth.
   *
   * @param start - The starting directory to search from.
   * @param depth - The maximum number of directories to search upwards. Defaults to undefined, meaning unlimited depth.
   * @returns A promise that resolves with an object containing the path to the configuration file and the configuration itself.
   */
  declare function _exports(
    start: string,
    depth?: number,
  ): Promise<{file: any; config: any}>;

  declare namespace _exports {
    /**
     * Synchronously finds the Babel configuration file starting from a given directory and searching up the directory tree to a specified depth.
     *
     * @param start - The starting directory to search from.
     * @param depth - The maximum number of directories to search upwards. Defaults to undefined, meaning unlimited depth.
     * @returns An object containing the path to the configuration file and the configuration itself.
     */
    function sync(
      start: string,
      depth?: number,
    ): {
      file: any;
      config: any;
    };
  }
  export = _exports;
}
