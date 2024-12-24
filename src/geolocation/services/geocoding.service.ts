export type ConvertLocationToGeoCoordinatesOptions = {
	city: string;
	countryCode: string;
	stateCode?: string;
	limit?: number;
};

export type LocationToGeoCoordinatesConversionResponse = {
	name: string;
	lat: number;
	lon: number;
	country: string;
	state: string;
};

export abstract class GeocodingService {
	abstract convertAddressToGeoCoordinates(
		opts: ConvertLocationToGeoCoordinatesOptions,
	): Promise<LocationToGeoCoordinatesConversionResponse[] | null>;
}
