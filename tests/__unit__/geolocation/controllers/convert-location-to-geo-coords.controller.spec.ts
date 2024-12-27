import { ConvertLocationToGeoCoordinatesController } from '@/geolocation/controllers/convert-location-to-geo-coords.controller';

import { ConvertLocationToGeoCoordinatesBodyDtoBuilder } from '#/data/builders/dtos/convert-location-to-geo-coords.dto';
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
		jest.spyOn(useCase, 'exec');

		useCase.emitAddressIsInvalidException();

		const { body } = new ConvertLocationToGeoCoordinatesBodyDtoBuilder()
			.setCity('Rio de Janeiro')
			.setCountry('Brazil')
			.setStreet('Avenida Rio Branco');

		await expect(sut.handle(body, {})).rejects.toThrow(
			'No location was found for given address.',
		);
		expect(useCase.exec).toHaveBeenCalledWith({
			city: 'Rio de Janeiro',
			country: 'Brazil',
			street: 'Avenida Rio Branco',
			state: body.state,
		});
	});
});
