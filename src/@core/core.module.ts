import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { HttpRequestService } from '@/@core/domain/services/http-request.service';
import { AxiosHttpRequestService } from '@/@core/infra/services/axios-http.service';

@Global()
@Module({
	imports: [HttpModule],
	providers: [
		{
			provide: HttpRequestService,
			useClass: AxiosHttpRequestService,
		},
	],
	exports: [HttpRequestService],
})
export class CoreModule {}
