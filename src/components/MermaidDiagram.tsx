import { useEffect, useId, useState, type ReactElement } from 'react';

interface MermaidDiagramProps {
	chart: string;
}

export const MermaidDiagram = ({
	chart,
}: MermaidDiagramProps): ReactElement => {
	const rawId = useId();
	const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, '');
	const [svg, setSvg] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const [isDark, setIsDark] = useState<boolean>(() =>
		typeof document !== 'undefined'
			? document.documentElement.classList.contains('dark')
			: false,
	);

	// Observe dark mode class changes on <html>
	useEffect(() => {
		const observer = new MutationObserver(() => {
			const darkActive = document.documentElement.classList.contains('dark');
			setIsDark(darkActive);
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		let isCancelled = false;

		const renderDiagram = async () => {
			try {
				const mermaidModule = await import('mermaid');
				const mermaid = mermaidModule.default;

				mermaid.initialize({
					startOnLoad: false,
					theme: isDark ? 'dark' : 'neutral',
					themeVariables: isDark
						? {
								darkMode: true,
								background: '#18181b',
								primaryColor: '#2563eb',
								primaryTextColor: '#f3f4f6',
								primaryBorderColor: '#3b82f6',
								lineColor: '#60a5fa',
								secondaryColor: '#1e293b',
								tertiaryColor: '#0f172a',
							}
						: {
								darkMode: false,
								background: '#ffffff',
								primaryColor: '#3b82f6',
								primaryTextColor: '#1e293b',
								primaryBorderColor: '#2563eb',
								lineColor: '#3b82f6',
								secondaryColor: '#f1f5f9',
								tertiaryColor: '#e2e8f0',
							},
					securityLevel: 'loose',
					fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
				});

				const renderId = `mermaid_${cleanId}_${Date.now()}`;
				const { svg: renderedSvg } = await mermaid.render(
					renderId,
					chart.trim(),
				);

				if (!isCancelled) {
					setSvg(renderedSvg);
					setError(null);
				}
			} catch (err) {
				if (!isCancelled) {
					setError(
						err instanceof Error ? err.message : 'Failed to render flowchart',
					);
				}
			}
		};

		renderDiagram();

		return () => {
			isCancelled = true;
		};
	}, [chart, cleanId, isDark]);

	if (error) {
		return (
			<pre className="my-3 overflow-x-auto rounded-xl border border-red-500/20 bg-neutral-900 p-4 font-mono text-xs whitespace-pre text-neutral-300">
				<code>{chart}</code>
			</pre>
		);
	}

	if (!svg) {
		return (
			<div className="my-4 flex items-center justify-center rounded-xl border border-gray-200/80 bg-gray-50/50 p-6 text-xs text-gray-400 dark:border-neutral-800 dark:bg-neutral-900/50">
				<span className="mr-2 inline-block size-3.5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
				Rendering diagram...
			</div>
		);
	}

	return (
		<div
			className="mermaid-wrapper my-6 flex justify-center overflow-x-auto rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-colors dark:border-neutral-800 dark:bg-neutral-900/90 [&>svg]:max-w-full [&>svg]:h-auto"
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
};
