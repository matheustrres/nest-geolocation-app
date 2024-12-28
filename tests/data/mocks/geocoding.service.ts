import { GeocodingService } from '@/geolocation/services/geocoding.service';

export const createGeocodingServiceMock =
	(): jest.Mocked<GeocodingService> => ({
		convertAddressToGeoCoordinates: jest.fn(),
		convertGeoCoordinatesToAddress: jest.fn(),
	});
