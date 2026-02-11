// tailwind-plugin-theme.ts
import plugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';
import type { Config } from './tokens';

import lightConfigRaw from './Primitives.Light.tokens.json';
import darkConfigRaw from './Primitives.Dark.tokens.json';

const lightConfig = lightConfigRaw as unknown as Config;
const darkConfig = darkConfigRaw as unknown as Config;

interface Modes {
	light: Record<string, string>;
	dark: Record<string, string>;
}

type Entries<T> = {
	[K in keyof T]: [K, T[K]]
}[keyof T][];

export function mappedEntries<O>(input: O): Entries<O> {
	return Object.entries(input as any) as Entries<O>;
}

function flattenColors(colors: Config['Colors']): Record<string, Modes> {
	const out: Record<string, Modes> = {};

	for (const [colorName, color] of mappedEntries(colors)) {
		if (colorName === 'OverlayBlackAlpha' || colorName === 'OverlayWhiteAlpha')
			continue;

		const name = colorName.toLowerCase();
		const lightSolid = lightConfig.Colors[colorName].Solid;
		const darkSolid = darkConfig.Colors[colorName].Solid;

		const light: Record<string, string> = {};
		const dark: Record<string, string> = {};

		for (const step of Object.keys(lightSolid)) {
			light[step] = lightSolid[step].$value;
			dark[step] = darkSolid[step].$value;
		}

		out[name] = { light, dark };
	}

	return out;
}

export const colorPalette = flattenColors(lightConfig.Colors);

export const lightColors = Object.fromEntries(
	mappedEntries(colorPalette).map(([k, v]) => [k, v.light]),
);

export const darkColors = Object.fromEntries(
	mappedEntries(colorPalette).map(([k, v]) => [k, v.dark]),
);

export const themeColors = Object.fromEntries(
	mappedEntries(colorPalette).map(([color, { light }]) => [
		color,
		Object.fromEntries(
			Object.keys(light).map(step => [`${step}`, `var(--color-${color}-${step})`]),
		),
	]),
);

export default plugin(({ addBase, addUtilities }: PluginAPI) => {
	const STEPS = Array.from({ length: 12 }, (_, i) => String(i + 1));

	const baseRules: Record<string, Record<string, string>> = {};
	const systemRules = {
		'@media (prefers-color-scheme: light)': {} as Record<string, Record<string, string>>,
		'@media (prefers-color-scheme: dark)': {} as Record<string, Record<string, string>>,
	};

	for (const [name, modes] of mappedEntries(colorPalette)) {
		const lightVars: Record<string, string> = {};
		const darkVars: Record<string, string> = {};

		for (const step of STEPS) {
			lightVars[`--color-theme-${step}`] = modes.light[step];
			lightVars[`--color-${name}-${step}`] = modes.light[step];
			darkVars[`--color-theme-${step}`] = modes.dark[step];
			darkVars[`--color-${name}-${step}`] = modes.dark[step];
		}

		const selLight = [
			`.theme-${name}.scheme-light`,
			`.scheme-light .theme-${name}:not(:is(.scheme-dark))`,
			`.theme-${name}:not(:is(.scheme-dark)):not(:is(html))`,
			`.theme-${name} .scheme-light:not(:is(html)):not(:is(.scheme-dark))`,
			`.theme-${name} .scheme-light:not(:is(html)):not(:is(.scheme-dark)) *`,
		].join(', ');

		const selDark = [
			`.theme-${name}.scheme-dark`,
			`.scheme-dark .theme-${name}:not(:is(.scheme-light))`,
			`.theme-${name}:not(:is(.scheme-light)):not(:is(html))`,
			`.theme-${name} .scheme-dark:not(:is(html)):not(:is(.scheme-light))`,
			`.theme-${name} .scheme-dark:not(:is(html)):not(:is(.scheme-light)) *`,
		].join(', ');

		const selSystem = [
			`.theme-${name}.scheme-system`,
			`.scheme-system .theme-${name}:not(:is(.scheme-light, .scheme-dark))`,
			`.theme-${name}:not(:is(.scheme-light, .scheme-dark)):not(:is(html))`,
			`.theme-${name} .scheme-system:not(:is(html)):not(:is(.scheme-light, .scheme-dark))`,
			`.theme-${name} .scheme-system:not(:is(html)):not(:is(.scheme-light, .scheme-dark)) *`,
		].join(', ');

		baseRules[selLight] = lightVars;
		baseRules[selDark] = darkVars;
		systemRules['@media (prefers-color-scheme: light)'][selSystem] = lightVars;
		systemRules['@media (prefers-color-scheme: dark)'][selSystem] = darkVars;

		addBase({
			':root': lightVars,
			'@media (prefers-color-scheme: dark)': {
				':root': darkVars,
			},
		});
	}

	const dynamicThemeLight: Record<string, string> = {};
	const dynamicThemeDark: Record<string, string> = {};
	const lightnessValues = [0.97, 0.93, 0.89, 0.85, 0.80, 0.75, 0.69, 0.61, 0.5, 0.45, 0.39, 0.15];

	for (let i = 0; i < 12; i++) {
		const step = i + 1;
		const lightL = lightnessValues[i];
		const darkL = 1 - lightnessValues[11 - i];

		dynamicThemeLight[`--color-theme-${step}`] = `oklch(from var(--theme) ${lightL} c h)`;
		dynamicThemeDark[`--color-theme-${step}`] = `oklch(from var(--theme) ${darkL} c h)`;
	}

	baseRules['[style*="--theme:"]:is(.scheme-light, .scheme-system)'] = dynamicThemeLight;
	baseRules['[style*="--theme:"].scheme-dark'] = dynamicThemeDark;
	systemRules['@media (prefers-color-scheme: light)']['[style*="--theme:"].scheme-system'] = dynamicThemeLight;
	systemRules['@media (prefers-color-scheme: dark)']['[style*="--theme:"].scheme-system'] = dynamicThemeDark;

	addBase({
		...baseRules,
		...systemRules,
	});
}, {
});
