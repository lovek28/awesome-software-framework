#!/usr/bin/env node
/**
 * Hook: check-implementation-gate
 *
 * Runs before every Write/Edit tool call.
 * Blocks implementation code (apps/, packages/) from being written unless:
 *   1. The architecture stage is completed in workflow.state.json
 *   2. A reasoning gate file exists for the current implementation stage
 *
 * Exit 0 = allow  |  Exit 2 = block (message shown to Claude)
 */

const fs   = require('fs')
const path = require('path')

async function main() {
  // Read tool input from stdin
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  let input
  try { input = JSON.parse(Buffer.concat(chunks).toString()) }
  catch { process.exit(0) }

  const filePath = input.tool_input?.file_path ?? input.tool_input?.path ?? ''
  const cwd      = process.cwd()

  // Normalise to relative path
  const rel = filePath.startsWith(cwd)
    ? filePath.slice(cwd.length + 1)
    : filePath.replace(/^\/+/, '')

  // Only enforce on implementation directories
  const IMPLEMENTATION_DIRS = ['apps/', 'packages/domain', 'packages/services', 'packages/ui', 'packages/shared']
  const isImplementation = IMPLEMENTATION_DIRS.some(d => rel.startsWith(d) || rel.includes('/' + d))
  if (!isImplementation) process.exit(0)

  // ── Gate 1: Architecture must be completed ──────────────────────────────
  const stateFile = path.join(cwd, '.claude/workflow.state.json')
  if (!fs.existsSync(stateFile)) process.exit(0) // no state file yet — allow

  let state
  try { state = JSON.parse(fs.readFileSync(stateFile, 'utf8')) }
  catch { process.exit(0) }

  const completed = Array.isArray(state.completed) ? state.completed : []

  if (!completed.includes('architecture')) {
    console.error(
      `\n🚫  GATE BLOCKED — Architecture not completed\n` +
      `\n` +
      `You are trying to write to: ${rel}\n` +
      `\n` +
      `Implementation code cannot be written until the architecture stage\n` +
      `is completed and documented in spec/architecture/.\n` +
      `\n` +
      `Current stage : ${state.stage ?? 'unknown'}\n` +
      `Completed     : ${completed.length ? completed.join(', ') : 'none'}\n` +
      `\n` +
      `Complete the architecture stage first, then return to implementation.\n`
    )
    process.exit(2)
  }

  // ── Gate 2: Reasoning gate file must exist for this stage ───────────────
  const currentStage = state.stage ?? ''
  const gateFile     = path.join(cwd, `.claude/gates/${currentStage}-gate.md`)

  if (!fs.existsSync(gateFile)) {
    console.error(
      `\n🚫  GATE BLOCKED — Pre-code reasoning gate not completed\n` +
      `\n` +
      `You are trying to write to: ${rel}\n` +
      `\n` +
      `Before writing any implementation code for the "${currentStage}" stage,\n` +
      `you must complete the pre-code reasoning gate (Section 3c).\n` +
      `\n` +
      `Write your reasoning to:\n` +
      `  .claude/gates/${currentStage}-gate.md\n` +
      `\n` +
      `The gate file must answer all six questions from Section 3c:\n` +
      `  1. Purpose\n` +
      `  2. Edge cases\n` +
      `  3. Error conditions\n` +
      `  4. Security\n` +
      `  5. Performance\n` +
      `  6. Flow correctness\n` +
      `\n` +
      `Write the gate file first, then retry.\n`
    )
    process.exit(2)
  }

  process.exit(0)
}

main().catch(() => process.exit(0))
