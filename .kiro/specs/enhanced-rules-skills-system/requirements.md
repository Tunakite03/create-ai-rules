# Requirements Document

## Introduction

This document defines requirements for enhancing the rules and skills system in the create-ai-rules CLI tool. The tool currently scaffolds AI coding rules, prompts, and skills for various IDE assistants (GitHub Copilot, Cursor, Windsurf, Claude Code, Cline, Antigravity, and Generic/Agents) with support for multiple tech stacks (TypeScript, React, Node.js, NestJS, Python, Unity).

The enhancements aim to improve rule coverage, expand skill templates, increase customization options, and enhance the overall developer experience.

## Glossary

- **Rules_System**: The module in `src/rules.js` that generates comprehensive AI coding rules based on tech stack
- **Skills_System**: The module in `src/skills.js` that generates reusable task templates for common development workflows
- **Target**: An IDE assistant platform (Copilot, Cursor, Windsurf, etc.) that receives generated rules and skills
- **Stack**: A technology stack configuration (TypeScript, React, Node.js, NestJS, Python, Unity)
- **Template**: A pre-defined code or documentation pattern used to scaffold files
- **Rule_Category**: A logical grouping of related coding rules (e.g., error handling, security, performance)
- **Skill_Template**: A reusable task scaffold with code examples and checklists for common development tasks

## Requirements

### Requirement 1: Expand Rule Categories

**User Story:** As a developer, I want more comprehensive rule categories, so that my AI assistant has guidance for additional aspects of software development.

#### Acceptance Criteria

1. THE Rules_System SHALL include a new "Accessibility" rule category covering WCAG compliance, ARIA attributes, keyboard navigation, and screen reader support
2. THE Rules_System SHALL include a new "Testing" rule category covering unit tests, integration tests, test organization, mocking patterns, and test-driven development
3. THE Rules_System SHALL include a new "Documentation" rule category covering code comments, API documentation, README standards, and inline documentation patterns
4. THE Rules_System SHALL include a new "Observability" rule category covering logging best practices, metrics collection, tracing, and monitoring patterns
5. WHEN a Stack includes frontend components, THE Rules_System SHALL include accessibility rules specific to that Stack

### Requirement 2: Add New Tech Stack Support

**User Story:** As a developer using additional tech stacks, I want rules and skills for my specific technologies, so that the AI assistant understands my project conventions.

#### Acceptance Criteria

1. THE Rules_System SHALL support a "Go" Stack with rules covering error handling, goroutines, channels, interfaces, and idiomatic Go patterns
2. THE Rules_System SHALL support a "Rust" Stack with rules covering ownership, borrowing, lifetimes, error handling with Result, and unsafe code guidelines
3. THE Rules_System SHALL support a "Vue.js" Stack with rules covering Composition API, reactivity, component patterns, and Vue-specific best practices
4. THE Rules_System SHALL support a "Django" Stack with rules covering models, views, templates, ORM patterns, and Django-specific security
5. WHEN a new Stack is added, THE Skills_System SHALL generate stack-appropriate skill templates

### Requirement 3: Enhance Skills System with More Templates

**User Story:** As a developer, I want more skill templates for common tasks, so that I can quickly scaffold repetitive development work.

#### Acceptance Criteria

1. THE Skills_System SHALL include a "create-test" skill template for each supported Stack with testing framework setup and test structure patterns
2. THE Skills_System SHALL include a "create-migration" skill template for Stacks with database support covering schema changes and rollback patterns
3. THE Skills_System SHALL include a "create-api-client" skill template for Stacks with API support covering HTTP client setup, error handling, and retry logic
4. THE Skills_System SHALL include a "setup-ci-cd" skill template covering GitHub Actions, GitLab CI, and common CI/CD patterns
5. THE Skills_System SHALL include a "create-docker-config" skill template covering Dockerfile, docker-compose, and containerization best practices
6. THE Skills_System SHALL include a "performance-optimization" skill template covering profiling, benchmarking, and optimization strategies for each Stack

### Requirement 4: Add Rule Customization System

**User Story:** As a developer, I want to customize generated rules, so that they match my team's specific conventions and preferences.

#### Acceptance Criteria

1. THE Rules_System SHALL support loading custom rule overrides from a `.ai-rules-config.json` file in the project root
2. WHEN a custom configuration file exists, THE Rules_System SHALL merge custom rules with default rules, with custom rules taking precedence
3. THE Rules_System SHALL support disabling specific rule categories via configuration
4. THE Rules_System SHALL support adding custom rule categories via configuration with user-defined content
5. THE Rules_System SHALL validate the configuration file format and provide clear error messages for invalid configurations

### Requirement 5: Implement Rule Severity Levels

**User Story:** As a developer, I want rules to have severity levels, so that the AI assistant knows which rules are critical versus optional.

#### Acceptance Criteria

1. THE Rules_System SHALL categorize each rule with a severity level: "CRITICAL", "IMPORTANT", or "RECOMMENDED"
2. WHEN generating rules, THE Rules_System SHALL include severity markers in the output format
3. THE Rules_System SHALL support filtering rules by minimum severity level via CLI flag
4. THE Rules_System SHALL document severity levels in generated rule files with clear explanations
5. WHEN a rule is marked "CRITICAL", THE Rules_System SHALL include it in all minimal mode outputs

### Requirement 6: Add Interactive Rule Selection

**User Story:** As a developer, I want to interactively select which rule categories to include, so that I only generate rules relevant to my project.

#### Acceptance Criteria

1. WHEN running in interactive mode, THE CLI SHALL present a multi-select menu of available rule categories
2. THE CLI SHALL allow users to toggle individual rule categories on or off using keyboard navigation
3. THE CLI SHALL display a brief description of each rule category in the selection menu
4. THE CLI SHALL remember the last selection and offer it as a default for subsequent runs
5. WHEN the `--yes` flag is used, THE CLI SHALL include all rule categories by default

### Requirement 7: Enhance Skills with Code Snippets

**User Story:** As a developer, I want skills to include more complete code examples, so that I can quickly understand and adapt the patterns.

#### Acceptance Criteria

1. WHEN generating a skill template, THE Skills_System SHALL include at least one complete, runnable code example
2. THE Skills_System SHALL include code examples for common variations of each skill pattern
3. THE Skills_System SHALL include error handling examples in all skill code snippets
4. THE Skills_System SHALL include test examples alongside implementation examples in skill templates
5. WHEN a skill involves multiple files, THE Skills_System SHALL show the complete file structure with all necessary files

### Requirement 8: Add Rule Validation and Linting

**User Story:** As a developer, I want to validate my custom rules, so that I can ensure they follow best practices and are properly formatted.

#### Acceptance Criteria

1. THE CLI SHALL provide a `validate` command that checks rule files for formatting and completeness
2. WHEN validating rules, THE CLI SHALL check for required sections: Identity & Behavior, Core Workflow, Code Quality, Error Handling, Security
3. THE CLI SHALL detect and report duplicate or conflicting rules within the same file
4. THE CLI SHALL verify that all code examples in rules use proper markdown formatting
5. WHEN validation fails, THE CLI SHALL provide actionable error messages with line numbers and suggested fixes

### Requirement 9: Implement Rule Templates System

**User Story:** As a developer, I want to create reusable rule templates, so that I can share common patterns across multiple projects.

#### Acceptance Criteria

1. THE Rules_System SHALL support loading rule templates from a `.ai-rules-templates/` directory
2. THE CLI SHALL provide a `template create` command to scaffold new rule templates
3. THE CLI SHALL provide a `template list` command to show available templates
4. WHEN generating rules, THE CLI SHALL allow selecting templates to include via `--template` flag
5. THE Rules_System SHALL support template variables that can be substituted with project-specific values

### Requirement 10: Add Stack-Specific Performance Rules

**User Story:** As a developer, I want performance rules tailored to my specific tech stack, so that the AI assistant provides relevant optimization guidance.

#### Acceptance Criteria

1. WHEN Stack is "React", THE Rules_System SHALL include rules for React-specific performance patterns: memoization, virtualization, code splitting, and bundle optimization
2. WHEN Stack is "Node.js" or "NestJS", THE Rules_System SHALL include rules for Node-specific performance: event loop management, worker threads, clustering, and memory profiling
3. WHEN Stack is "Python", THE Rules_System SHALL include rules for Python-specific performance: GIL considerations, async/await patterns, and C extensions
4. WHEN Stack is "Unity", THE Rules_System SHALL include rules for Unity-specific performance: draw call batching, LOD systems, and profiler usage
5. THE Rules_System SHALL include benchmarking and profiling guidance specific to each Stack

### Requirement 11: Enhance Git Workflow Skills

**User Story:** As a developer, I want more detailed Git workflow skills, so that the AI assistant can help with complex version control scenarios.

#### Acceptance Criteria

1. THE Skills_System SHALL include a "git-rebase" skill covering interactive rebase, conflict resolution, and rebase best practices
2. THE Skills_System SHALL include a "git-merge-strategies" skill covering merge vs rebase decisions, merge conflict patterns, and branch strategies
3. THE Skills_System SHALL include a "git-bisect" skill covering binary search debugging and automated bisect scripts
4. THE Skills_System SHALL include a "git-hooks" skill covering pre-commit, pre-push hooks, and hook automation
5. THE Skills_System SHALL include examples of conventional commit messages for different change types in the git-workflow skill

### Requirement 12: Add Multi-Language Project Support

**User Story:** As a developer working on polyglot projects, I want to combine rules from multiple stacks, so that the AI assistant understands my full tech stack.

#### Acceptance Criteria

1. THE CLI SHALL support selecting multiple Stacks simultaneously via `--stack` flag with comma-separated values
2. WHEN multiple Stacks are selected, THE Rules_System SHALL merge rules from all selected Stacks without duplication
3. WHEN multiple Stacks are selected, THE Rules_System SHALL organize rules by Stack with clear section headers
4. THE CLI SHALL detect potential conflicts between Stack rules and warn the user
5. THE Skills_System SHALL generate skills for all selected Stacks in appropriate subdirectories

### Requirement 13: Implement Rule Search and Discovery

**User Story:** As a developer, I want to search existing rules, so that I can quickly find relevant guidance without reading entire rule files.

#### Acceptance Criteria

1. THE CLI SHALL provide a `search` command that accepts a keyword or phrase
2. WHEN searching, THE CLI SHALL return matching rules with context showing the rule category and Stack
3. THE CLI SHALL support searching across all generated rule files in the project
4. THE CLI SHALL highlight matching text in search results
5. THE CLI SHALL support filtering search results by Stack or rule category

### Requirement 14: Add Rule Export Formats

**User Story:** As a developer, I want to export rules in different formats, so that I can integrate them with various tools and documentation systems.

#### Acceptance Criteria

1. THE CLI SHALL support exporting rules to JSON format via `--format=json` flag
2. THE CLI SHALL support exporting rules to HTML format via `--format=html` flag with styled output
3. THE CLI SHALL support exporting rules to PDF format via `--format=pdf` flag
4. WHEN exporting to JSON, THE Rules_System SHALL structure rules as parseable objects with metadata
5. THE CLI SHALL support exporting a subset of rules filtered by Stack or category

### Requirement 15: Enhance Documentation and Examples

**User Story:** As a developer, I want comprehensive documentation and examples, so that I can understand how to use and customize the rules system effectively.

#### Acceptance Criteria

1. THE project SHALL include a `docs/` directory with detailed documentation for each feature
2. THE project SHALL include a `docs/customization-guide.md` explaining how to customize rules and create templates
3. THE project SHALL include a `docs/examples/` directory with real-world project examples for each Stack
4. THE project SHALL include inline code comments in `src/rules.js` and `src/skills.js` explaining the template structure
5. THE README SHALL include a "Common Use Cases" section with step-by-step examples

