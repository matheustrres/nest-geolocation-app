import { Injectable, NotFoundException } from '@nestjs/common';

import { CachingService } from '@/@core/domain/services/caching.service';
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
	constructor(
		private readonly cachingService: CachingService,
		private readonly geocodingService: GeocodingService,
	) {}

	async exec({
		lat,
		lon,
	}: ConvertGeoCoordinatesToLocationUseCaseInput): Promise<ConvertGeoCoordinatesToLocationUseCaseOutput> {
		const key = `coords:${lat}:${lon}`;
		const cacheResult = await this.cachingService.get(key);

		if (cacheResult) {
			return {
				location: JSON.parse(cacheResult) as ReverseGeocoding,
			};
		}

		const result = await this.geocodingService.convertGeoCoordinatesToAddress({
			lat,
			lon,
		});

		if (result.status === GeocodingRequestStatus.Error) {
			throw new NotFoundException(
				'No location was found for given coordinates.',
			);
		}

		await this.cachingService.set(key, JSON.stringify(result.data), 86_400);

		return {
			location: result.data,
		};
	}
}
