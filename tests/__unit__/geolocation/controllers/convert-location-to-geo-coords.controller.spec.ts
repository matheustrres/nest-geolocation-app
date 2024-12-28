import { ConvertLocationToGeoCoordinatesController } from '@/geolocation/controllers/convert-location-to-geo-coords.controller';

import { ConvertLocationToGeoCoordinatesBodyDtoBuilder } from '#/data/builders/dtos/convert-location-to-geo-coords.dto';
import { DefaultPaginationOptionsQueryDtoBuilder } from '#/data/builders/dtos/default-pagination-options.dto';
import { ConvertLocationToGeoCoordinatesUseCaseStub } from '#/data/stubs/use-cases/convert-location-to-geo-coords.use-case';

describe(ConvertLocationToGeoCoordinatesController.name, () => {
	let useCase: ConvertLocationToGeoCoordinatesUseCaseStub;
	let sut: ConvertLocationToGeoCoordinatesController;

	beforeEach(() => {
		useCase = new ConvertLocationToGeoCoordinatesUseCaseStub();
		sut = new ConvertLocationToGeoCoordinatesController(useCase);
	});

	it('should be defined', () => {
		expect(useCase.exec).toBeDefined();
		expect(sut.handle).toBeDefined();
	});

	it('should caught an error if no location is found for given address', async () => {
		jest.spyOn(sut, 'handle');
		jest.spyOn(useCase, 'exec');

		useCase.emitAddressIsInvalidException();

		const { body } = new ConvertLocationToGeoCoordinatesBodyDtoBuilder()
			.setCity('Rio de Janeiro')
			.setCountry('Brazil')
			.setStreet('Avenida Rio Branco');

		await expect(sut.handle(body, {})).rejects.toThrow(
			'No location was found for given address.',
		);

		const commonBody = {
			city: 'Rio de Janeiro',
			country: 'Brazil',
			street: 'Avenida Rio Branco',
			state: body.state,
		};
		const commonQuery = {
			itemsPerPage: undefined,
			limit: undefined,
			skip: undefined,
		};

		expect(sut.handle).toHaveBeenCalledWith(commonBody, {
			itemsPerPage: undefined,
			limit: undefined,
			skip: undefined,
		});
		expect(useCase.exec).toHaveBeenCalledWith({
			...commonBody,
			...commonQuery,
		});
	});

	it('should return all locations for given address', async () => {
		jest.spyOn(sut, 'handle');
		jest.spyOn(useCase, 'exec').mockResolvedValueOnce({
			locations: [
				{
					lat: -16.449979,
					lon: -39.064922,
					name: 'Porto Seguro, Bahia, Brazil',
				},
				{
					lat: -16.449979,
					lon: -39.064922,
					name: 'Porto Seguro, Bahia, Brazil',
				},
				{
					lat: -16.449979,
					lon: -39.064922,
					name: 'Porto Seguro, Bahia, Brazil',
				},
			],
		});

		const { body } = new ConvertLocationToGeoCoordinatesBodyDtoBuilder()
			.setCity('Porto Seguro')
			.setCountry('Brazil')
			.setState('Bahia');
		const { query } = new DefaultPaginationOptionsQueryDtoBuilder().setLimit(1);

		const commonBody = {
			city: 'Porto Seguro',
			country: 'Brazil',
			state: 'Bahia',
			street: body.street,
		};
		const commonQuery = {
			itemsPerPage: undefined,
			limit: 1,
			skip: undefined,
		};

		const { locations } = await sut.handle(body, query);

		expect(sut.handle).toHaveBeenCalledWith(commonBody, commonQuery);
		expect(useCase.exec).toHaveBeenCalledWith({
			...commonBody,
			...commonQuery,
		});
		expect(locations).toBeDefined();
	});
});
