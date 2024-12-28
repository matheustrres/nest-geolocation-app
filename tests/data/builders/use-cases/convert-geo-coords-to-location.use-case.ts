import { fakerPT_BR } from '@faker-js/faker';

import {
	ConvertGeoCoordsToLocationUseCaseInput,
	ConvertGeoCoordsToLocationUseCaseOutput,
} from '@/geolocation/use-cases/convert-geo-coords-to-location.use-case';

export class ConvertGeoCoordsToLocationUseCaseBuilder {
	#input: ConvertGeoCoordsToLocationUseCaseInput;

	constructor(input?: Partial<ConvertGeoCoordsToLocationUseCaseInput>) {
		this.#input = {
			lat: input?.lat || fakerPT_BR.location.latitude(),
			lon: input?.lon || fakerPT_BR.location.longitude(),
			itemsPerPage: input?.itemsPerPage,
			limit: input?.limit,
			skip: input?.skip,
		};
	}

	get input(): ConvertGeoCoordsToLocationUseCaseInput {
		return this.#input;
	}

	setLat(lat: number): this {
		this.#input.lat = lat;
		return this;
	}

	setLon(lon: number): this {
		this.#input.lon = lon;
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

	build(): ConvertGeoCoordsToLocationUseCaseOutput {
		return {
			locations: [],
		};
	}
}
