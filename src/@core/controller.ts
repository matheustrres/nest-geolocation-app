export interface BaseController<TResponse = unknown> {
	handle(...args: any[]): Promise<TResponse>;
}
