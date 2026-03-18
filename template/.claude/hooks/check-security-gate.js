#!/usr/bin/env node
/**
 * Hook: check-security-gate (enforces Section 6)
 *
 * Two checks:
 *
 * 1. spec/security.md gate — blocks writes to apps/ or packages/ unless
 *    spec/security.md exists (security checklist must be written before implementation)
 *
 * 2. Hardcoded secrets scan — blocks writes containing obvious hardcoded
 *    secrets: connection strings with credentials, raw API keys, hardcoded passwords
 *
 * Exit 0 = allow  |  Exit 2 = block (message shown to Claude)
 */

const fs   = require('fs')
const path = require('path')

// Patterns that indicate hardcoded secrets
const SECRET_PATTERNS = [
  // Postgres/MySQL connection strings with credentials embedded
  { pattern: /postgres(?:ql)?:\/\/[^:]+:[^@]+@/i,  label: 'PostgreSQL connection string with credentials' },
  { pattern: /mysql:\/\/[^:]+:[^@]+@/i,             label: 'MySQL connection string with credentials' },
  // Generic password assignments
  { pattern: /password\s*[:=]\s*["'][^"']{4,}["']/i, label: 'Hardcoded password' },
  // JWT secret hardcoded
  { pattern: /jwt_?secret\s*[:=]\s*["'][^"']{4,}["']/i, label: 'Hardcoded JWT secret' },
  // API keys
  { pattern: /api_?key\s*[:=]\s*["'][a-zA-Z0-9_\-]{16,}["']/i, label: 'Hardcoded API key' },
  // AWS
  { pattern: /AKIA[0-9A-Z]{16}/,                    label: 'AWS Access Key ID' },
  // Common secret variable names with hardcoded values
  { pattern: /secret\s*[:=]\s*["'][^"']{8,}["']/i,  label: 'Hardcoded secret value' },
]

// File extensions to scan
const SCAN_EXTENSIONS = ['.ts', '.js', '.tsx', '.jsx', '.py', '.go', '.env']

async function main() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  let input
  try { input = JSON.parse(Buffer.concat(chunks).toString()) }
  catch { process.exit(0) }

  const filePath = input.tool_input?.file_path ?? input.tool_input?.path ?? ''
  const content  = input.tool_input?.content ?? input.tool_input?.new_string ?? ''
  const cwd      = process.cwd()
  const rel      = filePath.startsWith(cwd)
    ? filePath.slice(cwd.length + 1)
    : filePath.replace(/^\/+/, '')

  const isImplementation = ['apps/', 'packages/'].some(d => rel.startsWith(d))
  if (!isImplementation) process.exit(0)

  // ── Check 1: spec/security.md must exist before any implementation ────────
  const securitySpec = path.join(cwd, 'spec/security.md')
  if (!fs.existsSync(securitySpec)) {
    const stateFile = path.join(cwd, '.claude/workflow.state.json')
    let completed = []
    try { completed = JSON.parse(fs.readFileSync(stateFile, 'utf8')).completed ?? [] } catch {}

    // Only enforce after architecture is done (don't block early setup files)
    if (completed.includes('architecture')) {
      console.error(
        `\n🚫  GATE BLOCKED — spec/security.md does not exist (Section 6)\n` +
        `\n` +
        `You are trying to write implementation code to: ${rel}\n` +
        `\n` +
        `Before writing backend or frontend implementation, you must write\n` +
        `spec/security.md with an OWASP-oriented security checklist covering:\n` +
        `  - Input validation approach\n` +
        `  - Authentication and session management\n` +
        `  - Secrets management (env vars, never hardcoded)\n` +
        `  - HTTPS and transport security\n` +
        `  - CSRF protection (if applicable)\n` +
        `  - SQL injection / query injection prevention\n` +
        `  - Error handling (no stack traces to client)\n` +
        `\n` +
        `Write spec/security.md first, then retry.\n`
      )
      process.exit(2)
    }
  }

  // ── Check 2: Scan for hardcoded secrets ──────────────────────────────────
  const ext = path.extname(rel).toLowerCase()
  if (!SCAN_EXTENSIONS.includes(ext)) process.exit(0)
  if (!content) process.exit(0)

  // Skip .env.example files — they are allowed to have placeholder values
  if (rel.endsWith('.env.example')) process.exit(0)

  // Skip test files — mock values are expected
  if (/\.(test|spec)\.[tj]sx?$/.test(rel) || rel.includes('/tests/') || rel.includes('/__tests__/')) {
    process.exit(0)
  }

  // Exclude lines that use process.env or import.meta.env (legitimate)
  const lines = content.split('\n')
  for (const { pattern, label } of SECRET_PATTERNS) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      // Skip if the line uses env vars
      if (/process\.env|import\.meta\.env|env\(["']/.test(line)) continue
      // Skip comments
      if (/^\s*(\/\/|#|\/\*)/.test(line)) continue

      if (pattern.test(line)) {
        console.error(
          `\n🚫  GATE BLOCKED — Hardcoded secret detected (Section 6)\n` +
          `\n` +
          `File: ${rel}\n` +
          `Line: ${i + 1}\n` +
          `Issue: ${label}\n` +
          `\n` +
          `Never hardcode secrets in source code. Use environment variables:\n` +
          `  // ❌ Bad\n` +
          `  const secret = "my-real-secret"\n` +
          `\n` +
          `  // ✅ Good\n` +
          `  const secret = process.env.MY_SECRET\n` +
          `\n` +
          `Add the variable to .env.example (with a placeholder) and document\n` +
          `it so the user knows to set it in .env.\n`
        )
        process.exit(2)
      }
    }
  }

  process.exit(0)
}

main().catch(() => process.exit(0))
