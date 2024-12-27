import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginatorService } from '@/@core/domain/services/paginator.service';
import { UseCase } from '@/@core/domain/use-case';

import {
	GeocodingService,
	ForwardGeocoding,
	ConvertLocationToGeoCoordinatesOptions,
} from '@/geolocation/services/geocoding.service';

export type ConvertLocationToGeoCoordinatesUseCaseInput =
	ConvertLocationToGeoCoordinatesOptions & {
		itemsPerPage?: number;
		limit?: number;
		skip?: number;
	};

export type ConvertLocationToGeoCoordinatesUseCaseOutput = {
	locations: ForwardGeocoding[];
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
		country,
		state,
		street,
		...paginOptions
	}: ConvertLocationToGeoCoordinatesUseCaseInput): Promise<ConvertLocationToGeoCoordinatesUseCaseOutput> {
		const result = await this.geocodingService.convertAddressToGeoCoordinates({
			city,
			country,
			state,
			street,
		});

		if (result.status === 'error') {
			throw new NotFoundException('No location was found for given address.');
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
