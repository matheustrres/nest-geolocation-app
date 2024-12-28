import { fakerPT_BR } from '@faker-js/faker';

import {
	ConvertLocationToGeoCoordinatesBodyDto,
	ConvertLocationToGeoCoordinatesQueryDto,
} from '@/geolocation/controllers/dtos/convert-location-to-geo-coords.dto';

export class ConvertLocationToGeoCoordinatesBodyDtoBuilder {
	#body: ConvertLocationToGeoCoordinatesBodyDto;

	constructor(body?: Partial<ConvertLocationToGeoCoordinatesBodyDto>) {
		this.#body = {
			city: body?.city || fakerPT_BR.location.city(),
			country: body?.country || fakerPT_BR.location.country(),
			state: body?.state || fakerPT_BR.location.state(),
			street: body?.street || fakerPT_BR.location.street(),
		};
	}

	get body(): ConvertLocationToGeoCoordinatesBodyDto {
		return this.#body;
	}

	setCity(city: string): this {
		this.#body.city = city;
		return this;
	}

	setCountry(country: string): this {
		this.#body.country = country;
		return this;
	}

	setState(state: string): this {
		this.#body.state = state;
		return this;
	}

	setStreet(street: string): this {
		this.#body.street = street;
		return this;
	}

	build(): ConvertLocationToGeoCoordinatesBodyDto {
		return this.#body;
	}
}

export class ConvertLocationToGeoCoordinatesQueryDtoBuilder {
	#query: ConvertLocationToGeoCoordinatesQueryDto;

	constructor(query?: Partial<ConvertLocationToGeoCoordinatesQueryDto>) {
		this.#query = {
			itemsPerPage: query?.itemsPerPage,
			limit: query?.limit,
			skip: query?.skip,
		};
	}

	get query(): ConvertLocationToGeoCoordinatesQueryDto {
		return this.#query;
	}

	setItemsPerPage(itemsPerPage: number): this {
		this.#query.itemsPerPage = itemsPerPage;
		return this;
	}

	setLimit(limit: number): this {
		this.#query.limit = limit;
		return this;
	}

	setSkip(skip: number): this {
		this.#query.skip = skip;
		return this;
	}

	build(): ConvertLocationToGeoCoordinatesQueryDto {
		return this.#query;
	}
}
