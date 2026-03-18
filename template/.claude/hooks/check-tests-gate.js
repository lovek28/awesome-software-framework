#!/usr/bin/env node
/**
 * Hook: check-tests-gate (enforces Section 11)
 *
 * Runs before Write/Edit on workflow.state.json.
 * When the "tests" stage is being marked as completed,
 * blocks the write unless actual test files exist in tests/.
 *
 * A test file is any file matching: *.test.ts, *.spec.ts, *.test.js,
 * *.spec.js, *.e2e.ts, *.integration.ts (recursively under tests/)
 *
 * Exit 0 = allow  |  Exit 2 = block (message shown to Claude)
 */

const fs   = require('fs')
const path = require('path')

function findTestFiles(dir, found = []) {
  if (!fs.existsSync(dir)) return found
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      findTestFiles(full, found)
    } else if (/\.(test|spec|e2e|integration)\.[tj]sx?$/.test(entry.name)) {
      found.push(full)
    }
  }
  return found
}

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

  if (!rel.endsWith('workflow.state.json')) process.exit(0)

  // Parse new state to check if tests is being marked completed
  let newCompleted = []
  try {
    if (input.tool_input?.content) {
      newCompleted = JSON.parse(input.tool_input.content).completed ?? []
    } else if (input.tool_input?.new_string) {
      const match = input.tool_input.new_string.match(/"completed"\s*:\s*(\[[^\]]*\])/)
      if (match) newCompleted = JSON.parse(match[1])
    }
  } catch { process.exit(0) }

  // Read current state to check if tests is newly being added
  let currentCompleted = []
  try {
    const stateFile = path.join(cwd, '.claude/workflow.state.json')
    if (fs.existsSync(stateFile)) {
      currentCompleted = JSON.parse(fs.readFileSync(stateFile, 'utf8')).completed ?? []
    }
  } catch {}

  const isMarkingTestsComplete =
    newCompleted.includes('tests') && !currentCompleted.includes('tests')

  if (!isMarkingTestsComplete) process.exit(0)

  // Check for actual test files
  const testsDir   = path.join(cwd, 'tests')
  const testFiles  = findTestFiles(testsDir)

  // Also check co-located tests in apps/ and packages/
  const appTests  = findTestFiles(path.join(cwd, 'apps'))
  const pkgTests  = findTestFiles(path.join(cwd, 'packages'))

  const allTests = [...testFiles, ...appTests, ...pkgTests]

  if (allTests.length === 0) {
    console.error(
      `\n🚫  GATE BLOCKED — No test files found (Section 11)\n` +
      `\n` +
      `You are trying to mark the "tests" stage as completed,\n` +
      `but no test files exist in the project.\n` +
      `\n` +
      `Test files must match: *.test.ts, *.spec.ts, *.e2e.ts, *.integration.ts\n` +
      `Expected locations: tests/unit/, tests/integration/, tests/e2e/\n` +
      `\n` +
      `Required before marking tests complete (Section 11):\n` +
      `  - At least one unit test derived from domain rules\n` +
      `  - At least one integration test per API endpoint\n` +
      `  - At least one E2E test per core user journey (from spec/ux/flows.md)\n` +
      `\n` +
      `Write test files first, then mark the stage complete.\n`
    )
    process.exit(2)
  }

  // Warn if very few tests (< 3) but don't block
  if (allTests.length < 3) {
    console.error(
      `\n⚠️  WARNING — Very few test files found (Section 11)\n` +
      `\n` +
      `Only ${allTests.length} test file(s) found:\n` +
      allTests.map(f => `  ${path.relative(cwd, f)}`).join('\n') +
      `\n` +
      `Consider adding more tests before marking the stage complete.\n` +
      `At minimum: unit tests for domain logic, integration tests for routes,\n` +
      `and E2E tests for core user journeys from spec/ux/flows.md.\n` +
      `\n` +
      `Proceeding anyway — but review test coverage with the user.\n`
    )
    // Warning only — exit 0 to allow
    process.exit(0)
  }

  process.exit(0)
}

main().catch(() => process.exit(0))
