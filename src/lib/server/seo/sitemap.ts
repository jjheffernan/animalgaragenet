/** Nav-linked static routes + dynamic slug collectors for sitemap.xml (SEO-001). */
import { getProductPath } from '$lib/data/catalog-helpers';
import { listPublicBuilds } from '$lib/server/builds/public';
import { getPartCategoriesForNav, getPartsProducts } from '$lib/server/catalog/parts';
import { getShopProducts } from '$lib/server/catalog/products';
import { listBlogPosts, listGuides } from '$lib/server/ghost/posts';
import { config } from '$lib/config/env';

export const SITEMAP_STATIC_PATHS = [
	'/',
	'/shop',
	'/parts',
	'/builds',
	'/loyalty',
	'/guides',
	'/events',
	'/watch',
	'/media',
	'/deals',
	'/gift-cards',
	'/about',
	'/support',
	'/contact',
	'/support/report-bug',
	'/wholesale',
	'/military',
	'/blog',
	'/policies/shipping',
	'/policies/refunds',
	'/policies/privacy',
	'/auth/sign-in'
] as const;

export interface SitemapUrl {
	loc: string;
	lastmod?: string;
}

function flattenCategorySlugs(
	categories: Awaited<ReturnType<typeof getPartCategoriesForNav>>
): string[] {
	const slugs: string[] = [];
	for (const cat of categories) {
		slugs.push(cat.slug);
		for (const child of cat.children ?? []) {
			slugs.push(child.slug);
		}
	}
	return slugs;
}

export async function collectSitemapUrls(siteUrl = config.siteUrl): Promise<SitemapUrl[]> {
	const origin = siteUrl.replace(/\/$/, '');
	const urls = new Map<string, SitemapUrl>();

	const add = (path: string, lastmod?: string) => {
		const loc = `${origin}${path.startsWith('/') ? path : `/${path}`}`;
		if (!urls.has(loc)) {
			urls.set(loc, lastmod ? { loc, lastmod } : { loc });
		}
	};

	for (const path of SITEMAP_STATIC_PATHS) {
		add(path);
	}

	const [shopProducts, partsProducts, builds, guides, posts, partCategories] = await Promise.all([
		getShopProducts('all'),
		getPartsProducts(),
		listPublicBuilds(),
		listGuides(),
		listBlogPosts(),
		getPartCategoriesForNav()
	]);

	for (const product of shopProducts) {
		add(getProductPath(product));
	}

	for (const product of partsProducts) {
		add(getProductPath(product));
	}

	for (const slug of flattenCategorySlugs(partCategories)) {
		add(`/parts/${slug}`);
	}

	for (const build of builds) {
		add(`/builds/${build.slug}`);
	}

	for (const guide of guides) {
		add(`/guides/${guide.slug}`);
	}

	for (const post of posts) {
		add(`/blog/${post.slug}`, post.publishedAt);
	}

	return [...urls.values()];
}

export function renderSitemapXml(urls: SitemapUrl[]): string {
	const body = urls
		.map((entry) => {
			const lastmod = entry.lastmod
				? `\n    <lastmod>${entry.lastmod.slice(0, 10)}</lastmod>`
				: '';
			return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
