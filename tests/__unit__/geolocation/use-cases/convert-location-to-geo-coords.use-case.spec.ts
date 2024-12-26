import { NotFoundException } from '@nestjs/common';

import {
	GeocodingRequestStatus,
	GeocodingService,
} from '@/geolocation/services/geocoding.service';
import { ConvertLocationToGeoCoordinatesUseCase } from '@/geolocation/use-cases/convert-location-to-geo-coords.use-case';

import { createGeocodingServiceMock } from '#/data/mocks/geocoding.service';

describe(ConvertLocationToGeoCoordinatesUseCase.name, () => {
	let geocodingService: GeocodingService;
	let sut: ConvertLocationToGeoCoordinatesUseCase;

	beforeEach(() => {
		geocodingService = createGeocodingServiceMock();
		sut = new ConvertLocationToGeoCoordinatesUseCase(geocodingService);
	});

	it('should be defined', () => {
		expect(geocodingService.convertAddressToGeoCoordinates).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should throw a NotFoundException if no location is found with given address', async () => {
		jest
			.spyOn(geocodingService, 'convertAddressToGeoCoordinates')
			.mockResolvedValueOnce({
				data: 'Error message',
				status: GeocodingRequestStatus.Error,
			});

		await expect(
			sut.exec({
				city: 'São Paulo',
				countryCode: 'BR',
				limit: 1,
			}),
		).rejects.toThrow(
			new NotFoundException('No location was found for given address.'),
		);
		expect(
			geocodingService.convertAddressToGeoCoordinates,
		).toHaveBeenCalledWith({
			city: 'São Paulo',
			countryCode: 'BR',
			limit: 1,
			stateCode: undefined,
		});
	});
});
