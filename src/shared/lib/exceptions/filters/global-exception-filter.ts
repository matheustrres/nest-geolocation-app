import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { isAxiosError } from '@nestjs/terminus/dist/utils';

import { SentryMonitorService } from '@/shared/modules/monitor/sentry-monitor.service';
import { RequestSessionStatus } from '@/shared/modules/monitor/sentry-monitor.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter<unknown> {
	readonly #logger = new Logger(GlobalExceptionFilter.name);

	constructor(
		private readonly sentryMonitorService: SentryMonitorService,
		private readonly httpAdapterHost: HttpAdapterHost,
	) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const errorResponse = {
			timestamp: new Date().toISOString(),
			content: 'Internal Server Error',
			endpoint: httpAdapter.getRequestUrl(ctx.getRequest()),
		};

		if (isAxiosError(exception)) {
			errorResponse.content = exception.message;
		}

		this.#logger.error('An unhandled exception has been caught: ', exception);
		this.sentryMonitorService.captureException(
			exception,
			RequestSessionStatus.ERRORED,
		);

		httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
	}
}
