import type {
	BlogPost,
	DockApp,
	FinderNode,
	FinderLocation,
	GalleryItem,
	LocationType,
	LocationsMap,
	NavIcon,
	NavLink,
	SafariBookmark,
	SocialLink,
	TechStackCategory,
	WindowConfig,
} from '#types';

/**
 * Top-nav link labels and their window targets.
 */
const navLinks = [
	{
		id: 1,
		name: 'Projects',
		type: 'finder',
	},
	{
		id: 3,
		name: 'Contact',
		type: 'contact',
	},
	{
		id: 4,
		name: 'Resume',
		type: 'resume',
	},
] satisfies NavLink[];

/**
 * Status/action icons shown in the top nav.
 */
const navIcons = [
	{
		id: 1,
		type: 'status',
		img: '/icons/wifi.svg',
	},
	{
		id: 2,
		type: 'status',
		img: '/icons/search.svg',
	},
	{
		id: 3,
		type: 'status',
		img: '/icons/user.svg',
	},
	{
		id: 4,
		type: 'theme',
		img: '/icons/mode.svg',
	},
] satisfies NavIcon[];

/**
 * Dock icon config. `id` must map to a window key when `canOpen` is true.
 */
const dockApps = [
	{
		id: 'finder',
		name: 'Portfolio', // was "Finder"
		icon: 'finder.png',
		canOpen: true,
		showOnMobile: true,
	},
	{
		id: 'safari',
		name: 'Articles', // was "Safari"
		icon: 'safari.png',
		canOpen: true,
		showOnMobile: true,
	},
	{
		id: 'photos',
		name: 'Gallery', // was "Photos"
		icon: 'photos.png',
		canOpen: true,
		showOnMobile: true,
	},
	{
		id: 'contact',
		name: 'Contact', // or "Get in touch"
		icon: 'contact.png',
		canOpen: true,
		showOnMobile: true,
	},
	{
		id: 'terminal',
		name: 'Skills', // was "Terminal"
		icon: 'terminal.png',
		canOpen: true,
		showOnMobile: false,
	},
	{
		id: 'trash',
		name: 'Archive', // was "Trash"
		icon: 'trash.png',
		canOpen: false,
		showOnMobile: false,
	},
	{
		id: 'askai',
		name: 'Ask AI', // was "Ask AI"
		icon: 'askai.png',
		canOpen: true,
		showOnMobile: true,
	},
] satisfies DockApp[];

/**
 * Article cards shown in the Safari/Articles window.
 */
const blogPosts = [
	{
		id: 1,
		date: '2026',
		title: 'GraphRAG: Hybrid Qdrant Vector Search & Neo4j Knowledge Graph Traversal',
		image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
		link: 'https://github.com/yuvrajgovindrao/GraphRAG',
	},
	{
		id: 2,
		date: '2026',
		title: 'YouTubeRAG: Sentence-Aware Caption Chunking with Gemini Embeddings & pgvector',
		image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
		link: 'https://github.com/yuvrajgovindrao/YouTubeRAG',
	},
	{
		id: 3,
		date: '2026',
		title: 'Engineering an Interactive macOS Portfolio with React 19 and Zustand',
		image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
		link: 'https://yuvrajenv.in',
	},
] satisfies BlogPost[];

/**
 * Curated bookmarks shown in Safari bookmark menus.
 */
const safariBookmarks = [
	{
		id: 1,
		category: 'Portfolio',
		title: "Yuvraj's Portfolio",
		url: 'https://yuvrajenv.in',
	},
	{
		id: 2,
		category: 'Projects',
		title: 'GraphRAG Repository',
		url: 'https://github.com/yuvrajgovindrao/GraphRAG',
	},
	{
		id: 3,
		category: 'Projects',
		title: 'YouTubeRAG Repository',
		url: 'https://github.com/yuvrajgovindrao/YouTubeRAG',
	},
	{
		id: 4,
		category: 'Social',
		title: 'GitHub Profile',
		url: 'https://github.com/yuvrajgovindrao',
	},
	{
		id: 5,
		category: 'Social',
		title: 'LinkedIn',
		url: 'https://www.linkedin.com/in/yuvrajgovindrao',
	},
	{
		id: 6,
		category: 'Social',
		title: 'Twitter / X',
		url: 'https://x.com/yuvrajgovindrao',
	},
] satisfies SafariBookmark[];

/**
 * Tech stack grouped by category.
 */
const techStack = [
	{
		category: 'AI / LLM Engineering',
		items: [
			'RAG',
			'Vector Embeddings',
			'Semantic Search',
			'Knowledge-Graph-Enhanced Retrieval',
			'LLM APIs (Google Gemini, OpenAI)',
			'Prompt/Query Routing',
			'LLM Output Evaluation',
			'PyTorch',
			'LangChain',
		],
	},
	{
		category: 'Vector DBs & Search',
		items: [
			'PostgreSQL pgvector (HNSW Indexing)',
			'Qdrant',
			'Embedding Pipelines',
			'Cosine Similarity Search',
		],
	},
	{
		category: 'Graph & Data Pipelines',
		items: [
			'Neo4j (Cypher, AuraDB)',
			'Entity Resolution',
			'Multi-Document Graph Traversal',
			'Automated ETL Pipelines',
		],
	},
	{
		category: 'Backend & APIs',
		items: [
			'Python',
			'FastAPI',
			'AsyncIO',
			'REST API Design',
			'Microservices',
			'Node.js',
		],
	},
	{
		category: 'Frontend',
		items: [
			'React',
			'TypeScript',
			'JavaScript',
			'Tailwind CSS',
			'GSAP',
			'Zustand',
		],
	},
	{
		category: 'Databases',
		items: ['PostgreSQL', 'SQLite'],
	},
	{
		category: 'Testing & DevOps',
		items: [
			'Pytest',
			'Docker / Docker Compose',
			'GitHub Actions (CI)',
			'Locust Load Testing',
		],
	},
	{
		category: 'Core CS',
		items: [
			'Data Structures & Algorithms',
			'Object-Oriented Programming (OOP)',
			'Git/GitHub',
		],
	},
] satisfies TechStackCategory[];

/**
 * Social links with icon and accent color.
 */
const socials = [
	{
		id: 1,
		text: 'Github',
		icon: '/icons/github.svg',
		bg: '#f4656b',
		link: 'https://github.com/yuvrajgovindrao',
	},
	{
		id: 2,
		text: 'Website',
		icon: '/icons/atom.svg',
		bg: '#4bcb63',
		link: 'https://yuvrajenv.in',
	},
	{
		id: 3,
		text: 'Twitter/X',
		icon: '/icons/twitter.svg',
		bg: '#ff866b',
		link: 'https://x.com/yuvrajgovindrao',
	},
	{
		id: 4,
		text: 'LinkedIn',
		icon: '/icons/linkedin.svg',
		bg: '#05b6f6',
		link: 'https://www.linkedin.com/in/yuvrajgovindrao',
	},
] satisfies SocialLink[];

/** Certification cards shown in Photos and Finder > Photos. */
const ISSUER_URLS = {
	Google: 'https://developers.google.com/certification',
	AWS: 'https://aws.amazon.com/certification/',
} as const;

/** Certification cards shown in Photos and Finder > Photos. */
const GALLERY_IMAGES = [
	{
		title: 'Android Developer Virtual Internship',
		issuer: 'Google for Developers / EduSkills',
		issuerUrl: ISSUER_URLS.Google,
		category: 'Mobile / Android',
		imageUrl: '/files/Certificate_2.jpg',
	},
	{
		title: 'Data Engineering Virtual Internship',
		issuer: 'AWS Academy / EduSkills',
		issuerUrl: ISSUER_URLS.AWS,
		category: 'Cloud / Data',
		imageUrl: '/files/Certificate_1.jpg',
	},
] as const;

/**
 * Finder icon positions for photos root.
 * Layout is designed for 4 tiles; extra images reuse slots.
 */
const GALLERY_POSITIONS = [
	'top-10 left-10',
	'top-10 left-56',
	'top-56 left-10',
	'top-56 left-56',
] as const;

/**
 * Gallery image tiles for the Photos window.
 */
const gallery = GALLERY_IMAGES.map((img, index) => ({
	id: index + 1,
	title: img.title,
	issuer: img.issuer,
	issuerUrl: img.issuerUrl,
	category: img.category,
	img: img.imageUrl,
})) satisfies GalleryItem[];

/** Avatar URL shown in the Contact window. */
const CONTACT_AVATAR_URL = 'https://github.com/yuvrajgovindrao.png';

/** Primary email shown in the Contact window. */
const CONTACT_EMAIL = 'yuvrajgovindrao@gmail.com';

export {
	blogPosts,
	CONTACT_AVATAR_URL,
	CONTACT_EMAIL,
	dockApps,
	gallery,
	navIcons,
	navLinks,
	safariBookmarks,
	socials,
	techStack,
};

/**
 * Finder root: Work projects and related assets.
 */
const WORK_LOCATION = {
	id: 1,
	type: 'work',
	name: 'Work',
	icon: '/icons/work.svg',
	kind: 'folder',
	scope: 'root',
	children: [
		// ▶ Project 1: GraphRAG
		{
			id: 5,
			name: 'GraphRAG',
			icon: '/images/folder.png',
			kind: 'folder',
			scope: 'nested',
			position: 'top-8 left-12', // icon position inside Finder
			windowPosition: 'top-[5.25rem] right-8', // optional: Finder window position
			children: [
				{
					id: 1,
					name: 'GraphRAG Project.md',
					icon: '/icons/markdown.svg',
					kind: 'file',
					fileType: 'md',
					href: '/files/graphrag.md',
					position: 'top-5 left-10',
				},
				{
					id: 2,
					name: 'GitHub Repository',
					icon: '/images/safari.png',
					kind: 'file',
					fileType: 'url',
					href: 'https://github.com/yuvrajgovindrao/GraphRAG',
					position: 'top-10 right-20',
				},
				{
					id: 5,
					name: 'Source Code.url',
					icon: '/images/github.png',
					kind: 'file',
					fileType: 'url',
					href: 'https://github.com/yuvrajgovindrao/GraphRAG',
					position: 'top-60 right-20',
				},
			],
		},

		// ▶ Project 2: YouTubeRAG
		{
			id: 6,
			name: 'YouTubeRAG',
			icon: '/images/folder.png',
			kind: 'folder',
			scope: 'nested',
			position: 'top-8 left-72',
			windowPosition: 'top-[17.75rem] right-8',
			children: [
				{
					id: 1,
					name: 'YouTubeRAG Project.md',
					icon: '/icons/markdown.svg',
					kind: 'file',
					fileType: 'md',
					href: '/files/youtuberag.md',
					position: 'top-5 right-10',
				},
				{
					id: 2,
					name: 'GitHub Repository',
					icon: '/images/safari.png',
					kind: 'file',
					fileType: 'url',
					href: 'https://github.com/yuvrajgovindrao/YouTubeRAG',
					position: 'top-20 left-20',
				},
				{
					id: 5,
					name: 'Source Code.url',
					icon: '/images/github.png',
					kind: 'file',
					fileType: 'url',
					href: 'https://github.com/yuvrajgovindrao/YouTubeRAG',
					position: 'top-60 left-5',
				},
			],
		},

		// ▶ Project 3: macOS Portfolio
		{
			id: 7,
			name: 'macOS Portfolio',
			icon: '/images/folder.png',
			kind: 'folder',
			scope: 'nested',
			position: 'top-36 left-12',
			windowPosition: 'top-[30.25rem] right-8',
			children: [
				{
					id: 1,
					name: 'macOS Portfolio Project.md',
					icon: '/icons/markdown.svg',
					kind: 'file',
					fileType: 'md',
					href: '/files/macos-portfolio.md',
					position: 'top-5 left-10',
				},
				{
					id: 2,
					name: 'yuvrajenv.in',
					icon: '/images/safari.png',
					kind: 'file',
					fileType: 'url',
					href: 'https://yuvrajenv.in',
					position: 'top-10 right-20',
				},
				{
					id: 5,
					name: 'GitHub Profile.url',
					icon: '/images/github.png',
					kind: 'file',
					fileType: 'url',
					href: 'https://github.com/yuvrajgovindrao',
					position: 'top-60 right-20',
				},
			],
		},
	],
} as const satisfies FinderLocation;

/**
 * Finder root: About me content.
 */
const ABOUT_LOCATION = {
	id: 2,
	type: 'about',
	name: 'About me',
	icon: '/icons/info.svg',
	kind: 'folder',
	scope: 'root',
	children: [
		{
			id: 1,
			name: 'about-me.txt',
			icon: '/images/txt.png',
			kind: 'file',
			fileType: 'txt',
			position: 'top-10 left-10',
			subtitle: 'AI Engineer • B.Tech Computer Science (Game Technology) (2026)',
			image: 'https://github.com/yuvrajgovindrao.png',
			description: [
				"I'm Yuvraj Govind Rao, a B.Tech Computer Science & Engineering (Game Technology) graduate (2026) and AI Engineer based in Greater Noida, UP 201310.",
				'I specialize in building Python/FastAPI microservices integrating LLM APIs (Gemini, OpenAI) for Retrieval-Augmented Generation (RAG), semantic search, and knowledge-graph-enhanced retrieval.',
				'Experienced managing vector database indices across PostgreSQL pgvector (HNSW) and Qdrant, building async ingestion pipelines, and shipping full-stack applications with React, TypeScript, FastAPI, and Node.js.',
				'Contact: +91 7004890027 | yuvrajgovindrao@gmail.com | github.com/yuvrajgovindrao | linkedin.com/in/yuvrajgovindrao',
				'Actively seeking an AI Engineer role building and deploying high-impact LLM-powered products.',
			],
		},
		{
			id: 2,
			name: 'highlights.txt',
			icon: '/images/txt.png',
			kind: 'file',
			fileType: 'txt',
			position: 'top-10 left-52',
			subtitle: 'Technical Strengths • Experience • Education',
			description: [
				'Core competencies: Retrieval-Augmented Generation (RAG), Vector Embeddings, Neo4j Graph Traversal, PostgreSQL pgvector, Qdrant, FastAPI, Python, React, TypeScript, LangChain, PyTorch.',
				'Featured Projects: GraphRAG (hybrid Qdrant vector search + Neo4j AuraDB graph traversal), YouTubeRAG (timestamp-grounded video citations with 768-dim Gemini embeddings), and interactive macOS Portfolio.',
				'Professional Experience: User Trial Program Participant at Nothing Technology (2024–2025), evaluating unreleased consumer tech products and documenting bugs and UX friction points.',
				'Education: B.Tech, Computer Science & Engineering (Game Technology) — Galgotias University (2026), CGPA: 7.0 / 10.',
				'Certifications: Google Android Developer Certification | AWS Certified Data Engineer.',
			],
		},
	],
} as const satisfies FinderLocation;

/**
 * Finder root: Resume files (pdf or external links).
 */
const RESUME_LOCATION = {
	id: 3,
	type: 'resume',
	name: 'Resume',
	icon: '/icons/file.svg',
	kind: 'folder',
	scope: 'root',
	children: [
		{
			id: 1,
			name: 'Resume.pdf',
			icon: '/images/pdf.png',
			kind: 'file',
			fileType: 'pdf',
			// you can add `href` if you want to open a hosted resume
			// href: "/your/resume/path.pdf",
		},
	],
} as const satisfies FinderLocation;

/**
 * Finder root: Photos gallery files.
 */
const PHOTOS_LOCATION = {
	id: 4,
	type: 'photos',
	name: 'Certifications',
	icon: '/icons/file.svg',
	kind: 'folder',
	scope: 'root',
	children: GALLERY_IMAGES.map((certificate, index) => ({
		id: index + 1,
		name: certificate.title,
		subtitle: certificate.issuer,
		issuerUrl: certificate.issuerUrl,
		category: certificate.category,
		icon: '/images/image.png',
		kind: 'file',
		fileType: 'img',
		position: GALLERY_POSITIONS[index % GALLERY_POSITIONS.length],
		imageUrl: certificate.imageUrl,
	})),
} as const satisfies FinderLocation;

/**
 * Finder root: Trash items (non-openable by default).
 */
const TRASH_LOCATION = {
	id: 5,
	type: 'trash',
	name: 'Trash',
	icon: '/icons/trash.svg',
	kind: 'folder',
	scope: 'root',
	children: [
		{
			id: 1,
			name: 'trash1.png',
			icon: '/images/image.png',
			kind: 'file',
			fileType: 'img',
			position: 'top-10 left-10',
			imageUrl: '/images/trash-1.png',
		},
		{
			id: 2,
			name: 'trash2.png',
			icon: '/images/image.png',
			kind: 'file',
			fileType: 'img',
			position: 'top-40 left-80',
			imageUrl: '/images/trash-2.png',
		},
	],
} as const satisfies FinderLocation;

/**
 * Finder root map by location key.
 */
export const locations = {
	work: WORK_LOCATION,
	about: ABOUT_LOCATION,
	resume: RESUME_LOCATION,
	photos: PHOTOS_LOCATION,
	trash: TRASH_LOCATION,
} as const satisfies LocationsMap;

interface HomeItemRef {
	location: LocationType;
	// Path of node IDs from the location root to the item to render on Home.
	path: number[];
}

const homeItemRefs = [
	{ location: 'work', path: [5] },
	{ location: 'work', path: [6] },
	{ location: 'work', path: [7] },
] satisfies HomeItemRef[];

const resolveHomeItem = ({
	location,
	path,
}: HomeItemRef): FinderNode | null => {
	let current: FinderNode = locations[location];

	for (const nodeId of path) {
		if (current.kind !== 'folder') return null;
		const next: FinderNode | undefined = current.children.find(
			(child: FinderNode) => child.id === nodeId,
		);
		if (!next) return null;
		current = next;
	}

	return current;
};

/** Curated Finder nodes rendered as desktop shortcuts on Home. */
export const homeItems = homeItemRefs
	.map((ref, index) => {
		const item = resolveHomeItem(ref);
		if (!item) {
			console.warn('Invalid home item reference', { index, ref });
		}
		return item;
	})
	.filter((item): item is FinderNode => item !== null);

/**
 * Baseline z-index for unfocused windows.
 */
const INITIAL_Z_INDEX = 1000;

/**
 * Initial window state for all supported window ids.
 */
const WINDOW_CONFIG: WindowConfig = {
	finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
	contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
	resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
	safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
	photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
	terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
	txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
	imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
	askai: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };
