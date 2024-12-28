import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from 'class-validator';

import { ConvertGeoCoordinatesToLocationUseCaseInput } from '@/geolocation/use-cases/convert-geo-coords-to-location.use-case';

export class ConvertGeoCoordsToLocationBodyDto
	implements ConvertGeoCoordinatesToLocationUseCaseInput
{
	@ApiProperty({
		type: 'number',
		required: true,
		example: -22.9035,
	})
	@IsNumber()
	@IsLatitude()
	@IsNotEmpty()
	lat!: number;

	@ApiProperty({
		type: 'number',
		required: true,
		example: -43.2096,
	})
	@IsNumber()
	@IsLongitude()
	@IsNotEmpty()
	lon!: number;
}
