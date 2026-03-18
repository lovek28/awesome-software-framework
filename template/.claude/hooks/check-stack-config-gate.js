#!/usr/bin/env node
/**
 * Hook: check-stack-config-gate (enforces Section 4)
 *
 * Runs before Write/Edit on stack.config.json.
 * Blocks the write unless the new content contains the three required keys:
 *   frontend, backend, database (each can be a value or "none")
 *
 * Exit 0 = allow  |  Exit 2 = block (message shown to Claude)
 */

const fs   = require('fs')
const path = require('path')

async function main() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  let input
  try { input = JSON.parse(Buffer.concat(chunks).toString()) }
  catch { process.exit(0) }

  const filePath = input.tool_input?.file_path ?? input.tool_input?.path ?? ''
  const cwd      = process.cwd()
  const rel      = filePath.startsWith(cwd)
    ? filePath.slice(cwd.length + 1)
    : filePath.replace(/^\/+/, '')

  if (!rel.endsWith('stack.config.json')) process.exit(0)

  // Parse new content
  let newConfig
  try {
    if (input.tool_input?.content) {
      newConfig = JSON.parse(input.tool_input.content)
    } else if (input.tool_input?.new_string) {
      // Try to parse the new_string as partial JSON — best effort
      const match = input.tool_input.new_string.match(/\{[\s\S]*\}/)
      if (match) newConfig = JSON.parse(match[0])
    }
  } catch { process.exit(0) }

  if (!newConfig) process.exit(0)

  // Allow empty object (initial state before stack questions are answered)
  if (Object.keys(newConfig).length === 0) process.exit(0)

  const REQUIRED_KEYS = ['frontend', 'backend', 'database']
  const missing = REQUIRED_KEYS.filter(k => !(k in newConfig))

  if (missing.length > 0) {
    console.error(
      `\n🚫  GATE BLOCKED — stack.config.json is missing required keys (Section 4)\n` +
      `\n` +
      `Missing keys: ${missing.join(', ')}\n` +
      `\n` +
      `stack.config.json must contain at least:\n` +
      `  "frontend":  "nextjs" | "react" | "vue" | "none"\n` +
      `  "backend":   "fastify" | "express" | "none"\n` +
      `  "database":  "postgres" | "mysql" | "sqlite" | "none"\n` +
      `\n` +
      `Set missing keys to "none" if not needed. Do not leave them absent.\n` +
      `Example:\n` +
      `  {\n` +
      `    "frontend": "nextjs",\n` +
      `    "backend":  "fastify",\n` +
      `    "database": "postgres",\n` +
      `    "orm":      "prisma",\n` +
      `    "styling":  "tailwind"\n` +
      `  }\n`
    )
    process.exit(2)
  }

  process.exit(0)
}

main().catch(() => process.exit(0))
