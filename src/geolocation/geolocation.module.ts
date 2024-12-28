import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConvertGeoCoordsToLocationController } from '@/geolocation/controllers/convert-geo-coords-to-location.controller';
import { ConvertLocationToGeoCoordinatesController } from '@/geolocation/controllers/convert-location-to-geo-coords.controller';
import { GeocodingService } from '@/geolocation/services/geocoding.service';
import { GeocodeMapsGeocodingService } from '@/geolocation/services/implementations/geocodemaps-geocoding.service';
import { ConvertGeoCoordinatesToLocationUseCase } from '@/geolocation/use-cases/convert-geo-coords-to-location.use-case';
import { ConvertLocationToGeoCoordinatesUseCase } from '@/geolocation/use-cases/convert-location-to-geo-coords.use-case';

import { EnvModule } from '@/shared/modules/env/env.module';

@Module({
	imports: [HttpModule, EnvModule],
	providers: [
		{
			provide: GeocodingService,
			useClass: GeocodeMapsGeocodingService,
		},
		ConvertGeoCoordinatesToLocationUseCase,
		ConvertLocationToGeoCoordinatesUseCase,
	],
	controllers: [
		ConvertGeoCoordsToLocationController,
		ConvertLocationToGeoCoordinatesController,
	],
})
export class GeolocationModule {}
