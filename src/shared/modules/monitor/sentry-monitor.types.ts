import { ModuleMetadata } from '@nestjs/common';

import { NestSentry } from '@/shared/libs/sentry';

export enum RequestSessionStatus {
	OK = 'ok',
	ERRORED = 'errored',
	CRASHED = 'crashed',
}

export type SentryMonitorModuleOptions = Pick<
	NestSentry.NodeOptions,
	| 'dsn'
	| 'environment'
	| 'debug'
	| 'enabled'
	| 'enableTracing'
	| 'ignoreErrors'
	| 'integrations'
	| 'profilesSampleRate'
	| 'tracesSampleRate'
>;

export type SentryMonitorModuleAsyncOptions = Pick<
	ModuleMetadata,
	'imports'
> & {
	useFactory: (
		...args: any[]
	) => Promise<SentryMonitorModuleOptions> | SentryMonitorModuleOptions;
	inject: any[];
};
