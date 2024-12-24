import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';

import { NodeEnvEnum } from '@/@core/enums/node-env';

import { setupScalarReference } from '@/shared/libs/scalar';
import { setupSwaggerDocs } from '@/shared/libs/swagger';
import { EnvService } from '@/shared/modules/env/env.service';

const logger = new Logger(NestApplication.name);

enum ExitStatusEnum {
	FAILURE = 1,
	SUCCESS = 0,
}

enum ExitMessageEnum {
	FAILURE = 'App exited with an error:',
	SUCCESS = 'App exited successfully',
	UNCAUGHT_EXCEPTION = 'App exited due to an uncaught exception:',
	UNHANDLED_REJECTION = 'App exited due to an unhandled rejection:',
}

function exitWithSuccess(): never {
	logger.log(ExitMessageEnum.SUCCESS);
	process.exit(ExitStatusEnum.SUCCESS);
}

function exitWithFailure(message?: string, error?: unknown): never {
	logger.error(message, error);
	process.exit(ExitStatusEnum.FAILURE);
}

process.on('uncaughtException', (error: Error): never =>
	exitWithFailure(ExitMessageEnum.UNCAUGHT_EXCEPTION, error),
);

process.on('unhandledRejection', (reason: unknown) => {
	exitWithFailure(ExitMessageEnum.UNHANDLED_REJECTION, reason);
});

(async () => {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const envService = app.get(EnvService);
	const appPort = envService.getKeyOrThrow('PORT');

	const logMessages: string[] = [];

	if (envService.getKeyOrThrow('NODE_ENV') !== NodeEnvEnum.Production) {
		const docs = setupSwaggerDocs(app);
		setupScalarReference(app, docs);
		logMessages.push(
			`API client available at http://localhost:${appPort}/reference`,
		);
	}

	await app.listen(appPort).then(() => {
		logger.debug(`HTTP server running on port ${appPort}.`);
		if (logMessages.length) {
			logMessages.forEach((msg) => logger.debug(msg));
		}
	});

	const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

	for (const signal of exitSignals) {
		process.on(signal, async () => {
			try {
				await app.close();
				exitWithSuccess();
			} catch (error) {
				exitWithFailure(ExitMessageEnum.FAILURE, error);
			}
		});
	}
})();
