<!--
Sync Impact Report:
- Version change: Template -> 1.0.0
- List of modified principles: Defined initial principles (User-Centric, Security, Clean Code, Error Handling, Testability)
- Added sections: Technical Constraints, Development Workflow
- Removed sections: None
- Templates requiring updates: None (Generic templates align with these principles)
- Follow-up TODOs: None
-->
# Hostal-Management Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. User-Centric Design
<!-- Example: I. Library-First -->
All features must address a specific user need (staff or resident). Usability is a priority; the system should be intuitive for non-technical users.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### II. Security & Privacy First
<!-- Example: II. CLI Interface -->
Tenant data is sensitive. All PII must be protected. Authentication and authorization are mandatory for all non-public endpoints. Secure by default.
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### III. Clean & Maintainable Code
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
Follow standard patterns (MVC/Service-Repository). Code must be documented. Functions should be small and single-purpose. Don't Repeat Yourself (DRY).
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### IV. Robust Error Handling
<!-- Example: IV. Integration Testing -->
The system should fail gracefully. Errors must be logged with context for debugging, but user-facing errors must be friendly and safe (no stack traces to UI).
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### V. Testability & Reliability
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
Code should be written to be testable. Critical paths (booking, payments) require automated tests. Regressions in critical flows are unacceptable.
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## Technical Constraints
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

- **Architecture**: Web Application (Frontend + Backend separation preferred).
- **Database**: Relational DB (e.g., PostgreSQL/MySQL) for structured hostal data.
- **API**: RESTful JSON API.
- **Responsive Design**: UI must be functional on both mobile and desktop devices.
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## Development Workflow
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

- **Feature Branches**: All changes must occur in separate feature branches.
- **Pull Requests**: Code review required before merge to main/master.
- **CI/CD**: Automated checks (linting, tests) must pass where configured.
- **Version Control**: Use semantic commit messages (feat, fix, docs, chore).
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This Constitution supersedes ad-hoc decisions.
- **Amendments**: Proposed via Pull Request to this file. Must include rationale.
- **Compliance**: All PRs and Specs must be checked against these principles.
- **Review**: Major version changes require team consensus.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
