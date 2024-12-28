export type BetterOmit<T, K extends keyof T> = {
	[P in keyof T as Exclude<P, K>]: T[P];
};

export type PaginationOptions = {
	itemsPerPage?: number;
	limit?: number;
	skip?: number;
};

export type WithPaginationOptions<T> = PaginationOptions & T;

export type WithoutPaginationOptions<T extends PaginationOptions> = BetterOmit<
	T,
	'itemsPerPage' | 'limit' | 'skip'
>;
