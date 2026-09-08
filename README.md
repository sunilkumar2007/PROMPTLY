# PROMPTLY — AI Project Execution Platform

Promptly is an AI-powered software development platform for developers and builders who have software ideas but struggle to turn them into working products.

## Features

- **Promptly Engine**: Search-first discovery platform for curated prompts, code snippets, architectures, and UI components.
- **Interactive 3D Dust Canvas**: Custom Three.js / Canvas particle universe.
- **AI Workspace**: Multi-model sequential code and architecture generation (Claude 3.5 Sonnet, GPT-4o, Gemini 2.0 Flash, DeepSeek R1).
- **AI Prompt Studio**: Interactive prompt optimization pipeline with quality evaluation, context structuring, and remixing.
- **Creator Profiles**: Creator showcase, community-verified resources, likes, saves, and follower metrics.
- **Resource Publisher**: Standard publisher and direct prompt/code sharing.

## Tech Stack

- **Framework**: TanStack Start + React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Lucide Icons
- **State & Routing**: TanStack Router, TanStack Query
- **Backend / Database**: Supabase (Auth, Database, Storage)
- **AI Integration**: OpenAI, Anthropic, Google Generative AI

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/sunilkumar2007/PROMPTLY.git
cd PROMPTLY

# Install dependencies
npm install

# Copy environment template and configure keys
cp .env.example .env

# Run local development server
npm run dev
```

The application will be available at [http://localhost:8080](http://localhost:8080).
