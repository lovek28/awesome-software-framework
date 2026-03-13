# Publishing to GitHub

## 1. Create a repository on GitHub

1. Go to [github.com/new](https://github.com/new).
2. **Repository name**: e.g. `awesome-software-framework` (or `create-awesome-software`).
3. **Description** (optional): e.g. "Specification-first scaffold for building software with Claude Code".
4. Choose **Public**.
5. **Do not** add a README, .gitignore, or license (this repo already has them).
6. Click **Create repository**.

## 2. Connect and push from your machine

In your terminal, from this project folder:

```bash
# Add GitHub as remote (replace YOUR_USERNAME and REPO_NAME with your values)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or with SSH:
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# First commit (if you haven't already)
git add -A
git commit -m "Initial commit: Awesome Software Framework"

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. After publishing

- **Install command**: Users can run:
  ```bash
  npx create-awesome-software myapp
  ```
  npm will use the package name from `package.json` (`create-awesome-software`). To make `npx create-awesome-software` resolve to this repo before you publish to npm, they can run:
  ```bash
  npx github:YOUR_USERNAME/REPO_NAME myapp
  ```
  Or they can clone and run `node cli.js myapp` from the repo root.

- **Publishing to npm** (optional): If you want `npx create-awesome-software` to work without the `github:` prefix, publish the package to npm:
  1. Create an account at [npmjs.com](https://www.npmjs.com/signup).
  2. Run `npm login`, then `npm publish` from this directory (with a unique package name if `create-awesome-software` is taken).
