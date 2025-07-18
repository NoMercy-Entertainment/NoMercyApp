import { toRaw } from 'vue';
import i18next from 'i18next';
import { SortOrder, SortType } from '@/types/musicPlayer';
import { siteTitle, suffix } from '@/config/config';

export function setTitle(arg?: string | null) {
	if (!arg || arg === '') {
		document.title = siteTitle;
		return;
	}

	const res: string[] = [];

	if (arg) {
		res.push(arg);
	}
	if (!window.matchMedia('(display-mode: standalone)').matches) {
		if (arg) {
			res.push('-');
		}
		res.push(siteTitle);
	}

	document.title = res.join(' ');
}

export function breakLogoTitle(str: string, characters = [':', '!', '?']) {
	if (!str) {
		return '';
	}

	if (str.split('').some((l: string) => characters.includes(l))) {
		const reg = new RegExp(
			characters.map(l => (l === '?' ? `\\${l}` : l)).join('|'),
			'u',
		);
		const reg2 = new RegExp(
			characters.map(l => (l === '?' ? `\\${l}\\s` : `${l}\\s`)).join('|'),
			'u',
		);
		if (reg && reg2 && str.match(reg2)) {
			return str.replace(
				(str.match(reg2) as any)[0],
				`${(str.match(reg) as any)[0]}\n`,
			);
		}
	}

	return str;
}

/**
 * Create Enum from an array of values.
 * @param {Array} array Array
 */
export function createEnumFromArray(array: any[]) {
	return array.reduce(
		(res: { [x: string]: any }, key: string | number, index: number) => {
			res[key] = index + 1;
			return res;
		},
		{},
	);
}

export async function copyToClipboard(text: string): Promise<boolean> {
	// Navigator clipboard api needs a secure context (https)
	if (navigator.clipboard && window.isSecureContext) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		}
		catch {
			return false;
		}
	}
	else {
		// Use the 'out of viewport hidden text area' trick
		const textArea = document.createElement('textarea');
		textArea.value = text;

		// Move textarea out of the viewport so it's not visible
		textArea.style.position = 'absolute';
		textArea.style.left = '-999999px';

		document.body.prepend(textArea);
		textArea.select();

		try {
			document.execCommand('copy');
			return Promise.resolve(true);
		}
		catch (error) {
			console.error(error);
			return Promise.resolve(false);
		}
		finally {
			textArea.remove();
		}
	}
}

export function find_most(array: Array<number>): number {
	return array.reduce(
		(a: number, b: number, _i, arr: any[]) =>
			arr.filter(v => v === a).length >= arr.filter(v => v === b).length
				? a
				: b,
		array[0],
	);
}

export function formatDuration(value: number): string {
	const minute = Math.floor(value / 60);
	const secondLeft = Math.floor(value - minute * 60);
	return `${pad(minute, 1)}:${pad(secondLeft, 2)}`;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export function generateRandomString(length: number): string {
	let text = '';
	const possible
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

/**
 * Group Array of objects by key.
 * Sort by key (optional)
 * @param {Array} array Array
 * @param {string} key Group key
 */
export function groupBy<T>(array: T[], key: string): T[][] {
	const list: any = {};

	array.map((element: any) => {
		list[element[key]] = array.filter((el: any) => el[key] === element[key]);
	});

	return list;
}

export function hash(string: string) {
	const self = string;
	const range = Array.from({ length: string.length });
	for (let i = 0; i < string.length; i++) {
		range[i] = i;
	}
	return Array.prototype.map
		.call(range, i => self.charCodeAt(i).toString(16))
		.join('');
}

export function isJsonString(str: string) {
	try {
		JSON.parse(str);
	}
	catch {
		return false;
	}
	return true;
}

export function isValidObject(str: any) {
	return str.length > 0 && typeof str === 'object';
}

export function limitSentenceByCharacters(str: string, characters = 340): string {
	if (!str) {
		return '';
	}
	const arr: any = str.substring(0, characters).split('.');
	arr.pop(arr.length);
	return `${arr.join('.')}.`;
}

export function lineBreakLongTitle(str: string, characters = 45) {
	if (!str) {
		return '';
	}
	const ep = str.match(/S\d{2}E\d{2}/u);

	if (ep && str.length > characters) {
		const arr = str.split(/\sS\d{2}E\d{2}\s/u);

		return `${arr[0]} \n${ep[0]} ${arr[1]}`;
	}

	return str;
}

export function lineBreakShowTitle(str: string, removeShow = false) {
	if (!str) {
		return '';
	}
	const ep = str.match(/S\d{2}E\d{2}/u);

	if (ep) {
		const arr = str.split(/\sS\d{2}E\d{2}\s/u);
		if (removeShow) {
			return `${ep[0]} ${arr[1]}`;
		}
		return `${arr[0]} \n${ep[0]} ${arr[1]}`;
	}

	return str;
}

export function pad(number: string | number, places = 2): string {
	if (typeof number !== 'undefined') {
		const zero = places - number.toString().length + 1;

		return Array.from({ length: +(zero > 0 && zero) }).join('0') + number;
	}
	return '';
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

export function sortBy<T>(arr: T[], key: string, direction = 'asc',	subKey?: string) {
	return [...(arr ?? [])].sort((a: any, b: any) => {
		let x: typeof a;
		let y: typeof b;
		if (direction === 'desc') {
			x = subKey ? b[key]?.[subKey] ?? '0' : b[key] ?? '0';
			y = subKey ? a[key]?.[subKey] ?? '0' : a[key] ?? '0';
		}
		else {
			x = subKey ? a[key]?.[subKey] ?? '0' : a[key] ?? '0';
			y = subKey ? b[key]?.[subKey] ?? '0' : b[key] ?? '0';
		}

		return x < y ? -1 : x > y ? 1 : 0;
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
}, key: string, order = 'desc'): any {
	if (Array.isArray(sortingOrder)) {
		sortingOrder = createEnumFromArray(sortingOrder);
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
	if (sortType === SortType.name) {
		if (!sortOrder) {
			setSortOrder(SortOrder.asc);
		}
		return sortBy(itemList, 'name', sortOrder);
	}
	if (sortType === SortType.artist) {
		if (!sortOrder) {
			setSortOrder(SortOrder.asc);
		}
		return sortBy(itemList, 'artist_track[0]', sortOrder, SortType.name);
	}
	if (sortType === SortType.album) {
		if (!sortOrder) {
			setSortOrder(SortOrder.asc);
		}
		return sortBy(itemList, 'album_track[0]', sortOrder, SortType.name);
	}
	if (sortType === SortType.date) {
		if (!sortOrder) {
			setSortOrder(SortOrder.desc);
		}
		return sortBy(itemList, 'date', sortOrder || SortOrder.desc);
	}
	if (sortType === SortType.duration) {
		if (!sortOrder) {
			setSortOrder(SortOrder.desc);
		}
		return sortBy(itemList, 'duration', sortOrder || SortOrder.desc);
	}

	return sortBy<T>(itemList, 'disc', sortOrder || SortOrder.desc);
}

export function ucfirst(str: string): string {
	const firstLetter = str.substr(0, 1);
	return firstLetter.toUpperCase() + str.substr(1);
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
		(obj: any, pos, arr) =>
			arr.map((mapObj: any) => mapObj[key]).indexOf(obj[key]) === pos,
	);
}

export function uniqueBy(array: any, key: any) {
	if (!array) {
		return [];
	}
	return Array.from(new Map(array.map((x: any) => [key(x), x])).values());
}

/**
 * Return only unique objects by key,
 * @param {string} value
 * @param {string} index
 * @param {string} self
 */
export function distinct(value: any, index: any, self: string | any[]) {
	return self.indexOf(value) === index;
}

/**
 * FilterCallback.
 */
export function Unique(value: any, index: any, self: string | any[]) {
	return self.indexOf(value) === index;
}

/**
 * Generate a random string.
 * returns only aphanumeric characters.
 * @param {number} length Lenght
 */
export function random_string(length: number) {
	let result = '';
	const characters
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

/**
 * Group Array of objects by key,
 * Sort by key (optional),
 * @param {Array} array Array
 * @param {string} key Group key
 * @param {string} key Sort key
 */
export function sortByPriority(arr: any[], prefferedOrder: string | any[]) {
	const result: any[] = [];
	let i: number;
	let j: any;
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

export function trackSort(a: { disc: any; track: string | number }, b: { disc: any; track: string | number }) {
	if (a.disc === b.disc) {
		return Number.parseInt(`${a.track}`, 10) - Number.parseInt(`${b.track}`, 10);
	}
	return Number.parseInt(`${a.track}`, 10) > Number.parseInt(`${b.track}`, 10) ? 1 : -1;
}

export function uniqBy(a: {
	map: (arg0: (item: any) => any[]) => Iterable<readonly [unknown, unknown]>;
}, key: string | number) {
	return Array.from(
		new Map(a.map((item: { [x: string]: any }) => [item[key], item])).values(),
	);
}

export function sortByPosterAlphabetized<T>(data: T[], sort = 'name',	uniqued: string | null = null): T[] {
	data = toRaw(data);
	if (uniqued) {
		data = unique<T>(data, uniqued);
	}

	const current = Object.create(null);
	const finalArr: any[] = [];

	data.forEach((o: any) => {
		if (!current[o.name]) {
			current[o.name] = [];
			finalArr.push({ ...o, department: current[o.name] });
		}
		current[o.name].push(o.department);
	});

	const hasPoster = finalArr
		.filter((d: { profile: null }) => d.profile !== null)
		.sort(
			(
				a: { [x: string]: number },
				b: {
					[x: string]: number;
				},
			) => +(a[sort] > b[sort]) || -(a[sort] < b[sort]),
		);

	const nulled = finalArr
		.filter((d: { profile: null }) => d.profile === null)
		.sort(
			(
				a: { [x: string]: number },
				b: {
					[x: string]: number;
				},
			) => +(a[sort] > b[sort]) || -(a[sort] < b[sort]),
		);

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

declare global {
	interface String {
		capitalize: () => string;
		toPascalCase: (arg: string) => string;
		titleCase: (lang: string, withLowers: boolean) => string;
		toTitleCase: (lang?: string) => string;
		toInt: () => number;
	}
}

String.prototype.capitalize = function (): string {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.toTitleCase = function (): string {
	let i: number;
	let j: number;
	let str: string;

	str = this.replace(/([^\W_][^\s-]*) */gu, (txt: string) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});

	// Certain minor words should be left lowercase unless
	// they are the first or last words in the string

	// ['a', 'for', 'so', 'an', 'in', 'the', 'and', 'nor', 'to', 'at', 'of', 'up', 'but', 'on', 'yet', 'by', 'or'];
	const lowers = [
		'A',
		'An',
		'The',
		'And',
		'But',
		'Or',
		'For',
		'Nor',
		'As',
		'At',
		'By',
		'For',
		'From',
		'In',
		'Into',
		'Near',
		'Of',
		'On',
		'Onto',
		'To',
		'With',
	];
	for (i = 0, j = lowers.length; i < j; i++) {
		str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt) => {
			return txt.toLowerCase();
		});
	}

	// Certain words such as initialisms or acronyms should be left uppercase
	const uppers = ['Id', 'Tv'];
	for (i = 0, j = uppers.length; i < j; i++) {
		str = str.replace(
			new RegExp(`\\b${uppers[i]}\\b`, 'gu'),
			uppers[i].toUpperCase(),
		);
	}

	return str;
};

/**
 * @param  {string} lang EN|NL|FR
 * @param  {boolean} withLowers true|false
 */
String.prototype.titleCase = function (
  lang = navigator.language.split('-')[0],
  withLowers = true,
): string {
	let string: string;
	let lowers: string[] = [];

	string = this.replace(/([^\s:\-'])([^\s:\-']*)/gu, (txt: string) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	}).replace(/Mc(.)/gu, (_match: string, next: string) => {
		return `Mc${next.toUpperCase()}`;
	});

	if (withLowers) {
		lowers = [
			'A',
			'An',
			'The',
			'At',
			'By',
			'For',
			'In',
			'Of',
			'On',
			'To',
			'Up',
			'And',
			'As',
			'But',
			'Or',
			'Nor',
			'Not',
		];
		if (lang === 'FR') {
			lowers = [
				'Un',
				'Une',
				'Le',
				'La',
				'Les',
				'Du',
				'De',
				'Des',
				'À',
				'Au',
				'Aux',
				'Par',
				'Pour',
				'Dans',
				'Sur',
				'Et',
				'Comme',
				'Mais',
				'Ou',
				'Où',
				'Ne',
				'Ni',
				'Pas',
			];
		}
		else if (lang === 'NL') {
			lowers = [
				'De',
				'Het',
				'Een',
				'En',
				'Van',
				'Naar',
				'Op',
				'Door',
				'Voor',
				'In',
				'Als',
				'Maar',
				'Waar',
				'Niet',
				'Bij',
				'Aan',
			];
		}
		for (let i = 0; i < lowers.length; i++) {
			string = string.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt) => {
				return txt.toLowerCase();
			});
		}
	}

	const uppers = ['Id', 'R&d'];
	for (let i = 0; i < uppers.length; i++) {
		string = string.replace(
			new RegExp(`\\b${uppers[i]}\\b`, 'gu'),
			uppers[i].toUpperCase(),
		);
	}

	return string;
};

String.prototype.toPascalCase = function (): string {
	return (this.match(/[a-z0-9]+/giu) as string[])
		.map(
			(word: string) =>
				word.charAt(0).toUpperCase() + word.substr(1).toLowerCase(),
		)
		.join('_');
};

String.prototype.toInt = function (): number {
	return Number.parseInt(this as string, 10);
};

export function mathPercentage(strA: string, strB: string): number {
	let result = 0;

	for (let i = strA.length; (i -= 1);) {
		if (typeof strB[i] === 'undefined' || strA[i] === strB[i]) {
			//
		}
		else if (strA[i].toLowerCase() === strB[i].toLowerCase()) {
			result += 1;
		}
		else {
			result += 4;
		}
	}
	return (
		100
		- ((result + 4 * Math.abs(strA.length - strB.length))
			/ (2 * (strA.length + strB.length)))
		* 100
	);
}

/**
 * Sort Array of objects by the percentage matched,
 * @param {Array} array Array
 * @param {string} key Group key
 * @param {string} match Match to
 */
export function sortByMathPercentage(array: any[], key: string | number, match: string) {
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

export function create_UUID() {
	let dt = new Date().getTime();
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/gu, (c) => {
		const r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
	return uuid;
}

/**
 * @name stringFormat
 * @description Parses the template string with the values given as extra arguments
 * @author: Stoney_Eagle <stoney@nomercy.tv>
 *
 * @example stringFormat(
	'/{0}/{1}/season/{2}/episode/{3}?api_key={4}&language={5}',
	'tv',
	1433,
	1,
	1,
	'ABCDEFGHIJK',
	'en-US'
	) // /tv/1433/season/1/episode/1?api_key=ABCDEFGHIJK&language=en-US
 */
export function stringFormat(template: string, ...values: Array<string | number>): string {
	const regex = /\{(?<index>\d+)\}/gu;
	const matches = template.match(regex);
	if (!matches || matches?.length === null)
		return template;

	let string = template;

	for (let i = 0; i < matches.length; i++) {
		const element: string = matches[i];
		const index: number = Number.parseInt(matches[i][1], 10);

		string = string.replace(element, values[index].toString());
	}

	return string;
}

export function translate(template: string, ...value: Array<string | number>) {
	const translatedTemplate = i18next.t(template);
	const formatted = stringFormat(translatedTemplate, ...value);

	return formatted ?? template;
}

// export const translate = (t: (arg: string) => string, template: string, ...value: Array<string | number>) => {
// 	const translatedTemplate = t(template);

// 	return stringFormat(translatedTemplate, ...value);
// };

type itemMap = (n: any) => any;

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
			return valA > valB ? -1 : 1;
		}
		return valA > valB ? 1 : -1;
	};
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si = false, dp = 1): string {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return `${bytes} B`;
	}

	const units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;

	do {
		bytes /= thresh;
		++u;
	} while (
		Math.round(Math.abs(bytes) * r) / r >= thresh
		&& u < units.length - 1
	);

	return `${bytes.toFixed(dp)} ${units[u]}`;
}

export async function getDataUrl(url: string, accessToken: string) {
	return await fetch(encodeURI(url).replace(/#/gu, '%23'), {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
		.then(response => response.blob())
		.then((data) => {
			return URL.createObjectURL(data);
		})
		.catch((error) => {
			console.error(error);
		});
}

export function breakTitle(title: string, className: string | null = null) {
	if (!title)
		return '';

	const items = title.split(
		/(:\s|\sand\sthe\s|\sen\sde\s|\s-\s|\s–\s|\s&\s)/iu,
	);
	if (
		(items.includes(' - ') || items.includes(' – '))
		&& items.includes(': ')
	) {
		return title
			?.replace(
				/(.+)(:\s|sand\sthe|\sen\sde|\s&\s)(.*)/u,
				`<span class=''>$1</span><span class='${className}'>$3</span>`,
			)
			.replace(/\s-.+$/u, ' ');
	}
	if (items.length === 3 && title.length > 30) {
		if (title.includes(':')) {
			return title?.replace(
				/(.+)(:\s|sand\sthe|\sen\sde|\s&\s)(.*)/u,
				`<span class=''>$1</span><span class='${className}'>$3</span>`,
			);
		}
		return title?.replace(
			/(.+)(\sand\sthe\s|\sen\sde\s|\s-\s|\s&\s)(.+)/iu,
			`<span class=''>$1</span><span class='${className}'>$3</span>`,
		);
	}
	if (
		(items.includes(' and the ') || items.includes(' en de '))
		&& title.length > 25
		&& !items.includes(': ')
	) {
		return title
			?.replace(
				/(.+)(:\s|\sand\sthe\s|\sen\sde\s|\s-\s|\s&\s)(.+)/iu,
				`<span class=''>$1</span><span class='${className}'>$3</span>`,
			)
			.replace(/\sand\sthe\s|\sen\sde\s/iu, ' ');
	}
	if (
		(items.includes(' and the ') || items.includes(' en de '))
		&& title.length > 40
		&& items.includes(': ')
	) {
		return title
			?.replace(
				/(.+)(\sand\sthe\s|\sen\sde\s|\s-\s|\s&\s)(.+)/iu,
				`<span class=''>$1</span><span class='${className}'>$3</span>`,
			)
			.replace(/\sand\sthe\s|\sen\sde\s/iu, ' ');
	}
	if (title.includes(':') && title.split(/[I\-]+$/iu)[0].length > 20) {
		return title?.replace(
			/(.+)(:\s|sand\sthe|\sen\sde|\s&\s)(.*)/u,
			`<span class=''>$1</span><span class='${className}'>$3</span>`,
		);
	}

	return title;
}

export function breakTitle2(title: string, className: string | null = null) {
	if (!title)
		return '';

	return title?.replace(
		/(:\s|\sand\sthe|\sen\sde)(.*)/u,
		`:</br><span class='${className}'>$2</span>`,
	);
}

export function breakDescription(description: string) {
	// TODO: This is an XSS vulnerability. Replace it with `JSX` construction.
	return description
		?.split(/\.\s/u)
		.filter(s => !s.includes('Wikipedia') && !s.includes('CC-'))
		.join('.\n');
}

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

export function mappedEntries<O>(input: O) {
	return Object.entries(input as any) as Entries<O>;
}

export const alphaNumericRange = (function () {
	const data
    = '_#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
    	'',
    );
	return function (start: string, stop: string) {
		const a = data.indexOf(start);
		const b = data.indexOf(stop);
		return !~start || !~stop ? null : data.slice(a, b + 1);
	};
})() as (start: string, stop: string) => string[];

declare global {
	interface Array<T> {
		latest(): Array<T>;
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

export function getRandomNumberBetween(a: number, b: number) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function isIp(ip: string) {
	return ip.match(/^(?:\d{1,3}\.){3}\d{1,3}$/u);
}

export function isPublicIp(ip: string) {
	return (
		!ip.startsWith('192') && !ip.startsWith('10.') && !ip.startsWith('172')
	);
}

export function censorPublicIpAddresses(string?: string) {
	if (!string) {
		return '';
	}

	if (suffix !== '') {
		return string.replace(
			/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3})/gu,
			(ip: string) => {
				return isPublicIp(ip) ? 'XXX.XXX.XXX.XXX' : ip;
			},
		);
	}

	return string;
}

/**
 * Determines the state of a checkbox based on the selected values and total values.
 *
 * @param {unknown[]} selectedArray - An array of selected values. This should contain the values that are currently selected.
 * @param {unknown[]} totalArray - An array of all possible values. This should contain all the values that can be selected.
 *
 * @returns {false | null | true} - Returns `false` if no values are selected, `true` if all values are selected, and `null` if some but not all values are selected.
 */
export function checkboxValue(selectedArray: unknown[], totalArray: unknown[]): false | null | true {
	if (selectedArray.length === 0) {
		return false;
	}
	else if (selectedArray.length === totalArray?.length) {
		return true;
	}
	else {
		return null;
	}
}
