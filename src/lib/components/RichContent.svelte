<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';

	let { html = '', content = '' }: { html?: string; content?: string } = $props();

	const sanitizedHtml = $derived(
		html
			? DOMPurify.sanitize(html, {
					ALLOWED_TAGS: [
						'h1',
						'h2',
						'h3',
						'h4',
						'h5',
						'h6',
						'p',
						'br',
						'ul',
						'ol',
						'li',
						'a',
						'strong',
						'em',
						'blockquote',
						'code',
						'pre',
						'img',
						'figure',
						'figcaption',
						'hr',
						'table',
						'thead',
						'tbody',
						'tr',
						'th',
						'td'
					],
					ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'width', 'height', 'loading']
				})
			: ''
	);

	const plainBlocks = $derived(content ? content.split('\n\n').filter(Boolean) : []);
</script>

{#if sanitizedHtml}
	<div class="rich-content">{@html sanitizedHtml}</div>
{:else if plainBlocks.length > 0}
	<div class="rich-content rich-content--plain">
		{#each plainBlocks as block (block)}
			{#if block.startsWith('## ')}
				<h2>{block.slice(3)}</h2>
			{:else if block.startsWith('### ')}
				<h3>{block.slice(4)}</h3>
			{:else}
				<p>{block}</p>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.rich-content {
		line-height: 1.75;
		color: rgb(161 161 170);
	}

	.rich-content :global(h1),
	.rich-content :global(h2),
	.rich-content :global(h3),
	.rich-content :global(h4) {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-family: var(--font-display, inherit);
		font-weight: 700;
		text-transform: uppercase;
		color: white;
	}

	.rich-content :global(h2) {
		font-size: 1.25rem;
	}

	.rich-content :global(h3) {
		font-size: 1.125rem;
	}

	.rich-content :global(p),
	.rich-content--plain p {
		margin-top: 1rem;
	}

	.rich-content :global(ul),
	.rich-content :global(ol) {
		margin-top: 1rem;
		padding-left: 1.5rem;
	}

	.rich-content :global(li) {
		margin-top: 0.5rem;
	}

	.rich-content :global(a) {
		color: rgb(248 113 113);
		text-decoration: underline;
	}

	.rich-content :global(a:hover) {
		color: rgb(252 165 165);
	}

	.rich-content :global(blockquote) {
		margin-top: 1rem;
		border-left: 3px solid rgb(220 38 38);
		padding-left: 1rem;
		color: rgb(113 113 122);
	}

	.rich-content :global(img) {
		margin-top: 1.5rem;
		border-radius: 0.125rem;
		max-width: 100%;
	}

	.rich-content :global(code) {
		border-radius: 0.125rem;
		background: rgb(39 39 42);
		padding: 0.125rem 0.375rem;
		font-size: 0.875rem;
	}

	.rich-content :global(pre) {
		margin-top: 1rem;
		overflow-x: auto;
		border-radius: 0.125rem;
		background: rgb(24 24 27);
		padding: 1rem;
	}

	.rich-content :global(pre code) {
		background: transparent;
		padding: 0;
	}
</style>
