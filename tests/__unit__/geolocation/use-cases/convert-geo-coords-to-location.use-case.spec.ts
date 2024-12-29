import { NotFoundException } from '@nestjs/common';

import { CachingService } from '@/@core/domain/services/caching.service';

import {
	GeocodingRequestStatus,
	GeocodingService,
	ReverseGeocoding,
} from '@/geolocation/services/geocoding.service';
import { ConvertGeoCoordinatesToLocationUseCase } from '@/geolocation/use-cases/convert-geo-coords-to-location.use-case';

import { ConvertGeoCoordinatesToLocationUseCaseBuilder } from '#/data/builders/use-cases/convert-geo-coords-to-location.use-case';
import { createCachingServiceMock } from '#/data/mocks/caching.service';
import { createGeocodingServiceMock } from '#/data/mocks/geocoding.service';

describe(ConvertGeoCoordinatesToLocationUseCase.name, () => {
	let cachingService: CachingService;
	let geocodingService: GeocodingService;
	let sut: ConvertGeoCoordinatesToLocationUseCase;

	beforeEach(() => {
		cachingService = createCachingServiceMock();
		geocodingService = createGeocodingServiceMock();
		sut = new ConvertGeoCoordinatesToLocationUseCase(
			cachingService,
			geocodingService,
		);
	});

	it('should be defined', () => {
		expect(geocodingService.convertGeoCoordinatesToAddress).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should return the location from cache if it exists', async () => {
		jest.spyOn(cachingService, 'get').mockResolvedValueOnce(
			JSON.stringify({
				name: 'GRES Unidos da Tijuca, 47, Avenida Francisco Bicalho, Santo Cristo, Rio de Janeiro, Região Geográfica Imediata do Rio de Janeiro, Região Metropolitana do Rio de Janeiro, Região Geográfica Intermediária do Rio de Janeiro, Rio de Janeiro, Southeast Region, 20941-090, Brazil',
				lat: -22.9046958,
				lon: -43.20932617359628,
				country: 'Brazil',
				countryCode: 'br',
				city: 'Rio de Janeiro',
				state: 'Região Geográfica Intermediária do Rio de Janeiro',
				municipality: 'Região Geográfica Imediata do Rio de Janeiro',
				street: 'Avenida Francisco Bicalho',
				suburb: 'Santo Cristo',
				region: 'Southeast Region',
			} as ReverseGeocoding),
		);
		jest.spyOn(geocodingService, 'convertGeoCoordinatesToAddress');

		const { input } = new ConvertGeoCoordinatesToLocationUseCaseBuilder()
			.setLat(-22.9046958)
			.setLon(-43.20932617359628);

		const { location } = await sut.exec(input);

		expect(cachingService.get).toHaveBeenCalledWith(
			'coords:-22.9046958:-43.20932617359628',
		);
		expect(location).toBeDefined();
		expect(location).toStrictEqual({
			name: 'GRES Unidos da Tijuca, 47, Avenida Francisco Bicalho, Santo Cristo, Rio de Janeiro, Região Geográfica Imediata do Rio de Janeiro, Região Metropolitana do Rio de Janeiro, Região Geográfica Intermediária do Rio de Janeiro, Rio de Janeiro, Southeast Region, 20941-090, Brazil',
			lat: -22.9046958,
			lon: -43.20932617359628,
			country: 'Brazil',
			countryCode: 'br',
			city: 'Rio de Janeiro',
			state: 'Região Geográfica Intermediária do Rio de Janeiro',
			municipality: 'Região Geográfica Imediata do Rio de Janeiro',
			street: 'Avenida Francisco Bicalho',
			suburb: 'Santo Cristo',
			region: 'Southeast Region',
		});
		expect(
			geocodingService.convertGeoCoordinatesToAddress,
		).not.toHaveBeenCalled();
	});

	it('should throw a NotFoundException if no location is found with given coordinates', async () => {
		jest.spyOn(cachingService, 'get').mockResolvedValueOnce(null);
		jest.spyOn(cachingService, 'set');
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
		expect(cachingService.get).toHaveBeenCalledWith(`coords:-23.5505:-46.6333`);
		expect(
			geocodingService.convertGeoCoordinatesToAddress,
		).toHaveBeenCalledWith({
			lat: -23.5505,
			lon: -46.6333,
			itemsPerPage: undefined,
			limit: undefined,
			skip: undefined,
		});
		expect(cachingService.set).not.toHaveBeenCalled();
	});

	it('should return the locations found for given coordinates', async () => {
		const lat = -23.5506507;
		const lon = -46.6333824;

		jest.spyOn(cachingService, 'get').mockResolvedValueOnce(null);
		jest.spyOn(cachingService, 'set');
		jest
			.spyOn(geocodingService, 'convertGeoCoordinatesToAddress')
			.mockResolvedValueOnce({
				status: GeocodingRequestStatus.Success,
				data: {
					city: 'São Paulo',
					country: 'Brasil',
					state: 'São Paulo',
					lat,
					lon,
					street: 'Avenida Paulista',
					countryCode: 'BR',
					municipality: 'São Paulo',
					name: 'São Paulo, Avenida Paulista, Brasil',
					region: 'São Paulo',
					suburb: 'Bela Vista',
				},
			});

		const { input } = new ConvertGeoCoordinatesToLocationUseCaseBuilder()
			.setLat(lat)
			.setLon(lon);

		const result = await sut.exec(input);
		const cacheKey = `coords:${lat}:${lon}`;

		expect(cachingService.get).toHaveBeenCalledWith(cacheKey);
		expect(
			geocodingService.convertGeoCoordinatesToAddress,
		).toHaveBeenCalledWith({
			lat,
			lon,
		});
		expect(result.location).toStrictEqual({
			city: 'São Paulo',
			country: 'Brasil',
			state: 'São Paulo',
			lat,
			lon,
			street: 'Avenida Paulista',
			countryCode: 'BR',
			municipality: 'São Paulo',
			name: 'São Paulo, Avenida Paulista, Brasil',
			region: 'São Paulo',
			suburb: 'Bela Vista',
		});
		expect(cachingService.set).toHaveBeenCalledWith(
			cacheKey,
			JSON.stringify(result.location),
			86_400,
		);
	});
});
