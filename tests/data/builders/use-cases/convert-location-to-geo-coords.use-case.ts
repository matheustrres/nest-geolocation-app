import { fakerPT_BR } from '@faker-js/faker';

import {
	ConvertLocationToGeoCoordinatesUseCaseInput,
	ConvertLocationToGeoCoordinatesUseCaseOutput,
} from '@/geolocation/use-cases/convert-location-to-geo-coords.use-case';

export class ConvertLocationToGeoCoordinatesUseCaseBuilder {
	#input: ConvertLocationToGeoCoordinatesUseCaseInput;

	constructor(input?: Partial<ConvertLocationToGeoCoordinatesUseCaseInput>) {
		const minMax = fakerPT_BR.number.int({
			min: 1,
			max: 10,
		});

		this.#input = {
			city: input?.city || fakerPT_BR.location.city(),
			country: input?.country || fakerPT_BR.location.country(),
			state: input?.state || fakerPT_BR.location.state(),
			street: input?.street || fakerPT_BR.location.street(),
			itemsPerPage: input?.itemsPerPage || minMax,
			limit: input?.limit || minMax,
			skip: input?.skip || minMax,
		};
	}

	get input(): ConvertLocationToGeoCoordinatesUseCaseInput {
		return this.#input;
	}

	setCity(city: string): this {
		this.#input.city = city;
		return this;
	}

	setCountry(country: string): this {
		this.#input.country = country;
		return this;
	}

	setState(state: string): this {
		this.#input.state = state;
		return this;
	}

	setStreet(street: string): this {
		this.#input.street = street;
		return this;
	}

	setItemsPerPage(itemsPerPage: number): this {
		this.#input.itemsPerPage = itemsPerPage;
		return this;
	}

	setLimit(limit: number): this {
		this.#input.limit = limit;
		return this;
	}

	setSkip(skip: number): this {
		this.#input.skip = skip;
		return this;
	}

	build(): ConvertLocationToGeoCoordinatesUseCaseOutput {
		return {
			locations: [],
		};
	}
}
