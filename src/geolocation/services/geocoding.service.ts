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

export type GeocodingResponse<T extends ForwardGeocoding> =
	| {
			status: GeocodingRequestStatus.Error;
			data: string;
	  }
	| {
			status: GeocodingRequestStatus.Success;
			data: Iterable<T>;
	  };

export abstract class GeocodingService {
	abstract convertAddressToGeoCoordinates(
		opts: ConvertLocationToGeoCoordinatesOptions,
	): Promise<GeocodingResponse<ForwardGeocoding>>;
}
