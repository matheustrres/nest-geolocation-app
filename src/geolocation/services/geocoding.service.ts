export type ConvertLocationToGeoCoordinatesOptions = {
	city: string;
	country: string;
	state: string;
	street: string;
};

export type ConvertGeoCoordsToLocationOptions = {
	lat: number;
	lon: number;
};

export enum GeocodingRequestStatus {
	Error = 'error',
	Success = 'success',
}

export type ForwardGeocoding = {
	name: string;
	lat: number;
	lon: number;
};

export type ReverseGeocoding = {
	name: string;
	lat: number;
	lon: number;
	country: string;
	countryCode: string;
	city: string;
	state: string;
	municipality: string;
	street: string;
	suburb: string;
	region: string;
};

export type GeocodingResponse<T> =
	| {
			status: GeocodingRequestStatus.Error;
			data: string;
	  }
	| {
			status: GeocodingRequestStatus.Success;
			data: T;
	  };

export abstract class GeocodingService {
	abstract convertAddressToGeoCoordinates(
		opts: ConvertLocationToGeoCoordinatesOptions,
	): Promise<GeocodingResponse<Iterable<ForwardGeocoding>>>;
	abstract convertGeoCoordinatesToAddress(
		opts: ConvertGeoCoordsToLocationOptions,
	): Promise<GeocodingResponse<ReverseGeocoding>>;
}
