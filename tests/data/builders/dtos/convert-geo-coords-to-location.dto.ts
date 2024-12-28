import { fakerPT_BR } from '@faker-js/faker';

import { ConvertGeoCoordsToLocationBodyDto } from '@/geolocation/controllers/dtos/convert-geo-coords-to-location.dto';

export class ConvertGeoCoordsToLocationBodyDtoBuilder {
	#body: ConvertGeoCoordsToLocationBodyDto;

	constructor(body?: Partial<ConvertGeoCoordsToLocationBodyDto>) {
		this.#body = {
			lat: body?.lat || fakerPT_BR.location.latitude(),
			lon: body?.lat || fakerPT_BR.location.longitude(),
		};
	}

	get body(): ConvertGeoCoordsToLocationBodyDto {
		return this.#body;
	}

	setLat(lat: number): this {
		this.#body.lat = lat;
		return this;
	}

	setLon(lon: number): this {
		this.#body.lon = lon;
		return this;
	}

	build(): ConvertGeoCoordsToLocationBodyDto {
		return this.#body;
	}
}
