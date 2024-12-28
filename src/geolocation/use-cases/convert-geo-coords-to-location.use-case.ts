import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@/@core/domain/use-case';

import {
	ConvertGeoCoordsToLocationOptions,
	GeocodingRequestStatus,
	GeocodingService,
	ReverseGeocoding,
} from '@/geolocation/services/geocoding.service';

export type ConvertGeoCoordinatesToLocationUseCaseInput =
	ConvertGeoCoordsToLocationOptions;

export type ConvertGeoCoordinatesToLocationUseCaseOutput = {
	location: ReverseGeocoding;
};

@Injectable()
export class ConvertGeoCoordinatesToLocationUseCase
	implements
		UseCase<
			ConvertGeoCoordinatesToLocationUseCaseInput,
			ConvertGeoCoordinatesToLocationUseCaseOutput
		>
{
	constructor(private readonly geocodingService: GeocodingService) {}

	async exec({
		lat,
		lon,
	}: ConvertGeoCoordinatesToLocationUseCaseInput): Promise<ConvertGeoCoordinatesToLocationUseCaseOutput> {
		const result = await this.geocodingService.convertGeoCoordinatesToAddress({
			lat,
			lon,
		});

		if (result.status === GeocodingRequestStatus.Error) {
			throw new NotFoundException(
				'No location was found for given coordinates.',
			);
		}

		return {
			location: result.data,
		};
	}
}
