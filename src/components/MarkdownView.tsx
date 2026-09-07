import clsx from 'clsx';
import {
	useEffect,
	useState,
	type ComponentPropsWithoutRef,
	type ReactElement,
} from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { MermaidDiagram } from './MermaidDiagram';

interface MarkdownViewProps {
	content?: string;
	fileUrl?: string;
	className?: string;
	variant?: 'document' | 'chat';
}

/**
 * Renders Markdown content with clean, GitHub-flavored styling.
 * Supports inline content (e.g. Ask AI chat bubbles) or full document preview (Safari markdown reader).
 */
export const MarkdownView = ({
	content: initialContent = '',
	fileUrl,
	className,
	variant,
}: MarkdownViewProps): ReactElement => {
	const [fetchedContent, setFetchedContent] = useState<string>('');
	const [prevFileUrl, setPrevFileUrl] = useState<string | undefined>(fileUrl);
	const [isLoading, setIsLoading] = useState<boolean>(Boolean(fileUrl));
	const [error, setError] = useState<string | null>(null);

	if (prevFileUrl !== fileUrl) {
		setPrevFileUrl(fileUrl);
		setFetchedContent('');
		setIsLoading(Boolean(fileUrl));
		setError(null);
	}

	useEffect(() => {
		if (!fileUrl) return;

		let isCancelled = false;

		fetch(fileUrl)
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(
						`Failed to load (${String(res.status)} ${res.statusText})`,
					);
				}
				return res.text();
			})
			.then((text) => {
				if (!isCancelled) {
					setFetchedContent(text);
					setIsLoading(false);
				}
			})
			.catch((err: unknown) => {
				if (!isCancelled) {
					const message =
						err instanceof Error
							? err.message
							: 'Error loading markdown file.';
					setError(message);
					setIsLoading(false);
				}
			});

		return () => {
			isCancelled = true;
		};
	}, [fileUrl]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20 text-xs text-gray-400">
				<span className="mr-2 inline-block size-3.5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
				Loading markdown document...
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
				<p className="text-sm font-semibold">Unable to load document</p>
				<p className="mt-1">{error}</p>
				<p className="mt-2 text-gray-500 dark:text-gray-400">
					Make sure the file exists at{' '}
					<code className="rounded bg-black/5 px-1 py-0.5 font-mono dark:bg-white/10">
						{fileUrl}
					</code>{' '}
					in the public folder.
				</p>
			</div>
		);
	}

	const rawMarkdown = fileUrl ? fetchedContent : initialContent;
	const isDocument = variant ? variant === 'document' : Boolean(fileUrl);

	return (
		<div
			className={clsx(
				'markdown-content leading-relaxed',
				isDocument
					? 'github-markdown-body text-[15px] text-neutral-900 dark:text-neutral-100'
					: 'text-sm text-neutral-800 dark:text-neutral-200',
				className,
			)}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={{
					p: ({ children }) => (
						<p className={clsx(isDocument ? 'mb-4 leading-relaxed' : 'mb-2 leading-relaxed last:mb-0')}>
							{children}
						</p>
					),
					strong: ({ children }) => (
						<strong className="font-semibold text-gray-950 dark:text-white">
							{children}
						</strong>
					),
					em: ({ children }) => <em className="italic">{children}</em>,
					ul: ({ children }) => (
						<ul
							className={clsx(
								'list-disc text-inherit',
								isDocument ? 'my-3 ml-6 space-y-1.5' : 'my-1.5 ml-4 space-y-1',
							)}
						>
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol
							className={clsx(
								'list-decimal text-inherit',
								isDocument ? 'my-3 ml-6 space-y-1.5' : 'my-1.5 ml-4 space-y-1',
							)}
						>
							{children}
						</ol>
					),
					li: ({ children }) => (
						<li className={clsx('leading-relaxed', isDocument ? 'pl-1' : 'pl-0.5')}>
							{children}
						</li>
					),
					h1: ({ children }) =>
						isDocument ? (
							<h1 className="mt-8 mb-4 border-b border-gray-200/90 pb-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 first:mt-0 dark:border-neutral-800 dark:text-white">
								{children}
							</h1>
						) : (
							<h3 className="mt-2.5 mb-1 text-base font-bold text-gray-950 dark:text-white">
								{children}
							</h3>
						),
					h2: ({ children }) =>
						isDocument ? (
							<h2 className="mt-8 mb-3.5 border-b border-gray-200/80 pb-2 text-xl sm:text-2xl font-bold tracking-tight text-gray-950 dark:border-neutral-800 dark:text-white">
								{children}
							</h2>
						) : (
							<h4 className="mt-2 mb-1 text-sm font-bold text-gray-950 dark:text-white">
								{children}
							</h4>
						),
					h3: ({ children }) =>
						isDocument ? (
							<h3 className="mt-6 mb-2 text-lg sm:text-xl font-semibold tracking-tight text-gray-950 dark:text-white">
								{children}
							</h3>
						) : (
							<h5 className="mt-1.5 mb-0.5 text-xs font-bold uppercase tracking-wide text-gray-950 dark:text-white">
								{children}
							</h5>
						),
					h4: ({ children }) =>
						isDocument ? (
							<h4 className="mt-4 mb-2 text-base font-semibold text-gray-950 dark:text-white">
								{children}
							</h4>
						) : (
							<h6 className="mt-1.5 mb-0.5 text-xs font-semibold text-gray-950 dark:text-white">
								{children}
							</h6>
						),
					code: ({
						className: codeClassName,
						children,
						...props
					}: ComponentPropsWithoutRef<'code'>) => {
						const isInline =
							!codeClassName &&
							typeof children === 'string' &&
							!children.includes('\n');
						if (isInline) {
							return (
								<code
									className={clsx(
										'rounded-md font-mono font-medium',
										isDocument
											? 'bg-gray-100 dark:bg-neutral-800/80 px-1.5 py-0.5 text-[13px] text-pink-600 dark:text-pink-400 border border-gray-200/70 dark:border-neutral-700/60'
											: 'bg-black/5 dark:bg-white/10 px-1.5 py-0.5 text-xs text-blue-600 dark:text-blue-300',
									)}
									{...props}
								>
									{children}
								</code>
							);
						}

						const rawCode = Array.isArray(children)
							? children
									.map((c) => (typeof c === 'string' ? c : ''))
									.join('')
							: String(children ?? '').replace(/\n$/, '');

						const isMermaid =
							codeClassName === 'language-mermaid' ||
							Boolean(codeClassName?.includes('mermaid')) ||
							rawCode.trimStart().startsWith('flowchart ') ||
							rawCode.trimStart().startsWith('graph ') ||
							rawCode.trimStart().startsWith('sequenceDiagram');

						if (isMermaid) {
							return <MermaidDiagram chart={rawCode} />;
						}

						return (
							<pre
								className={clsx(
									'my-3 block overflow-x-auto rounded-xl border border-neutral-800/80 bg-neutral-900 dark:bg-black/95 text-neutral-100 shadow-xs select-text',
									isDocument ? 'p-4 text-xs sm:text-[13px]' : 'p-3 text-xs',
								)}
								style={{
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									lineHeight: 1.35,
									tabSize: 2,
								}}
							>
								<code
									className={clsx(
										'block whitespace-pre font-mono',
										codeClassName,
									)}
									style={{
										fontFamily: 'inherit',
										lineHeight: 'inherit',
									}}
									{...props}
								>
									{children}
								</code>
							</pre>
						);
					},
					pre: ({ children }) => <>{children}</>,
					a: ({ href, children }) => (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:opacity-80 break-words"
						>
							{children}
						</a>
					),
					img: ({ src, alt, ...props }) => (
						<img
							src={src}
							alt={alt ?? ''}
							className={clsx(
								'inline-block h-auto align-middle',
								isDocument ? 'max-w-full rounded-lg my-1' : 'max-w-full rounded',
							)}
							loading="lazy"
							{...props}
						/>
					),
					blockquote: ({ children }) => (
						<blockquote
							className={clsx(
								'border-l-4 italic my-3',
								isDocument
									? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-2.5 rounded-r-lg text-neutral-700 dark:text-neutral-300'
									: 'border-blue-500 pl-3 text-gray-600 dark:text-gray-300',
							)}
						>
							{children}
						</blockquote>
					),
					table: ({ children }) => (
						<div
							className={clsx(
								'my-4 overflow-x-auto',
								isDocument
									? 'rounded-lg border border-gray-200 dark:border-neutral-700 shadow-xs'
									: 'border border-gray-200 dark:border-neutral-700',
							)}
						>
							<table className="min-w-full text-left text-xs sm:text-sm border-collapse divide-y divide-gray-200 dark:divide-neutral-700">
								{children}
							</table>
						</div>
					),
					th: ({ children }) => (
						<th
							className={clsx(
								'font-semibold text-gray-950 dark:text-white border-b border-gray-200 dark:border-neutral-700',
								isDocument
									? 'bg-gray-50 dark:bg-neutral-800/90 px-4 py-2.5 text-xs sm:text-sm'
									: 'bg-gray-100 dark:bg-neutral-800 px-2 py-1',
							)}
						>
							{children}
						</th>
					),
					td: ({ children }) => (
						<td
							className={clsx(
								'text-gray-800 dark:text-gray-200 border-b border-gray-200/80 dark:border-neutral-800/80',
								isDocument ? 'px-4 py-2.5 text-xs sm:text-sm' : 'px-2 py-1',
							)}
						>
							{children}
						</td>
					),
					tr: ({ children }) => (
						<tr
							className={clsx(
								isDocument
									? 'odd:bg-white even:bg-gray-50/60 dark:odd:bg-neutral-900 dark:even:bg-neutral-800/40 transition-colors hover:bg-blue-50/30 dark:hover:bg-neutral-800/60'
									: '',
							)}
						>
							{children}
						</tr>
					),
					hr: () => (
						<hr
							className={clsx(
								'border-0 h-px',
								isDocument
									? 'my-6 bg-gray-200 dark:bg-neutral-800'
									: 'my-2 bg-gray-200 dark:bg-neutral-700',
							)}
						/>
					),
				}}
			>
				{rawMarkdown}
			</ReactMarkdown>
		</div>
	);
};
