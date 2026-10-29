import graphragMd from '../../public/files/graphrag.md?raw';
import macosPortfolioMd from '../../public/files/macos-portfolio.md?raw';
import teamTaskManagerMd from '../../public/files/team-task-manager.md?raw';
import youtuberagMd from '../../public/files/youtuberag.md?raw';

/**
 * Raw project Markdown documentation imported directly from public/files/.
 * No manual summaries or extractions: the AI reads the exact markdown files verbatim.
 */
export const RAW_PROJECT_DOCS: Record<string, string> = {
	'youtuberag.md': youtuberagMd,
	'graphrag.md': graphragMd,
	'team-task-manager.md': teamTaskManagerMd,
	'macos-portfolio.md': macosPortfolioMd,
};

export const BASE_SYSTEM_INSTRUCTION = `You are "Ask AI", Yuvraj Govind Rao's personal portfolio AI assistant inside this macOS-inspired portfolio app.
Your job is to answer questions from recruiters, hiring managers, clients, and developers about Yuvraj Govind Rao, his background, skills, technical projects, experience, education, and contact details.

Guidelines:
- Tone: Friendly, professional, concise, enthusiastic, and helpful.
- Speak in the third person on behalf of Yuvraj ("Yuvraj is an AI Engineer...", "Here are Yuvraj's top projects...").
- Keep responses clear, informative, and easy to read (1-3 paragraphs or structured bullet points).
- Format using Markdown (bullet points, bold text, inline code, and links).
- When asked about any project, you MUST directly use the official project Markdown (.md) files provided below. Reference the exact architecture, pipeline stages, features, endpoints, and configuration profiles from these .md files.
- Mention that visitors can also read the full project markdown files directly inside the portfolio's Safari browser or Finder (e.g. /files/youtuberag.md, /files/graphrag.md, /files/team-task-manager.md, /files/macos-portfolio.md).
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
- AWS Data Engineer - AICTE
`;

/**
 * Selects only the relevant project Markdown documentation based on user query intent.
 * Optimizes latency, token consumption, and rate limits while guaranteeing 100% full context.
 */
export function routeProjectDocs(
	query: string,
	allDocs: Record<string, string> = RAW_PROJECT_DOCS,
): Record<string, string> {
	if (!query || typeof query !== 'string') return {};
	const q = query.toLowerCase().trim();

	// 1. Pure greeting or simple contact/bio queries (0 project docs needed)
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
			q.includes('degree') ||
			q.includes('education')) &&
			!q.includes('project') &&
			!q.includes('rag') &&
			!q.includes('code') &&
			!q.includes('stack') &&
			!q.includes('architecture') &&
			!q.includes('youtube') &&
			!q.includes('graph') &&
			!q.includes('teamflow') &&
			!q.includes('task') &&
			!q.includes('docker') &&
			!q.includes('database'));

	if (isPureGreeting || isPureContactOrBio) {
		return {};
	}

	// 2. Specific project detection
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

	const wantsTeamFlow =
		q.includes('teamflow') ||
		q.includes('task manager') ||
		q.includes('task') ||
		q.includes('bcrypt') ||
		q.includes('jwt') ||
		q.includes('otp') ||
		q.includes('migration') ||
		q.includes('express');

	const wantsPortfolio =
		q.includes('macos') ||
		q.includes('portfolio') ||
		q.includes('safari') ||
		q.includes('finder') ||
		q.includes('zustand') ||
		q.includes('yuvrajenv');

	// If asking for a specific single project:
	if (wantsYouTube && !wantsGraph && !wantsPortfolio && !wantsTeamFlow) {
		return allDocs['youtuberag.md']
			? { 'youtuberag.md': allDocs['youtuberag.md'] }
			: {};
	}
	if (wantsGraph && !wantsYouTube && !wantsPortfolio && !wantsTeamFlow) {
		return allDocs['graphrag.md']
			? { 'graphrag.md': allDocs['graphrag.md'] }
			: {};
	}
	if (wantsTeamFlow && !wantsYouTube && !wantsGraph && !wantsPortfolio) {
		return allDocs['team-task-manager.md']
			? { 'team-task-manager.md': allDocs['team-task-manager.md'] }
			: {};
	}
	if (wantsPortfolio && !wantsYouTube && !wantsGraph && !wantsTeamFlow) {
		return allDocs['macos-portfolio.md']
			? { 'macos-portfolio.md': allDocs['macos-portfolio.md'] }
			: {};
	}

	// 3. General technical / multiple projects / fallback
	return allDocs;
}
