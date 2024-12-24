import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';

import { ConvertLocationToGeoCoordinatesUseCaseInput } from '@/geolocation/use-cases/convert-location-to-geo-coords.use-case';

export class ConvertLocationToGeoCoordinatesBodyDto
	implements ConvertLocationToGeoCoordinatesUseCaseInput
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
	countryCode!: string;

	@ApiProperty({
		description: 'State code only for US',
		type: 'string',
		required: false,
		example: 'RJ',
	})
	@IsString()
	@IsOptional()
	stateCode!: string;

	@ApiProperty({
		type: 'number',
		required: false,
		example: 5,
	})
	@IsNumber()
	@Min(1)
	@Max(5)
	@IsOptional()
	limit = 1;
}
