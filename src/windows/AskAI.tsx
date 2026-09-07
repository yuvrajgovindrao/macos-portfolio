import { MarkdownView, WindowControls } from '#components';
import { WindowWrapper } from '#hoc';
import { RAW_PROJECT_DOCS, routeProjectDocs } from '#lib/knowledge';
import clsx from 'clsx';
import { RotateCcw, Send } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactElement } from 'react';

interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
	{
		id: 'welcome-1',
		role: 'assistant',
		content:
			"Hello! 👋 I'm Yuvraj's personal portfolio AI assistant powered by Google Gemini. Ask me anything about his projects, AI/RAG skills, experience, or how to get in touch!",
		timestamp: 'Just now',
	},
];

const SUGGESTED_PROMPTS = [
	'🚀 Tell me about GraphRAG and YouTubeRAG',
	'🧠 What is Yuvraj’s AI & RAG expertise?',
	'💻 What is Yuvraj’s tech stack?',
	'📬 How can I contact Yuvraj?',
	'🎓 What is Yuvraj’s education & experience?',
];

/**
 * Desktop "Ask AI" chatbot window.
 */
const AskAI = (): ReactElement => {
	const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	const sendMessage = async (userText: string) => {
		const trimmed = userText.trim();
		if (!trimmed || isLoading) return;

		const userMsg: ChatMessage = {
			id: `user-${String(Date.now())}`,
			role: 'user',
			content: trimmed,
			timestamp: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};

		const updatedMessages = [...messages, userMsg];
		setMessages(updatedMessages);
		setInput('');
		setIsLoading(true);

		try {
			const history = updatedMessages.slice(-6).map((m) => ({
				role: m.role,
				content: m.content,
			}));

			const relevantDocs = routeProjectDocs(trimmed, RAW_PROJECT_DOCS);

			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: trimmed,
					history,
					projectDocs: relevantDocs,
				}),
			});

			let reply = '';
			try {
				const data = (await res.json()) as {
					reply?: string | null;
					error?: string | null;
				};
				if (res.ok && data.reply) {
					reply = data.reply;
				} else {
					reply =
						data.error ??
						`Backend returned status ${res.status}. Please check your backend configuration.`;
				}
			} catch {
				const rawText = await res.text().catch(() => '');
				reply = `Backend error (${res.status}): ${rawText || 'Empty response from /api/chat. Please ensure backend functions are running.'}`;
			}

			const botMsg: ChatMessage = {
				id: `bot-${String(Date.now())}`,
				role: 'assistant',
				content: reply,
				timestamp: new Date().toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				}),
			};

			setMessages((prev) => [...prev, botMsg]);
		} catch (err: unknown) {
			const botMsg: ChatMessage = {
				id: `bot-${String(Date.now())}`,
				role: 'assistant',
				content:
					err instanceof Error
						? `Network Error: ${err.message}. Please check your backend connection.`
						: 'Error connecting to the backend server.',
				timestamp: new Date().toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				}),
			};
			setMessages((prev) => [...prev, botMsg]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		void sendMessage(input);
	};

	const handleReset = () => {
		setMessages(INITIAL_MESSAGES);
		setInput('');
	};

	return (
		<>
			<div className="window-header">
				<WindowControls target="askai" />
				<div className="flex items-center gap-2">
					<img
						src="/icons/askaichat.svg"
						alt="Ask AI"
						className="size-4.5 object-contain"
					/>
					<h2 className="text-sm font-semibold">Ask AI</h2>
					<span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
						<span className="inline-block size-2 rounded-full bg-emerald-500 animate-ping" />
						Online
					</span>
				</div>
				<button
					type="button"
					onClick={handleReset}
					title="Reset chat"
					aria-label="Reset chat"
					className="cursor-pointer text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
				>
					<RotateCcw size={15} />
				</button>
			</div>

			<div className="askai-container">
				{/* Message list */}
				<div className="askai-messages">
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={clsx(
								'flex flex-col mb-4',
								msg.role === 'user' ? 'items-end' : 'items-start',
							)}
						>
							{msg.role === 'assistant' ? (
								<div className="flex items-start gap-2.5 max-w-[90%]">
									<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-xs border border-gray-200/70 dark:border-white/10 mt-0.5">
										<img
											src="/icons/askaichat.svg"
											alt="Ask AI"
											className="size-4.5 object-contain"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<div className="rounded-2xl rounded-tl-xs bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-gray-100 px-4 py-2.5 text-sm leading-relaxed border border-gray-200/60 dark:border-white/5 select-text shadow-xs">
											<MarkdownView content={msg.content} />
										</div>
										<span className="mt-1 block px-1 text-[10px] text-gray-400 dark:text-gray-500">
											{msg.timestamp}
										</span>
									</div>
								</div>
							) : (
								<div className="flex flex-col items-end max-w-[85%]">
									<div className="rounded-2xl rounded-br-xs bg-blue-600 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm select-text whitespace-pre-wrap">
										{msg.content}
									</div>
									<span className="mt-1 px-1 text-[10px] text-gray-400 dark:text-gray-500">
										{msg.timestamp}
									</span>
								</div>
							)}
						</div>
					))}

					{/* Typing Indicator */}
					{isLoading && (
						<div className="flex items-start gap-2.5 mb-4">
							<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-xs border border-gray-200/70 dark:border-white/10 mt-0.5">
								<img
									src="/icons/askaichat.svg"
									alt="Ask AI"
									className="size-4.5 object-contain animate-pulse"
								/>
							</div>
							<div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs bg-gray-100 px-4 py-3 dark:bg-neutral-800 border border-gray-200/60 dark:border-white/5">
								<span className="size-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
								<span className="size-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
								<span className="size-2 rounded-full bg-blue-500 animate-bounce" />
							</div>
						</div>
					)}

					{/* Quick Prompt Chips (only if conversation is short) */}
					{messages.length <= 2 && !isLoading && (
						<div className="mt-4 pt-2 border-t border-gray-100 dark:border-neutral-800">
							<p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
								Suggested questions:
							</p>
							<div className="flex flex-wrap gap-1.5">
								{SUGGESTED_PROMPTS.map((prompt) => (
									<button
										key={prompt}
										type="button"
										onClick={() => {
											void sendMessage(prompt);
										}}
										className="cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-gray-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 active:scale-95"
									>
										{prompt}
									</button>
								))}
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				{/* Input Bar */}
				<form onSubmit={handleSubmit} className="askai-footer">
					<div className="relative flex w-full items-center">
						<input
							type="text"
							value={input}
							onChange={(e) => {
								setInput(e.target.value);
							}}
							placeholder="Ask a question about Yuvraj or his work..."
							disabled={isLoading}
							className="w-full rounded-full border border-gray-300 bg-white py-2.5 pr-12 pl-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-blue-400"
						/>
						<button
							type="submit"
							disabled={!input.trim() || isLoading}
							aria-label="Send message"
							className="absolute right-1.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<Send size={15} />
						</button>
					</div>
					<p className="mt-1 text-center text-[10px] text-gray-400 dark:text-gray-500">
						Powered by Google Gemini • API key kept securely on backend
					</p>
				</form>
			</div>
		</>
	);
};

const AskAIWindow = WindowWrapper(AskAI, 'askai');
export default AskAIWindow;
