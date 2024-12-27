import { NotFoundException } from '@nestjs/common';

import {
	ConvertLocationToGeoCoordinatesUseCase,
	ConvertLocationToGeoCoordinatesUseCaseInput,
	ConvertLocationToGeoCoordinatesUseCaseOutput,
} from '@/geolocation/use-cases/convert-location-to-geo-coords.use-case';

import { ConvertLocationToGeoCoordinatesUseCaseBuilder } from '#/data/builders/use-cases/convert-location-to-geo-coords.use-case';
import { createGeocodingServiceMock } from '#/data/mocks/geocoding.service';

export class ConvertLocationToGeoCoordinatesUseCaseStub extends ConvertLocationToGeoCoordinatesUseCase {
	#isAddressInvalid = false;

	constructor() {
		super(createGeocodingServiceMock());
	}

	async exec({
		city,
		country,
		state,
		street,
		...rest
	}: ConvertLocationToGeoCoordinatesUseCaseInput): Promise<ConvertLocationToGeoCoordinatesUseCaseOutput> {
		if (this.#isAddressInvalid)
			throw new NotFoundException('No location was found for given address.');

		const builder = new ConvertLocationToGeoCoordinatesUseCaseBuilder()
			.setCity(city)
			.setCountry(country)
			.setState(state)
			.setStreet(street);

		if (rest.itemsPerPage) builder.setItemsPerPage(rest.itemsPerPage);
		if (rest.limit) builder.setLimit(rest.limit);
		if (rest.skip) builder.setSkip(rest.skip);

		return builder.build();
	}

	emitAddressIsInvalidException(): this {
		this.#isAddressInvalid = true;
		return this;
	}
}
