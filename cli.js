#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, 'template');

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function main() {
  const projectName = process.argv[2];
  if (!projectName) {
    console.error('Usage: npx create-awesome-software <project-name>');
    process.exit(1);
  }

  const cwd = process.cwd();
  const projectPath = path.join(cwd, projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });
  copyRecursive(TEMPLATE_DIR, projectPath);

  console.log('');
  console.log('Project created: ' + projectName);
  console.log('');
  console.log('  cd ' + projectName);
  console.log('  Open the project in Cursor (or VS Code) and tell Claude what to build.');
  console.log('  Claude will ask you for tech stack and other choices, then run the pipeline.');
  console.log('');
}

main();
