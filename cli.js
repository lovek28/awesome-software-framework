#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const TEMPLATE_DIR = path.join(__dirname, 'template');
const PACKAGE_JSON_PATH = path.join(__dirname, 'package.json');

function getFrameworkVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

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

function parseArgs(argv) {
  const args = argv.slice(2);
  let projectName = null;
  let outputDir = process.cwd();

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--version' || arg === '-v') {
      return { version: true };
    }
    if (arg === '--output-dir' || arg === '-o') {
      outputDir = args[i + 1];
      if (!outputDir || outputDir.startsWith('-')) {
        console.error('Error: --output-dir (-o) requires a path.');
        process.exit(1);
      }
      i++;
      continue;
    }
    if (!arg.startsWith('-') && projectName === null) {
      projectName = arg;
    }
  }

  return { projectName, outputDir };
}

function checkUpdate(currentVersion) {
  if (process.env.NO_UPDATE_CHECK === '1') return;

  const req = https.get(
    'https://registry.npmjs.org/create-awesome-software/latest',
    { timeout: 3000 },
    (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const latest = JSON.parse(data).version;
          if (latest && latest !== currentVersion) {
            console.log('Update available: ' + latest + ' (current: ' + currentVersion + ')');
          }
        } catch {
          // ignore parse errors
        }
      });
    }
  );

  req.on('timeout', () => { req.destroy(); });
  req.on('error', () => {});
}

function main() {
  const { version, projectName, outputDir } = parseArgs(process.argv);

  const frameworkVersion = getFrameworkVersion();

  if (version) {
    console.log(frameworkVersion);
    process.exit(0);
  }

  if (!projectName) {
    console.error('Usage: npx create-awesome-software <project-name> [options]');
    console.error('');
    console.error('Options:');
    console.error('  -v, --version       Print CLI version and exit');
    console.error('  -o, --output-dir    Parent directory for the new project (default: current directory)');
    console.error('');
    console.error('Example:');
    console.error('  npx create-awesome-software myapp -o ../projects');
    process.exit(1);
  }

  const projectPath = path.join(outputDir, projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory "${projectName}" already exists${outputDir !== process.cwd() ? ' in ' + outputDir : ''}.`);
    process.exit(1);
  }

  const parentDir = path.dirname(projectPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  fs.mkdirSync(projectPath, { recursive: true });
  copyRecursive(TEMPLATE_DIR, projectPath);

  // Write framework version so generated projects know which version they came from (for future upgrades).
  fs.writeFileSync(
    path.join(projectPath, '.framework-version'),
    frameworkVersion + '\n',
    'utf8'
  );

  checkUpdate(frameworkVersion);

  console.log('');
  console.log('Project created: ' + projectName);
  console.log('');
  console.log('  cd ' + (outputDir === process.cwd() ? projectName : projectPath));
  console.log('  Open the project in Cursor (or VS Code) and tell Claude what to build.');
  console.log('  Claude will ask you for tech stack and other choices, then run the pipeline.');
  console.log('');
}

main();
