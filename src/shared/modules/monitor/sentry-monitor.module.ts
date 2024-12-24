import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
	SENTRY_MONITOR_MODULE_ASYNC_OPTIONS_TOKEN,
	SENTRY_MONITOR_TOKEN,
} from './sentry-monitor.config';
import { SentryMonitorService } from './sentry-monitor.service';
import {
	SentryMonitorModuleAsyncOptions,
	SentryMonitorModuleOptions,
} from './sentry-monitor.types';

import { NestSentry } from '@/shared/libs/sentry';

@Module({
	providers: [SentryMonitorService],
	exports: [SentryMonitorService],
})
export class SentryMonitorModule {
	static forRoot(
		sentryModuleOptions: SentryMonitorModuleOptions,
	): DynamicModule {
		NestSentry.init(sentryModuleOptions);

		return {
			module: SentryMonitorModule,
			global: true,
		};
	}

	static forRootAsync(
		sentryModuleAsyncOptions: SentryMonitorModuleAsyncOptions,
	): DynamicModule {
		const sentryProvider: Provider = {
			provide: SENTRY_MONITOR_TOKEN,
			useFactory: (sentryModuleOptions: SentryMonitorModuleOptions) =>
				NestSentry.init(sentryModuleOptions),
			inject: [SENTRY_MONITOR_MODULE_ASYNC_OPTIONS_TOKEN],
		};

		const sentryAsyncProviders: Provider[] = [
			{
				provide: SENTRY_MONITOR_MODULE_ASYNC_OPTIONS_TOKEN,
				useFactory: sentryModuleAsyncOptions.useFactory,
				inject: sentryModuleAsyncOptions.inject,
			},
		];

		return {
			module: SentryMonitorModule,
			imports: sentryModuleAsyncOptions.imports,
			providers: [...sentryAsyncProviders, sentryProvider],
			global: true,
		};
	}
}
