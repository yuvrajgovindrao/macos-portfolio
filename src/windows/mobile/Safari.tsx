import { MarkdownView } from '#components';
import { MobileWindowHeader } from '#components/mobile/WindowHeader';
import { blogPosts, safariBookmarks } from '#constants';
import { MobileWindowWrapper } from '#hoc';
import { groupBookmarksByCategory } from '#lib/bookmark-utils';
import { resolveSafariAddressInput } from '#lib/safari-address';
import { useWindowStore, type WindowState } from '#store';
import { isFinderMdFile, type FinderMdFile } from '#types';
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	Copy,
	Mic,
	MoveRight,
	Search,
	Share,
} from 'lucide-react';
import {
	useEffect,
	useMemo,
	useRef,
	useState,
	type FormEvent,
	type ReactElement,
} from 'react';

const MOBILE_SAFARI_PAGE_SIZE = 2;

const MobileSafari = (): ReactElement => {
	const windows = useWindowStore((state: WindowState) => state.windows);
	const safariData = windows.safari.data;

	const [prevSafariData, setPrevSafariData] = useState<unknown>(safariData);
	const [dismissedData, setDismissedData] = useState<unknown>(null);
	const [customAddress, setCustomAddress] = useState<string | null>(null);
	const [pageIndex, setPageIndex] = useState(0);
	const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
	const bookmarksSheetRef = useRef<HTMLDivElement | null>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	const bookmarksSheetLabelId = 'mobile-safari-bookmarks-label';

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
			: '');

	const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const targetUrl = resolveSafariAddressInput(displayedAddress);
		if (!targetUrl) return;

		window.open(targetUrl, '_blank', 'noopener,noreferrer');
	};

	const totalPages = Math.max(
		1,
		Math.ceil(blogPosts.length / MOBILE_SAFARI_PAGE_SIZE),
	);
	const visiblePosts = useMemo(() => {
		const start = pageIndex * MOBILE_SAFARI_PAGE_SIZE;
		return blogPosts.slice(start, start + MOBILE_SAFARI_PAGE_SIZE);
	}, [pageIndex]);
	const canGoBack = Boolean(activeMdFile) || pageIndex > 0;
	const canGoForward = !activeMdFile && pageIndex < totalPages - 1;

	const handleGoBack = () => {
		if (activeMdFile) {
			setDismissedData(safariData);
			setCustomAddress('');
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
			// Ignore clipboard failures.
		}
	};

	const toggleBookmarksMenu = (): void => {
		setIsBookmarksOpen((previous) => !previous);
	};

	useEffect(() => {
		if (isBookmarksOpen) {
			previouslyFocusedRef.current =
				document.activeElement as HTMLElement | null;
			const timer = window.setTimeout(() => {
				const container = bookmarksSheetRef.current;
				if (!container) return;

				const firstFocusable = container.querySelector<HTMLElement>(
					'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
				);

				(firstFocusable ?? container).focus();
			}, 0);

			return () => {
				window.clearTimeout(timer);
			};
		}

		previouslyFocusedRef.current?.focus();
		previouslyFocusedRef.current = null;
	}, [isBookmarksOpen]);

	useEffect(() => {
		if (!isBookmarksOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsBookmarksOpen(false);
				return;
			}
			if (event.key !== 'Tab') return;

			const container = bookmarksSheetRef.current;
			if (!container) return;

			const focusable = Array.from(
				container.querySelectorAll<HTMLElement>(
					'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
				),
			);

			if (focusable.length === 0) {
				event.preventDefault();
				container.focus();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement as HTMLElement | null;

			if (event.shiftKey) {
				if (active === first || !container.contains(active)) {
					event.preventDefault();
					last.focus();
				}
				return;
			}

			if (active === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isBookmarksOpen]);

	return (
		<>
			<MobileWindowHeader windowKey="safari" title={activeMdFile ? activeMdFile.name : 'Safari'} />
			{activeMdFile ? (
				<div className="safari-md-reader flex-1 overflow-y-auto bg-white px-4 py-5 pb-32 select-text dark:bg-neutral-900">
					{/* Mobile breadcrumb / back to blog bar */}
					<div className="mb-4 flex items-center justify-between border-b border-gray-200/80 pb-3 dark:border-neutral-800">
						<span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
							Markdown Doc
						</span>
						<button
							type="button"
							onClick={() => {
								setDismissedData(safariData);
								setCustomAddress('');
							}}
							className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
						>
							← Back to Projects & Articles
						</button>
					</div>

					<div className="safari-markdown-body text-neutral-800 dark:text-neutral-200">
						<MarkdownView fileUrl={activeMdFile.href} />
					</div>
				</div>
			) : (
				<div className="blog">
					<h2>Featured Projects & Technical Write-ups</h2>
					<div className="space-y-8">
						{visiblePosts.map(({ id, image, title, date, link }) => (
							<div key={id} className="blog-post">
								<div>
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
						))}
					</div>
				</div>
			)}
			<footer>
				<form className="search" onSubmit={handleAddressSubmit}>
					<Search
						className="mobile-safari-search-icon pointer-events-none"
						aria-hidden="true"
					/>
					<input
						type="text"
						placeholder="Search or enter website name"
						className="flex-1"
						aria-label="Search or enter website name"
						value={displayedAddress}
						onChange={(event) => {
							setCustomAddress(event.target.value);
						}}
					/>
					<Mic
						className="mobile-safari-search-icon"
						aria-hidden="true"
					/>
				</form>
				<div className="mobile-safari-actions">
					<button
						type="button"
						className="mobile-safari-action"
						aria-label="Go back"
						disabled={!canGoBack}
						onClick={handleGoBack}
					>
						<ChevronLeft aria-hidden="true" />
					</button>
					<button
						type="button"
						className="mobile-safari-action"
						aria-label="Go forward"
						disabled={!canGoForward}
						onClick={() => {
							setPageIndex((previous) => previous + 1);
						}}
					>
						<ChevronRight aria-hidden="true" />
					</button>
					<button
						type="button"
						className="mobile-safari-action"
						aria-label="Share page"
						onClick={() => {
							void handleShare();
						}}
					>
						<Share aria-hidden="true" />
					</button>
					<div className="mobile-safari-bookmarks">
						<button
							type="button"
							className="mobile-safari-action"
							aria-label="Open bookmarks"
							aria-expanded={isBookmarksOpen}
							onClick={toggleBookmarksMenu}
						>
							<BookOpen aria-hidden="true" />
						</button>
					</div>
					<button
						type="button"
						className="mobile-safari-action"
						aria-label="Open Google in new tab"
						onClick={() => {
							openExternalUrl('https://www.google.com');
						}}
					>
						<Copy aria-hidden="true" />
					</button>
				</div>
			</footer>
			{isBookmarksOpen ? (
				<div
					className="mobile-safari-bookmarks-drawer"
					role="dialog"
					aria-modal="true"
					aria-labelledby={bookmarksSheetLabelId}
				>
					<button
						type="button"
						className="mobile-safari-bookmarks-backdrop"
						aria-label="Close bookmarks"
						onClick={() => {
							setIsBookmarksOpen(false);
						}}
					/>
					<div
						ref={bookmarksSheetRef}
						className="mobile-safari-bookmarks-sheet"
						tabIndex={-1}
					>
						<div
							className="mobile-safari-bookmarks-sheet-handle"
							aria-hidden="true"
						/>
						<div className="mobile-safari-bookmarks-sheet-header">
							<h3 id={bookmarksSheetLabelId}>Bookmarks</h3>
							<button
								type="button"
								className="mobile-safari-sheet-close"
								aria-label="Close bookmarks"
								onClick={() => {
									setIsBookmarksOpen(false);
								}}
							>
								<ChevronDown aria-hidden="true" />
							</button>
						</div>
						<div className="mobile-safari-bookmarks-sheet-content">
							{bookmarksByCategory.map(
								([category, bookmarks]) => (
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
												onClick={() => {
													openExternalUrl(
														bookmark.url,
													);
													setIsBookmarksOpen(false);
												}}
											>
												{bookmark.title}
											</button>
										))}
									</div>
								),
							)}
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};

const MobileSafariWindow = MobileWindowWrapper(MobileSafari, 'safari');
export default MobileSafariWindow;
