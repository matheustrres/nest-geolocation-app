import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
} from 'class-validator';

import { BetterOmit } from '@/@core/domain/types';

import { ConvertLocationToGeoCoordinatesUseCaseInput } from '@/geolocation/use-cases/convert-location-to-geo-coords.use-case';

export class ConvertLocationToGeoCoordinatesBodyDto
	implements
		BetterOmit<
			ConvertLocationToGeoCoordinatesUseCaseInput,
			'itemsPerPage' | 'limit' | 'skip'
		>
{
	@ApiProperty({
		type: 'string',
		required: true,
		example: 'Rio de Janeiro',
	})
	@IsString()
	@IsNotEmpty()
	city!: string;

	@ApiProperty({
		description: 'ISO 3166 country code',
		type: 'string',
		required: true,
		example: 'BR',
	})
	@IsString()
	@IsNotEmpty()
	country!: string;

	@ApiProperty({
		type: 'string',
		required: true,
		example: 'Rio de Janeiro',
	})
	@IsString()
	@IsNotEmpty()
	state!: string;

	@ApiProperty({
		type: 'string',
		required: true,
		example: 'Avenida Mem de Sá',
	})
	@IsString()
	@IsNotEmpty()
	street!: string;
}

export class ConvertLocationToGeoCoordinatesQueryDto
	implements
		Pick<
			ConvertLocationToGeoCoordinatesUseCaseInput,
			'itemsPerPage' | 'limit' | 'skip'
		>
{
	@ApiProperty({
		description: 'The number of items per page',
		type: 'number',
		required: false,
		example: 5,
	})
	@IsNumberString()
	@IsOptional()
	itemsPerPage?: number;

	@ApiProperty({
		description: 'The number of items to be taken',
		type: 'number',
		required: false,
		example: 100,
	})
	@IsNumberString()
	@IsOptional()
	limit?: number;

	@ApiProperty({
		description: 'The number of items to be skipped',
		type: 'number',
		required: false,
		example: 10,
	})
	@IsNumberString()
	@IsOptional()
	skip?: number;
}
