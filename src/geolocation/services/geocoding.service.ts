export type ConvertLocationToGeoCoordinatesOptions = {
	city: string;
	countryCode: string;
	stateCode?: string;
	limit?: number;
};

export enum GeocodingRequestStatus {
	Error = 'error',
	Success = 'success',
}

export type DirectGeocoding = {
	name: string;
	lat: number;
	lon: number;
	country: string;
	state: string;
};

export type LocationToGeoCoordinatesConversionResponse =
	| {
			status: GeocodingRequestStatus.Error;
			data: string;
	  }
	| {
			status: GeocodingRequestStatus.Success;
			data: Array<DirectGeocoding>;
	  };

export abstract class GeocodingService {
	abstract convertAddressToGeoCoordinates(
		opts: ConvertLocationToGeoCoordinatesOptions,
	): Promise<LocationToGeoCoordinatesConversionResponse>;
}
