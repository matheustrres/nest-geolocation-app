import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { GeolocationModule } from '@/geolocation/geolocation.module';

import { HealthModule } from '@/health/health.module';

import { GlobalExceptionFilter } from '@/shared/lib/exceptions/filters/global-exception-filter';
import { HttpExceptionFilter } from '@/shared/lib/exceptions/filters/http-exception-filter';
import { DatabaseModule } from '@/shared/modules/database/database.module';
import { EnvModule } from '@/shared/modules/env/env.module';
import { EnvService } from '@/shared/modules/env/env.service';
import { SentryMonitorModule } from '@/shared/modules/monitor/sentry-monitor.module';
import { SentryMonitorModuleOptions } from '@/shared/modules/monitor/sentry-monitor.types';

@Module({
	imports: [
		SentryMonitorModule.forRootAsync({
			imports: [EnvModule],
			useFactory: (envService: EnvService): SentryMonitorModuleOptions => {
				const nodeEnv = envService.getKeyOrThrow('NODE_ENV');
				const isProduction = nodeEnv === 'production';

				return {
					dsn: envService.getKeyOrThrow('SENTRY_DSN'),
					environment: nodeEnv,
					enabled: isProduction,
					tracesSampleRate: isProduction ? 0.1 : 1.0,
					debug: nodeEnv === 'development',
					integrations: [nodeProfilingIntegration()],
					profilesSampleRate: 1.0,
				};
			},
			inject: [EnvService],
		}),
		DatabaseModule,
		HealthModule,
		GeolocationModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
