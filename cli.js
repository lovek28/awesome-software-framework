#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TEMPLATE_DIR = path.join(__dirname, 'template');

const STANDARD_STACK = {
  frontend: 'nextjs',
  backend: 'fastify',
  database: 'postgres',
  orm: 'prisma',
  styling: 'tailwind',
};

const STACK_OPTIONS = {
  frontend: [
    { value: 'nextjs', label: 'Next.js' },
    { value: 'remix', label: 'Remix' },
    { value: 'react-vite', label: 'React (Vite)' },
  ],
  backend: [
    { value: 'fastify', label: 'Fastify' },
    { value: 'express', label: 'Express' },
    { value: 'nestjs', label: 'NestJS' },
  ],
  database: [
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
  ],
  orm: [
    { value: 'prisma', label: 'Prisma' },
    { value: 'drizzle', label: 'Drizzle' },
    { value: 'typeorm', label: 'TypeORM' },
  ],
  styling: [
    { value: 'tailwind', label: 'Tailwind CSS' },
    { value: 'css-modules', label: 'CSS Modules' },
    { value: 'styled-components', label: 'styled-components' },
  ],
};

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

function question(rl, prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function promptChoice(rl, category, options) {
  const lines = [
    '',
    `${category}:`,
    ...options.map((o, i) => `  ${i + 1}) ${o.label} (${o.value})`),
    `  Enter number [1-${options.length}] (default 1): `,
  ];
  const answer = await question(rl, lines.join('\n'));
  const num = parseInt((answer || '1').trim(), 10);
  const index = (isNaN(num) || num < 1 || num > options.length) ? 0 : num - 1;
  return options[index].value;
}

async function selectStack(rl) {
  let useStandard = await question(
    rl,
    'Use standard stack? (Next.js, Fastify, Postgres, Prisma, Tailwind) [Y/n]: '
  );
  useStandard = (useStandard || 'y').trim().toLowerCase();
  if (useStandard === '' || useStandard === 'y' || useStandard === 'yes') {
    return { ...STANDARD_STACK };
  }

  console.log('\nSelect your stack (or press Enter for default):');
  const stack = {};
  stack.frontend = await promptChoice(rl, 'Frontend', STACK_OPTIONS.frontend);
  stack.backend = await promptChoice(rl, 'Backend', STACK_OPTIONS.backend);
  stack.database = await promptChoice(rl, 'Database', STACK_OPTIONS.database);
  stack.orm = await promptChoice(rl, 'ORM', STACK_OPTIONS.orm);
  stack.styling = await promptChoice(rl, 'Styling', STACK_OPTIONS.styling);
  return stack;
}

async function main() {
  const args = process.argv.slice(2);
  const projectName = args.find((a) => !a.startsWith('-'));
  const useStandardNonInteractive = args.includes('--yes') || args.includes('-y');

  if (!projectName) {
    console.error('Usage: npx create-awesome-software <project-name> [options]');
    console.error('Options:');
    console.error('  --yes, -y    Use standard stack without prompting');
    process.exit(1);
  }

  const cwd = process.cwd();
  const projectPath = path.join(cwd, projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  let stack;
  if (useStandardNonInteractive) {
    stack = { ...STANDARD_STACK };
    console.log('\nUsing standard stack (Next.js, Fastify, Postgres, Prisma, Tailwind).');
  } else {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    stack = await selectStack(rl);
    rl.close();
  }

  fs.mkdirSync(projectPath, { recursive: true });
  copyRecursive(TEMPLATE_DIR, projectPath);

  fs.writeFileSync(
    path.join(projectPath, 'stack.config.json'),
    JSON.stringify(stack, null, 2)
  );

  console.log('');
  console.log('Project created: ' + projectName);
  console.log('Stack: ' + [stack.frontend, stack.backend, stack.database, stack.orm, stack.styling].join(', '));
  console.log('');
  console.log('  cd ' + projectName);
  console.log('  Open the project in VS Code and start building with Claude.');
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
