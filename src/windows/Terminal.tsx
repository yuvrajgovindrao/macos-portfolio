import { WindowControls } from '#components';
import { techStack } from '#constants';
import { WindowWrapper } from '#hoc';
import { Check, Flag } from 'lucide-react';
import type { ReactElement } from 'react';

/**
 * Desktop terminal window that renders the categorized tech stack summary.
 *
 * @returns {ReactElement} Terminal-like tech stack view for desktop.
 */
const Terminal = (): ReactElement => {
	const loadedCount = techStack.length;
	return (
		<>
			<div className="window-header">
				<WindowControls target="terminal" />
				<h2>Tech Stack</h2>
				<div className="window-header-spacer" aria-hidden="true" />
			</div>
			<div className="techstack">
				<p>
					<span className="font-bold"> @yuvrajgovindrao % </span>
					show tech stack
				</p>

				<div className="label">
					<p className="ms-9 w-52 shrink-0">Category</p>
					<p>Technologies</p>
				</div>

				<ul className="content">
					{techStack.map(({ category, items }) => (
						<li key={category} className="flex items-start">
							<Check className="check mt-0.5 shrink-0" size={18} />
							<h3 className="w-52 shrink-0">{category}</h3>
							<ul className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1">
								{items.map((item, i) => (
									<li
										key={`${category}-${String(i)}-${item}`}
									>
										{item}
										{i < items.length - 1 ? ',' : ''}
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>

				<div className="footnote">
					<p>
						<Check size={20} /> {loadedCount} of {techStack.length}{' '}
						stacks loaded successfully (100%)
					</p>

					<p className="text-neutral-900 dark:text-neutral-100">
						<Flag size={15} className="text-inherit" />
						Render time: 9ms
					</p>
				</div>
			</div>
		</>
	);
};

const TerminalWindow = WindowWrapper(Terminal, 'terminal');

export default TerminalWindow;
