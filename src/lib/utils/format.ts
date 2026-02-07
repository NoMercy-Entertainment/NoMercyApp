import { pad } from './string';

export function formatDuration(value: number): string {
	const minute = Math.floor(value / 60);
	const secondLeft = Math.floor(value - minute * 60);
	return `${pad(minute, 1)}:${pad(secondLeft, 2)}`;
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

export function getRandomNumberBetween(a: number, b: number) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function getCommonSize(requestedWidth: string | number | null): string {
	const commonSizes = ['w92', 'w185', 'w342', 'w500', 'w780', 'original'];

	if (!requestedWidth) {
		return 'original';
	}

	const requestedWidthNum = Number.parseInt(requestedWidth.toString(), 10);
	let closestSize = commonSizes[0];

	for (const size of commonSizes) {
		if (size === 'original')
			return 'original';
		const sizeNum = Number.parseInt(size.replace('w', ''), 10);

		if (sizeNum >= requestedWidthNum) {
			closestSize = size;
			break;
		}
	}

	return closestSize;
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
