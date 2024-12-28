import { fakerPT_BR } from '@faker-js/faker';

import { ReverseGeocoding } from '@/geolocation/services/geocoding.service';
import {
	ConvertGeoCoordinatesToLocationUseCaseInput,
	ConvertGeoCoordinatesToLocationUseCaseOutput,
} from '@/geolocation/use-cases/convert-geo-coords-to-location.use-case';

export class ConvertGeoCoordinatesToLocationUseCaseBuilder {
	#input: ConvertGeoCoordinatesToLocationUseCaseInput;

	constructor(input?: Partial<ConvertGeoCoordinatesToLocationUseCaseInput>) {
		this.#input = {
			lat: input?.lat || fakerPT_BR.location.latitude(),
			lon: input?.lon || fakerPT_BR.location.longitude(),
		};
	}

	get input(): ConvertGeoCoordinatesToLocationUseCaseInput {
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

	build(): ConvertGeoCoordinatesToLocationUseCaseOutput {
		return {
			location: {} as ReverseGeocoding,
		};
	}
}
