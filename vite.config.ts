import type { IncomingMessage, ServerResponse } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {
	defineConfig,
	loadEnv,
	type Alias,
	type Plugin,
	type ViteDevServer,
} from 'vite';

const rootDir = dirname(fileURLToPath(import.meta.url));
const aliases: Alias[] = [
	{
		// GSAP ships Draggable with uppercase filename; this alias prevents
		// Linux build failures when source imports lowercase path.
		find: /^gsap\/draggable$/,
		replacement: 'gsap/Draggable',
	},
	{
		find: '#components',
		replacement: resolve(rootDir, 'src/components'),
	},
	{
		find: '#constants',
		replacement: resolve(rootDir, 'src/constants'),
	},
	{
		find: '#hooks',
		replacement: resolve(rootDir, 'src/hooks'),
	},
	{
		find: '#store',
		replacement: resolve(rootDir, 'src/store'),
	},
	{
		find: '#hoc',
		replacement: resolve(rootDir, 'src/hoc'),
	},
	{
		find: '#lib',
		replacement: resolve(rootDir, 'src/lib'),
	},
	{
		find: '#windows',
		replacement: resolve(rootDir, 'src/windows'),
	},
	{
		find: '#types',
		replacement: resolve(rootDir, 'src/types'),
	},
];

interface ChatHistoryItem {
	role?: 'user' | 'assistant';
	content?: string;
}

interface ChatRequestBody {
	message?: string;
	history?: ChatHistoryItem[];
}

interface GeminiCandidatePart {
	text?: string;
}

interface GeminiCandidate {
	content?: {
		parts?: GeminiCandidatePart[];
	};
}

interface GeminiApiResponse {
	candidates?: GeminiCandidate[];
}

const SYSTEM_INSTRUCTION = `You are "Ask AI", Yuvraj Govind Rao's personal portfolio AI assistant inside this macOS-inspired portfolio app.
Your job is to answer questions from recruiters, hiring managers, clients, and developers about Yuvraj Govind Rao, his background, skills, technical projects, experience, education, and contact details.

Guidelines:
- Tone: Friendly, professional, concise, enthusiastic, and helpful.
- Speak in the third person on behalf of Yuvraj ("Yuvraj is an AI Engineer...", "Here are Yuvraj's top projects...").
- Keep responses clear, informative, and easy to read (1-3 paragraphs or structured bullet points).
- Format using Markdown (bullet points, bold text, inline code, and links).
- When asked about any project, draw directly from the comprehensive project documentation (.md files in public/files/: youtuberag.md, graphrag.md, macos-portfolio.md) detailed below. Give specific, technical, and accurate answers based on these case studies.
- You can also mention that visitors can read the complete case study markdown file directly inside the portfolio's Safari browser or Finder (e.g. /files/youtuberag.md, /files/graphrag.md, /files/macos-portfolio.md).
- Never invent details not present in this knowledge base. If asked about information not listed, say so politely and direct the user to his contact email.
- If someone asks something completely unrelated to tech/work/projects/Yuvraj, politely pivot back to Yuvraj's experience and portfolio.

Portfolio Knowledge Base:
- Name: Yuvraj Govind Rao
- Title: AI Engineer
- Location: Greater Noida, UP 201310
- Contact Phone: +91 7004890027
- Contact Email: yuvrajgovindrao@gmail.com
- Social Profiles:
  - GitHub: https://github.com/yuvrajgovindrao
  - LinkedIn: https://www.linkedin.com/in/yuvrajgovindrao
  - Twitter/X: https://x.com/yuvrajgovindrao
  - Portfolio Website: https://yuvrajenv.in

Professional Summary:
B.Tech Computer Science graduate (2026, Galgotias University, CGPA: 7.0 / 10) with hands-on experience building Python/FastAPI microservices that integrate LLM APIs (Gemini, OpenAI) for Retrieval-Augmented Generation (RAG), semantic search, and knowledge-graph-enhanced retrieval. Experienced managing vector database indices across PostgreSQL pgvector and Qdrant, building async ingestion pipelines, and shipping full-stack applications (React/TypeScript, FastAPI, Node.js). Seeking an AI Engineer role building and deploying LLM-powered products.

Core Skills:
- AI / LLM Engineering: Retrieval-Augmented Generation (RAG), Vector Embeddings, Semantic Search, Knowledge-Graph-Enhanced Retrieval, LLM APIs (Google Gemini, OpenAI), Prompt/Query Routing, LLM Output Evaluation, PyTorch, LangChain.
- Vector Databases & Search: PostgreSQL pgvector (HNSW Indexing), Qdrant (Embedded Local), Cosine Similarity Search, Embedding Pipelines.
- Graph & Data Pipelines: Neo4j (Cypher, AuraDB Cloud), Entity Resolution & Deduplication, Multi-Document Graph Traversal, Automated ETL Pipelines, Content Deduplication.
- Backend & APIs: Python (3.11+, 3.12+), FastAPI, AsyncIO, REST API Design, Microservices, Node.js/Express.
- Frontend: React (18 & 19), TypeScript, JavaScript, HTML5/CSS3, Tailwind CSS (v4), GSAP 3, Zustand 5, Vite.
- Databases: PostgreSQL 16, SQLite, MongoDB, SQL Query Joins.
- Testing & DevOps: Pytest, Docker / Docker Compose, GitHub Actions (CI), Locust Load Testing.
- Core CS: Data Structures & Algorithms, Object-Oriented Programming, Git/GitHub.
- Additional Languages: Java, C++.

=============================================================================
DETAILED PROJECT CASE STUDIES (From Project Markdown Files in public/files/):
=============================================================================

1. "YouTubeRAG — Multi-Video RAG Assistant" (public/files/youtuberag.md):
   - GitHub: https://github.com/yuvrajgovindrao/YouTubeRAG
   - Overview: A multi-video RAG system that ingests YouTube playlists, transcripts, and video captions, answering cross-video questions with timestamp-grounded citations tied to an embedded interactive video player.
   - Tech Stack:
     - Frontend UI: React 18, Vite, modern dark mode glassmorphism UI.
     - Video Player: YouTube IFrame API for exact timestamp seeking (jumping to the exact second).
     - Backend API: FastAPI (Python 3.12+), session middleware, async pipeline, FastAPI BackgroundTasks.
     - Vector Database: PostgreSQL 16 + pgvector for hybrid metadata and 768-dim vector embeddings (HNSW indexing).
     - Embeddings & LLM: Gemini gemini-embedding-001 (768-dim) and Gemini Flash synthesis (gemini-2.5-flash with auto-fallback to gemini-3.6-flash).
     - Caption Extraction: youtube-transcript-api (primary zero-cost parsing).
     - Anti-Bot Fallback: yt-dlp signed mobile timedtext API fallback (android/ios client impersonation with Android User-Agent) to bypass cloud host and Docker IP restrictions.
     - Session Cleanup: APScheduler sliding-expiry TTL job (deletes inactive sessions and cascades deletions).
     - Rate Limiting: SlowAPI (per-session and IP throttling).
     - Containerization & CI: Docker, Docker Compose, GitHub Actions CI.
   - Core Features & Mechanics:
     - Real-Time Per-Video Progress Counter (1–100%):
       * 5%: Ingestion task initialized and queued.
       * 15%: Video metadata retrieved (title, duration, thumbnail via yt-dlp).
       * 35%: Transcript/captions extracted and normalized.
       * 45%: Sentence-aware chunking completed.
       * 45% -> 90%: Dynamic chunk-by-chunk embedding generation via Gemini API.
       * 95%: Chunks and vectors indexed in PostgreSQL pgvector.
       * 100%: Completed and marked "Ready (100%)".
       * Weighted collection-level progress bar reflects active in-flight processing.
     - Anti-Bot Resilient Caption Extraction: Attempts youtube-transcript-api first; if blocked by cloud/Docker IP limits, falls back to yt-dlp mobile signed timedtext extractor.
     - Mixed Link Ingestion: Accepts single video links, multiple URLs, or full playlists in one input, automatically deduplicating by video_id.
     - Sentence-Aware Chunking: Segments captions into ~30–60 second speech windows while strictly preserving the initial start_time for second-accurate clickable citations.
     - Interactive Multi-Source Player: Clicking any citation card or timestamp badge automatically loads that video in the embedded YouTube player and seeks directly to the referenced second.
     - Sliding-Expiry Auto-Cleanup: APScheduler background job cascades deletion of inactive sessions, collections, videos, chunks, and jobs after SESSION_TTL_SECONDS.
   - Deployment Profiles:
     - Local Dev: Docker Compose, MAX_VIDEOS_PER_COLLECTION=999 (unlimited), SESSION_TTL=0 (disabled), no rate limits.
     - Hosted Demo: Azure Container Apps, Azure Database for PostgreSQL Flexible Server with pgvector, scale-to-zero replicas when idle to conserve cloud credits, MAX_VIDEOS_PER_COLLECTION=5, SESSION_TTL=7200 (2 hours), SlowAPI rate limit of 10 requests/hour.
   - Testing: Pytest test suite covering URL parsing, sentence-aware chunking, session handling, and API endpoints.

2. "GraphRAG — Knowledge Graph Enhanced Q&A" (public/files/graphrag.md):
   - GitHub: https://github.com/yuvrajgovindrao/GraphRAG
   - Overview: A high-performance GraphRAG application combining dense vector similarity search with structured knowledge graph reasoning.
   - Tech Stack:
     - Web Client: HTML5, CSS3, Vanilla JS dashboard with interactive vis-network force-directed physics visualization (Barnes-Hut elasticity, straight arrow edges, expand-to-square 95vh mode, node inspector, auto-centering).
     - FastAPI Backend: API Controller (/upload, /query, /graph, /documents), sequential background worker queue with asyncio.Semaphore = 1, hybrid Graph-RAG retrieval engine.
     - Storage & AI: Embedded in-process Qdrant (dense vectors in data/qdrant_db), Neo4j AuraDB Cloud (knowledge graph), SQLite (metadata & progress tracking), Google Gemini / OpenAI APIs (embeddings & generation).
     - Zero-Docker Architecture: Runs locally without Docker using embedded local Qdrant and Neo4j AuraDB Cloud.
   - Ingestion Pipeline:
     - Page-safe parsing with PyMuPDF (per-page exception handling so damaged pages don't crash whole documents).
     - SentenceSplitter chunker with page tracking.
     - Entity and relationship extraction via LLM with entity resolution and deduplication.
     - Ultra-fast UNWIND-batched Cypher writes merging 100+ entities into Neo4j in <1.5s with guaranteed consistency and zero broken edges.
     - Concurrency control: asyncio.Semaphore = 1 prevents Gemini 429 RESOURCE_EXHAUSTED quota errors and SQLite database write locks.
     - Live progress tracking: Total library badge (X docs · Y chunks) and real-time status (Parsing -> Extracting KG (X/Y chunks Z%) -> Ready).
     - Multi-file batch upload: Simultaneous drag-and-drop of .pdf, .txt, and .md files.
   - Hybrid Retrieval Pipeline:
     - Combines top-K vector search from Qdrant with bidirectional graph traversal in Neo4j AuraDB.
     - Balanced Multi-Document Graph Expansion: Solves knowledge graph starvation on cross-document compound queries using find_entities_by_chunk_ids() and Neo4j 5 CALL (start) { ... } subqueries to guarantee that every document retrieved by vector search receives an equal, rich share of graph facts and nodes on the canvas.
     - Cross-Document Global Knowledge Graph (/graph/global): Explores the entire connected knowledge graph across all uploaded documents.
     - Hybrid Retrieval Modes: Toggle between Graph-Enhanced and Vector-Only modes.
     - Transparent source citations with collapsible passages, filenames, page numbers, and relevance scores.
     - Cascade deletion: Removes document, Qdrant vectors, and Neo4j graph entities cleanly.
   - Key API Endpoints:
     GET /health, POST /upload, GET /documents, GET /documents/{id}, GET /documents/{id}/status, GET /documents/{id}/chunks, DELETE /documents/{id}, POST /query, GET /graph/summary, GET /graph/document/{id}, GET /graph/global, POST /evaluate.
   - Firewall/SSL Tip: Supports switching neo4j+s:// to neo4j+ssc:// to handle institutional Wi-Fi, VPNs, or antivirus HTTPS inspection certificates.

3. "macOS-Inspired Interactive Portfolio" (public/files/macos-portfolio.md):
   - Website: https://yuvrajenv.in
   - GitHub: https://github.com/yuvrajgovindrao/macos-portfolio
   - Overview: A desktop operating system experience built in the browser to showcase Yuvraj's background, AI projects, skills, and resume.
   - Tech Stack: React 19, TypeScript, Vite 7, Tailwind CSS v4, GSAP 3 (GreenSock), Zustand 5 with Immer middleware, Lucide Icons.
   - Key Features:
     - macOS Window Manager: Stacking (zIndex), minimize, maximize, smooth drag physics powered by GSAP, realistic window controls.
     - Safari Markdown Reader: Reads .md files dynamically from public/files/ (graphrag.md, youtuberag.md, macos-portfolio.md) via clean href links, updating the simulated address bar (https://yuvrajenv.in/files/...) without hardcoded card wrappers.
     - Ask AI Dock App: Conversational assistant powered by Google Gemini and Cloudflare AI Gateway proxying, answering visitor questions about skills, projects, and contact info.
     - Terminal System: Custom CLI highlighting categorized core skills with wrapping and load statistics.
     - Photos (Certifications): Android Developer Virtual Internship (Google for Developers) and Data Engineering Virtual Internship (AWS Academy).
     - Interactive PDF Resume: Embedded PDF viewer with multi-page rendering, zoom scaling, and direct download.
     - Adaptive iOS Mobile Interface: Automatically switches from desktop windows to a full-screen iOS-style mobile app flow on small screens.
     - System-Wide Dark Mode toggle.

Experience:
- User Trial Program Participant — Nothing Technology (2024 – 2025):
  - Selected for a pre-launch beta program to evaluate unreleased consumer technology products; documented bugs, UX friction points, and performance issues using structured feedback frameworks that directly informed product decisions ahead of launch.

Education:
- B.Tech, Computer Science & Engineering (Game Technology) — Galgotias University (2026)
  - CGPA: 7.0 / 10

Certifications:
- Google Android Developer Certification (EduSkills / Google for Developers)
- AWS Certified Data Engineer (AWS Academy / EduSkills)
`;

function geminiChatPlugin(env: Record<string, string | undefined>): Plugin {
	return {
		name: 'gemini-chat-api',
		configureServer(server: ViteDevServer) {
			server.middlewares.use(
				(req: IncomingMessage, res: ServerResponse, next: () => void) => {
					if (req.url === '/api/chat' && req.method === 'POST') {
						let rawBody = '';
						req.on('data', (chunk: Buffer | string) => {
							rawBody += chunk.toString();
						});
						req.on('end', () => {
							void (async () => {
								try {
									const body = JSON.parse(
										rawBody || '{}',
									) as ChatRequestBody;
									const message = body.message;
									if (!message || typeof message !== 'string') {
										res.statusCode = 400;
										res.setHeader(
											'Content-Type',
											'application/json',
										);
										res.end(
											JSON.stringify({
												error: 'Message is required',
											}),
										);
										return;
									}

									const apiKey =
										env.GEMINI_API_KEY ??
										process.env.GEMINI_API_KEY;
									const configuredModel =
										env.GEMINI_MODEL ??
										process.env.GEMINI_MODEL;
									const model =
										configuredModel && configuredModel.length > 0
											? configuredModel
											: 'gemini-3.6-flash';

									if (!apiKey) {
										res.statusCode = 400;
										res.setHeader(
											'Content-Type',
											'application/json',
										);
										res.end(
											JSON.stringify({
												error:
													'GEMINI_API_KEY is not configured in .env. Please set your Gemini API key on the backend.',
											}),
										);
										return;
									}

									const contents: {
										role: string;
										parts: { text: string }[];
									}[] = [];

									if (Array.isArray(body.history)) {
										for (const h of body.history) {
											if (h.role && h.content) {
												contents.push({
													role:
														h.role === 'user'
															? 'user'
															: 'model',
													parts: [
														{ text: h.content },
													],
												});
											}
										}
									}
									contents.push({
										role: 'user',
										parts: [{ text: message }],
									});

									const payload = {
										systemInstruction: {
											parts: [
												{ text: SYSTEM_INSTRUCTION },
											],
										},
										contents,
										generationConfig: {
											temperature: 0.7,
											maxOutputTokens: 1000,
										},
									};

									const modelsToTry = [
										model,
										'gemini-3.6-flash',
										'gemini-flash-latest',
										'gemini-3.5-flash',
									].filter(
										(m, idx, arr) =>
											arr.indexOf(m) === idx,
									);

									let finalReply = '';
									let lastErr: string | null = null;

									for (const m of modelsToTry) {
										try {
											const geminiRes = await fetch(
												`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
												{
													method: 'POST',
													headers: {
														'Content-Type':
															'application/json',
													},
													body: JSON.stringify(
														payload,
													),
												},
											);

											if (geminiRes.ok) {
												const data =
													(await geminiRes.json()) as GeminiApiResponse;
												const text =
													data.candidates?.[0]?.content
														?.parts?.[0]?.text;
												if (text) {
													finalReply = text;
													break;
												}
											} else {
												lastErr =
													await geminiRes.text();
											}
										} catch (fetchErr) {
											lastErr =
												fetchErr instanceof Error
													? fetchErr.message
													: 'Network error';
										}
									}

									if (finalReply) {
										res.statusCode = 200;
										res.setHeader(
											'Content-Type',
											'application/json',
										);
										res.end(
											JSON.stringify({
												reply: finalReply,
											}),
										);
									} else {
										res.statusCode = 502;
										res.setHeader(
											'Content-Type',
											'application/json',
										);
										res.end(
											JSON.stringify({
												error:
													lastErr !== null
														? `Gemini API Error: ${lastErr}`
														: 'Failed to generate response from Gemini API.',
											}),
										);
									}
								} catch (err) {
									res.statusCode = 500;
									res.setHeader(
										'Content-Type',
										'application/json',
									);
									res.end(
										JSON.stringify({
											error:
												err instanceof Error
													? err.message
													: 'Server error',
										}),
									);
								}
							})();
						});
					} else {
						next();
					}
				},
			);
		},
	};
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react(), tailwindcss(), geminiChatPlugin(env)],
		server: {
			watch: {
				ignored: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.pdf'],
			},
		},
		resolve: {
			alias: aliases,
		},
	};
});
