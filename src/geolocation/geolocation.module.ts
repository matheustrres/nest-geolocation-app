import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConvertLocationToGeoCoordinatesController } from './controllers/convert-location-to-geo-coords.controller';
import { GeocodingService } from './services/geocoding.service';
import { OpenWeatherGeocodingService } from './services/implementations/openweather-geocoding.service';
import { ConvertLocationToGeoCoordinatesUseCase } from './use-cases/convert-location-to-geo-coords.use-case';

import { EnvModule } from '@/shared/modules/env/env.module';

@Module({
	imports: [HttpModule, EnvModule],
	providers: [
		{
			provide: GeocodingService,
			useClass: OpenWeatherGeocodingService,
		},
		ConvertLocationToGeoCoordinatesUseCase,
	],
	controllers: [ConvertLocationToGeoCoordinatesController],
})
export class GeolocationModule {}
