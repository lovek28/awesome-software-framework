#!/usr/bin/env node
/**
 * Hook: check-stage-advance-gate (enforces Section 3b)
 *
 * Runs before Write/Edit on .claude/workflow.state.json.
 * When the stage is being advanced (a new entry added to completed[]),
 * blocks the write unless a checkpoint file exists for the completed stage.
 *
 * Checkpoint file: .claude/gates/checkpoint-<stage>.md
 *
 * This ensures Claude wrote a checkpoint summary and the user had a chance
 * to respond before the pipeline advanced.
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

  // Only enforce on workflow state file
  if (!rel.endsWith('workflow.state.json')) process.exit(0)

  // Read current state (before write)
  const stateFile = path.join(cwd, '.claude/workflow.state.json')
  if (!fs.existsSync(stateFile)) process.exit(0)

  let currentState
  try { currentState = JSON.parse(fs.readFileSync(stateFile, 'utf8')) }
  catch { process.exit(0) }

  const currentCompleted = Array.isArray(currentState.completed) ? currentState.completed : []

  // Parse new state from tool input
  let newState
  try {
    // Write tool: content is the full new file
    if (input.tool_input?.content) {
      newState = JSON.parse(input.tool_input.content)
    }
    // Edit tool: apply new_string heuristic — look for completed array in new_string
    else if (input.tool_input?.new_string) {
      const match = input.tool_input.new_string.match(/"completed"\s*:\s*(\[[^\]]*\])/)
      if (match) newState = { completed: JSON.parse(match[1]) }
    }
  } catch { process.exit(0) }

  if (!newState) process.exit(0)

  const newCompleted = Array.isArray(newState.completed) ? newState.completed : []

  // Find stages that are newly being marked as completed
  const newlyCompleted = newCompleted.filter(s => !currentCompleted.includes(s))
  if (newlyCompleted.length === 0) process.exit(0)

  // Mandatory checkpoint stages — always require checkpoint file
  const MANDATORY = ['product_spec', 'architecture', 'backend', 'tests']

  for (const stage of newlyCompleted) {
    const isMandatory   = MANDATORY.includes(stage)
    const checkpointFile = path.join(cwd, `.claude/gates/checkpoint-${stage}.md`)

    if (!fs.existsSync(checkpointFile)) {
      const mandatoryNote = isMandatory
        ? `\n⚠️  "${stage}" is a MANDATORY checkpoint — it cannot be skipped even in autonomous mode.\n`
        : ''

      console.error(
        `\n🚫  GATE BLOCKED — Checkpoint not written for stage "${stage}" (Section 3b)\n` +
        mandatoryNote +
        `\n` +
        `You are trying to mark "${stage}" as completed in workflow.state.json,\n` +
        `but no checkpoint file exists for this stage.\n` +
        `\n` +
        `Before advancing the pipeline, you must:\n` +
        `  1. Write a checkpoint file: .claude/gates/checkpoint-${stage}.md\n` +
        `  2. Show the checkpoint summary to the user\n` +
        `  3. Wait for the user's response (yes / adjust first / skip)\n` +
        `  4. Only then update workflow.state.json\n` +
        `\n` +
        `Checkpoint file format:\n` +
        `  # Checkpoint: ${stage}\n` +
        `  ## Completed\n` +
        `  [1-2 sentences summarising what was produced]\n` +
        `  ## Next stage\n` +
        `  [stage name]\n` +
        `  [1-2 sentences previewing what will happen]\n` +
        `  ## User response\n` +
        `  [yes / adjust: <what changed> / skip]\n` +
        `\n` +
        `Write the checkpoint file and record the user's response, then retry.\n`
      )
      process.exit(2)
    }

    // For mandatory stages, also verify user response is recorded in the file
    if (isMandatory) {
      const content = fs.readFileSync(checkpointFile, 'utf8')
      if (!content.includes('User response') && !content.includes('user response')) {
        console.error(
          `\n🚫  GATE BLOCKED — User response not recorded in checkpoint for "${stage}"\n` +
          `\n` +
          `The checkpoint file exists but does not contain the user's response.\n` +
          `File: .claude/gates/checkpoint-${stage}.md\n` +
          `\n` +
          `Add a "## User response" section with the user's answer before advancing.\n`
        )
        process.exit(2)
      }
    }
  }

  process.exit(0)
}

main().catch(() => process.exit(0))
