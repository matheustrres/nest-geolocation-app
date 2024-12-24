import { Body, Post } from '@nestjs/common';

import { ConvertLocationToGeoCoordinatesBodyDto } from './dtos/convert-location-to-geo-coords.dto';

import { BaseController } from '@/@core/controller';

import {
	ConvertLocationToGeoCoordinatesUseCase,
	ConvertLocationToGeoCoordinatesUseCaseOutput,
} from '@/geolocation/use-cases/convert-location-to-geo-coords.use-case';

import { SwaggerController } from '@/shared/libs/swagger';

@SwaggerController('geoloc')
export class ConvertLocationToGeoCoordinatesController
	implements BaseController
{
	constructor(
		private readonly useCase: ConvertLocationToGeoCoordinatesUseCase,
	) {}

	@Post('convert-address')
	async handle(
		@Body() body: ConvertLocationToGeoCoordinatesBodyDto,
	): Promise<ConvertLocationToGeoCoordinatesUseCaseOutput> {
		const { locations } = await this.useCase.exec(body);

		return {
			locations: [...locations],
		};
	}
}
