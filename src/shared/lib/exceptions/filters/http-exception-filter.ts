import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { SentryMonitorService } from '@/shared/modules/monitor/sentry-monitor.service';
import { RequestSessionStatus } from '@/shared/modules/monitor/sentry-monitor.types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	readonly #logger = new Logger(HttpExceptionFilter.name);

	constructor(private readonly sentryMonitorService: SentryMonitorService) {}

	catch(exception: HttpException, host: ArgumentsHost): Response {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		const isInternalServerError = status === HttpStatus.INTERNAL_SERVER_ERROR;

		const message = isInternalServerError
			? 'Internal Server Error'
			: exception.getResponse();

		const errorResponse = {
			timestamp: new Date().toISOString(),
			content: message,
			endpoint: `${request.method} ${request.url}`,
		};

		if (isInternalServerError) {
			this.sentryMonitorService.captureException(
				exception,
				RequestSessionStatus.ERRORED,
			);
		}

		this.#logger.error('An unhandled exception has been caught: ', exception);

		return response.status(status).json(errorResponse);
	}
}
