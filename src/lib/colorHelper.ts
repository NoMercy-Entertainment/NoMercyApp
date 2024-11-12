import {hexToRgba, hsvaToHex} from '@uiw/color-convert';
import {chunk} from '@/lib/stringArray';

export const greenToRed = [
	{
		pct: 0,
		color: {
			r: 0x00,
			g: 0xff,
			b: 0,
		},
	},
	{
		pct: 50,
		color: {
			r: 0xff,
			g: 0xff,
			b: 0,
		},
	},
	{
		pct: 100,
		color: {
			r: 0xff,
			g: 0x00,
			b: 0,
		},
	},
];

export const percentColors = [
	{
		pct: 10,
		color: {
			r: 0xcc,
			g: 0,
			b: 0,
		},
	},
	{
		pct: 50,
		color: {
			r: 0xee,
			g: 0xee,
			b: 0,
		},
	},
	{
		pct: 99,
		color: {
			r: 0,
			g: 0x90,
			b: 0,
		},
	},
	{
		pct: 100,
		color: {
			r: 0,
			g: 0x40,
			b: 0,
		},
	},
];

export interface PercentColor {
	pct: number;
	color: {
		r: number;
		g: number;
		b: number;
	};
}

export const getColorFromPercent = (pct: number, scheme = greenToRed) => {
	let i: number;
	for (i = 1; i < scheme.length - 1; i++) {
		if (pct < scheme[i].pct) {
			break;
		}
	}
	const lower = scheme[i - 1];
	const upper = scheme[i];
	const range = upper.pct - lower.pct;
	const rangePct = (pct - lower.pct) / range;
	const pctLower = 1 - rangePct;
	const pctUpper = rangePct;
	const color = {
		r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
		g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
		b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
	};
	return `rgb(${[color.r, color.g, color.b].join(',')})`;
};

export const setPrimaryDegree = function (value: number) {
	document.documentElement.style.setProperty('--primary-deg', `${value}deg`);
};
export const setPrimarySaturation = function (value: number) {
	document.documentElement.style.setProperty('--primary-sat', `${value}%`);
};

export const setCustomColor = function (key: string, value: number[]) {
	document.documentElement.style.setProperty(`--custom-${key}`, value?.toString().replace(/,/gu, ' '));
};

export const getLuminosity = function (c: any) {
	c = RGBString2hex(c).substring(1);

	const rgb: number = parseInt(c, 16);
	const r = (rgb >> 16) & 0xff;
	const g = (rgb >> 8) & 0xff;
	const b = (rgb >> 0) & 0xff;

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const tooLight = function (c: any, max = 130) {
	if (c) {
		if (c.includes('#')) {
			const rgb = hexToRgba(c);
			c = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
		}

		const luminosity = getLuminosity(c);
		return luminosity > max;

	}
	return false;
};

export const tooDark = function (c: any, min = 50) {
	if (c) {
		if (c.includes('#')) {
			const rgb = hexToRgba(c);
			c = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
		}

		const luminosity = getLuminosity(c);
		return luminosity < min;

	}
	return false;
};

export const byte2Hex = (n: number): string => {
	const nybHexString = '0123456789ABCDEF';
	return String(nybHexString.substr((n >> 4) & 0x0f, 1)) + nybHexString.substr(n & 0x0f, 1);
};

export const RGB2hex = (r: number, g: number, b: number): string => `#${byte2Hex(r)}${byte2Hex(g)}${byte2Hex(b)}`;

export const RGBString2hex = (string: string): string => {
	const newString: number[] = string
		.replace('rgb(', '')
		.replace(')', '')
		.split(/,|\s/gu)
		.slice(0, 3)
		.map(n => parseInt(n, 10));

	return `#${byte2Hex(newString[0])}${byte2Hex(newString[1])}${byte2Hex(newString[2])}`;
};

export const hexToRGB = (hex: string) => {
	const rgb = hexToRgba(hex);
	return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export const pickPaletteColor = (color_palette?: PaletteColors | null | undefined, dark = 60, light = 160): string => {
	if (!color_palette || !color_palette.darkVibrant) {
		return 'var(--color-theme-9)';
	}
	if (!tooDark(color_palette.primary, dark) && !tooLight(color_palette.primary, light)) {
		if (color_palette.primary!.includes('#')) {
			const rgb = hexToRgba(color_palette.primary!);
			return `${rgb.r} ${rgb.g} ${rgb.b}`;
		}
		return color_palette.primary ?? 'var(--color-theme-9)';
	}
	if (!tooLight(color_palette.lightVibrant, light) && !tooDark(color_palette.lightVibrant, dark)) {
		if (color_palette.lightVibrant!.includes('#')) {
			const rgb = hexToRgba(color_palette.lightVibrant!);
			return `${rgb.r} ${rgb.g} ${rgb.b}`;
		}
		return color_palette.lightVibrant ?? 'var(--color-theme-9)';
	}
	if (!tooDark(color_palette.dominant, dark) && !tooLight(color_palette.dominant, light)) {
		if (color_palette.dominant!.includes('#')) {
			const rgb = hexToRgba(color_palette.dominant!);
			return `${rgb.r} ${rgb.g} ${rgb.b}`;
		}
		return color_palette.dominant ?? 'var(--color-theme-9)';
	}

	if (!tooDark(color_palette.darkVibrant, dark) && !tooLight(color_palette.darkVibrant, light)) {
		if (color_palette.darkVibrant!.includes('#')) {
			const rgb = hexToRgba(color_palette.darkVibrant!);
			return `${rgb.r} ${rgb.g} ${rgb.b}`;
		}
		return color_palette.darkVibrant ?? 'var(--color-theme-9)';
	}
	if (!tooDark(color_palette.darkMuted, dark) && !tooLight(color_palette.darkMuted, light)) {
		if (color_palette.darkMuted!.includes('#')) {
			const rgb = hexToRgba(color_palette.darkMuted!);
			return `${rgb.r} ${rgb.g} ${rgb.b}`;
		}
		return color_palette.darkMuted ?? 'var(--color-theme-9)';
	}
	if (!tooLight(color_palette.lightMuted, light) && !tooDark(color_palette.lightMuted, dark)) {
		if (color_palette.lightMuted!.includes('#')) {
			const rgb = hexToRgba(color_palette.lightMuted!);
			return `${rgb.r} ${rgb.g} ${rgb.b}`;
		}
		return color_palette.lightMuted ?? 'var(--color-theme-9)';
	}

	return 'var(--color-theme-9)';
};

export enum TailwindColors {
	amber = 'amber',
	blue = 'blue',
	bronze = 'bronze',
	brown = 'brown',
	crimson = 'crimson',
	cyan = 'cyan',
	gold = 'gold',
	grass = 'grass',
	gray = 'gray',
	green = 'green',
	indigo = 'indigo',
	lime = 'lime',
	mauve = 'mauve',
	mint = 'mint',
	olive = 'olive',
	orange = 'orange',
	pink = 'pink',
	plum = 'plum',
	purple = 'purple',
	red = 'red',
	sage = 'sage',
	sand = 'sand',
	sky = 'sky',
	slate = 'slate',
	teal = 'teal',
	tomato = 'tomato',
	violet = 'violet',
	yellow = 'yellow',
}

export const themeColors: { title: keyof typeof TailwindColors; color: string }[] = [
	{title: 'red', color: 'rgb(var(--color-red-9))'},
	{title: 'tomato', color: 'rgb(var(--color-tomato-9))'},
	{title: 'orange', color: 'rgb(var(--color-orange-9))'},
	{title: 'amber', color: 'rgb(var(--color-amber-9))'},
	{title: 'yellow', color: 'rgb(var(--color-yellow-9))'},

	{title: 'lime', color: 'rgb(var(--color-lime-9))'},
	{title: 'grass', color: 'rgb(var(--color-grass-9))'},
	{title: 'green', color: 'rgb(var(--color-green-9))'},
	{title: 'teal', color: 'rgb(var(--color-teal-9))'},

	{title: 'mint', color: 'rgb(var(--color-mint-9))'},
	{title: 'cyan', color: 'rgb(var(--color-cyan-9))'},
	{title: 'sky', color: 'rgb(var(--color-sky-9))'},
	{title: 'blue', color: 'rgb(var(--color-blue-9))'},
	{title: 'indigo', color: 'rgb(var(--color-indigo-9))'},

	{title: 'violet', color: 'rgb(var(--color-violet-9))'},
	{title: 'purple', color: 'rgb(var(--color-purple-9))'},
	{title: 'plum', color: 'rgb(var(--color-plum-9))'},
	{title: 'pink', color: 'rgb(var(--color-pink-9))'},
	{title: 'crimson', color: 'rgb(var(--color-crimson-9))'},

	{title: 'brown', color: 'rgb(var(--color-brown-9))'},
	{title: 'gold', color: 'rgb(var(--color-gold-9))'},
	{title: 'bronze', color: 'rgb(var(--color-bronze-9))'},

	{title: 'olive', color: 'rgb(var(--color-olive-9))'},
	{title: 'sage', color: 'rgb(var(--color-sage-9))'},
	{title: 'slate', color: 'rgb(var(--color-slate-9))'},
	{title: 'mauve', color: 'rgb(var(--color-mauve-9))'},
	{title: 'sand', color: 'rgb(var(--color-sand-9))'},
	{title: 'gray', color: 'rgb(var(--color-gray-9))'},
];

export const backgroundColors: { title: keyof typeof TailwindColors; color: string }[] = [
	{title: 'olive', color: 'rgb(var(--background-olive-9))'},
	{title: 'sage', color: 'rgb(var(--background-sage-9))'},
	{title: 'slate', color: 'rgb(var(--background-slate-9))'},
	{title: 'mauve', color: 'rgb(var(--background-mauve-9))'},
	{title: 'sand', color: 'rgb(var(--background-sand-9))'},
	{title: 'gray', color: 'rgb(var(--background-gray-9))'},

];

export type ThemeColors = TailwindColors | 'custom';

export interface ColorList {
	key: string;
	value: number[];
}

export const setCustomColors = (colors: ColorList[]) => {
	if (!colors) return;
	Object.entries(colors).map((color) => {
		setCustomColor(color[1].key, color[1].value);
	});
};


export type ImageBrightness = {
	brightness: number,
	transparency: number,
	nonTransparentBrightness: number
}

/**
 * Calculates the brightness and transparency of an image.
 * @param imageSrc - The source URL of the image.
 * @param cb - The callback function that receives an object with the `brightness`, `transparency`, and `nonTransparentBrightness` values.
 */
export const getImageBrightness = (imageSrc: string, cb: (arg: ImageBrightness) => void) => {

	const img = new Image();
	img.style.display = 'none';
	img.crossOrigin = 'anonymous';
	img.src = imageSrc;

	img.onload = () => {

		let alphaSum = 0;
		let colorSum = 0;

		const canvas = document.createElement('canvas');

		// make the canvas use the full size of the image, not the rendered size
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;

		const ctx = canvas.getContext('2d', {willReadFrequently: true})!;
		ctx.drawImage(img, 0, 0);

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;
		let r;
		let g;
		let b;
		let a;

		for (let x = 0, len = data.length; x < len; x += 4) {
			r = data[x];
			g = data[x + 1];
			b = data[x + 2];
			a = data[x + 3];

			colorSum += Math.floor((r + g + b) / 3);
			alphaSum += a;
		}

		const transparency = 100 - Math.floor((alphaSum / (img.naturalWidth * img.naturalHeight) / 255) * 100);
		const brightness = Math.floor((colorSum / (img.naturalWidth * img.naturalHeight) / 255) * 100);
		const nonTransparentBrightness = Math.floor((brightness / (100 - transparency)) * 100);

		cb({
			brightness,
			transparency,
			nonTransparentBrightness,
		});
	};

	img.onerror = () => {
		cb({
			brightness: 0,
			transparency: 0,
			nonTransparentBrightness: 0,
		});
	};
};

export const RGBToHSL = (r: number, g: number, b: number) => {
	r /= 255;
	g /= 255;
	b /= 255;
	const l = Math.max(r, g, b);
	const s = l - Math.min(r, g, b);
	const h = s
		? l === r
			? (g - b) / s
			: l === g
				? 2 + (b - r) / s
				: 4 + (r - g) / s
		: 0;
	return {
		h: 60 * h < 0
			? 60 * h + 360
			: 60 * h,
		s: 100 * (s
			? (l <= 0.5
				? s / (2 * l - s)
				: s / (2 - (2 * l - s)))
			: 0),
		l: (100 * (2 * l - s)) / 2,
	};
};

export interface Color {
	red: number;
	green: number;
	blue: number;
}

export const isSimilarColor = (color1: Color, color2: Color, threshold = 15): boolean => {
	const distance = Math.sqrt(
		(color1.red - color2.red) ** 2
		+ (color1.green - color2.green) ** 2
		+ (color1.blue - color2.blue) ** 2
	);

	return distance <= threshold;
};

export interface PaletteColors {
	darkMuted?: string;
	lightMuted?: string;
	darkVibrant?: string;
	lightVibrant?: string;
	primary?: string;
	dominant?: string;
}

export const getDominantColor = (img: HTMLImageElement): PaletteColors => {

	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;

	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, 0, 0, img.width, img.height);

	const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

	interface ColorMap {
		count: number,
		totalRGB: number,
		averageRGB: number,
		luminosity: number,
		hsl: {
			h: number,
			s: number,
			l: number,
		},
	}

	const colorMap = new Map<string, ColorMap>();

	for (let i = 0; i < imageData.length; i += 4) {

		const colorMapObject = {
			count: 0,
			totalRGB: 0,
			averageRGB: 0,
			luminosity: 0,
			hsl: {
				h: 0,
				s: 0,
				l: 0,
			},
		};

		const rgba = imageData.slice(i, i + 4);

		const total = rgba[0] + rgba[1] + rgba[2];

		if (rgba[3] == 0) {
			continue;
		}
		const color = `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;

		colorMapObject.count = (colorMap.get(color)?.count ?? 0) + 1;
		colorMapObject.totalRGB = total;
		colorMapObject.luminosity = getLuminosity(color);
		colorMapObject.averageRGB = total / 3;
		colorMapObject.hsl = RGBToHSL(rgba[0], rgba[1], rgba[2]);

		colorMap.set(color, colorMapObject);
	}

	const colors: [string, ColorMap][] = Array.from(colorMap)
		.sort((a, b) => b[1].count - a[1].count);
	const pColor = colors.splice(0, 1);
	const arr = [];
	arr.push(pColor[0][0]);

	const newColors = colors.sort((a, b) => (a[1].hsl.l - b[1].hsl.l));
	const firstHalf = newColors.splice(0, newColors.length / 2);
	const secondHalf = newColors.splice(0, newColors.length);

	const ch = chunk(firstHalf, firstHalf.length / 2);
	const ch2 = chunk(secondHalf, secondHalf.length / 2);

	for (let i = 0; i < 2; i++) {
		arr.push(ch[i][0][0]);
	}
	for (let i = 0; i < 2; i++) {
		arr.push((ch2[i].reverse())[0][0]);
	}

	return {
		dominant: RGBString2hex(arr[0]),
		primary: RGBString2hex(arr[0]),
		darkMuted: RGBString2hex(arr[1]),
		darkVibrant: RGBString2hex(arr[2]),
		lightVibrant: RGBString2hex(arr[3]),
		lightMuted: RGBString2hex(arr[4]),
	};
};

export const hexLighter = (hex?: string, luminosity?: number) => {
	if (!hex) return;
	const rgb = hexToRgba(hex);
	const hsl = RGBToHSL(rgb.r, rgb.g, rgb.b);

	if (luminosity) {
		hsl.l += luminosity;
	}

	return hsvaToHex({h:hsl.h, s:hsl.s, v:hsl.l, a:1});
	// return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export const hexDarker = (hex: string, luminosity?: number): string => {
	const rgb = hexToRgba(hex);
	const hsl = RGBToHSL(rgb.r, rgb.g, rgb.b);

	if (luminosity) {
		hsl.l -= luminosity;
	}

	return hsvaToHex({h:hsl.h, s:hsl.s, v:hsl.l, a:1});

	// return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}
