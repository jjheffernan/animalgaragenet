export interface GhostTag {
	id: string;
	name: string;
	slug: string;
}

export interface GhostAuthor {
	id: string;
	name: string;
	slug: string;
}

export interface GhostPost {
	id: string;
	uuid: string;
	slug: string;
	title: string;
	html: string;
	excerpt: string;
	custom_excerpt: string | null;
	feature_image: string | null;
	reading_time: number;
	published_at: string | null;
	primary_tag: GhostTag | null;
	tags: GhostTag[];
	authors: GhostAuthor[];
}

export interface GhostPostsResponse {
	posts: GhostPost[];
}

export interface GhostPostResponse {
	posts: [GhostPost];
}

export type GhostContentTag = 'guide' | 'blog';
