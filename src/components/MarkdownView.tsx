import clsx from 'clsx';
import {
	useEffect,
	useState,
	type ComponentPropsWithoutRef,
	type ReactElement,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
	content?: string;
	fileUrl?: string;
	className?: string;
}

/**
 * Renders Markdown content with clean styling and without distracting raw symbols.
 * Supports inline content or fetching from fileUrl (e.g. /files/example.md).
 */
export const MarkdownView = ({
	content: initialContent = '',
	fileUrl,
	className,
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
				Loading markdown file...
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

	return (
		<div className={clsx('markdown-content text-sm leading-relaxed', className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					p: ({ children }) => (
						<p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
					),
					strong: ({ children }) => (
						<strong className="font-semibold text-gray-950 dark:text-white">
							{children}
						</strong>
					),
					em: ({ children }) => <em className="italic">{children}</em>,
					ul: ({ children }) => (
						<ul className="my-1.5 ml-4 list-disc space-y-1 text-inherit">
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol className="my-1.5 ml-4 list-decimal space-y-1 text-inherit">
							{children}
						</ol>
					),
					li: ({ children }) => (
						<li className="leading-relaxed pl-0.5">{children}</li>
					),
					h1: ({ children }) => (
						<h3 className="mt-2.5 mb-1 text-base font-bold text-gray-950 dark:text-white">
							{children}
						</h3>
					),
					h2: ({ children }) => (
						<h4 className="mt-2 mb-1 text-sm font-bold text-gray-950 dark:text-white">
							{children}
						</h4>
					),
					h3: ({ children }) => (
						<h5 className="mt-1.5 mb-0.5 text-xs font-bold uppercase tracking-wide text-gray-950 dark:text-white">
							{children}
						</h5>
					),
					h4: ({ children }) => (
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
									className="rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.5 font-mono text-xs font-medium text-blue-600 dark:text-blue-300"
									{...props}
								>
									{children}
								</code>
							);
						}
						return (
							<code
								className={clsx(
									'block overflow-x-auto rounded-lg bg-neutral-900 p-2.5 font-mono text-xs text-neutral-100 my-2',
									codeClassName,
								)}
								{...props}
							>
								{children}
							</code>
						);
					},
					pre: ({ children }) => (
						<div className="my-1.5 overflow-x-auto">{children}</div>
					),
					a: ({ href, children }) => (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:opacity-80 break-all"
						>
							{children}
						</a>
					),
					blockquote: ({ children }) => (
						<blockquote className="my-1.5 border-l-2 border-blue-500 pl-3 italic text-gray-600 dark:text-gray-300">
							{children}
						</blockquote>
					),
					table: ({ children }) => (
						<div className="my-2 overflow-x-auto">
							<table className="min-w-full text-xs border border-gray-200 dark:border-neutral-700 divide-y divide-gray-200 dark:divide-neutral-700">
								{children}
							</table>
						</div>
					),
					th: ({ children }) => (
						<th className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-700">
							{children}
						</th>
					),
					td: ({ children }) => (
						<td className="px-2 py-1 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700">
							{children}
						</td>
					),
					hr: () => (
						<hr className="my-2 border-gray-200 dark:border-neutral-700" />
					),
				}}
			>
				{rawMarkdown}
			</ReactMarkdown>
		</div>
	);
};
