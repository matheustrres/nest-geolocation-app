export type ConvertLocationToGeoCoordinatesOptions = {
	city: string;
	country: string;
	state: string;
	street: string;
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

export type LocationToGeoCoordinatesConversionResponse =
	| {
			status: GeocodingRequestStatus.Error;
			data: string;
	  }
	| {
			status: GeocodingRequestStatus.Success;
			data: Iterable<ForwardGeocoding>;
	  };

export abstract class GeocodingService {
	abstract convertAddressToGeoCoordinates(
		opts: ConvertLocationToGeoCoordinatesOptions,
	): Promise<LocationToGeoCoordinatesConversionResponse>;
}
