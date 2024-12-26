import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@/@core/use-case';

import {
	GeocodingService,
	DirectGeocoding,
} from '@/geolocation/services/geocoding.service';

export type ConvertLocationToGeoCoordinatesUseCaseInput = {
	city: string;
	countryCode: string;
	stateCode?: string;
	limit?: number;
};

export type ConvertLocationToGeoCoordinatesUseCaseOutput = {
	locations: Iterable<DirectGeocoding>;
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
		const result = await this.geocodingService.convertAddressToGeoCoordinates({
			city,
			stateCode,
			countryCode,
			limit,
		});

		if (result.status === 'error') {
			throw new NotFoundException('No location was found for given address.');
		}

		return {
			locations: this.#normalizeLocations(result.data),
		};
	}

	*#normalizeLocations(
		locations: DirectGeocoding[],
	): Iterable<DirectGeocoding> {
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
