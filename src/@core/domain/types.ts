export type BetterOmit<T, K extends keyof T> = {
	[P in keyof T as Exclude<P, K>]: T[P];
};

export type WithPaginationOptions<T> = {
	itemsPerPage?: number;
	limit?: number;
	skip?: number;
} & T;
