<div align="center">
  <br />
  <a href="https://yuvrajenv.in" target="_blank">
    <img width="1200" alt="portfolio" src="https://github.com/user-attachments/assets/bc55a7c5-d5c2-4c15-9e12-89348855095d" />

  </a>
  <br />
  <br />

  <h1>macOS-Inspired Interactive Portfolio</h1>
  <p><strong>Personal portfolio and interactive desktop operating system experience for Yuvraj Govind Rao — AI Engineer</strong></p>

  <div>
    <a href="https://yuvrajenv.in"><img src="https://img.shields.io/badge/Live_Site-yuvrajenv.in-007AFF?style=for-the-badge&logo=safari&logoColor=white" alt="Live Site" /></a>
    <a href="https://github.com/yuvrajgovindrao"><img src="https://img.shields.io/badge/GitHub-yuvrajgovindrao-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
    <a href="https://www.linkedin.com/in/yuvrajgovindrao"><img src="https://img.shields.io/badge/LinkedIn-yuvrajgovindrao-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
    <a href="mailto:yuvrajgovindrao@gmail.com"><img src="https://img.shields.io/badge/Email-yuvrajgovindrao@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
  </div>
  <br />

  <div>
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
    <img src="https://img.shields.io/badge/Zustand-614A1F?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
  </div>
</div>

---

## 📋 Table of Contents

1. [✨ Introduction](#-introduction)
2. [🚀 Featured Projects Showcase](#-featured-projects-showcase)
3. [🔋 Key Features](#-key-features)
4. [⚙️ Tech Stack](#️-tech-stack)
5. [🤖 Ask AI Architecture (Google Gemini)](#-ask-ai-architecture-google-gemini)
6. [📁 Project Structure](#-project-structure)
7. [🤸 Quick Start & Local Setup](#-quick-start--local-setup)
8. [🛡️ Code Quality & Verification](#️-code-quality--verification)
9. [📬 Contact & Connect](#-contact--connect)

---

## ✨ Introduction

This is a fully interactive, macOS-inspired desktop operating system built entirely in the browser using **React 19**, **TypeScript**, **GSAP**, **Zustand**, and **Tailwind CSS**. It serves as the personal portfolio platform for **Yuvraj Govind Rao**, an AI Engineer specializing in Retrieval-Augmented Generation (RAG), vector databases (PostgreSQL pgvector, Qdrant), and knowledge graph traversal (Neo4j).

The platform recreates a true-to-life desktop experience complete with:
- Draggable, resizable windows with dynamic focus stacking.
- Physics-based magnifying dock and top navigation bar.
- Fully functional applications: **Finder**, **Safari**, **Terminal**, **Photos (Certifications)**, **Resume PDF viewer**, **Contact**, and **Ask AI**.
- Seamless adaptation into an **iOS-style mobile interface** on touch and handheld viewports.
- Dark mode toggle with persistent system preferences.

---

## 🚀 Featured Projects Showcase

The portfolio Finder directly presents detailed project case studies written in pure Markdown and rendered directly in Safari:

### 1. **GraphRAG — Knowledge Graph Enhanced Q&A**
- **Architecture**: Hybrid Retrieval-Augmented Generation uniting embedded vector search in Qdrant with knowledge graph traversal in Neo4j AuraDB.
- **Highlights**: High-throughput UNWIND-batched Cypher writes (100+ entities merged into Neo4j in < 1.5s), multi-document entity resolution, and cross-document retrieval expansion.
- **Repository**: [github.com/yuvrajgovindrao/GraphRAG](https://github.com/yuvrajgovindrao/GraphRAG)

### 2. **YouTubeRAG — Multi-Video RAG Assistant**
- **Architecture**: Full-stack application (React, FastAPI, PostgreSQL + pgvector) for cross-video questioning over YouTube playlists.
- **Highlights**: Sentence-aware caption chunking preserving second-accurate source timestamps, 768-dimension Gemini embeddings, and dual config-driven Docker Compose profiles.
- **Repository**: [github.com/yuvrajgovindrao/YouTubeRAG](https://github.com/yuvrajgovindrao/YouTubeRAG)

### 3. **macOS-Inspired Interactive Portfolio**
- **Architecture**: Modular window manager with Zustand + Immer, GSAP draggable physics, and serverless Gemini API chat integration.
- **Highlights**: Desktop and iOS mobile modes, Markdown reader in Safari, categorized terminal tech stack, and interactive PDF viewer.
- **Simulated Domain**: [https://yuvrajenv.in](https://yuvrajenv.in)

---

## 🔋 Key Features

- 🖥️ **macOS Window Management**: Realistic window stacking (`zIndex`), minimize, maximize, and smooth drag physics powered by GSAP.
- 🤖 **"Ask AI" Assistant**: Conversational dock app backed by Google Gemini that answers visitor questions about Yuvraj's background, skills, and projects with Markdown rendering and AI chat badges.
- 🧭 **Safari Markdown Reader**: Reads `.md` files dynamically from `public/files/` via clean `href` links, updating the simulated address bar (`https://yuvrajenv.in/files/...`) without hardcoded card wrappers.
- 💻 **Terminal System**: Custom command-line interface highlighting categorized core engineering skills (AI/LLMs, Vector DBs, Graph Pipelines, Backend, Frontend, Testing, Core CS) with clean wrapping and load statistics.
- 🖼️ **Certifications Viewer (Photos)**: Displays verified credentials including:
  - **Android Developer Virtual Internship** (Google for Developers / EduSkills)
  - **Data Engineering Virtual Internship** (AWS Academy / EduSkills)
- 📄 **Interactive PDF Resume**: Embedded PDF viewer with multi-page rendering, zoom scaling, and direct download action.
- 📱 **Adaptive iOS Mobile Interface**: Responsive design automatically switches from desktop windows to a full-screen iOS-style mobile app flow on small screens.
- 🌗 **System-Wide Dark Mode**: Polished light and dark theme with smooth color transitions.

---

## ⚙️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite 7 |
| **Animation & Drag** | GSAP 3 (GreenSock), `@gsap/react`, GSAP Draggable |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons, Radix UI |
| **State Management** | Zustand with Immer middleware |
| **AI & LLM Backend** | Google Gemini API (`gemini-3.5-flash` with multi-model cascade & Cloudflare AI Gateway proxying) |
| **Document Processing** | `react-markdown`, `remark-gfm`, `react-pdf`, PDF.js worker |
| **DevOps & Quality** | ESLint 9 (Flat Config), Prettier, GitHub Actions CI |

---

## 🤖 Ask AI Architecture (Google Gemini)

The portfolio includes an integrated conversational AI ("Ask AI") available directly on the desktop dock.

- **Multi-Runtime Backend Support**:
  - **Local Development**: Built-in Vite middleware proxy (`/api/chat` in `vite.config.ts`) using `loadEnv`.
  - **Production (Vercel / Node)**: Serverless function in `api/chat.ts`.
  - **Production (Azure Static Web Apps)**: Serverless function in `api/src/functions/chat.js`.
- **Smart Intent-Based Project Doc Routing**:
  - Dynamically routes raw Markdown files (`graphrag.md`, `youtuberag.md`, `macos-portfolio.md`) directly from `public/files/` based on visitor query intent.
  - Zero tokens wasted on greetings or simple contact/bio queries, while providing 100% full technical context when discussing projects.
- **Resilient Multi-Tier Model Cascade**:
  - Primary model: **`gemini-3.5-flash`** (configured in `.env` / Azure environment variables).
  - Cascades automatically in sequence: `gemini-3.5-flash` ➔ `gemini-3.6-flash` ➔ `gemini-3.7-flash` ➔ `gemini-3.5-flash-lite` ➔ `gemini-3.1-flash-lite` ➔ `gemini-flash-latest` ➔ `gemini-flash-lite-latest` to ensure high availability and prevent 429 quota disruptions.
- **Cloudflare AI Gateway Proxying**:
  - Supports enterprise AI Gateway routing, caching, and rate limiting via `GEMINI_BASE_URL` and `CF_AIG_TOKEN` headers.
- **Grounding & System Knowledge**:
  - Grounded strictly on [`src/lib/knowledge.ts`](file:///c:/Users/yuvra/Desktop/macos-portfolio/src/lib/knowledge.ts), ensuring zero hallucination regarding skills, background, and contact details.

---

## 📁 Project Structure

```text
macos-portfolio/
├── api/
│   ├── chat.ts                     # Vercel / Node serverless handler for Gemini AI
│   └── src/
│       └── functions/
│           └── chat.js             # Azure Static Web Apps serverless handler
├── public/
│   ├── files/
│   │   ├── Certificate_1.jpg       # AWS Data Engineering Certificate
│   │   ├── Certificate_2.jpg       # Google Android Developer Certificate
│   │   ├── graphrag.md             # GraphRAG project case study
│   │   ├── youtuberag.md           # YouTubeRAG project case study
│   │   ├── macos-portfolio.md      # macOS Portfolio project case study
│   │   └── resume.pdf              # Downloadable resume
│   ├── icons/                      # System icons (Finder, Ask AI, Wi-Fi, etc.)
│   └── images/                     # Dock apps, wallpapers, and avatars
├── src/
│   ├── components/                 # Desktop UI (Dock, Navbar, Welcome, Home, Theme)
│   │   └── mobile/                 # iOS-style mobile components
│   ├── constants/
│   │   └── index.ts                # Portfolio data, projects, bookmarks, skills
│   ├── hoc/
│   │   ├── WindowWrapper.tsx       # Desktop window drag and z-index wrapper
│   │   └── MobileWindowWrapper.tsx # Mobile window wrapper
│   ├── hooks/                      # Custom hooks (time, mobile check, container width)
│   ├── lib/
│   │   ├── knowledge.ts            # Ask AI system prompt and portfolio knowledge
│   │   ├── gsap.ts                 # GSAP animation configuration
│   │   └── pdf.ts                  # PDF.js worker configuration
│   ├── store/
│   │   └── index.ts                # Zustand global window manager
│   ├── types/                      # TypeScript definitions (Finder, Windows, TechStack)
│   ├── windows/                    # Desktop windows (Finder, Safari, AskAI, Terminal...)
│   │   └── mobile/                 # Mobile window counterparts
│   ├── App.tsx                     # Main layout and window mount coordinator
│   └── index.css                   # Tailwind CSS styling and window definitions
├── index.html                      # HTML entry with metadata
├── vite.config.ts                  # Vite config, aliases, and Gemini dev server
└── package.json
```

---

## 🤸 Quick Start & Local Setup

Follow these steps to run the portfolio locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/yuvrajgovindrao/macos-portfolio.git
cd macos-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash

# Optional: Cloudflare AI Gateway
# GEMINI_BASE_URL=https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/google-ai-studio
# CF_AIG_TOKEN=your_cf_aig_token
```

> [!TIP]
> You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Start the Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser to experience the desktop.

### 5. Build for Production
```bash
npm run build
```

---

## 🛡️ Code Quality & Verification

The codebase adheres to strict TypeScript standards and modern React practices:

- **Linting**:
  ```bash
  npm run lint
  ```
  Runs ESLint across all TypeScript and React files with 0 warnings/errors.

- **Formatting**:
  ```bash
  npm run format
  ```
  Formats with Prettier and automatically organizes Tailwind CSS class orders.

---

## 📬 Contact & Connect

- **Name**: Yuvraj Govind Rao
- **Role**: AI Engineer
- **Location**: Greater Noida, UP, India
- **Email**: [yuvrajgovindrao@gmail.com](mailto:yuvrajgovindrao@gmail.com)
- **GitHub**: [github.com/yuvrajgovindrao](https://github.com/yuvrajgovindrao)
- **LinkedIn**: [linkedin.com/in/yuvrajgovindrao](https://www.linkedin.com/in/yuvrajgovindrao)
- **Website**: [https://yuvrajenv.in](https://yuvrajenv.in)

---

<div align="center">
  <p>Designed and built with ❤️ by <a href="https://github.com/yuvrajgovindrao"><strong>Yuvraj Govind Rao</strong></a></p>
</div>
