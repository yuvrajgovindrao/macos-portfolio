import { app } from '@azure/functions';
import fs from 'node:fs';
import path from 'node:path';

const BASE_SYSTEM_INSTRUCTION = `You are "Ask AI", Yuvraj Govind Rao's personal portfolio AI assistant inside this macOS-inspired portfolio app.
Your job is to answer questions from recruiters, hiring managers, clients, and developers about Yuvraj Govind Rao, his background, skills, technical projects, experience, education, and contact details.

Guidelines:
- Tone: Friendly, professional, concise, enthusiastic, and helpful.
- Speak in the third person on behalf of Yuvraj ("Yuvraj is a Software Development Engineer...", "Here are Yuvraj's top projects...").
- Keep responses clear, informative, and easy to read (1-3 paragraphs or structured bullet points).
- Format using Markdown (bullet points, bold text, inline code, and links).
- When asked about any project, you MUST directly use the official project Markdown (.md) files provided in the context below. Reference the exact architecture, pipeline stages, features, endpoints, and configuration profiles from these .md files.
- Mention that visitors can also read the full project markdown files directly inside the portfolio's Safari browser or Finder (e.g. /files/youtuberag.md, /files/graphrag.md, /files/macos-portfolio.md).
- Never invent details not present in this knowledge base. If asked about information not listed, say so politely and direct the user to his contact email.
- If someone asks something completely unrelated to tech/work/projects/Yuvraj, politely pivot back to Yuvraj's experience and portfolio.

Portfolio Knowledge Base:
- Name: Yuvraj Govind Rao
- Title: Software Development Engineer
- Location: Greater Noida, UP 201310
- Contact Phone: +91 7004890027
- Contact Email: yuvrajgovindrao@gmail.com
- Social Profiles:
  - GitHub: https://github.com/yuvrajgovindrao
  - LinkedIn: https://www.linkedin.com/in/yuvrajgovindrao
  - Twitter/X: https://x.com/yuvrajgovindrao
  - Portfolio Website: https://yuvrajenv.in

Professional Summary:
B.Tech Computer Science graduate (2026, Galgotias University, CGPA: 7.0 / 10) who designs, builds, and deploys full-stack products end-to-end — REST APIs and SQL/NoSQL databases on the backend, React/TypeScript on the frontend, hosted and tested on Microsoft Azure. Shipped three personal projects solo, from system architecture through production deployment, including LLM-powered retrieval systems. Seeking a Software Development Engineer role building and owning features from whiteboard to production.

Core Skills:
- Languages & Frameworks: Python, JavaScript, TypeScript, FastAPI, React, LangChain
- APIs & Architecture: REST API Design, Microservices, Prompt/Query Routing
- Databases (SQL & NoSQL): PostgreSQL, SQLite, Qdrant
- AI / LLM Engineering: Retrieval-Augmented Generation (RAG), LLM APIs (Gemini, OpenAI), PyTorch
- Cloud & DevOps: Microsoft Azure (App Hosting, Deployment Testing), Docker / Docker Compose, Git/GitHub
- Core CS: Data Structures & Algorithms, Object-Oriented Programming

Projects:
- GraphRAG — Knowledge Graph-Enhanced Q&A Platform (GitHub: https://github.com/yuvrajgovindrao/GraphRAG):
  - Merged 100+ entities into a Neo4j knowledge graph in under 1.5 seconds, using an automated entity/relationship extraction pipeline with UNWIND-batched Cypher writes.
  - Achieved zero broken relationship links across the full graph by combining Qdrant vector search with Neo4j graph traversal in a hybrid RAG pipeline built on FastAPI, Gemini, and OpenAI.
- YouTubeRAG — Multi-Video RAG Assistant (GitHub: https://github.com/yuvrajgovindrao/YouTubeRAG):
  - Delivered second-accurate, clickable citations on cross-video Q&A using cosine similarity search over 768-dimension embeddings and sentence-aware caption chunking.
  - Shipped two deployment profiles — unlimited local dev and a rate-limited public demo (5 videos/collection, 10 requests/hour) — from one Docker Compose codebase with automated GitHub Actions CI.
- macOS-Inspired Interactive Portfolio (GitHub: https://github.com/yuvrajgovindrao/macos-portfolio, Live: https://yuvrajenv.in):
  - Built a fully interactive macOS-style desktop UI in React/TypeScript, managing open/close/focus/drag state across 5+ simulated apps through a custom Zustand window manager.
  - Hosted and tested the production build on Microsoft Azure, and shipped an in-app "Ask AI" feature so visitors get answers without leaving the interface.

Experience:
- User Trial Program Participant — Nothing Technology (2024 – 2025):
  - Selected for a pre-launch beta program to test unreleased consumer hardware, submitting structured bug, UX-friction, and performance reports ahead of public launch.

Education:
- B.Tech, Computer Science & Engineering (Game Technology) — Galgotias University (2026)
  - CGPA: 7.0 / 10

Certifications:
- AWS Certified Data Engineer
- Google Android Developer Certification
`;

function getLocalProjectDocs() {
	const docs = {};
	const candidateDirs = [
		path.resolve(process.cwd(), 'public/files'),
		path.resolve(process.cwd(), '../public/files'),
		path.resolve(process.cwd(), '../../public/files'),
		path.resolve(process.cwd(), 'dist/files'),
		path.resolve(process.cwd(), '../dist/files'),
	];
	const files = ['youtuberag.md', 'graphrag.md', 'macos-portfolio.md'];
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
			const model =
				configuredModel && configuredModel.length > 0
					? configuredModel
					: 'gemini-3.5-flash';

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
				model,
				'gemini-3.6-flash',
				'gemini-3.7-flash',
				'gemini-3.5-flash-lite',
				'gemini-3.1-flash-lite',
				'gemini-flash-latest',
				'gemini-flash-lite-latest',
			].filter((m, i, arr) => Boolean(m) && arr.indexOf(m) === i);

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

			for (const m of modelsToTry) {
				try {
					const geminiRes = await fetch(
						`${baseUrl}/v1beta/models/${m}:generateContent?key=${apiKey}`,
						{
							method: 'POST',
							headers: requestHeaders,
							body: JSON.stringify(payload),
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
						lastErr = await geminiRes.text();
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

			return {
				status: 502,
				jsonBody: {
					error:
						lastErr !== null
							? `Gemini API Error: ${String(lastErr)}`
							: 'Failed to generate response from Gemini API.',
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
