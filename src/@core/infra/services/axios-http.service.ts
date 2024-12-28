import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';

import { HttpRequestService } from '@/@core/domain/services/http-request.service';

@Injectable()
export class AxiosHttpRequestService implements HttpRequestService {
	readonly #logger = new Logger(this.constructor.name);

	constructor(private readonly httpService: HttpService) {}

	makeGet<T, R>(
		url: string,
		normalizer: (data: T) => R,
	): Observable<R | string> {
		return this.httpService.get<T>(url).pipe(
			map((response) => {
				if (!response.data) {
					this.#logger.warn(`Empty response for URL: ${url}`);
					throw new BadRequestException('Empty response');
				}

				return normalizer(response.data);
			}),
			catchError((err) => {
				this.#logger.error(`Request failed for URL ${url}`, err['message']);
				return of(err);
			}),
		);
	}
}
