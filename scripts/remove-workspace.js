#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workingPath = process.cwd();

fs.copyFileSync(
  path.resolve(workingPath, 'package.json'),
  path.resolve('package.json.bak'),
);

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(workingPath, 'package.json'), 'utf8'),
);

const {
  workspaces,
  private: _private,
  ...packageJsonWithoutWorkspaces
} = packageJson;

fs.writeFileSync(
  path.resolve(workingPath, 'package.json'),
  `${JSON.stringify(packageJsonWithoutWorkspaces, null, 2)}\n`,
);
