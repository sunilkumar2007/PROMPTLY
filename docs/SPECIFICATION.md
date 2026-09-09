# PROMPTLY — AI-Powered Project Execution Platform

> **From Idea → Structured Phases → AI Prompts → Execution → Working Product**

---

## 1. Executive Summary & Core Philosophy

**Promptly** transforms unguided, one-off AI chat prompting into a persistent, multi-phase project execution engine. Rather than asking an AI to "build an entire project" in disconnected bursts, Promptly decomposes projects into structured, dependent or parallel phases. Each phase leverages filtered context, generates targeted role-based prompts, routes to optimal AI models, validates artifacts, records decisions, and feeds project memory forward into subsequent phases.

---

## 2. The Core Execution Loop

```text
INPUT (Idea, SRS, Docs, Code, Designs)
  ↓
PROJECT UNDERSTANDING & ANALYSIS
  ↓
PHASE GRAPH PLANNING (Linear / DAG)
  ↓
CONTEXT SELECTION ENGINE (Filtered Token-Efficient Memory)
  ↓
PROMPT GENERATION ENGINE (Role, Context, Task, Constraints, Validation)
  ↓
MODEL ROUTER (GPT / Claude / Gemini / Specialized Models)
  ↓
AI EXECUTION & REVIEW (Generate / Review / Execute / Test / Fix)
  ↓
ARTIFACT ENGINE & PROJECT MEMORY (Docs, Schemas, Code, Decisions, Risks)
  ↓
NEXT PHASE / ADAPTIVE WORKFLOW EXPANSION
```

---

## 3. Key Pillars & Engines

### 3.1. Context Engine
* Filters and selects only relevant project memory for the current phase/task rather than dumping entire histories.
* Prevents token bloat, hallucinations, context drift, and unnecessary API costs.

### 3.2. Prompt Engine
* Auto-engineers optimized tasks with explicit:
  * **Role**: Specialized agent persona (e.g., Senior Software Architect, Security Engineer).
  * **Context**: Relevant requirements, architectural decisions, and previous phase artifacts.
  * **Task**: Clear, bounded objective.
  * **Constraints**: Immutability rules, out-of-scope boundaries.
  * **Expected Output**: Specific artifact formats and file paths.
  * **Validation Criteria**: Acceptance criteria and verification tests.

### 3.3. Model Router & Multi-API Orchestration Engine
* **Concurrent Multi-Model Execution**: Supports querying multiple AI model APIs simultaneously in the same phase:
  * **Ensemble / Consensus Mode**: Generate parallel solutions with different models (e.g., Claude + GPT-4o + Gemini Pro) and synthesise or pick the best result.
  * **Cross-Agent Peer Review**: One API model implements while another simultaneously conducts real-time security/architectural audits.
  * **Parallel Sub-task Splitting**: Distribute frontend tasks to one model API and backend/database tasks to another model API concurrently.
  * **Dynamic Multi-Provider Fallback & Load Balancing**: Automatic failover between API providers (OpenAI, Anthropic, Google, Mistral, Groq, DeepSeek, Local Ollama/vLLM) to mitigate rate limits and downtime.
* **External Multi-API & Tool Integration**:
  * Simultaneously integrate external development & productivity APIs during phase execution (e.g., GitHub/GitLab API, Supabase/Firebase API, Sandbox/E2B Code Execution API, Figma API, Linear/Jira API, Custom user-defined REST/GraphQL endpoints).
  * Flexible user API key management and per-project / per-phase provider configuration.

### 3.4. Project Memory & Artifact Engine
* Maintains state across:
  * **Requirements & Decisions** (with rationale for tech stack / design choices).
  * **Constraints & Invariants**.
  * **Artifacts** (`requirements.md`, `architecture.md`, `schema.sql`, `api-spec.yaml`, source code, tests).
  * **Issues, Blockers & Technical Debt**.

### 3.5. Human-in-the-Loop & Execution Control
* **Manual Mode**: User reviews and modifies prompts before execution.
* **Assisted Mode**: AI recommends next actions/architectural choices; user approves/modifies.
* **Autonomous Mode**: AI continuously executes, tests, reviews, and progresses phases with pause capability.

---

## 4. Phase Lifecycle & Execution Modes

### Phase Statuses
- `○ Not Started`
- `◐ Planning`
- `◐ Prompt Generated`
- `◐ Waiting for Approval`
- `◐ Executing`
- `◐ Reviewing`
- `✓ Completed`
- `⚠ Needs Attention`
- `✕ Failed`

### Phase Execution Modes
1. **Generate**: Create specifications, prompts, designs, or initial code.
2. **Review**: Audit architecture, security compliance, or code quality.
3. **Execute**: Build features, write implementations, scaffold migrations.
4. **Test**: Run test suites, integration benchmarks, and validation criteria.
5. **Fix**: Analyze errors, identify root causes, implement corrections, and re-verify.

---

## 5. Technology Stack & Data Architecture

* **Frontend**: React, TypeScript, Next.js / Vite, Tailwind CSS.
* **Backend**: Node.js / TypeScript API, Modular Engine Services (Project, Context, Prompt, Artifact, Memory, Multi-API Router).
* **Database & Storage**: PostgreSQL, `pgvector` for semantic context retrieval, Supabase Storage / Auth.
* **Core Entities**:
  * `users` → `projects`
  * `projects` → `project_files`, `phases`, `phase_dependencies`, `artifacts`, `decisions`, `issues`, `project_memory`, `api_integrations`
  * `phases` → `prompts`, `tasks`, `executions`
  * `executions` → `model_invocations` (tracks multiple simultaneous API calls, tokens, latency, cost, and consensus outputs)
  * `api_providers` → `user_api_keys`, `rate_limit_policies`, `fallback_rules`

---

## 6. MVP Scope

1. **Project Ingestion**: Create project from raw idea text or uploaded SRS/docs.
2. **Phase Setup**: Configurable phase counts (recommended vs custom).
3. **Prompt & Context Pipeline**: Automated context retrieval + prompt generation per phase.
4. **Execution & Routing**: Run AI tasks against LLM APIs.
5. **Artifact & Memory Persistence**: Save structured outputs, update memory, pass downstream to next phase.
6. **Progress Tracking**: Dashboard with interactive phase statuses and prompt review.

---

## 7. Platform Integrations & Lovable Compatibility

* **Lovable.dev / AI Codebase Ingestion**:
  * Seamlessly ingest, analyze, and manage projects generated from platforms like Lovable (e.g., `lovable-project-4cdb944c`), v0, Bolt, Cursor, etc.
  * Apply Promptly's multi-phase structured workflows (Requirements → Architecture → Database → Feature Extension → Multi-API Review & Testing) on top of Lovable projects.
  * Sync artifacts, schemas, and code changes back to the repository.

---

## 8. Long-Term Vision: AI Project Operating System

Expanding beyond software engineering to research workflows, content creation, business strategy, and learning tracks with dynamic phase generation and an autonomous AI Project Manager.
