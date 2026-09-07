import { MarkdownView, WindowControls } from '#components';
import { blogPosts, safariBookmarks } from '#constants';
import { WindowWrapper } from '#hoc';
import { groupBookmarksByCategory } from '#lib/bookmark-utils';
import { resolveSafariAddressInput } from '#lib/safari-address';
import { useWindowStore, type WindowState } from '#store';
import { isFinderMdFile, type FinderMdFile } from '#types';
import {
	ChevronLeft,
	ChevronRight,
	MoveRight,
	PanelLeft,
	Plus,
	SearchIcon,
	Share,
} from 'lucide-react';
import {
	useEffect,
	useMemo,
	useState,
	type FormEvent,
	type ReactElement,
} from 'react';

const SAFARI_PAGE_SIZE = 3;

/**
 * Safari-like window that previews blog posts, navigation controls, and Markdown documents.
 */
const Safari = (): ReactElement => {
	const windows = useWindowStore((state: WindowState) => state.windows);
	const safariData = windows.safari.data;

	const [prevSafariData, setPrevSafariData] = useState<unknown>(safariData);
	const [dismissedData, setDismissedData] = useState<unknown>(null);
	const [customAddress, setCustomAddress] = useState<string | null>(null);
	const [pageIndex, setPageIndex] = useState(0);
	const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
	const [addressInputEl, setAddressInputEl] =
		useState<HTMLInputElement | null>(null);

	if (prevSafariData !== safariData) {
		setPrevSafariData(safariData);
		setDismissedData(null);
		setCustomAddress(null);
	}

	const activeMdFile: FinderMdFile | null =
		dismissedData === safariData
			? null
			: isFinderMdFile(safariData)
				? safariData
				: null;

	const displayedAddress =
		customAddress ??
		(activeMdFile
			? `https://yuvrajenv.in${activeMdFile.href.startsWith('/') ? activeMdFile.href : `/${activeMdFile.href}`}`
			: 'https://yuvrajenv.in');

	const isSafariTopmost = useMemo(() => {
		const openWindows = Object.values(windows).filter(
			(windowMeta) => windowMeta.isOpen,
		);
		if (openWindows.length === 0) return false;

		const topZIndex = Math.max(
			...openWindows.map((windowMeta) => windowMeta.zIndex),
		);
		return windows.safari.isOpen && windows.safari.zIndex === topZIndex;
	}, [windows]);

	const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const targetUrl = resolveSafariAddressInput(displayedAddress);
		if (!targetUrl) return;

		window.open(targetUrl, '_blank', 'noopener,noreferrer');
	};

	const totalPages = Math.max(
		1,
		Math.ceil(blogPosts.length / SAFARI_PAGE_SIZE),
	);

	const visiblePosts = useMemo(() => {
		const start = pageIndex * SAFARI_PAGE_SIZE;
		return blogPosts.slice(start, start + SAFARI_PAGE_SIZE);
	}, [pageIndex]);

	const canGoBack = Boolean(activeMdFile) || pageIndex > 0;
	const canGoForward = !activeMdFile && pageIndex < totalPages - 1;

	const handleGoBack = () => {
		if (activeMdFile) {
			setDismissedData(safariData);
			setCustomAddress('https://yuvrajenv.in');
			return;
		}
		if (pageIndex > 0) {
			setPageIndex((previous) => previous - 1);
		}
	};

	const bookmarksByCategory = useMemo(
		() => groupBookmarksByCategory(safariBookmarks),
		[],
	);

	const openExternalUrl = (url: string): void => {
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	const handleShare = async (): Promise<void> => {
		const shareUrl = window.location.href;
		try {
			await navigator.share({
				title: "Yuvraj's macOS Portfolio",
				url: shareUrl,
			});
			return;
		} catch (error) {
			const name = (error as DOMException | undefined)?.name;
			if (name === 'AbortError') return;
			// Fall back to clipboard below.
		}

		try {
			await navigator.clipboard.writeText(shareUrl);
		} catch {
			// No-op if clipboard is unavailable.
		}
	};

	const toggleBookmarksMenu = (): void => {
		setIsBookmarksOpen((previous) => !previous);
	};

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const isAddressShortcut =
				(event.metaKey || event.ctrlKey) &&
				!event.shiftKey &&
				!event.altKey &&
				(event.key === '/' || event.code === 'Slash');

			if (!isAddressShortcut || !isSafariTopmost) return;

			event.preventDefault();
			addressInputEl?.focus();
			addressInputEl?.select();
		};

		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [isSafariTopmost, addressInputEl]);

	return (
		<>
			<div className="window-header safari-header">
				<div className="safari-header-left">
					<WindowControls target="safari" />
					<button
						type="button"
						className="safari-toolbar-btn ml-6"
						aria-label="Toggle bookmarks sidebar"
						aria-expanded={isBookmarksOpen}
						onClick={toggleBookmarksMenu}
					>
						<PanelLeft
							className="safari-toolbar-icon"
							aria-hidden="true"
						/>
					</button>

					<div className="ml-3 flex items-center gap-1">
						<button
							type="button"
							className="safari-toolbar-btn"
							aria-label="Previous articles page"
							onClick={handleGoBack}
							disabled={!canGoBack}
						>
							<ChevronLeft
								className="safari-toolbar-icon"
								aria-hidden="true"
							/>
						</button>
						<button
							type="button"
							className="safari-toolbar-btn"
							aria-label="Next articles page"
							onClick={() => {
								setPageIndex((previous) => previous + 1);
							}}
							disabled={!canGoForward}
						>
							<ChevronRight
								className="safari-toolbar-icon"
								aria-hidden="true"
							/>
						</button>
					</div>
				</div>

				<div className="safari-header-center">
					<form className="search" onSubmit={handleAddressSubmit}>
						<SearchIcon
							className="safari-toolbar-icon pointer-events-none"
							aria-hidden="true"
						/>
						<input
							ref={setAddressInputEl}
							type="text"
							placeholder="Search or enter website name"
							aria-label="Search or enter website name"
							className="flex-1"
							value={displayedAddress}
							onChange={(event) => {
								setCustomAddress(event.target.value);
							}}
						/>
					</form>
				</div>

				<div className="safari-header-right">
					<button
						type="button"
						className="safari-toolbar-btn"
						aria-label="Share current page"
						onClick={() => {
							void handleShare();
						}}
					>
						<Share
							className="safari-toolbar-icon"
							aria-hidden="true"
						/>
					</button>
					<button
						type="button"
						className="safari-toolbar-btn"
						aria-label="Open new tab"
						onClick={() => {
							openExternalUrl('https://www.google.com');
						}}
					>
						<Plus
							className="safari-toolbar-icon"
							aria-hidden="true"
						/>
					</button>
				</div>
			</div>

			<div className="safari-content">
				<aside
					className={`safari-sidebar ${isBookmarksOpen ? 'safari-sidebar-open' : ''}`}
					aria-hidden={!isBookmarksOpen}
				>
					<div className="safari-sidebar-scroll">
						<div className="safari-sidebar-header">
							<p className="safari-sidebar-title">
								Bookmarks Sidebar
							</p>
						</div>
						{bookmarksByCategory.map(([category, bookmarks]) => (
							<div
								key={category}
								className="safari-bookmarks-group"
							>
								<p className="safari-bookmarks-heading">
									{category}
								</p>
								{bookmarks.map((bookmark) => (
									<button
										key={bookmark.id}
										type="button"
										className="safari-bookmark-item"
										tabIndex={isBookmarksOpen ? 0 : -1}
										onClick={() => {
											openExternalUrl(bookmark.url);
										}}
									>
										{bookmark.title}
									</button>
								))}
							</div>
						))}
					</div>
				</aside>

				{activeMdFile ? (
					<div className="safari-md-reader flex-1 overflow-y-auto bg-white p-6 sm:p-10 select-text dark:bg-neutral-900">
						<div className="mx-auto max-w-3xl">
							{/* Document top navigation */}
							<div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 pb-4 dark:border-neutral-800">
								<div className="flex items-center gap-2">
									<span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
										Markdown Document
									</span>
									<span className="font-mono text-xs text-gray-500 dark:text-gray-400">
										{activeMdFile.name}
									</span>
								</div>
								<button
									type="button"
									onClick={() => {
										setDismissedData(safariData);
										setCustomAddress('https://yuvrajenv.in');
									}}
									className="flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
								>
									← Back to Projects & Articles
								</button>
							</div>

							<div className="safari-markdown-body text-neutral-800 dark:text-neutral-200">
								<MarkdownView fileUrl={activeMdFile.href} />
							</div>
						</div>
					</div>
				) : (
					<div className="blog">
						<h2>Featured Projects & Technical Write-ups</h2>
						<div className="space-y-8">
							{visiblePosts.map(
								({ id, image, title, date, link }) => (
									<div key={id} className="blog-post">
										<div className="col-span-2">
											<img src={image} alt={title} />
										</div>
										<div className="content">
											<p>{date}</p>
											<h3>{title}</h3>
											<a
												href={link}
												target="_blank"
												rel="noopener noreferrer"
											>
												Check out the full post{' '}
												<MoveRight className="icon-hover" />
											</a>
										</div>
									</div>
								),
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow;
