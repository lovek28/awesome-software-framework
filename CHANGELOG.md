# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (Nothing yet.)

### Changed

- (Nothing yet.)

### Fixed

- (Nothing yet.)

---

## [1.0.0] - (initial release)

### Added

- Initial scaffold: template with spec-first pipeline (idea → product_spec → domain → ux → ui → architecture → backend → frontend → tests).
- CLI: `create-awesome-software <project-name>` with optional `--output-dir` / `-o` and `--version` / `-v`.
- Framework version written to generated projects (`.framework-version`) for future upgrades.
- Optional update check on run (disable with `NO_UPDATE_CHECK=1`).
- Template: `workflow.config.json`, `.claude/workflow.state.json`, `stack.config.json`, spec and app layout.
- Docker Compose (Postgres) and `.env.example` for local backend development.

[Unreleased]: https://github.com/lovek28/awesome-software-framework/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lovek28/awesome-software-framework/releases/tag/v1.0.0
