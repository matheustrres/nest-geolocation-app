import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map, of } from 'rxjs';

import {
	GeocodingResponse,
	ConvertLocationToGeoCoordinatesOptions,
	GeocodingService,
	GeocodingRequestStatus,
	ForwardGeocoding,
} from '@/geolocation/services/geocoding.service';

import { EnvService } from '@/shared/modules/env/env.service';

type GeocodeMapsForwardGeocodingResponse = {
	display_name: string;
	lat: string;
	lon: string;
};

@Injectable()
export class GeocodeMapsGeocodingService implements GeocodingService {
	readonly #baseUrl = 'https://geocode.maps.co';
	readonly #logger = new Logger(GeocodeMapsGeocodingService.name);

	constructor(
		private readonly envService: EnvService,
		private readonly httpService: HttpService,
	) {}

	async convertAddressToGeoCoordinates(
		opts: ConvertLocationToGeoCoordinatesOptions,
	): Promise<GeocodingResponse<ForwardGeocoding>> {
		const source = this.httpService.get<GeocodeMapsForwardGeocodingResponse[]>(
			this.#buildForwardGeocodingUrl(opts).toString(),
		);

		return firstValueFrom(
			source.pipe(
				map(({ data }) => {
					return !!data
						? this.#replyWithSuccess(data)
						: this.#replyWithError('Invalid address provided.');
				}),
				catchError((err) => {
					this.#logger.error('Error converting address to coordinates', err);
					return of(this.#replyWithSuccess(err.message));
				}),
			),
		);
	}

	#buildForwardGeocodingUrl({
		city,
		country,
		state,
		street,
	}: ConvertLocationToGeoCoordinatesOptions): URL {
		const apiKey = this.envService.getKey('GEOCODE_MAPS_API_KEY');

		const url = new URL(`${this.#baseUrl}/search`);
		url.searchParams.append('q', [city, country, state, street].join(','));
		url.searchParams.append('api_key', apiKey);

		return url;
	}

	#replyWithError(message: string): GeocodingResponse<ForwardGeocoding> {
		return {
			status: GeocodingRequestStatus.Error,
			data: message,
		};
	}

	#replyWithSuccess(
		data: GeocodeMapsForwardGeocodingResponse[],
	): GeocodingResponse<ForwardGeocoding> {
		return {
			status: GeocodingRequestStatus.Success,
			data: this.#normalizeForwardedGeocodingCoordinates(data),
		};
	}

	*#normalizeForwardedGeocodingCoordinates(
		locations: GeocodeMapsForwardGeocodingResponse[],
	): Iterable<ForwardGeocoding> {
		for (const location of locations) {
			yield {
				name: location.display_name,
				lat: parseFloat(location.lat),
				lon: parseFloat(location.lon),
			};
		}
	}
}
