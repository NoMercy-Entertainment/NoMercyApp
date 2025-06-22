import { pad } from './stringArray';
import type { PlaylistItem } from '@/types/musicPlayer';
import { t } from 'i18next';
import i18next from '@/config/i18next';

export function convertToHumanReact(
	t: (arg: string) => string,
	time: number,
	short = false,
): string {
	let seconds: number | string = Number.parseInt(time.toString(), 10);

	let days: number | string = Math.floor(seconds / (3600 * 24));
	seconds -= days * 3600 * 24;
	let hours: number | string = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	let minutes: number | string = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	if (days === 0) {
		days = '';
	}
	else if (days > 0 && days < 2) {
		days = `${days} ${short ? t('d') : t('day')}`;
	}
	else if (days > 0) {
		days = `${days} ${short ? t('d') : t('days')}`;
	}

	if (hours === 0) {
		hours = '';
	}
	else if (hours > 0 && hours < 2) {
		hours = `${hours} ${short ? t('hr') : t('hour')}`;
	}
	else if (hours > 0) {
		hours = `${hours} ${short ? t('hrs') : t('hours')}`;
	}
	if (minutes === 0) {
		minutes = '';
	}
	else if (minutes > 0 && minutes < 2) {
		minutes = `${minutes} ${short ? t('min') : t('minute')}`;
	}
	else if (minutes > 0) {
		minutes = `${minutes} ${short ? t('min') : t('minutes')}`;
	}

	if (seconds > 0 && !short) {
		seconds = `${seconds} ${short ? t('sec') : t('seconds')}`;
	}
	else {
		seconds = '';
	}

	return `${days} ${hours} ${minutes} ${seconds}`;
}

export function humanTime(time: any) {
	time = Number.parseInt(time, 10);
	let hours: any = pad(Number.parseInt(`${(time % 86400) / 3600}`, 10), 2);

	let minutes: any = Number.parseInt(`${(time % 3600) / 60}`, 10);
	let seconds: any = Number.parseInt(`${time % 60}`, 10);
	if (`${minutes}`.length === 1) {
		minutes = `0${minutes}`;
	}
	if (`${seconds}`.length === 1) {
		seconds = `0${seconds}`;
	}
	if (hours === 0) {
		hours = '00:';
	}
	else {
		hours = `${hours}:`;
	}
	if (minutes === 0) {
		minutes = '00:';
	}
	else {
		minutes = `${minutes}:`;
	}
	if (hours === '00:') {
		hours = '';
	}
	const current = hours + minutes + seconds;
	return current.replace('NaN:NaN:NaN', '00:00');
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function humanTimeExtended(
	t: Function,
	dateTime: Date | number,
	short = false,
) {
	const now = new Date().getTime();
	const diffInSeconds = Math.floor((now - new Date(dateTime).getTime()) / 1000);

	let days: number | string = Math.floor(diffInSeconds / (3600 * 24));
	let hours: number | string = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
	let minutes: number | string = Math.floor((diffInSeconds % 3600) / 60);
	let seconds: number | string = diffInSeconds % 60;

	if (days === 0) {
		days = '';
	}
	else if (days > 0 && days < 2) {
		days = `${days} ${t('day')}`;
	}
	else if (days > 0) {
		days = `${days} ${t('days')}`;
	}

	if (hours === 0) {
		hours = '';
	}
	else if (hours > 0 && hours < 2) {
		hours = `${hours} ${t('hour')}`;
	}
	else if (hours > 0) {
		hours = `${hours} ${t('hours')}`;
	}
	if (minutes === 0) {
		minutes = '';
	}
	else if (minutes > 0 && minutes < 2) {
		minutes = `${minutes} ${t('minute')}`;
	}
	else if (minutes > 0) {
		minutes = `${minutes} ${t('minutes')}`;
	}

	if (seconds > 0 && !short) {
		seconds = `${seconds} ${t('seconds')}`;
	}
	else {
		seconds = '';
	}

	return `${days} ${hours} ${minutes} ${seconds}`;
}

export function convertToHis(time: any) {
	time = Number.parseInt(time, 10);
	let hours: any = pad(Number.parseInt(`${(time % 86400) / 3600}`, 10), 2);

	let minutes: any = Number.parseInt(`${(time % 3600) / 60}`, 10);
	let seconds: any = Number.parseInt(`${time % 60}`, 10);
	if (`${minutes}`.length === 1) {
		minutes = `0${minutes}`;
	}
	if (`${seconds}`.length === 1) {
		seconds = `0${seconds}`;
	}
	if (hours === 0) {
		hours = '00:';
	}
	else {
		hours = `${hours}:`;
	}
	if (minutes === 0) {
		minutes = '00:';
	}
	else {
		minutes = `${minutes}:`;
	}
	const current = `${hours + minutes + seconds}.000`;
	return current.replace('NaN:NaN:NaN', '00:00');
}

export function convertToSeconds(hms: string | null) {
	if (!hms) {
		return 0;
	}
	const a: number[] = hms.split(':').map(n => Number.parseInt(n, 10));
	if (a.length < 3) {
		a.unshift(0);
	}

	return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
}

export function parseYear(date: string | undefined) {
	if (!date) {
		return '';
	}
	return new Date(date).getFullYear();
}

export function sleep(ms: number) {
	const start = new Date().getTime();
	const expire = start + ms;
	while (new Date().getTime() < expire) {
		//
	}
}

export function calculateDuration<T>(value?: T) {
	if (!value)
		return;
	return convertToHumanReact(
		t,
		(value as { tracks?: PlaylistItem[] })?.tracks?.map(track => convertToSeconds(track.duration)).reduce((prev, curr) => prev + curr, 0) ?? 0,
	);
}

export function randomDate() {
	const now = new Date().getTime();
	const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000; // 7 days ago
	const randomEpoch = Math.floor(
		Math.random() * (now - oneWeekAgo) + oneWeekAgo,
	);
	return new Date(randomEpoch);
}

export function timeAgoShort(epoch: Date | number) {
	const rtf = new Intl.RelativeTimeFormat(navigator.language.split('-')?.[0], {
		numeric: 'auto',
		style: 'short',
	});

	epoch = new Date(epoch).getTime();

	const now = Date.now();
	const secondsAgo = Math.floor(
		(now - (epoch > 1000000000000 ? epoch : epoch * 1000)) / 1000,
	); // Check if epoch is in milliseconds

	if (secondsAgo < 60) {
		return t('just now');
	}

	const minutesAgo = Math.floor(secondsAgo / 60);
	if (minutesAgo < 60) {
		return rtf.format(-minutesAgo, 'minute');
	}

	const hoursAgo = Math.floor(minutesAgo / 60);
	if (hoursAgo < 24) {
		return rtf.format(-hoursAgo, 'hour');
	}

	const daysAgo = Math.floor(hoursAgo / 24);
	if (daysAgo < 7) {
		return rtf.format(-daysAgo, 'day');
	}

	const weeksAgo = Math.floor(daysAgo / 7);
	if (weeksAgo < 4) {
		return rtf.format(-weeksAgo, 'week');
	}

	const monthsAgo = Math.floor(daysAgo / 30);
	if (monthsAgo < 12) {
		return rtf.format(-monthsAgo, 'month');
	}

	const yearsAgo = Math.floor(daysAgo / 365);
	return rtf.format(-yearsAgo, 'year');
}
export function userTime(time: Date | number) {
	return new Date(time).toLocaleString(i18next.language, {
		timeZone: 'UTC',
		// timeZoneName: 'short',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	});
}

export function isXmasTime(): boolean {
	const today = new Date();
	const currentYear = today.getFullYear();

	let xmasBeginDate: Date;
	let xmasEndDate: Date;

	if (today >= new Date(currentYear, 5, 1)) {
		xmasBeginDate = new Date(currentYear, 11, 7);
		xmasEndDate = new Date(currentYear + 1, 0, 5);
	}
	else {
		xmasBeginDate = new Date(currentYear - 1, 11, 7);
		xmasEndDate = new Date(currentYear, 0, 5);
	}

	return today >= xmasBeginDate && today <= xmasEndDate;
}
