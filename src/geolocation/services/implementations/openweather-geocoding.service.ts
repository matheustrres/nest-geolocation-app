import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map, of } from 'rxjs';

import {
	LocationToGeoCoordinatesConversionResponse,
	ConvertLocationToGeoCoordinatesOptions,
	GeocodingService,
	DirectGeocoding,
	GeocodingRequestStatus,
} from '@/geolocation/services/geocoding.service';

import { EnvService } from '@/shared/modules/env/env.service';

type OpenWeatherDirectGeocodingResponse = DirectGeocoding & {
	local_names: Record<string, string>;
};

type OpenWeatherResponse<T> =
	| T
	| {
			cod: string;
			message: string;
	  };

@Injectable()
export class OpenWeatherGeocodingService implements GeocodingService {
	readonly #baseUrl = 'http://api.openweathermap.org/geo/1.0';

	constructor(
		private readonly envService: EnvService,
		private readonly httpService: HttpService,
	) {}

	async convertAddressToGeoCoordinates({
		city,
		countryCode,
		stateCode,
		limit = 10,
	}: ConvertLocationToGeoCoordinatesOptions): Promise<LocationToGeoCoordinatesConversionResponse> {
		const requestSource = this.httpService.get<
			OpenWeatherResponse<OpenWeatherDirectGeocodingResponse[]>
		>(this.#buildDirectGeocodingUrl(city, countryCode, stateCode, limit));

		return firstValueFrom(
			requestSource.pipe(
				map(({ data }) => {
					if ('message' in data) return this.#replyWithError(data.message);
					return this.#replyWithSuccess(data);
				}),
				catchError((error) => of(this.#replyWithError(error.message))),
			),
		);
	}

	#buildDirectGeocodingUrl(
		city: string,
		countryCode: string,
		stateCode?: string,
		limit = 10,
	): string {
		const openWeatherAppId = this.envService.getKeyOrThrow(
			'OPEN_WEATHER_APP_ID',
		);
		const url = new URL(`${this.#baseUrl}/direct`);
		url.searchParams.append('q', [city, stateCode, countryCode].join(','));
		url.searchParams.append('limit', limit.toString());
		url.searchParams.append('appid', openWeatherAppId);

		return url.toString();
	}

	#replyWithError(message: string): LocationToGeoCoordinatesConversionResponse {
		return {
			status: GeocodingRequestStatus.Error,
			data: message,
		};
	}

	#replyWithSuccess(
		data: OpenWeatherDirectGeocodingResponse[],
	): LocationToGeoCoordinatesConversionResponse {
		return {
			status: GeocodingRequestStatus.Success,
			data,
		};
	}
}
