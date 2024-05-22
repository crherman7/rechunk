#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const format = require('format-package').default;

const workingPath = process.cwd();

const oldPackageJson = JSON.parse(
  fs.readFileSync(path.resolve(workingPath, 'package.json.bak'), 'utf8'),
);

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(workingPath, 'package.json'), 'utf8'),
);

format({
  ...packageJson,
  private: oldPackageJson.private,
  workspaces: oldPackageJson.workspaces,
}).then(res => {
  fs.writeFileSync(path.resolve(workingPath, 'package.json'), res);

  fs.unlinkSync(path.resolve(workingPath, 'package.json.bak'));
});
