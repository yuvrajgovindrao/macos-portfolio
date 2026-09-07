# YUVRAJ GOVIND RAO
### AI Engineer

Greater Noida, UP 201310 | +91 7004890027 | yuvrajgovindrao@gmail.com | github.com/yuvrajgovindrao | linkedin.com/in/yuvrajgovindrao

---

## Summary

B.Tech Computer Science graduate (2026) with hands-on experience building Python/FastAPI microservices that integrate LLM APIs (Gemini, OpenAI) for Retrieval-Augmented Generation (RAG), semantic search, and knowledge-graph-enhanced retrieval. Experienced managing vector database indices across PostgreSQL pgvector and Qdrant, building async ingestion pipelines, and shipping full-stack applications (React/TypeScript, FastAPI, Node.js). Seeking an AI Engineer role building and deploying LLM-powered products.

---

## Core Skills

- **AI / LLM Engineering:** Retrieval-Augmented Generation (RAG), Vector Embeddings, Semantic Search, Knowledge-Graph-Enhanced Retrieval, LLM APIs (Google Gemini, OpenAI), Prompt/Query Routing, LLM Output Evaluation, PyTorch
- **Vector Databases & Search:** PostgreSQL pgvector (HNSW Indexing), Qdrant, Cosine Similarity Search, Embedding Pipelines
- **Graph & Data Pipelines:** Neo4j (Cypher, AuraDB), Entity Resolution, Multi-Document Graph Traversal, Automated ETL Pipelines, Content Deduplication
- **Backend & APIs:** Python, FastAPI, AsyncIO, REST API Design, Microservices, Node.js/Express, LangChain
- **Frontend:** React, TypeScript, JavaScript, Tailwind CSS, GSAP, Zustand, Vite
- **Databases:** PostgreSQL, SQLite, MongoDB, SQL Query Joins
- **Testing & DevOps:** Pytest, Docker / Docker Compose, GitHub Actions (CI), Locust Load Testing
- **Core CS:** Data Structures & Algorithms, Object-Oriented Programming, Git/GitHub
- **Additional Languages:** Java, C++


---

## Technical Projects

**GraphRAG — Knowledge Graph Enhanced Q&A** — *Personal Project | link - https://github.com/yuvrajgovindrao/GraphRAG
- Built Python/FastAPI microservices integrating Google Gemini and OpenAI APIs to deliver hybrid Retrieval-Augmented Generation, combining embedded Qdrant vector search with Neo4j AuraDB graph traversal for grounded, cited multi-document answers.
- Engineered an automated entity/relationship extraction and resolution pipeline that populates the knowledge graph from ingested PDF/TXT/MD files, using UNWIND-batched Cypher writes to merge 100+ entities into Neo4j in under 1.5 seconds.
- Fixed a cross-document retrieval gap by rebuilding graph expansion logic so every document surfaced by vector search contributes a proportional share of graph context, with zero broken relationship links across the full graph.

**YouTubeRAG — Multi-Video RAG Assistant** — *Personal Project | link - https://github.com/yuvrajgovindrao/YouTubeRAG
- Built a full-stack RAG application (React/Vite, FastAPI, PostgreSQL + pgvector) that ingests YouTube playlists and answers cross-video questions with timestamp-grounded citations tied to an embedded video player.
- Implemented sentence-aware caption chunking that preserves source timestamps, enabling pgvector cosine similarity search over 768-dimension Gemini embeddings to power second-accurate, clickable citations.
- Shipped two deployment profiles from one config-driven Docker Compose codebase — unlimited local development vs. a public demo capped at 5 videos/collection and 10 requests/hour — with automated tests run via GitHub Actions CI.

**macOS-Inspired Interactive Portfolio** — *Personal Project | link - i will add it later.
- Built a fully interactive macOS-style desktop UI in React/TypeScript with draggable, resizable windows (Finder, Safari, Photos, Terminal) and a Zustand-based window manager handling open/close/focus/drag state across 5+ simulated apps.
- Integrated an "Ask AI" conversational feature that answers visitor questions about my background, projects, and contact details directly inside the interface, plus a GSAP animation layer with full dark-mode and iOS-style mobile support.

---

## Experience

**User Trial Program Participant — Nothing Technology** &nbsp;&nbsp;|&nbsp;&nbsp; 2024 – 2025
- Selected for a pre-launch beta program to evaluate unreleased consumer technology products; documented bugs, UX friction points, and performance issues using structured feedback frameworks that directly informed product decisions ahead of launch.

---

## Education

**B.Tech, Computer Science & Engineering (Game Technology) — Galgotias University** &nbsp;&nbsp;|&nbsp;&nbsp; 2026
CGPA: 7.0 / 10

---

## Certifications

Google Android Developer Certification | AWS Certified Data Engineer