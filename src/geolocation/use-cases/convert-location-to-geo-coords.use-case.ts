import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@/@core/use-case';

import {
	LocationToGeoCoordinatesConversionResponse,
	GeocodingService,
} from '@/geolocation/services/geocoding.service';

export type ConvertLocationToGeoCoordinatesUseCaseInput = {
	city: string;
	countryCode: string;
	stateCode?: string;
	limit?: number;
};

export type ConvertLocationToGeoCoordinatesUseCaseOutput = {
	locations: Iterable<LocationToGeoCoordinatesConversionResponse>;
};

@Injectable()
export class ConvertLocationToGeoCoordinatesUseCase
	implements
		UseCase<
			ConvertLocationToGeoCoordinatesUseCaseInput,
			ConvertLocationToGeoCoordinatesUseCaseOutput
		>
{
	constructor(private readonly geocodingService: GeocodingService) {}

	async exec({
		city,
		countryCode,
		stateCode,
		limit,
	}: ConvertLocationToGeoCoordinatesUseCaseInput): Promise<ConvertLocationToGeoCoordinatesUseCaseOutput> {
		try {
			const locations =
				await this.geocodingService.convertAddressToGeoCoordinates({
					city,
					stateCode,
					countryCode,
					limit,
				});

			if (!locations?.length) {
				throw new NotFoundException('No location was found for given address.');
			}

			return {
				locations: this.#normalizeLocations(locations),
			};
		} catch (error) {
			throw new NotFoundException('No location was found for given address.');
		}
	}

	*#normalizeLocations(
		locations: LocationToGeoCoordinatesConversionResponse[],
	): Iterable<LocationToGeoCoordinatesConversionResponse> {
		for (const location of locations) {
			yield {
				name: location.name,
				lat: location.lat,
				lon: location.lon,
				country: location.country,
				state: location.state,
			};
		}
	}
}
