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
				country: 'Brasil',
				state: 'São Paulo',
				street: 'Avenida Paulista',
			}),
		).rejects.toThrow(
			new NotFoundException('No location was found for given address.'),
		);
		expect(
			geocodingService.convertAddressToGeoCoordinates,
		).toHaveBeenCalledWith({
			city: 'São Paulo',
			country: 'Brasil',
			state: 'São Paulo',
			street: 'Avenida Paulista',
		});
	});

	it('should return the locations found with given address', async () => {
		jest
			.spyOn(geocodingService, 'convertAddressToGeoCoordinates')
			.mockResolvedValueOnce({
				status: GeocodingRequestStatus.Success,
				data: [
					{
						name: 'São Paulo',
						lat: -23.5506507,
						lon: -46.6333824,
					},
				],
			});

		const result = await sut.exec({
			city: 'São Paulo',
			country: 'Brasil',
			state: 'São Paulo',
			street: 'Avenida Paulista',
		});

		expect(
			geocodingService.convertAddressToGeoCoordinates,
		).toHaveBeenCalledWith({
			city: 'São Paulo',
			country: 'Brasil',
			state: 'São Paulo',
			street: 'Avenida Paulista',
		});
		expect(result.locations).toStrictEqual([
			{
				name: 'São Paulo',
				lat: -23.5506507,
				lon: -46.6333824,
			},
		]);
	});
});
