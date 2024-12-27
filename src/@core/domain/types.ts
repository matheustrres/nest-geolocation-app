export type BetterOmit<T, K extends keyof T> = {
	[P in keyof T as Exclude<P, K>]: T[P];
};
