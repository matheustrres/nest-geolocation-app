import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
