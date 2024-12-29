import { NotFoundException } from '@nestjs/common';

import {
	ConvertGeoCoordinatesToLocationUseCase,
	ConvertGeoCoordinatesToLocationUseCaseInput,
	ConvertGeoCoordinatesToLocationUseCaseOutput,
} from '@/geolocation/use-cases/convert-geo-coords-to-location.use-case';

import { ConvertGeoCoordinatesToLocationUseCaseBuilder } from '#/data/builders/use-cases/convert-geo-coords-to-location.use-case';
import { createCachingServiceMock } from '#/data/mocks/caching.service';
import { createGeocodingServiceMock } from '#/data/mocks/geocoding.service';

export class ConvertGeoCoordsToLocationUseCaseStub extends ConvertGeoCoordinatesToLocationUseCase {
	#isLocationInvalid = false;

	constructor() {
		super(createCachingServiceMock(), createGeocodingServiceMock());
	}

	async exec({
		lat,
		lon,
	}: ConvertGeoCoordinatesToLocationUseCaseInput): Promise<ConvertGeoCoordinatesToLocationUseCaseOutput> {
		if (this.#isLocationInvalid) {
			throw new NotFoundException(
				'No location was found for given coordinates.',
			);
		}

		const builder = new ConvertGeoCoordinatesToLocationUseCaseBuilder()
			.setLat(lat)
			.setLon(lon);

		return builder.build();
	}

	emitLocationIsInvalidException(): this {
		this.#isLocationInvalid = true;
		return this;
	}
}
