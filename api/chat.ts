import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'node:fs';
import path from 'node:path';

interface ChatRequestBody {
	message?: string;
	history?: Array<{ role: 'user' | 'assistant'; content: string }>;
	projectDocs?: Record<string, string>;
}

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

function getLocalProjectDocs(): Record<string, string> {
	const docs: Record<string, string> = {};
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

function routeProjectDocs(
	query: string,
	allDocs: Record<string, string> = {},
): Record<string, string> {
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

function assembleSystemInstruction(
	clientDocs?: Record<string, string>,
	query: string = '',
): string {
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

/**
  * Serverless API handler for production (e.g. Vercel)
  */
export default async function handler(
	req: IncomingMessage & { body?: any },
	res: ServerResponse,
) {
	if (req.method !== 'POST') {
		res.statusCode = 405;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ error: 'Method not allowed' }));
		return;
	}

	let rawBody = '';
	req.on('data', (chunk) => {
		rawBody += chunk;
	});

	req.on('end', async () => {
		try {
			const body: ChatRequestBody =
				req.body && typeof req.body === 'object'
					? req.body
					: JSON.parse(rawBody || '{}');

			const message = body.message;
			if (!message || typeof message !== 'string') {
				res.statusCode = 400;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ error: 'Message is required' }));
				return;
			}

			const apiKey = process.env.GEMINI_API_KEY;
			const configuredModel = process.env.GEMINI_MODEL;
			const model =
				configuredModel && configuredModel.length > 0
					? configuredModel
					: 'gemini-3.5-flash';

			if (!apiKey) {
				res.statusCode = 400;
				res.setHeader('Content-Type', 'application/json');
				res.end(
					JSON.stringify({
						error: 'GEMINI_API_KEY is not configured in Environment Variables.',
					}),
				);
				return;
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
					maxOutputTokens: 1000,
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
			let lastErr: unknown = null;

			const rawBaseUrl = process.env.GEMINI_BASE_URL;
			const baseUrl =
				rawBaseUrl && rawBaseUrl.length > 0
					? rawBaseUrl.replace(/\/+$/, '')
					: 'https://generativelanguage.googleapis.com';

			const cfToken = process.env.CF_AIG_TOKEN;
			const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
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
						const data = (await geminiRes.json()) as any;
						const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
						if (text) {
							finalReply = text;
							break;
						}
					} else {
						lastErr = await geminiRes.text();
					}
				} catch (fetchErr) {
					lastErr = fetchErr;
				}
			}

			if (finalReply) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ reply: finalReply }));
			} else {
				res.statusCode = 502;
				res.setHeader('Content-Type', 'application/json');
				res.end(
					JSON.stringify({
						error:
							lastErr !== null
								? `Gemini API Error: ${String(lastErr)}`
								: 'Failed to generate response from Gemini API.',
					}),
				);
			}
		} catch (err: any) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({ error: err?.message || 'Server error' }));
		}
	});
}
