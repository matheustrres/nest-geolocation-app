import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';

import {
	GeocodingResponse,
	ConvertLocationToGeoCoordinatesOptions,
	GeocodingService,
	GeocodingRequestStatus,
	ForwardGeocoding,
	ConvertGeoCoordsToLocationOptions,
	ReverseGeocoding,
} from '@/geolocation/services/geocoding.service';

import { EnvService } from '@/shared/modules/env/env.service';

type GeocodeMapsForwardGeocodingResponse = {
	display_name: string;
	lat: string;
	lon: string;
};

type GeocodeMapsReverseGeocodingResponse = {
	display_name: string;
	lat: string;
	lon: string;
	address: {
		amenity: string;
		house_number: string;
		road: string;
		suburb: string;
		city: string;
		municipality: string;
		country: string;
		country_code: string;
		state_district: string;
		region: string;
	};
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
	): Promise<GeocodingResponse<Iterable<ForwardGeocoding>>> {
		const source = this.httpService.get<GeocodeMapsForwardGeocodingResponse[]>(
			this.#buildForwardGeocodingUrl(opts).toString(),
		);

		return firstValueFrom(
			source.pipe(
				map(({ data }): GeocodingResponse<Iterable<ForwardGeocoding>> => {
					if (!data) this.#replyWithError('Invalid address provided.');
					return this.#replySuccessfulForwardGeocoding(data);
				}),
				catchError((err): Observable<GeocodingResponse<any>> => {
					this.#logger.error('Error converting address to coordinates', err);
					return of(this.#replyWithError(err.message));
				}),
			),
		);
	}

	async convertGeoCoordinatesToAddress(
		opts: ConvertGeoCoordsToLocationOptions,
	): Promise<GeocodingResponse<ReverseGeocoding>> {
		const source = this.httpService.get<GeocodeMapsReverseGeocodingResponse>(
			this.#buildReverseGeocodingUrl(opts).toString(),
		);

		return firstValueFrom(
			source.pipe(
				map(({ data }): GeocodingResponse<ReverseGeocoding> => {
					if (!data)
						return this.#replyWithError('Invalid coordinates provided.');
					return this.#replySuccessfulReverseGeocoding(data);
				}),
				catchError((err): Observable<GeocodingResponse<any>> => {
					this.#logger.error('Error converting coordinates to address', err);
					return of(this.#replyWithError(err.message));
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

	#buildReverseGeocodingUrl({
		lat,
		lon,
	}: ConvertGeoCoordsToLocationOptions): URL {
		const apiKey = this.envService.getKey('GEOCODE_MAPS_API_KEY');

		const url = new URL(`${this.#baseUrl}/reverse`);
		url.searchParams.append('lat', lat.toString());
		url.searchParams.append('lon', lon.toString());
		url.searchParams.append('api_key', apiKey);

		return url;
	}

	#replyWithError<T extends ForwardGeocoding | ReverseGeocoding>(
		message: string,
	): GeocodingResponse<T> {
		return {
			status: GeocodingRequestStatus.Error,
			data: message,
		};
	}

	#replySuccessfulForwardGeocoding(
		data: GeocodeMapsForwardGeocodingResponse[],
	): GeocodingResponse<Iterable<ForwardGeocoding>> {
		return {
			status: GeocodingRequestStatus.Success,
			data: this.#normalizeForwardedGeocodingCoordinates(data),
		};
	}

	#replySuccessfulReverseGeocoding(
		data: GeocodeMapsReverseGeocodingResponse,
	): GeocodingResponse<ReverseGeocoding> {
		return {
			status: GeocodingRequestStatus.Success,
			data: this.#normalizeReverseGeocodingCoordinates(data),
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

	#normalizeReverseGeocodingCoordinates(
		location: GeocodeMapsReverseGeocodingResponse,
	): ReverseGeocoding {
		return {
			name: location.display_name,
			lat: parseFloat(location.lat),
			lon: parseFloat(location.lon),
			country: location.address.country,
			countryCode: location.address.country_code,
			city: location.address.city,
			state: location.address.state_district,
			municipality: location.address.municipality,
			street: location.address.road,
			suburb: location.address.suburb,
			region: location.address.region,
		};
	}
}
