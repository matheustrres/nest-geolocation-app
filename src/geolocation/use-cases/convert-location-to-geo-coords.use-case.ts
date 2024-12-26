import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@/@core/use-case';

import {
	GeocodingService,
	ForwardGeocoding,
} from '@/geolocation/services/geocoding.service';

export type ConvertLocationToGeoCoordinatesUseCaseInput = {
	city: string;
	country: string;
	state: string;
	street: string;
};

export type ConvertLocationToGeoCoordinatesUseCaseOutput = {
	locations: Iterable<ForwardGeocoding>;
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

	async exec(
		input: ConvertLocationToGeoCoordinatesUseCaseInput,
	): Promise<ConvertLocationToGeoCoordinatesUseCaseOutput> {
		const result =
			await this.geocodingService.convertAddressToGeoCoordinates(input);

		if (result.status === 'error') {
			throw new NotFoundException('No location was found for given address.');
		}

		return {
			locations: result.data,
		};
	}
}
