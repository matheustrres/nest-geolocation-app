import { ConvertGeoCoordsToLocationController } from '@/geolocation/controllers/convert-geo-coords-to-location.controller';

import { ConvertGeoCoordsToLocationBodyDtoBuilder } from '#/data/builders/dtos/convert-geo-coords-to-location.dto';
import { ConvertGeoCoordsToLocationUseCaseStub } from '#/data/stubs/use-cases/convert-geo-coords-to-location.use-case';

describe(ConvertGeoCoordsToLocationController.name, () => {
	let sut: ConvertGeoCoordsToLocationController;
	let useCase: ConvertGeoCoordsToLocationUseCaseStub;

	beforeEach(() => {
		useCase = new ConvertGeoCoordsToLocationUseCaseStub();
		sut = new ConvertGeoCoordsToLocationController(useCase);
	});

	it('should be defined', () => {
		expect(useCase.exec).toBeDefined();
		expect(sut.handle).toBeDefined();
	});

	it('should caught an error if no location is found for given coordinates', async () => {
		jest.spyOn(sut, 'handle');
		jest.spyOn(useCase, 'exec');

		useCase.emitLocationIsInvalidException();

		const { body } = new ConvertGeoCoordsToLocationBodyDtoBuilder()
			.setLat(40.7558017)
			.setLon(73.9787414);

		await expect(sut.handle(body)).rejects.toThrow(
			'No location was found for given coordinates.',
		);
		expect(sut.handle).toHaveBeenCalledWith({
			lat: 40.7558017,
			lon: 73.9787414,
		});
		expect(useCase.exec).toHaveBeenCalledWith({
			lat: 40.7558017,
			lon: 73.9787414,
		});
	});
});
