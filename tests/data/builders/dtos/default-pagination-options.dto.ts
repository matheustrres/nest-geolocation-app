import { DefaultPaginationOptionsQueryDto } from '@/@core/infra/dtos/pagination.dto';

export class DefaultPaginationOptionsQueryDtoBuilder {
	#query: DefaultPaginationOptionsQueryDto;

	constructor(query?: Partial<DefaultPaginationOptionsQueryDto>) {
		this.#query = {
			itemsPerPage: query?.itemsPerPage,
			limit: query?.limit,
			skip: query?.skip,
		};
	}

	get query(): DefaultPaginationOptionsQueryDto {
		return this.#query;
	}

	setItemsPerPage(itemsPerPage: number): this {
		this.#query.itemsPerPage = itemsPerPage;
		return this;
	}

	setLimit(limit: number): this {
		this.#query.limit = limit;
		return this;
	}

	setSkip(skip: number): this {
		this.#query.skip = skip;
		return this;
	}

	build(): DefaultPaginationOptionsQueryDto {
		return this.#query;
	}
}
