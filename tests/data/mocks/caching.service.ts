import { CachingService } from '@/@core/domain/services/caching.service';

export const createCachingServiceMock = (): jest.Mocked<CachingService> => ({
	get: jest.fn(),
	set: jest.fn(),
});
