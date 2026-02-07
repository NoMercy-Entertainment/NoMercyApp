import i18next from 'i18next';
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
		const match2 = str.match(reg2);
		const match1 = str.match(reg);
		if (reg && reg2 && match2 && match1) {
			return str.replace(
				match2[0],
				`${match1[0]}\n`,
			);
		}
	}

	return str;
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

export function generateRandomString(length: number): string {
	let text = '';
	const possible
		= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
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

export function limitSentenceByCharacters(str: string, characters = 340): string {
	if (!str) {
		return '';
	}
	const arr: string[] = str.substring(0, characters).split('.');
	arr.pop();
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

export function ucfirst(str: string): string {
	const firstLetter = str.substr(0, 1);
	return firstLetter.toUpperCase() + str.substr(1);
}

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
