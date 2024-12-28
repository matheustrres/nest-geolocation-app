import { Observable } from 'rxjs';

export abstract class HttpRequestService {
	abstract makeGet<T, R>(
		url: string,
		normalizer: (data: T) => R,
	): Observable<R | string>;
}
