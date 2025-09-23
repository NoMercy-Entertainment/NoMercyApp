import plugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';

type Entries<T> = {
	[K in keyof T]: [K, T[K]]
}[keyof T][];

export function mappedEntries<O>(input: O): Entries<O> {
	return Object.entries(input as any) as Entries<O>;
}

export const surfaceColorPalette = {
	// ocean: {
	// 	light: {
	// 		1: '#ffffff',
	// 		2: '#fbfcfc',
	// 		3: '#F7F9F8',
	// 		4: '#EFF3F2',
	// 		5: '#DADEDD',
	// 		6: '#B1B7B6',
	// 		7: '#828787',
	// 		8: '#5F7274',
	// 		9: '#415B61',
	// 		10: '#29444E',
	// 		11: '#183240',
	// 		12: '#0c1920',
	// 	},
	// 	dark: {
	// 		1: '#0c1920',
	// 		2: '#183240',
	// 		3: '#29444E',
	// 		4: '#415B61',
	// 		5: '#5F7274',
	// 		6: '#828787',
	// 		7: '#B1B7B6',
	// 		8: '#DADEDD',
	// 		9: '#EFF3F2',
	// 		10: '#F7F9F8',
	// 		11: '#fbfcfc',
	// 		12: '#ffffff',
	// 	},
	// },
	// slate: {
	// 	light: {
	// 		1: '#ffffff',
	// 		2: '#f8fafc',
	// 		3: '#f1f5f9',
	// 		4: '#e2e8f0',
	// 		5: '#cbd5e1',
	// 		6: '#94a3b8',
	// 		7: '#64748b',
	// 		8: '#475569',
	// 		9: '#334155',
	// 		10: '#1e293b',
	// 		11: '#0f172a',
	// 		12: '#020617',
	// 	},
	// 	dark: {
	// 		1: '#020617',
	// 		2: '#0f172a',
	// 		3: '#1e293b',
	// 		4: '#334155',
	// 		5: '#475569',
	// 		6: '#64748b',
	// 		7: '#94a3b8',
	// 		8: '#cbd5e1',
	// 		9: '#e2e8f0',
	// 		10: '#f1f5f9',
	// 		11: '#f8fafc',
	// 		12: '#ffffff',
	// 	},
	// },
	// viva: {
	// 	light: {
	// 		1: '#ffffff',
	// 		2: '#f3f3f3',
	// 		3: '#e7e7e8',
	// 		4: '#cfd0d0',
	// 		5: '#b7b8b9',
	// 		6: '#9fa1a1',
	// 		7: '#87898a',
	// 		8: '#6e7173',
	// 		9: '#565a5b',
	// 		10: '#3e4244',
	// 		11: '#262b2c',
	// 		12: '#0e1315',
	// 	},
	// 	dark: {
	// 		1: '#0e1315',
	// 		2: '#262b2c',
	// 		3: '#3e4244',
	// 		4: '#565a5b',
	// 		5: '#6e7173',
	// 		6: '#87898a',
	// 		7: '#9fa1a1',
	// 		8: '#b7b8b9',
	// 		9: '#cfd0d0',
	// 		10: '#e7e7e8',
	// 		11: '#f3f3f3',
	// 		12: '#ffffff',
	// 	},
	// },
	// soho: {
	// 	light: {
	// 		1: '#ffffff',
	// 		2: '#ececec',
	// 		3: '#dedfdf',
	// 		4: '#c4c4c6',
	// 		5: '#adaeb0',
	// 		6: '#97979b',
	// 		7: '#7f8084',
	// 		8: '#6a6b70',
	// 		9: '#55565b',
	// 		10: '#3f4046',
	// 		11: '#2c2c34',
	// 		12: '#16161d',
	// 	},
	// 	dark: {
	// 		1: '#16161d',
	// 		2: '#2c2c34',
	// 		3: '#3f4046',
	// 		4: '#55565b',
	// 		5: '#6a6b70',
	// 		6: '#7f8084',
	// 		7: '#97979b',
	// 		8: '#adaeb0',
	// 		9: '#c4c4c6',
	// 		10: '#dedfdf',
	// 		11: '#ececec',
	// 		12: '#ffffff',
	// 	},
	// },
	// stone: {
	// 	light: {
	// 		1: '#ffffff',
	// 		2: '#fafaf9',
	// 		3: '#f5f5f4',
	// 		4: '#e7e5e4',
	// 		5: '#d6d3d1',
	// 		6: '#a8a29e',
	// 		7: '#78716c',
	// 		8: '#57534e',
	// 		9: '#44403c',
	// 		10: '#292524',
	// 		11: '#1c1917',
	// 		12: '#0c0a09',
	// 	},
	// 	dark: {
	// 		1: '#0c0a09',
	// 		2: '#1c1917',
	// 		3: '#292524',
	// 		4: '#44403c',
	// 		5: '#57534e',
	// 		6: '#78716c',
	// 		7: '#a8a29e',
	// 		8: '#d6d3d1',
	// 		9: '#e7e5e4',
	// 		10: '#f5f5f4',
	// 		11: '#fafaf9',
	// 		12: '#ffffff',
	// 	},
	// },
	// neutral: {
	// 	light: {
	// 		1: '#ffffff',
	// 		2: '#fafafa',
	// 		3: '#f5f5f5',
	// 		4: '#e5e5e5',
	// 		5: '#d4d4d4',
	// 		6: '#a3a3a3',
	// 		7: '#737373',
	// 		8: '#525252',
	// 		9: '#404040',
	// 		10: '#262626',
	// 		11: '#171717',
	// 		12: '#0a0a0a',
	// 	},
	// 	dark: {
	// 		1: '#0a0a0a',
	// 		2: '#171717',
	// 		3: '#262626',
	// 		4: '#404040',
	// 		5: '#525252',
	// 		6: '#737373',
	// 		7: '#a3a3a3',
	// 		8: '#d4d4d4',
	// 		9: '#e5e5e5',
	// 		10: '#f5f5f5',
	// 		11: '#fafafa',
	// 		12: '#ffffff',
	// 	},
	// },
	// zinc: {
	// 	light: {
	// 		1: '#ffffff',
	// 		2: '#fafafa',
	// 		3: '#f4f4f5',
	// 		4: '#e4e4e7',
	// 		5: '#d4d4d8',
	// 		6: '#a1a1aa',
	// 		7: '#71717a',
	// 		8: '#52525b',
	// 		9: '#3f3f46',
	// 		10: '#27272a',
	// 		11: '#18181b',
	// 		12: '#09090b',
	// 	},
	// 	dark: {
	// 		1: '#09090b',
	// 		2: '#18181b',
	// 		3: '#27272a',
	// 		4: '#3f3f46',
	// 		5: '#52525b',
	// 		6: '#71717a',
	// 		7: '#a1a1aa',
	// 		8: '#d4d4d8',
	// 		9: '#e4e4e7',
	// 		10: '#f4f4f5',
	// 		11: '#fafafa',
	// 		12: '#ffffff',
	// 	},
	// },
	// gray: {
	// 	light: {
	// 		1: '#ffffff',
	// 		2: '#f9fafb',
	// 		3: '#f3f4f6',
	// 		4: '#e5e7eb',
	// 		5: '#d1d5db',
	// 		6: '#9ca3af',
	// 		7: '#6b7280',
	// 		8: '#4b5563',
	// 		9: '#374151',
	// 		10: '#1f2937',
	// 		11: '#111827',
	// 		12: '#030712',
	// 	},
	// 	dark: {
	// 		1: '#030712',
	// 		2: '#111827',
	// 		3: '#1f2937',
	// 		4: '#374151',
	// 		5: '#4b5563',
	// 		6: '#6b7280',
	// 		7: '#9ca3af',
	// 		8: '#d1d5db',
	// 		9: '#e5e7eb',
	// 		10: '#f3f4f6',
	// 		11: '#f9fafb',
	// 		12: '#ffffff',
	// 	},
	// },

	neutral: {
		light: {
			1: 'oklch(from var(--color-theme-1) l var(--surface-strength, 0%) h)',
			2: 'oklch(from var(--color-theme-2) l var(--surface-strength, 0%) h)',
			3: 'oklch(from var(--color-theme-3) l var(--surface-strength, 0%) h)',
			4: 'oklch(from var(--color-theme-4) l var(--surface-strength, 0%) h)',
			5: 'oklch(from var(--color-theme-5) l var(--surface-strength, 0%) h)',
			6: 'oklch(from var(--color-theme-6) l var(--surface-strength, 0%) h)',
			7: 'oklch(from var(--color-theme-7) l var(--surface-strength, 0%) h)',
			8: 'oklch(from var(--color-theme-8) l var(--surface-strength, 0%) h)',
			9: 'oklch(from var(--color-theme-9) l var(--surface-strength, 0%) h)',
			10: 'oklch(from var(--color-theme-10) l var(--surface-strength, 0%) h)',
			11: 'oklch(from var(--color-theme-11) l var(--surface-strength, 0%) h)',
			12: 'oklch(from var(--color-theme-12) l var(--surface-strength, 0%) h)',
		},
		dark: {
			1: 'oklch(from var(--color-theme-1) l var(--surface-strength, 0%) h)',
			2: 'oklch(from var(--color-theme-2) l var(--surface-strength, 0%) h)',
			3: 'oklch(from var(--color-theme-3) l var(--surface-strength, 0%) h)',
			4: 'oklch(from var(--color-theme-4) l var(--surface-strength, 0%) h)',
			5: 'oklch(from var(--color-theme-5) l var(--surface-strength, 0%) h)',
			6: 'oklch(from var(--color-theme-6) l var(--surface-strength, 0%) h)',
			7: 'oklch(from var(--color-theme-7) l var(--surface-strength, 0%) h)',
			8: 'oklch(from var(--color-theme-8) l var(--surface-strength, 0%) h)',
			9: 'oklch(from var(--color-theme-9) l var(--surface-strength, 0%) h)',
			10: 'oklch(from var(--color-theme-10) l var(--surface-strength, 0%) h)',
			11: 'oklch(from var(--color-theme-11) l var(--surface-strength, 0%) h)',
			12: 'oklch(from var(--color-theme-12) l var(--surface-strength, 0%) h)',
		},
	},
};

export const surfaceLightColors = Object.fromEntries(
	mappedEntries(surfaceColorPalette).map(([k, v]) => [k, v.light]),
);

export const surfaceDarkColors = Object.fromEntries(
	mappedEntries(surfaceColorPalette).map(([k, v]) => [k, v.dark]),
);

// export const surfaceColors = Object.fromEntries(
// 	mappedEntries(surfaceColorPalette).map(([color, { light }]) => [
// 		color,
// 		Object.fromEntries(
// 			Object.keys(light).map(step => [`${step}`, `var(--surface-${step})`]),
// 		),
// 	]),
// );

// const scales = Array.from({ length: 12 }, (_, i) => String(i + 1));
// const surfacePlugin = plugin(({ addBase, matchUtilities, addUtilities, theme }: PluginAPI) => {
// 	const baseRules: Record<string, Record<string, string>> = {};
// 	const systemRules = {
// 		'@media (prefers-color-scheme: light)': {} as Record<string, Record<string, string>>,
// 		'@media (prefers-color-scheme: dark)': {} as Record<string, Record<string, string>>,
// 	};
//
// 	const rootVars = Object.fromEntries(
// 		mappedEntries(surfaceLightColors).map(([k, v]) => [`--${k}`, v]),
// 	);
//
// 	const darkRootVars = Object.fromEntries(
// 		mappedEntries(surfaceDarkColors).map(([k, v]) => [`--${k}`, v]),
// 	);
//
// 	addBase({
// 		':root, .scheme-light': {
// 			...rootVars,
// 		},
// 		'.scheme-dark': {
// 			...darkRootVars,
// 		},
// 		'@media (prefers-color-scheme: dark)': {
// 			':root:not(.scheme-light):not(.scheme-dark)': {
// 				...darkRootVars,
// 			},
// 		},
// 	});
//
// 	for (const [name, modes] of Object.entries(surfaceColorPalette)) {
// 		const lightVars: Record<string, string> = {};
// 		const darkVars: Record<string, string> = {};
//
// 		for (const step of scales) {
// 			lightVars[`--surface-${step}`] = modes.light[step as unknown as keyof typeof modes.light];
// 			darkVars[`--surface-${step}`] = modes.dark[step as unknown as keyof typeof modes.dark];
// 		}
//
// 		const selLight = [
// 			`.surface-${name}.scheme-light`,
// 			`.scheme-light:not(:is(html)):not(:is(.scheme-dark))`,
// 			`.scheme-light:not(:is(html)):not(:is(.scheme-dark)) *`,
// 		].join(', ');
//
// 		const selDark = [
// 			`.surface-${name}.scheme-dark`,
// 			`.scheme-dark:not(:is(html)):not(:is(.scheme-light))`,
// 			`.scheme-dark:not(:is(html)):not(:is(.scheme-light)) *`,
// 		].join(', ');
//
// 		const selSystem = [
// 			`.surface-${name}.scheme-system`,
// 			`.scheme-system:not(:is(html)):not(:is(.scheme-light, .scheme-dark))`,
// 			`.scheme-system:not(:is(html)):not(:is(.scheme-light, .scheme-dark)) *`,
// 		].join(', ');
//
// 		baseRules[selLight] = lightVars;
// 		baseRules[selDark] = darkVars;
// 		systemRules['@media (prefers-color-scheme: light)'][selSystem] = lightVars;
// 		systemRules['@media (prefers-color-scheme: dark)'][selSystem] = darkVars;
// 	}
//
// 	addBase({
// 		':root': rootVars,
// 		'.scheme-dark': darkRootVars,
// 		...baseRules,
// 		...systemRules,
// 	});
//
// 	const rootLight: Record<string, string> = {};
// 	const rootDark: Record<string, string> = {};
//
// 	// Flatten every palette’s vars into a single set
// 	for (const [name, modes] of Object.entries(surfaceColorPalette)) {
// 		for (const step of scales) {
// 			rootLight[`--surface-${step}`] = modes.light[step as unknown as keyof typeof modes.light];
// 			rootDark[`--surface-${step}`] = modes.dark[step as unknown as keyof typeof modes.light];
// 		}
//
// 		addBase({
// 			':root': rootLight,
// 			[`.theme-${name}.scheme-light, .theme-${name} .scheme-light`]: rootLight,
// 			[`.theme-${name}.scheme-dark, .theme-${name} .scheme-dark`]: rootDark,
// 			'@media (prefers-color-scheme: dark)': {
// 				[`.theme-${name}:not(.scheme-light):not(.scheme-dark), .theme-${name} :not(.scheme-light):not(.scheme-dark)`]: rootDark,
// 			},
// 			'@media (prefers-color-scheme: light)': {
// 				[`.theme-${name}:not(.scheme-light):not(.scheme-dark), .theme-${name} :not(.scheme-light):not(.scheme-dark)`]: rootLight,
// 			},
// 		});
// 	}
//
// 	// Always emit these vars on :root
// 	// addBase({
// 	// 	':root': rootLight,
// 	// 	'@media (prefers-color-scheme: dark)': {
// 	// 		':root': rootDark,
// 	// 	},
// 	// });
// },	{
// });

interface Modes { light: Record<string, string>; dark: Record<string, string> }

function flattenSurfaces(colors: Record<string, Modes>): Record<string, Modes> {
	const out: Record<string, Modes> = {};
	for (const [name, modes] of Object.entries(colors)) {
		out[name.toLowerCase()] = modes;
	}
	return out;
}

export const surfaceColors = flattenSurfaces(surfaceColorPalette);

export const surfacePlugin = plugin(({ addBase }: PluginAPI) => {
	const STEPS = Array.from({ length: 12 }, (_, i) => String(i + 1));

	const baseRules: Record<string, Record<string, string>> = {};
	const systemRules: Record<string, Record<string, Record<string, string>>> = {
		'@media (prefers-color-scheme: light)': {},
		'@media (prefers-color-scheme: dark)': {},
	};

	for (const [name] of Object.entries(surfaceColors)) {
		const lightVars: Record<string, string> = {};
		const darkVars: Record<string, string> = {};

		for (const step of STEPS) {
			lightVars[`--surface-${step}`] = `var(--color-${name}-${step})`;
			darkVars[`--surface-${step}`] = `var(--color-${name}-${step})`;
		}

		const selLight = `.theme-${name}.scheme-light, .scheme-light .theme-${name}:not(.scheme-dark)`;
		const selDark = `.theme-${name}.scheme-dark, .scheme-dark .theme-${name}:not(.scheme-light)`;
		const selSystem = `.theme-${name}.scheme-system, .scheme-system .theme-${name}:not(:is(.scheme-light, .scheme-dark))`;

		baseRules[selLight] = lightVars;
		baseRules[selDark] = darkVars;
		systemRules['@media (prefers-color-scheme: light)'][selSystem] = lightVars;
		systemRules['@media (prefers-color-scheme: dark)'][selSystem] = darkVars;
	}

	const dynamicSurfaceLight: Record<string, string> = {};
	const dynamicSurfaceDark: Record<string, string> = {};
	const saturationValues = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12];

	for (let i = 0; i < 12; i++) {
		const step = i + 1;
		const s = saturationValues[i];
		dynamicSurfaceLight[`--surface-${step}`] = `oklch(from var(--theme) l ${s} h)`;
		dynamicSurfaceDark[`--surface-${step}`] = `oklch(from var(--theme) l ${s} h)`;
	}

	baseRules['[style*="--theme:"]:is(.scheme-light, .scheme-system)'] = { ...baseRules['[style*="--theme:"]:is(.scheme-light, .scheme-system)'], ...dynamicSurfaceLight };
	baseRules['[style*="--theme:"].scheme-dark'] = { ...baseRules['[style*="--theme:"].scheme-dark'], ...dynamicSurfaceDark };
	systemRules['@media (prefers-color-scheme: light)']['[style*="--theme:"].scheme-system'] = { ...systemRules['@media (prefers-color-scheme: light)']['[style*="--theme:"].scheme-system'], ...dynamicSurfaceLight };
	systemRules['@media (prefers-color-scheme: dark)']['[style*="--theme:"].scheme-system'] = { ...systemRules['@media (prefers-color-scheme: dark)']['[style*="--theme:"].scheme-system'], ...dynamicSurfaceDark };

	addBase({
		...baseRules,
		...systemRules,
	});
});

export default surfacePlugin;
