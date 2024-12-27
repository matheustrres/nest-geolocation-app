/**
 * @author matheustrres
 * @see {@link [gist](https://gist.github.com/matheustrres/816cd23a79c48f2a4bff47770641a5a3)}
 */

type PaginatorConfig<T> = {
	items: T[];
	itemsPerPage?: number;
	take?: number;
	skip?: number;
};

export class PaginatorService<T = unknown> {
	itemsPerPage: number;

	#originalItems: T[];
	#items: T[];
	#pages = new Map<number, T[]>();

	static readonly #DEFAULT_ITEMS_PER_PAGE = 20;

	constructor(config: PaginatorConfig<T>) {
		this.#originalItems = config.items;
		this.#items = config.items;
		this.itemsPerPage =
			config.itemsPerPage ?? PaginatorService.#DEFAULT_ITEMS_PER_PAGE;

		config.skip && this.skipItems(config.skip);
		config.take && this.takeItems(config.take);
	}

	get currentItems(): T[] {
		return this.#items;
	}

	*loadPages(): Generator<T[]> {
		const totalPages = Math.ceil(
			this.#originalItems.length / this.itemsPerPage,
		);

		for (let p = 1; p <= totalPages; p++) {
			yield this.loadPage(p);
		}
	}

	loadPage(p: number = 1): T[] {
		if (!Number.isInteger(p) || p <= 0) p = 1;

		if (!this.#pages.has(p)) {
			const start = (p - 1) * this.itemsPerPage;
			const end = Math.min(start + this.itemsPerPage, this.#items.length);

			const pageItems = this.#items.slice(start, end);

			this.#pages.set(p, pageItems);
		}

		return this.#pages.get(p) || [];
	}

	takeItems(amount: number = this.itemsPerPage): this {
		this.#items = this.#originalItems.slice(0, amount);
		this.#clearCachedPages();

		return this;
	}

	skipItems(amount: number = 0): this {
		this.#items = this.#originalItems.slice(amount);
		this.#clearCachedPages();

		return this;
	}

	#clearCachedPages(): void {
		this.#pages.clear();
	}
}
