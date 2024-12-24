import {
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
} from 'class-validator';

import { NodeEnvEnum } from '@/@core/enums/node-env';

export class EnvSchema {
	@IsEnum(NodeEnvEnum)
	@IsNotEmpty()
	NODE_ENV?: NodeEnvEnum;

	@IsNumberString()
	@IsOptional()
	PORT = 3000;

	@IsString()
	@IsNotEmpty()
	MONGODB_USER?: string;

	@IsString()
	@IsNotEmpty()
	MONGODB_PASSWORD?: string;

	@IsString()
	@IsNotEmpty()
	MONGODB_DATABASE?: string;

	@IsNumberString()
	@IsOptional()
	MONGODB_PORT = 27017;

	@IsString()
	@IsNotEmpty()
	MONGODB_HOST?: string;

	@IsString()
	@IsNotEmpty()
	MONGODB_URI?: string;

	@IsString()
	@IsNotEmpty()
	SENTRY_DSN?: string;
}
