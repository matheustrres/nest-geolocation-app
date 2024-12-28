import { NotFoundException } from '@nestjs/common';

import {
	GeocodingRequestStatus,
	GeocodingService,
} from '@/geolocation/services/geocoding.service';
import { ConvertGeoCoordinatesToLocationUseCase } from '@/geolocation/use-cases/convert-geo-coords-to-location.use-case';

import { ConvertGeoCoordinatesToLocationUseCaseBuilder } from '#/data/builders/use-cases/convert-geo-coords-to-location.use-case';
import { createGeocodingServiceMock } from '#/data/mocks/geocoding.service';

describe(ConvertGeoCoordinatesToLocationUseCase.name, () => {
	let geocodingService: GeocodingService;
	let sut: ConvertGeoCoordinatesToLocationUseCase;

	beforeEach(() => {
		geocodingService = createGeocodingServiceMock();
		sut = new ConvertGeoCoordinatesToLocationUseCase(geocodingService);
	});

	it('should be defined', () => {
		expect(geocodingService.convertGeoCoordinatesToAddress).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should throw a NotFoundException if no location is found with given coordinates', async () => {
		jest
			.spyOn(geocodingService, 'convertGeoCoordinatesToAddress')
			.mockResolvedValueOnce({
				data: 'Error message',
				status: GeocodingRequestStatus.Error,
			});

		const { input } = new ConvertGeoCoordinatesToLocationUseCaseBuilder()
			.setLat(-23.5505)
			.setLon(-46.6333);

		await expect(sut.exec(input)).rejects.toThrow(
			new NotFoundException('No location was found for given coordinates.'),
		);
		expect(
			geocodingService.convertGeoCoordinatesToAddress,
		).toHaveBeenCalledWith({
			lat: -23.5505,
			lon: -46.6333,
			itemsPerPage: undefined,
			limit: undefined,
			skip: undefined,
		});
	});

	it('should return the locations found for given coordinates', async () => {
		jest
			.spyOn(geocodingService, 'convertGeoCoordinatesToAddress')
			.mockResolvedValueOnce({
				status: GeocodingRequestStatus.Success,
				data: {
					city: 'São Paulo',
					country: 'Brasil',
					state: 'São Paulo',
					lat: -23.5506507,
					lon: -46.6333824,
					street: 'Avenida Paulista',
					countryCode: 'BR',
					municipality: 'São Paulo',
					name: 'São Paulo, Avenida Paulista, Brasil',
					region: 'São Paulo',
					suburb: 'Bela Vista',
				},
			});

		const { input } = new ConvertGeoCoordinatesToLocationUseCaseBuilder()
			.setLat(-23.5505)
			.setLon(-46.6333);

		const result = await sut.exec(input);

		expect(
			geocodingService.convertGeoCoordinatesToAddress,
		).toHaveBeenCalledWith({
			lat: -23.5505,
			lon: -46.6333,
		});
		expect(result.location).toStrictEqual({
			city: 'São Paulo',
			country: 'Brasil',
			state: 'São Paulo',
			lat: -23.5506507,
			lon: -46.6333824,
			street: 'Avenida Paulista',
			countryCode: 'BR',
			municipality: 'São Paulo',
			name: 'São Paulo, Avenida Paulista, Brasil',
			region: 'São Paulo',
			suburb: 'Bela Vista',
		});
	});
});
