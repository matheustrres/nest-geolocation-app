import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';

import {
	LocationToGeoCoordinatesConversionResponse,
	ConvertLocationToGeoCoordinatesOptions,
	GeocodingService,
} from '@/geolocation/services/geocoding.service';

import { EnvService } from '@/shared/modules/env/env.service';

type OpenWeatherDataResponse<T> =
	| T
	| {
			cod: string;
			message: string;
	  };

@Injectable()
export class OpenWeatherGeocodingService implements GeocodingService {
	readonly #logger = new Logger(OpenWeatherGeocodingService.name);
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
	}: ConvertLocationToGeoCoordinatesOptions): Promise<
		LocationToGeoCoordinatesConversionResponse[] | null
	> {
		const openWeatherAppId = this.envService.getKeyOrThrow(
			'OPEN_WEATHER_APP_ID',
		);
		const query = [city, stateCode, countryCode];

		return firstValueFrom(
			this.httpService
				.get<
					OpenWeatherDataResponse<LocationToGeoCoordinatesConversionResponse[]>
				>(`${this.#baseUrl}/direct?q=${encodeURIComponent(query.join(','))}&limit=${limit}&appid=${openWeatherAppId}`)
				.pipe(
					map(({ data }) => {
						if ('message' in data) {
							this.#logger.error(`OpenWeather API error: ${data.message}`);
							return null;
						}
						return data as LocationToGeoCoordinatesConversionResponse[];
					}),
					catchError((error) => {
						this.#logger.error(
							'Error while converting address to geo coordinates: ',
							error,
						);
						return throwError(() => error);
					}),
				),
		);
	}
}
