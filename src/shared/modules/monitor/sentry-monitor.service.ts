import { Injectable } from '@nestjs/common';

import { NestSentry, SentryTypes } from '@/shared/libs/sentry';

@Injectable()
export class SentryMonitorService {
	captureException(
		exception: unknown,
		requestSessionStatus: SentryTypes.RequestSessionStatus,
	): void {
		NestSentry.captureException(exception, {
			requestSession: {
				status: requestSessionStatus,
			},
		});
	}
}
