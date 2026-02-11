import { toRaw } from 'vue';
import { SortOrder, SortType } from '@/types/musicPlayer';

import { mathPercentage } from './format';

/**
 * Create Enum from an array of values.
 * @param {Array} array Array
 */
export function createEnumFromArray(array: string[]) {
	return array.reduce(
		(res: Record<string, number>, key: string, index: number) => {
			res[key] = index + 1;
			return res;
		},
		{},
	);
}

export function find_most(array: Array<number>): number {
	return array.reduce(
		(a: number, b: number, _i, arr: number[]) =>
			arr.filter(v => v === a).length >= arr.filter(v => v === b).length
				? a
				: b,
		array[0],
	);
}

/**
 * Group Array of objects by key.
 * Sort by key (optional)
 * @param {Array} array Array
 * @param {string} key Group key
 */
export function groupBy<T extends Record<string, unknown>>(array: T[], key: string): Record<string, T[]> {
	const list: Record<string, T[]> = {};

	array.forEach((element) => {
		const groupKey = String(element[key]);
		list[groupKey] = array.filter((el) => el[key] === element[key]);
	});

	return list;
}

/**
 * Shuffle array,
 * @param {Array} array Array
 */
export function shuffle<T>(array: Array<T>): Array<T> {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

/**
 * SortCallback.
 * ** Deprecated,
 * Use 'sort_updated' with direction
 */
export function sort_updated_asc(a: Record<string, string | number | Date>, b: Record<string, string | number | Date>) {
	const keyA = new Date(a.updated_at);
	const keyB = new Date(b.updated_at);
	if (keyA > keyB) {
		return -1;
	}
	if (keyA < keyB) {
		return 1;
	}
	return 0;
}

/**
 * SortCallback.
 * ** Deprecated,
 * Use 'sort_updated' with direction
 */
export function sort_updated_desc(a: Record<string, string | number | Date>, b: Record<string, string | number | Date>) {
	const keyA = new Date(a.updated_at);
	const keyB = new Date(b.updated_at);
	if (keyA < keyB) {
		return -1;
	}
	if (keyA > keyB) {
		return 1;
	}
	return 0;
}

export function sortBy<T>(arr: T[], key: string, direction = 'asc',	subKey?: string): T[] {
	return [...(arr ?? [])].sort((a, b) => {
		const aRec = a as Record<string, Record<string, unknown> | unknown>;
		const bRec = b as Record<string, Record<string, unknown> | unknown>;
		let x: unknown;
		let y: unknown;
		if (direction === 'desc') {
			x = subKey ? (bRec[key] as Record<string, unknown>)?.[subKey] ?? '0' : bRec[key] ?? '0';
			y = subKey ? (aRec[key] as Record<string, unknown>)?.[subKey] ?? '0' : aRec[key] ?? '0';
		}
		else {
			x = subKey ? (aRec[key] as Record<string, unknown>)?.[subKey] ?? '0' : aRec[key] ?? '0';
			y = subKey ? (bRec[key] as Record<string, unknown>)?.[subKey] ?? '0' : bRec[key] ?? '0';
		}

		return (x as string | number) < (y as string | number) ? -1 : (x as string | number) > (y as string | number) ? 1 : 0;
	});
}

export function sortBy2<T>(
	arr: T[],
	key: string,
	key2: string,
	direction: 'asc' | 'desc' = 'asc',
	subKey?: string,
) {
	return [...(arr ?? [])].sort((a, b) => {
		const getVal = (obj: T, k: string) => {
			const rec = obj as Record<string, Record<string, unknown> | unknown>;
			return subKey ? (rec[k] as Record<string, unknown>)?.[subKey] ?? '0' : rec[k] ?? '0';
		};

		let x1 = getVal(a, key);
		let y1 = getVal(b, key);

		if (direction === 'desc') {
			[x1, y1] = [y1, x1];
		}

		// Primary sort
		if (x1 < y1)
			return -1;
		if (x1 > y1)
			return 1;

		// Secondary sort
		let x2 = getVal(a, key2);
		let y2 = getVal(b, key2);

		if (direction === 'desc') {
			[x2, y2] = [y2, x2];
		}

		return x2 < y2 ? -1 : x2 > y2 ? 1 : 0;
	});
}

/**
 * SortCallback.
 * Sort Array of objects by a priority list.
 * @param {Array} sortingOrder Sorting Order
 * @param {string} key Sort key
 * @param {string} order Sort direction
 */
export function sortByPriorityKeyed<T = string>(sortingOrder: {
	[x: string]: T;
}, key: string, order = 'desc'): <U extends Record<string, unknown>>(a: U, b: U) => number {
	if (Array.isArray(sortingOrder)) {
		sortingOrder = createEnumFromArray(sortingOrder) as { [x: string]: T };
	}
	return function <T = string>(a: T, b: T): number {
		if (
			!(a as string).hasOwnProperty(key)
			|| !(b as string).hasOwnProperty(key)
		) {
			return 0;
		}

		if (!(a[key as keyof typeof a] as string)) {
			return 0;
		}

		const first = (a[key as keyof typeof a] as string).toString().toLowerCase() in sortingOrder
			? sortingOrder[a[key as keyof typeof a] as string]
			: Number.MAX_SAFE_INTEGER;
		const second = (b[key as keyof typeof b] as string).toString().toLowerCase() in sortingOrder
			? sortingOrder[b[key as keyof typeof b] as string]
			: Number.MAX_SAFE_INTEGER;

		let result = 0;
		if (first > second) {
			result = -1;
		}
		else if (first < second) {
			result = 1;
		}
		return order === 'desc' ? ~result : result;
	};
}

export function sortByType<T>(itemList: T[], sortType: SortType, sortOrder: SortOrder, setSortOrder: (payload: SortOrder) => void): T[] {
	// Determine effective order locally — only call setSortOrder if the value
	// actually needs to change, to avoid re-triggering reactive watchers that
	// call sort() again (infinite loop).
	let effectiveOrder = sortOrder;

	if (sortType === SortType.name) {
		if (!effectiveOrder) {
			effectiveOrder = SortOrder.asc;
			setSortOrder(effectiveOrder);
		}
		return sortBy(itemList, 'name', effectiveOrder);
	}
	if (sortType === SortType.artist) {
		if (!effectiveOrder) {
			effectiveOrder = SortOrder.asc;
			setSortOrder(effectiveOrder);
		}
		return sortBy(itemList, 'artist_track[0]', effectiveOrder, SortType.name);
	}
	if (sortType === SortType.album) {
		if (!effectiveOrder) {
			effectiveOrder = SortOrder.asc;
			setSortOrder(effectiveOrder);
		}
		return sortBy(itemList, 'album_track[0]', effectiveOrder, SortType.name);
	}
	if (sortType === SortType.date) {
		if (!effectiveOrder) {
			effectiveOrder = SortOrder.desc;
			setSortOrder(effectiveOrder);
		}
		return sortBy(itemList, 'date', effectiveOrder);
	}
	if (sortType === SortType.duration) {
		if (!effectiveOrder) {
			effectiveOrder = SortOrder.desc;
			setSortOrder(effectiveOrder);
		}
		return sortBy(itemList, 'duration', effectiveOrder);
	}

	return sortBy2<T>(itemList, 'disc', 'track', effectiveOrder || SortOrder.desc);
}

/**
 * Return only unique objects by key,
 * @param {Array} array Array
 * @param {string} key Unique key
 */
export function unique<T>(array: T[], key: string): T[] {
	if (!array || !Array.isArray(array)) {
		return [];
	}

	return array.filter(
		(obj, pos, arr) =>
			arr.map((mapObj) => (mapObj as Record<string, unknown>)[key]).indexOf((obj as Record<string, unknown>)[key]) === pos,
	);
}

export function uniqueBy<T>(array: T[] | null | undefined, key: (item: T) => unknown): T[] {
	if (!array) {
		return [];
	}
	return Array.from(new Map(array.map((x) => [key(x), x])).values());
}

/**
 * Return only unique objects by key,
 * @param {string} value
 * @param {string} index
 * @param {string} self
 */
export function distinct<T>(value: T, index: number, self: T[]): boolean {
	return self.indexOf(value) === index;
}

/**
 * FilterCallback.
 */
export function Unique<T>(value: T, index: number, self: T[]): boolean {
	return self.indexOf(value) === index;
}

/**
 * Group Array of objects by key,
 * Sort by key (optional),
 * @param {Array} array Array
 * @param {string} key Group key
 * @param {string} key Sort key
 */
export function sortByPriority<T>(arr: T[], prefferedOrder: T[]): T[] {
	const result: T[] = [];
	let i: number;
	let j: number;
	for (i = 0; i < prefferedOrder.length; i++) {
		while ((j = arr.indexOf(prefferedOrder[i])) !== -1) {
			result.push(arr.splice(j, 1)[0]);
		}
	}
	return result.concat(arr);
}

/**
 * SortCallback.
 * Sort Array of objects by Updated at,
 * @param a
 * @param a.updated_at Updated at property
 * @param b
 * @param b.updated_at Updated at property
 * @param {string} direction Sort direction
 */
export function sort_updated(
	a: { updated_at: string | number | Date },
	b: { updated_at: string | number | Date },
	direction = 'asc',
): 0 | 1 | -1 {
	const keyA = new Date(a.updated_at);
	const keyB = new Date(b.updated_at);
	if (keyA < keyB) {
		return direction === 'desc' ? -1 : 1;
	}
	if (keyA > keyB) {
		return direction === 'desc' ? 1 : -1;
	}
	return 0;
}

export function trackSort(a: { disc: number | string; track: string | number }, b: { disc: number | string; track: string | number }): number {
	if (a.disc === b.disc) {
		return Number.parseInt(`${a.track}`, 10) - Number.parseInt(`${b.track}`, 10);
	}
	return Number.parseInt(`${a.track}`, 10) > Number.parseInt(`${b.track}`, 10) ? 1 : -1;
}

export function uniqBy<T extends Record<string, unknown>>(a: T[], key: string | number): T[] {
	return Array.from(
		new Map(a.map((item) => [item[key], item])).values(),
	);
}

export function sortByPosterAlphabetized<T>(data: T[], sort = 'name',	uniqued: string | null = null): T[] {
	data = toRaw(data);
	if (uniqued) {
		data = unique<T>(data, uniqued);
	}

	const current = Object.create(null) as Record<string, string[]>;
	const finalArr: (T & { department: string[]; profile?: string | null })[] = [];

	data.forEach((o) => {
		const rec = o as T & { name: string; department: string; profile?: string | null };
		if (!current[rec.name]) {
			current[rec.name] = [];
			finalArr.push({ ...rec, department: current[rec.name] });
		}
		current[rec.name].push(rec.department);
	});

	const hasPoster = finalArr
		.filter(d => d.profile !== null)
		.sort((a, b) => {
			const aVal = String((a as Record<string, unknown>)[sort]);
			const bVal = String((b as Record<string, unknown>)[sort]);
			return +(aVal > bVal) || -(aVal < bVal);
		});

	const nulled = finalArr
		.filter(d => d.profile === null)
		.sort((a, b) => {
			const aVal = String((a as Record<string, unknown>)[sort]);
			const bVal = String((b as Record<string, unknown>)[sort]);
			return +(aVal > bVal) || -(aVal < bVal);
		});

	return hasPoster.concat(nulled);
}

export function chunk<T>(arr: T[], size: number) {
	const chunkArr = [] as T[][];

	for (let i = 0; i < Math.ceil(arr.length / size); i++) {
		const chunkRow = arr.slice(i * size, i * size + size);
		chunkArr[i] = chunkRow;
	}

	return chunkArr;
}

/**
 * Sort Array of objects by the percentage matched,
 * @param {Array} array Array
 * @param {string} key Group key
 * @param {string} match Match to
 */
export function sortByMathPercentage<T extends Record<string | number, string>>(array: T[], key: string | number, match: string): T[] {
	return array.sort((a, b) => {
		const x = mathPercentage(match, a[key]);
		const y = mathPercentage(match, b[key]);
		return x > y ? -1 : x < y ? 1 : 0;
	});
}

export function objectsEqual<T, S>(o1: T | any, o2: S | any): boolean {
	if (o2 === null && o1 !== null) {
		return false;
	}
	return o1 !== null && typeof o1 === 'object' && Object.keys(o1).length > 0
		? Object.keys(o1).length === Object.keys(o2).length
		&& Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
		: o1 !== null
			&& Array.isArray(o1)
			&& Array.isArray(o2)
			&& !o1.length
			&& !o2.length
			? true
			: o1 === o2;
}

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

export function mappedEntries<O>(input: O) {
	return Object.entries(input as any) as Entries<O>;
}

type itemMap = (n: unknown) => unknown;

interface SortConfig<T> {
	key: keyof T;
	reverse?: boolean;
	map?: itemMap;
}

export function byObjectValues<T extends object>(
	keys: (keyof T | SortConfig<T>)[],
): (a: T, b: T) => 0 | 1 | -1 {
	return function (a: T, b: T) {
		const firstKey: keyof T | SortConfig<T> = keys[0];
		const isSimple = typeof firstKey === 'string';
		const key: keyof T = isSimple
			? (firstKey as keyof T)
			: (firstKey as SortConfig<T>).key;
		const reverse: boolean = isSimple
			? false
			: !!(firstKey as SortConfig<T>).reverse;
		const map: itemMap | null = isSimple
			? null
			: (firstKey as SortConfig<T>).map || null;

		const valA = map ? map(a[key]) : a[key];
		const valB = map ? map(b[key]) : b[key];
		if (valA === valB) {
			if (keys.length === 1) {
				return 0;
			}
			return byObjectValues<T>(keys.slice(1))(a, b);
		}
		if (reverse) {
			return (valA as string | number) > (valB as string | number) ? -1 : 1;
		}
		return (valA as string | number) > (valB as string | number) ? 1 : -1;
	};
}

declare global {
	interface Array<T> {
		latest(): Array<T>;
	}
	interface Date {
		timestamp(): number;
	}
}

Array.prototype.latest = function () {
	return [...this].sort(
		(a: { updated_at: number }, b: { updated_at: number }) => {
			if (a.updated_at > b.updated_at) {
				return -1;
			}
			if (a.updated_at < b.updated_at) {
				return 1;
			}
			return 0;
		},
	);
};

Date.prototype.timestamp = function (): number {
	return Math.floor(this.getTime() / 1000);
};
