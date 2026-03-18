#!/usr/bin/env node
/**
 * Hook: check-architecture-decisions-gate (enforces Section 3a)
 *
 * Blocks writes to spec/architecture/ unless:
 *   .claude/gates/architecture-decisions.md exists
 *
 * This ensures Claude has reasoned through architecture decisions
 * and presented them to the user before writing any architecture spec.
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

  // Only enforce on architecture spec files
  if (!rel.startsWith('spec/architecture/')) process.exit(0)

  // Allow the decisions file itself to be written (that's the gate artifact)
  if (rel === 'spec/architecture/decisions.md') process.exit(0)

  // All other architecture files require the decisions gate to exist first
  const decisionsGate = path.join(cwd, '.claude/gates/architecture-decisions.md')
  if (!fs.existsSync(decisionsGate)) {
    console.error(
      `\n🚫  GATE BLOCKED — Architecture decisions not written (Section 3a)\n` +
      `\n` +
      `You are trying to write to: ${rel}\n` +
      `\n` +
      `Before writing any architecture spec, you must:\n` +
      `  1. Analyse the project context (scale, data complexity, real-time needs)\n` +
      `  2. Decide and justify: system style, code organisation, data pattern, API style, error strategy\n` +
      `  3. Present the decisions to the user and wait for approval\n` +
      `  4. Write the decisions to: .claude/gates/architecture-decisions.md\n` +
      `\n` +
      `Gate file format:\n` +
      `  # Architecture decisions\n` +
      `  ## Analysis\n` +
      `  [Your reasoning about scale, complexity, patterns]\n` +
      `  ## Decisions\n` +
      `  - System: ... (reason: ...)\n` +
      `  - Layers: ... (reason: ...)\n` +
      `  - Data: ... (reason: ...)\n` +
      `  - API: ... (reason: ...)\n` +
      `  - State: ... (reason: ...)\n` +
      `  - Errors: ... (reason: ...)\n` +
      `  ## User approval\n` +
      `  Approved: yes\n` +
      `\n` +
      `Write the gate file first, then retry.\n`
    )
    process.exit(2)
  }

  process.exit(0)
}

main().catch(() => process.exit(0))
