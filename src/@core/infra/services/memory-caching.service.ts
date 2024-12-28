import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { CachingService } from '@/@core/domain/services/caching.service';

@Injectable()
export class InMemoryCachingService implements CachingService {
	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	async get(key: string): Promise<string | null> {
		const data = await this.cacheManager.get<string>(key);
		return data ?? null;
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		await this.cacheManager.set(key, value, ttl);
	}
}
