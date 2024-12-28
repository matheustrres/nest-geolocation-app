import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { CachingService } from '@/@core/domain/services/caching.service';
import { HttpRequestService } from '@/@core/domain/services/http-request.service';
import { AxiosHttpRequestService } from '@/@core/infra/services/axios-http.service';
import { InMemoryCachingService } from '@/@core/infra/services/memory-caching.service';

@Global()
@Module({
	imports: [HttpModule],
	providers: [
		{
			provide: CachingService,
			useClass: InMemoryCachingService,
		},
		{
			provide: HttpRequestService,
			useClass: AxiosHttpRequestService,
		},
	],
	exports: [CachingService, HttpRequestService],
})
export class CoreModule {}
