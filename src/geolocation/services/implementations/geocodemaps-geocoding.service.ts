import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { HttpRequestService } from '@/@core/domain/services/http-request.service';

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

	constructor(
		private readonly httpRequestService: HttpRequestService,
		private readonly envService: EnvService,
	) {}

	async convertAddressToGeoCoordinates(
		opts: ConvertLocationToGeoCoordinatesOptions,
	): Promise<GeocodingResponse<Iterable<ForwardGeocoding>>> {
		const url = this.#buildForwardGeocodingUrl(opts).toString();

		const result = await firstValueFrom(
			this.httpRequestService.makeGet<
				GeocodeMapsForwardGeocodingResponse[],
				Iterable<ForwardGeocoding>
			>(url, this.#normalizeForwardedGeocodingCoordinates.bind(this)),
		);

		if (typeof result === 'string') {
			return this.#createErrorResponse(result);
		}

		return this.#createSuccessResponse(result);
	}

	async convertGeoCoordinatesToAddress(
		opts: ConvertGeoCoordsToLocationOptions,
	): Promise<GeocodingResponse<ReverseGeocoding>> {
		const url = this.#buildReverseGeocodingUrl(opts).toString();

		const result = await firstValueFrom(
			this.httpRequestService.makeGet<
				GeocodeMapsReverseGeocodingResponse,
				ReverseGeocoding
			>(url, this.#normalizeReverseGeocodingCoordinates.bind(this)),
		);

		if (typeof result === 'string') {
			return this.#createErrorResponse(result);
		}

		return this.#createSuccessResponse(result);
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

	#createErrorResponse<T>(message: string): GeocodingResponse<T> {
		return {
			status: GeocodingRequestStatus.Error,
			data: message,
		};
	}

	#createSuccessResponse<T>(data: T): GeocodingResponse<T> {
		return {
			status: GeocodingRequestStatus.Success,
			data,
		};
	}
}
