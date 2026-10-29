import { app } from '@azure/functions';
import fs from 'node:fs';
import path from 'node:path';

const BASE_SYSTEM_INSTRUCTION = `You are "Ask AI", Yuvraj Govind Rao's personal portfolio AI assistant inside this macOS-inspired portfolio app.
Your job is to answer questions from recruiters, hiring managers, clients, and developers about Yuvraj Govind Rao, his background, skills, technical projects, experience, education, and contact details.

Guidelines:
- Tone: Friendly, professional, concise, enthusiastic, and helpful.
- Speak in the third person on behalf of Yuvraj ("Yuvraj is an AI Engineer...", "Here are Yuvraj's top projects...").
- Keep responses clear, informative, and easy to read (1-3 paragraphs or structured bullet points).
- Format using Markdown (bullet points, bold text, inline code, and links).
- When asked about any project, you MUST directly use the official project Markdown (.md) files provided in the context below. Reference the exact architecture, pipeline stages, features, endpoints, and configuration profiles from these .md files.
- Mention that visitors can also read the full project markdown files directly inside the portfolio's Safari browser or Finder (e.g. /files/youtuberag.md, /files/graphrag.md, /files/macos-portfolio.md).
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
Computer Science graduate (2026, Galgotias University), having hands-on experience building AI software in Python, built multi-tier application with FastAPI, React, REST API, PostgreSQL, and Docker. Built GraphRAG and RAG system using NLP (semantic search, vector embedding, entity extraction). Built data pipelines that integrate, cleanse, and shape data into open-source database. Works with Jupyter Notebooks and foundational scikit-learn and TensorFlow. Tests with pytest and GitHub Actions CI. Projects are public on GitHub.

Core Skills:
- Languages: Python, JavaScript, TypeScript, SQL.
- ML and Data Science: AI/ML/DL fundamentals, Machine Learning (ML) frameworks: scikit-learn, Deep Learning (DL) frameworks: TensorFlow, Jupyter Notebooks.
- AI and NLP: Natural Language Processing (NLP), Retrieval Augmented Generation (RAG), GraphRAG, LLM API integration, semantic search, vector search, vector embedding, knowledge graph, entity extraction and resolution.
- Data and Database: PostgreSQL, SQLite, database design, data pipeline and dataflow, Qdrant, pgvector, Neo4j.
- Backend and REST APIs: REST API design, FastAPI, Express, Node.js, asyncio.
- Tools and DevOps: Git, GitHub, GitHub Actions (CI), pytest, Docker, Docker Compose, Azure Container Apps, debugging.
- Frontend: React (18 & 19), TypeScript, JavaScript, HTML5/CSS3, Tailwind CSS (v4), GSAP 3, Zustand 5, Vite.

Experience:
- User Trial Program Participant — Nothing Technology (2024 – 2025):
  - Documented 30+ structured defect reports for bugs and performance issues, many critical, across 2 unreleased devices using the program feedback framework that directly informed product decisions ahead of launch.

Projects:
1. GraphRAG — Knowledge Graph Q&A Engine (Python, FastAPI, Qdrant, Neo4j, Google Gemini, OpenAI | https://github.com/yuvrajgovindrao/GraphRAG):
   - Built a Retrieval Augmented Generation (RAG) microservice using Python/FastAPI combining Qdrant for vector search with Neo4j for graph traversal to produce cited, multi-document Q/A.
   - Built an automated entity and relationship extraction pipeline using UNWIND batched Cypher query, in under 1.5 seconds merging 100+ entities into Neo4j.
   - Rebuilt the graph expansion logic to resolve a cross-document retrieval gap, removed broken relationship links between linked entities across sourced documents.
2. YouTubeRAG — Multi-Video RAG Assistant (Python, FastAPI, PostgreSQL + pgvector, React/Vite, Gemini | https://github.com/yuvrajgovindrao/YouTubeRAG):
   - Built a full-stack RAG application using React/Vite, FastAPI, PostgreSQL + pgvector that indexes and ingests YouTube videos and playlists, provides cross-video Q/A with seconds-accurate clickable timestamp grounded citations.
   - Wrote SQL-based retrieval logic in PostgreSQL using pgvector to store and query 768-dimension Gemini embeddings via cosine-similarity search.
   - Architected a single config-driven Docker Compose codebase supporting both unrestricted local development and a rate-limited public demo (10 requests/hour), with GitHub Actions CI running the test suite on every commit.
3. TeamFlow: Team Task Manager (React, Node.js, Express, PostgreSQL | https://github.com/yuvrajgovindrao/team-task-manager):
   - Built an authentication system using bcrypt hashed password, OTP signup, and JWT session, including a password reset feature from scratch.
   - Implemented admin/member roles for every project within the Express middleware, where multi-assignee tasks are modeled via a junction table across four versioned SQL migrations.
4. macOS-Inspired Interactive Portfolio (React 19, TypeScript, Zustand, GSAP, Gemini | https://github.com/yuvrajgovindrao/macos-portfolio):
   - Built a desktop-style portfolio using React 19 and TypeScript, featuring a Zustand-based window manager that handles the open/close/focus/drag states of over five simulated windows; also includes GSAP animations and a responsive dark-mode/iOS-style mobile layout.
   - Integrated a Google Gemini-powered "Ask AI" assistant so visitors can ask questions about background and projects.

Education:
- Bachelor of Technology in Computer Science and Engineering — Galgotias University (2026)

Certifications:
- Google Android Developer Certification – AICTE
- AWS Data Engineer - AICTE`;

function getLocalProjectDocs() {
	const docs = {};
	const candidateDirs = [
		path.resolve(process.cwd(), 'public/files'),
		path.resolve(process.cwd(), '../public/files'),
		path.resolve(process.cwd(), '../../public/files'),
		path.resolve(process.cwd(), 'dist/files'),
		path.resolve(process.cwd(), '../dist/files'),
	];
	const files = ['youtuberag.md', 'graphrag.md', 'macos-portfolio.md', 'team-task-manager.md'];
	for (const dir of candidateDirs) {
		try {
			if (fs.existsSync(dir)) {
				for (const f of files) {
					const filePath = path.join(dir, f);
					if (fs.existsSync(filePath) && !docs[f]) {
						docs[f] = fs.readFileSync(filePath, 'utf-8');
					}
				}
			}
		} catch {
			// ignore directory access errors
		}
	}
	return docs;
}

function routeProjectDocs(query, allDocs = {}) {
	if (!query || typeof query !== 'string') return {};
	const q = query.toLowerCase().trim();

	const isPureGreeting =
		/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|night)|howdy|sup|hola)[\s!.,?]*$/i.test(
			q,
		) ||
		/^(who are you|what can you do|what is this|help)[\s!.,?]*$/i.test(q);

	const isPureContactOrBio =
		/^(what is your|how (can|do) i (contact|reach)|where (are you|do you live)|tell me about (yourself|yuvraj)|who is yuvraj|give me (your|the) (email|phone|resume|contact|linkedin|github))[\s!.,?]*$/i.test(
			q,
		) ||
		((q.includes('contact') ||
			q.includes('email') ||
			q.includes('phone') ||
			q.includes('linkedin') ||
			q.includes('twitter') ||
			q.includes('location') ||
			q.includes('address') ||
			q.includes('college') ||
			q.includes('university') ||
			q.includes('cgpa') ||
			q.includes('degree') ||
			q.includes('education')) &&
			!q.includes('project') &&
			!q.includes('rag') &&
			!q.includes('code') &&
			!q.includes('stack') &&
			!q.includes('architecture') &&
			!q.includes('youtube') &&
			!q.includes('graph') &&
			!q.includes('docker') &&
			!q.includes('database'));

	if (isPureGreeting || isPureContactOrBio) {
		return {};
	}

	const wantsYouTube =
		q.includes('youtube') ||
		q.includes('caption') ||
		q.includes('transcript') ||
		q.includes('timedtext') ||
		q.includes('yt-dlp') ||
		q.includes('video') ||
		q.includes('playlist');

	const wantsGraph =
		q.includes('graphrag') ||
		q.includes('knowledge graph') ||
		q.includes('neo4j') ||
		q.includes('auradb') ||
		q.includes('qdrant') ||
		q.includes('cypher') ||
		q.includes('vis-network') ||
		q.includes('pymupdf');

	const wantsPortfolio =
		q.includes('macos') ||
		q.includes('portfolio') ||
		q.includes('safari') ||
		q.includes('finder') ||
		q.includes('zustand') ||
		q.includes('yuvrajenv');

	if (wantsYouTube && !wantsGraph && !wantsPortfolio) {
		return allDocs['youtuberag.md']
			? { 'youtuberag.md': allDocs['youtuberag.md'] }
			: {};
	}
	if (wantsGraph && !wantsYouTube && !wantsPortfolio) {
		return allDocs['graphrag.md']
			? { 'graphrag.md': allDocs['graphrag.md'] }
			: {};
	}
	if (wantsPortfolio && !wantsYouTube && !wantsGraph) {
		return allDocs['macos-portfolio.md']
			? { 'macos-portfolio.md': allDocs['macos-portfolio.md'] }
			: {};
	}

	return allDocs;
}

function assembleSystemInstruction(clientDocs, query) {
	let instruction = BASE_SYSTEM_INSTRUCTION;
	const docs =
		clientDocs !== undefined && clientDocs !== null
			? clientDocs
			: routeProjectDocs(query, getLocalProjectDocs());

	const entries = Object.entries(docs);
	if (entries.length > 0) {
		instruction += `\n\n=============================================================================
ACTUAL PROJECT MARKDOWN DOCUMENTATION (DIRECT FROM PUBLIC/FILES/):
=============================================================================`;
		for (const [filename, content] of entries) {
			if (typeof content === 'string' && content.trim().length > 0) {
				instruction += `\n\n--- START OF public/files/${filename} ---\n${content.trim()}\n--- END OF public/files/${filename} ---`;
			}
		}
	}
	return instruction;
}

app.http('chat', {
	methods: ['POST'],
	authLevel: 'anonymous',
	handler: async (request) => {
		try {
			const body = await request.json().catch(() => ({}));
			const message = body?.message;

			if (!message || typeof message !== 'string') {
				return {
					status: 400,
					jsonBody: { error: 'Message is required' },
				};
			}

			const apiKey = process.env.GEMINI_API_KEY;
			const configuredModel = process.env.GEMINI_MODEL;
			const primaryModel =
				configuredModel === 'gemini-3.8-flash'
					? 'gemini-3.8-flash'
					: 'gemini-3.5-flash-lite';
			const fallbackModel =
				primaryModel === 'gemini-3.5-flash-lite'
					? 'gemini-3.8-flash'
					: 'gemini-3.5-flash-lite';

			if (!apiKey) {
				return {
					status: 400,
					jsonBody: {
						error: 'GEMINI_API_KEY is not configured in Azure Environment Variables.',
					},
				};
			}

			const contents = [];
			if (Array.isArray(body.history)) {
				for (const h of body.history) {
					if (h?.role && h?.content) {
						contents.push({
							role: h.role === 'user' ? 'user' : 'model',
							parts: [{ text: h.content }],
						});
					}
				}
			}
			contents.push({
				role: 'user',
				parts: [{ text: message }],
			});

			const systemInstructionText = assembleSystemInstruction(
				body?.projectDocs,
				message,
			);

			const payload = {
				systemInstruction: {
					parts: [{ text: systemInstructionText }],
				},
				contents,
				generationConfig: {
					temperature: 0.7,
					maxOutputTokens: 8192,
				},
			};

			const modelsToTry = [
				primaryModel,
				fallbackModel,
			];

			let finalReply = '';
			let lastErr = null;

			const rawBaseUrl = process.env.GEMINI_BASE_URL;
			const baseUrl =
				rawBaseUrl && rawBaseUrl.length > 0
					? rawBaseUrl.replace(/\/+$/, '')
					: 'https://generativelanguage.googleapis.com';

			const cfToken = process.env.CF_AIG_TOKEN;
			const requestHeaders = { 'Content-Type': 'application/json' };
			if (cfToken && cfToken.trim().length > 0) {
				requestHeaders['cf-aig-authorization'] = cfToken.startsWith('Bearer ')
					? cfToken.trim()
					: `Bearer ${cfToken.trim()}`;
			}

			const startTime = Date.now();
			// Azure Static Web Apps has a ~30s front-door timeout. Limit total execution to 22s.
			const MAX_TOTAL_MS = 22000;
			const PRIMARY_MODEL_TIMEOUT_MS = 12000;
			const FALLBACK_MODEL_TIMEOUT_MS = 5000;

			for (let i = 0; i < modelsToTry.length; i++) {
				const m = modelsToTry[i];
				if (Date.now() - startTime > MAX_TOTAL_MS) {
					break;
				}

				const perModelTimeout =
					i === 0 ? PRIMARY_MODEL_TIMEOUT_MS : FALLBACK_MODEL_TIMEOUT_MS;

				try {
					const geminiRes = await fetch(
						`${baseUrl}/v1beta/models/${m}:generateContent?key=${apiKey}`,
						{
							method: 'POST',
							headers: requestHeaders,
							body: JSON.stringify(payload),
							signal: AbortSignal.timeout(perModelTimeout),
						},
					);

					if (geminiRes.ok) {
						const data = await geminiRes.json();
						const text = data?.candidates?.[0]?.content?.parts
							?.filter(
								(p) => !p.thought && typeof p.text === 'string',
							)
							?.map((p) => p.text)
							?.join('');
						if (text) {
							finalReply = text;
							break;
						}
					} else {
						const errBody = await geminiRes.text().catch(() => '');
						lastErr = errBody || `HTTP ${geminiRes.status}`;
					}
				} catch (fetchErr) {
					lastErr =
						fetchErr instanceof Error
							? fetchErr.message
							: String(fetchErr);
				}
			}

			if (finalReply) {
				return {
					status: 200,
					jsonBody: { reply: finalReply },
				};
			}

			const isOverload =
				typeof lastErr === 'string' &&
				(lastErr.includes('503') ||
					lastErr.includes('high demand') ||
					lastErr.includes('UNAVAILABLE') ||
					lastErr.includes('TimeoutError') ||
					lastErr.includes('aborted'));

			return {
				status: 503,
				jsonBody: {
					error: isOverload
						? 'Google AI is currently experiencing high demand spikes. Please try again in a few moments.'
						: (lastErr !== null
							? `Gemini API Error: ${String(lastErr)}`
							: 'Failed to generate response from Gemini API.'),
				},
			};
		} catch (err) {
			return {
				status: 500,
				jsonBody: {
					error:
						err instanceof Error ? err.message : 'Server error',
				},
			};
		}
	},
});
