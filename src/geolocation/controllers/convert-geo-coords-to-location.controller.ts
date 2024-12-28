import { Body, Post } from '@nestjs/common';

import { ConvertGeoCoordsToLocationBodyDto } from './dtos/convert-geo-coords-to-location.dto';

import {
	ConvertGeoCoordinatesToLocationUseCase,
	ConvertGeoCoordinatesToLocationUseCaseOutput,
} from '../use-cases/convert-geo-coords-to-location.use-case';

import { SwaggerController } from '@/shared/libs/swagger';

@SwaggerController('geoloc')
export class ConvertGeoCoordsToLocationController {
	constructor(
		private readonly useCase: ConvertGeoCoordinatesToLocationUseCase,
	) {}

	@Post('convert-geo-coords')
	async handle(
		@Body() body: ConvertGeoCoordsToLocationBodyDto,
	): Promise<ConvertGeoCoordinatesToLocationUseCaseOutput> {
		return this.useCase.exec(body);
	}
}
