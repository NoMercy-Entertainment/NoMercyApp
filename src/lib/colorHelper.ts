import { hexToRgba, hsvaToHex } from '@uiw/color-convert';
import { chunk } from '@/lib/utils/array';
import { blue, brown, gray, green, red } from '@/config/global';
import type { EdgeStyle } from '@/lib/VideoPlayer/plugins/UIPlugin/buttons.ts';

export const greenToRed = [
	{
		pct: 0,
		color: {
			r: 0,
			g: 0x40,
			b: 0,
		},
	},
	{
		pct: 1,
		color: {
			r: 0,
			g: 0x90,
			b: 0,
		},
	},
	{
		pct: 50,
		color: {
			r: 0xFF,
			g: 0xFF,
			b: 0,
		},
	},
	{
		pct: 100,
		color: {
			r: 0xFF,
			g: 0x00,
			b: 0,
		},
	},
];

export const redToGreen = [
	{
		pct: 0,
		color: {
			r: 0xCC,
			g: 0,
			b: 0,
		},
	},
	{
		pct: 50,
		color: {
			r: 0xEE,
			g: 0xEE,
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

export function getColorFromPercent(pct: number, scheme = greenToRed) {
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
}

export function setCustomColor(key: string, value: number[]) {
	document.documentElement.style.setProperty(
		`--custom-${key}`,
		value?.toString().replace(/,/gu, ' '),
	);
}

export function getLuminosity(c: string): number {
	const hex = RGBString2hex(c).substring(1);

	const rgb: number = Number.parseInt(hex, 16);
	const r = (rgb >> 16) & 0xFF;
	const g = (rgb >> 8) & 0xFF;
	const b = (rgb >> 0) & 0xFF;

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function tooLight(c: string | null | undefined, max = 130): boolean {
	if (c) {
		let color = c;
		if (color.includes('#')) {
			const rgb = hexToRgba(color);
			color = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
		}

		const luminosity = getLuminosity(color);
		return luminosity > max;
	}
	return false;
}

export function tooDark(c: string | null | undefined, min = 50): boolean {
	if (c) {
		let color = c;
		if (color.includes('#')) {
			const rgb = hexToRgba(color);
			color = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
		}

		const luminosity = getLuminosity(color);
		return luminosity < min;
	}
	return false;
}

export function byte2Hex(n: number): string {
	const nybHexString = '0123456789ABCDEF';
	return (
		String(nybHexString.substr((n >> 4) & 0x0F, 1))
		+ nybHexString.substr(n & 0x0F, 1)
	);
}

export function RGB2hex(r: number, g: number, b: number): string {
	return `#${byte2Hex(r)}${byte2Hex(g)}${byte2Hex(b)}`;
}

export function RGBString2hex(string: string): string {
	const newString: number[] = string
		.replace('rgb(', '')
		.replace(')', '')
		.split(/,|\s/gu)
		.slice(0, 3)
		.map(n => Number.parseInt(n, 10));

	return `#${byte2Hex(newString[0])}${byte2Hex(newString[1])}${byte2Hex(
		newString[2],
	)}`;
}

export function hexToRGB(hex: string) {
	const rgb = hexToRgba(hex);
	return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
}

export function pickPaletteColor(color_palette?: PaletteColors | null | undefined, dark = 60, light = 160): string {
	if (!color_palette || !color_palette.darkVibrant) {
		return '';
	}
	if (!tooLight(color_palette.lightVibrant, light) && !tooDark(color_palette.lightVibrant, dark)) {
		return color_palette.lightVibrant!;
	}
	if (!tooDark(color_palette.primary, dark) && !tooLight(color_palette.primary, light)) {
		return color_palette.primary!;
	}
	if (!tooDark(color_palette.dominant, dark) && !tooLight(color_palette.dominant, light)) {
		return color_palette.dominant!;
	}

	if (!tooDark(color_palette.darkVibrant, dark) && !tooLight(color_palette.darkVibrant, light)) {
		return color_palette.darkVibrant!;
	}
	if (!tooDark(color_palette.darkMuted, dark) && !tooLight(color_palette.darkMuted, light)) {
		return color_palette.darkMuted!;
	}
	if (!tooLight(color_palette.lightMuted, light) && !tooDark(color_palette.lightMuted, dark)) {
		return color_palette.lightMuted!;
	}

	return '';
}

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
	neutral = 'neutral',
	zinc = 'zinc',
	stone = 'stone',
	soho = 'soho',
	viva = 'viva',
	ocean = 'ocean',
}

export const themeColors: {
	title: keyof typeof TailwindColors;
	color: string;
}[] = [
	// Reds → Oranges → Yellows
	{ title: 'red', color: 'var(--color-red-6)' },
	{ title: 'tomato', color: 'var(--color-tomato-6)' },
	{ title: 'orange', color: 'var(--color-orange-6)' },
	{ title: 'amber', color: 'var(--color-amber-6)' },
	{ title: 'yellow', color: 'var(--color-yellow-6)' },

	// Greens
	{ title: 'lime', color: 'var(--color-lime-6)' },
	{ title: 'grass', color: 'var(--color-grass-6)' },
	{ title: 'green', color: 'var(--color-green-6)' },

	// Cyans → Blues
	{ title: 'mint', color: 'var(--color-mint-6)' },
	{ title: 'teal', color: 'var(--color-teal-6)' },
	{ title: 'cyan', color: 'var(--color-cyan-6)' },
	{ title: 'sky', color: 'var(--color-sky-6)' },
	{ title: 'blue', color: 'var(--color-blue-6)' },
	{ title: 'indigo', color: 'var(--color-indigo-6)' },

	// Purples → Pinks
	{ title: 'violet', color: 'var(--color-violet-6)' },
	{ title: 'purple', color: 'var(--color-purple-6)' },
	{ title: 'plum', color: 'var(--color-plum-6)' },
	{ title: 'pink', color: 'var(--color-pink-6)' },
	{ title: 'crimson', color: 'var(--color-crimson-6)' },

	// Browns
	{ title: 'bronze', color: 'var(--color-bronze-6)' },
	{ title: 'brown', color: 'var(--color-brown-6)' },
	{ title: 'gold', color: 'var(--color-gold-6)' },

	// Neutrals
	{ title: 'olive', color: 'var(--color-olive-6)' },
	{ title: 'sage', color: 'var(--color-sage-6)' },
	{ title: 'mauve', color: 'var(--color-mauve-6)' },
	{ title: 'sand', color: 'var(--color-sand-6)' },
];

export const surfaceColors: {
	title: keyof typeof TailwindColors;
	color: string;
}[] = [
	{ title: 'slate', color: 'var(--surface-slate-6)' },
	{ title: 'gray', color: 'var(--surface-gray-6)' },
	{ title: 'neutral', color: 'var(--surface-neutral-6)' },
	{ title: 'zinc', color: 'var(--surface-zinc-6)' },
	{ title: 'stone', color: 'var(--surface-stone-6)' },
	{ title: 'soho', color: 'var(--surface-soho-6)' },
	{ title: 'viva', color: 'var(--surface-viva-6)' },
	{ title: 'ocean', color: 'var(--surface-ocean-6)' },
];

export type ThemeColors = TailwindColors | 'custom';

export interface ColorList {
	key: string;
	value: number[];
}

export function setCustomColors(colors: ColorList[]) {
	if (!colors)
		return;
	Object.entries(colors)
		.map(color => setCustomColor(color[1].key, color[1].value));
}

export interface ImageBrightness {
	brightness: number;
	transparency: number;
	nonTransparentBrightness: number;
}

/**
 * Calculates the brightness and transparency of an image.
 * @param imageSrc - The source URL of the image.
 * @param cb - The callback function that receives an object with the `brightness`, `transparency`, and `nonTransparentBrightness` values.
 */
export function getImageBrightness(imageSrc: string, cb: (arg: ImageBrightness) => void) {
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

		const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
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

		const transparency
			= 100
				- Math.floor(
					(alphaSum / (img.naturalWidth * img.naturalHeight) / 255) * 100,
				);
		const brightness = Math.floor(
			(colorSum / (img.naturalWidth * img.naturalHeight) / 255) * 100,
		);
		const nonTransparentBrightness = Math.floor(
			(brightness / (100 - transparency)) * 100,
		);

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
}

export function RGBToHSL(r: number, g: number, b: number) {
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
		h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
		s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
		l: (100 * (2 * l - s)) / 2,
	};
}

export interface Color {
	red: number;
	green: number;
	blue: number;
}

export function isSimilarColor(color1: Color, color2: Color, threshold = 15): boolean {
	const distance = Math.sqrt(
		(color1.red - color2.red) ** 2
		+ (color1.green - color2.green) ** 2
		+ (color1.blue - color2.blue) ** 2,
	);

	return distance <= threshold;
}

export interface PaletteColors {
	darkMuted?: string;
	lightMuted?: string;
	darkVibrant?: string;
	lightVibrant?: string;
	primary?: string;
	dominant?: string;
}

export function getDominantColor(img: HTMLImageElement): PaletteColors {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;

	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, 0, 0, img.width, img.height);

	const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

	interface ColorMap {
		count: number;
		totalRGB: number;
		averageRGB: number;
		luminosity: number;
		hsl: {
			h: number;
			s: number;
			l: number;
		};
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

		if (rgba[3] === 0) {
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

	const colors: [string, ColorMap][] = Array.from(colorMap).sort(
		(a, b) => b[1].count - a[1].count,
	);
	const pColor = colors.splice(0, 1);
	const arr = [];
	arr.push(pColor[0][0]);

	const newColors = colors.sort((a, b) => a[1].hsl.l - b[1].hsl.l);
	const firstHalf = newColors.splice(0, newColors.length / 2);
	const secondHalf = newColors.splice(0, newColors.length);

	const ch = chunk(firstHalf, firstHalf.length / 2);
	const ch2 = chunk(secondHalf, secondHalf.length / 2);

	for (let i = 0; i < 2; i++) {
		arr.push(ch[i][0][0]);
	}
	for (let i = 0; i < 2; i++) {
		arr.push(ch2[i].reverse()[0][0]);
	}

	return {
		dominant: RGBString2hex(arr[0]),
		primary: RGBString2hex(arr[0]),
		darkMuted: RGBString2hex(arr[1]),
		darkVibrant: RGBString2hex(arr[2]),
		lightVibrant: RGBString2hex(arr[3]),
		lightMuted: RGBString2hex(arr[4]),
	};
}

export function hexLighter(hex?: string, luminosity?: number) {
	if (!hex)
		return;
	const rgb = hexToRgba(hex);
	const hsl = RGBToHSL(rgb.r, rgb.g, rgb.b);

	if (luminosity) {
		hsl.l += luminosity;
	}

	while (hsvaToHex({ h: hsl.h, s: hsl.s, v: hsl.l, a: 1 }).length !== 7) {
		hsl.l -= 1;
	}

	return hsvaToHex({ h: hsl.h, s: hsl.s, v: hsl.l, a: 1 });
}

export function hexDarker(hex: string, luminosity?: number): string {
	const rgb = hexToRgba(hex);
	const hsl = RGBToHSL(rgb.r, rgb.g, rgb.b);

	if (luminosity) {
		hsl.l -= luminosity;
	}

	while (hsvaToHex({ h: hsl.h, s: hsl.s, v: hsl.l, a: 1 }).length !== 7) {
		hsl.l += 1;
	}

	console.log(hsvaToHex({ h: hsl.h, s: hsl.s, v: hsl.l, a: 1 }));

	return hsvaToHex({ h: hsl.h, s: hsl.s, v: hsl.l, a: 1 });
}

export function hexOpacity(hex: string, opacity: number): string {
	const rgb = hexToRgba(hex);
	return `rgba(${rgb.r} ${rgb.g} ${rgb.b}/ ${opacity}%)`;
}

export function getGpuColor(gpu: string) {
	if (gpu.toLowerCase().includes('nvidia'))
		return green;
	if (gpu.toLowerCase().includes('amd'))
		return red;
	if (gpu.toLowerCase().includes('intel'))
		return blue;
	return gray;
}

export function getCpuColor(cpu: string) {
	if (cpu.toLowerCase().includes('amd'))
		return red;
	if (cpu.toLowerCase().includes('intel'))
		return blue;
	if (cpu.toLowerCase().includes('arm'))
		return brown;
	return gray;
}

export function getEdgeStyle(edgeStyle: EdgeStyle, opacity: number): string {
	const color = parseColorToHex('black', opacity);
	switch (edgeStyle) {
		case 'depressed':
			return `1px 1px 2px ${color}`;
		case 'dropShadow':
			return `2px 2px 4px ${color}`;
		case 'raised':
			return `-1px -1px 2px ${color}`;
		case 'uniform':
			return `0px 0px 4px ${color}`;
		case 'textShadow':
			return `${color} 0px 0px 4px, ${color} 0px 0px 4px, 
					${color} 0px 0px 4px, ${color} 0px 0px 4px, 
					${color} 0px 0px 4px, ${color} 0px 0px 4px, 
					${color} 0px 0px 4px`;
		default:
			return '';
	}
}

export const namedColors: Record<string, string> = {
	aliceblue: '#F0F8FF',
	antiquewhite: '#FAEBD7',
	aquamarine: '#7FFFD4',
	azure: '#F0FFFF',
	beige: '#F5F5DC',
	bisque: '#FFE4C4',
	black: '#000000',
	blanchedalmond: '#FFEBCD',
	blue: '#0000FF',
	blueviolet: '#8A2BE2',
	brown: '#A52A2A',
	burlywood: '#DEB887',
	cadetblue: '#5F9EA0',
	chartreuse: '#7FFF00',
	chocolate: '#D2691E',
	coral: '#FF7F50',
	cornflowerblue: '#6495ED',
	cornsilk: '#FFF8DC',
	crimson: '#DC143C',
	cyan: '#00FFFF',
	darkblue: '#00008B',
	darkcyan: '#008B8B',
	darkgoldenrod: '#B8860B',
	darkgray: '#A9A9A9',
	darkgreen: '#006400',
	darkkhaki: '#BDB76B',
	darkmagenta: '#8B008B',
	darkolivegreen: '#556B2F',
	darkorange: '#FF8C00',
	darkorchid: '#9932CC',
	darkred: '#8B0000',
	darksalmon: '#E9967A',
	darkseagreen: '#8FBC8F',
	darkslateblue: '#483D8B',
	darkslategray: '#2F4F4F',
	darkturquoise: '#00CED1',
	darkviolet: '#9400D3',
	deeppink: '#FF1493',
	deepskyblue: '#00BFFF',
	dimgray: '#696969',
	dodgerblue: '#1E90FF',
	firebrick: '#B22222',
	floralwhite: '#FFFAF0',
	forestgreen: '#228B22',
	fuchsia: '#FF00FF',
	gainsboro: '#DCDCDC',
	ghostwhite: '#F8F8FF',
	gold: '#FFD700',
	goldenrod: '#DAA520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#ADFF2F',
	honeydew: '#F0FFF0',
	hotpink: '#FF69B4',
	indianred: '#CD5C5C',
	indigo: '#4B0082',
	ivory: '#FFFFF0',
	khaki: '#F0E68C',
	lavender: '#E6E6FA',
	lavenderblush: '#FFF0F5',
	lawngreen: '#7CFC00',
	lemonchiffon: '#FFFACD',
	lightblue: '#ADD8E6',
	lightcoral: '#F08080',
	lightcyan: '#E0FFFF',
	lightgoldenrodyellow: '#FAFAD2',
	lightgray: '#D3D3D3',
	lightgreen: '#90EE90',
	lightpink: '#FFB6C1',
	lightsalmon: '#FFA07A',
	lightseagreen: '#20B2AA',
	lightskyblue: '#87CEFA',
	lightslategray: '#778899',
	lightsteelblue: '#B0C4DE',
	lightyellow: '#FFFFE0',
	lime: '#00FF00',
	limegreen: '#32CD32',
	linen: '#FAF0E6',
	magenta: '#FF00FF',
	maroon: '#800000',
	mediumaquamarine: '#66CDAA',
	mediumblue: '#0000CD',
	mediumorchid: '#BA55D3',
	mediumpurple: '#9370DB',
	mediumseagreen: '#3CB371',
	mediumslateblue: '#7B68EE',
	mediumspringgreen: '#00FA9A',
	mediumturquoise: '#48D1CC',
	mediumvioletred: '#C71585',
	midnightblue: '#191970',
	mintcream: '#F5FFFA',
	mistyrose: '#FFE4E1',
	moccasin: '#FFE4B5',
	navajowhite: '#FFDEAD',
	navy: '#000080',
	oldlace: '#FDF5E6',
	olive: '#808000',
	olivedrab: '#6B8E23',
	orange: '#FFA500',
	orangered: '#FF4500',
	orchid: '#DA70D6',
	palegoldenrod: '#EEE8AA',
	palegreen: '#98FB98',
	paleturquoise: '#AFEEEE',
	palevioletred: '#DB7093',
	papayawhip: '#FFEFD5',
	peachpuff: '#FFDAB9',
	peru: '#CD853F',
	pink: '#FFC0CB',
	plum: '#DDA0DD',
	powderblue: '#B0E0E6',
	purple: '#800080',
	rebeccapurple: '#663399',
	red: '#FF0000',
	rosybrown: '#BC8F8F',
	royalblue: '#4169E1',
	saddlebrown: '#8B4513',
	salmon: '#FA8072',
	sandybrown: '#F4A460',
	seagreen: '#2E8B57',
	seashell: '#FFF5EE',
	sienna: '#A0522D',
	silver: '#C0C0C0',
	skyblue: '#87CEEB',
	slateblue: '#6A5ACD',
	slategray: '#708090',
	snow: '#FFFAFA',
	springgreen: '#00FF7F',
	steelblue: '#4682B4',
	tan: '#D2B48C',
	teal: '#008080',
	thistle: '#D8BFD8',
	tomato: '#FF6347',
	turquoise: '#40E0D0',
	violet: '#EE82EE',
	wheat: '#F5DEB3',
	white: '#FFFFFF',
	whitesmoke: '#F5F5F5',
	yellow: '#FFFF00',
	yellowgreen: '#9ACD32',
};

export function parseColorToHex(color: string, opacity: number = 1): string | null {
	const ctx = document.createElement('canvas').getContext('2d');
	if (!ctx)
		return null;

	if (color.toLowerCase() === 'transparent') {
		return '#00000000';
	}

	// Handle named colors
	if (namedColors[color.toLowerCase()]) {
		return normalizeHex(namedColors[color.toLowerCase()], opacity);
	}

	// Handle other color formats
	ctx.fillStyle = color;
	const computedColor = ctx.fillStyle;

	// Convert RGB(A) to hex
	if (computedColor.startsWith('rgb')) {
		return rgbToHex(computedColor, opacity);
	}

	// Convert HSL(A) to hex
	if (computedColor.startsWith('hsl')) {
		return hslToHex(computedColor, opacity);
	}

	// Handle hex format
	if (/^#[0-9A-F]{3,8}$/i.test(computedColor)) {
		return normalizeHex(computedColor, opacity);
	}

	return computedColor;
}

export function rgbToHex(rgb: string, opacity: number): string {
	const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
	if (!match)
		return '#00000000';

	const r = Number(match[1]);
	const g = Number(match[2]);
	const b = Number(match[3]);
	const a = match[4] !== undefined ? Number(match[4]) : opacity;

	const alpha = Math.round(a * 255)
		.toString(16)
		.padStart(2, '0')
		.toUpperCase();

	return (
		`#${
			r.toString(16).padStart(2, '0').toUpperCase()
		}${g.toString(16).padStart(2, '0').toUpperCase()
		}${b.toString(16).padStart(2, '0').toUpperCase()
		}${alpha}`
	);
}

export function hslToHex(hsl: string, opacity: number): string {
	const match = hsl.match(/\d+/g);
	if (!match || match.length < 3)
		return '#00000000';

	let [h, s, l] = match.map(Number);
	s /= 100;
	l /= 100;

	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) =>
		Math.round(
			(l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255,
		);

	const alpha = Math.round(opacity * 255)
		.toString(16)
		.padStart(2, '0')
		.toUpperCase();
	return `#${f(0).toString(16).padStart(2, '0')}${f(8)
		.toString(16)
		.padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}${alpha}`;
}

export function normalizeHex(hex: string, opacity: number): string {
	if (hex.length === 4) {
		hex
			= `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase();
	}
	if (hex.length === 7) {
		const alpha = Math.round(opacity * 255)
			.toString(16)
			.padStart(2, '0')
			.toUpperCase();
		return hex.toUpperCase() + alpha;
	}
	return hex.toUpperCase();
}
