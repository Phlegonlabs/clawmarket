## 1. System Overview

### 1.1 Project Type
- **Type**: Monorepo + Web App
- **Workspace base**: Monorepo (Bun workspaces, default)
- **Delivery mode**: Existing codebase
- **AI Provider**: None
- **Package Manager**: Bun
- **Primary goal**: Enable the project to have a closed-loop for state, progress, and validation from the scaffold onward.

### 1.2 Existing Repository Signal

- **Detected top-level directories**: .github, agents, apps, docs, packages, src, tests
- **Detected dependency/tooling signal**: @biomejs/biome, @types/node, bun-types, dependency-cruiser, typescript

### 1.3 Core Flow

```text
Project Setup → PRD / Architecture → .harness runtime → Backlog parse
       ↓                 ↓                  ↓               ↓
   AGENTS/CLAUDE     GitBook / ADR     validate/resume   PROGRESS sync
```
