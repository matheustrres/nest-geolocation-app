import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginatorService } from '@/@core/domain/services/paginator.service';
import { WithPaginationOptions } from '@/@core/domain/types';
import { UseCase } from '@/@core/domain/use-case';

import {
	ConvertGeoCoordsToLocationOptions,
	GeocodingRequestStatus,
	GeocodingService,
	ReverseGeocoding,
} from '@/geolocation/services/geocoding.service';

export type ConvertGeoCoordsToLocationUseCaseInput =
	WithPaginationOptions<ConvertGeoCoordsToLocationOptions>;

export type ConvertGeoCoordsToLocationUseCaseOutput = {
	locations: ReverseGeocoding[];
};

@Injectable()
export class ConvertGeoCoordsToLocationUseCase
	implements
		UseCase<
			ConvertGeoCoordsToLocationUseCaseInput,
			ConvertGeoCoordsToLocationUseCaseOutput
		>
{
	constructor(private readonly geocodingService: GeocodingService) {}

	async exec({
		lat,
		lon,
		...paginOptions
	}: ConvertGeoCoordsToLocationUseCaseInput): Promise<ConvertGeoCoordsToLocationUseCaseOutput> {
		const result = await this.geocodingService.convertGeoCoordinatesToLocation({
			lat,
			lon,
		});

		if (result.status === GeocodingRequestStatus.Error) {
			throw new NotFoundException(
				'No location was found for given coordinates.',
			);
		}

		const paginator = new PaginatorService({
			items: [...result.data],
			itemsPerPage: paginOptions.itemsPerPage,
			skip: paginOptions.skip,
			take: paginOptions.limit,
		});

		return {
			locations: [...paginator.loadPages()].flat(),
		};
	}
}
