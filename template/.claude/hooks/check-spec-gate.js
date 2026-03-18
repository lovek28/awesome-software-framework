#!/usr/bin/env node
/**
 * Hook: check-spec-gate
 *
 * Blocks spec files from being written out of pipeline order.
 *
 * Rules:
 *   - spec/domain/     requires product_spec completed
 *   - spec/ux/         requires domain_rules completed
 *   - spec/ui/         requires ux_flow completed
 *   - spec/architecture/ requires ui_system completed (or ux_flow for api-only)
 *
 * Exit 0 = allow  |  Exit 2 = block (message shown to Claude)
 */

const fs   = require('fs')
const path = require('path')

const SPEC_GATES = [
  { prefix: 'spec/domain/',        requires: 'product_spec',  label: 'product spec' },
  { prefix: 'spec/ux/',            requires: 'domain_rules',  label: 'domain rules' },
  { prefix: 'spec/ui/',            requires: 'ux_flow',       label: 'UX flows' },
  { prefix: 'spec/architecture/',  requires: 'ux_flow',       label: 'UX flows (or ui_system)' },
]

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

  const gate = SPEC_GATES.find(g => rel.startsWith(g.prefix))
  if (!gate) process.exit(0)

  const stateFile = path.join(cwd, '.claude/workflow.state.json')
  if (!fs.existsSync(stateFile)) process.exit(0)

  let state
  try { state = JSON.parse(fs.readFileSync(stateFile, 'utf8')) }
  catch { process.exit(0) }

  const completed = Array.isArray(state.completed) ? state.completed : []

  if (!completed.includes(gate.requires)) {
    console.error(
      `\n🚫  GATE BLOCKED — Out of pipeline order\n` +
      `\n` +
      `You are trying to write to: ${rel}\n` +
      `\n` +
      `This file requires the "${gate.requires}" stage to be completed first.\n` +
      `The ${gate.label} stage must be done before this spec can be written.\n` +
      `\n` +
      `Current stage : ${state.stage ?? 'unknown'}\n` +
      `Completed     : ${completed.length ? completed.join(', ') : 'none'}\n` +
      `\n` +
      `Complete the "${gate.requires}" stage first.\n`
    )
    process.exit(2)
  }

  process.exit(0)
}

main().catch(() => process.exit(0))
