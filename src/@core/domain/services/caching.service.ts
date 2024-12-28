export abstract class CachingService {
	abstract set(key: string, value: string, ttl?: number): Promise<void>;
	abstract get(key: string): Promise<string | null>;
}
