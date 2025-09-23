import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import selectorParser from 'postcss-selector-parser';
import markdownBase from './markdownStyles';
import radialGradientPlugin from './radialGradientPlugin';
// @ts-ignore
import safeArea from 'tailwindcss-safe-area-capacitor';
// @ts-ignore
import scrollBar from 'tailwind-scrollbar';
import animate from 'tailwindcss-animate';
import primeui from 'tailwindcss-primeui';
import colorsPlugin, { lightColors } from './colorsPlugin';
import surfacePlugin, { surfaceLightColors } from './surfacePlugin';

const scales = Array.from({ length: 12 }, (_, i) => String(i + 1));

export default {
	darkMode: ['variant', [
		'@media (prefers-color-scheme: dark) { &:not(.scheme-light *) }',
		'&:is(.scheme-dark *)',
	]],
	mode: 'jit',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
	theme: {
		...defaultTheme,
		presets: [],
		container: {
			'center': true,
			'padding': '2rem',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1400px',
			'3xl': '1800px',
			'4xl': '1920px',
			'5xl': '2200px',
			'6xl': '2800px',
		},
		screens: {
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			'3xl': '1800px',
			'4xl': '1920px',
			'5xl': '2200px',
			'6xl': '2800px',
			'tv': {
				min: '960px',
				max: '960px',
			},
		},
		fontSize: {
			'3xs': ['0.65rem', { lineHeight: '1.15rem' }],
			'2xs': ['0.75rem', { lineHeight: '1.25rem' }],
			'xs': ['0.8125rem', { lineHeight: '1.5rem' }],
			'sm': ['0.875rem', { lineHeight: '1.5rem' }],
			'base': ['1rem', { lineHeight: '1.75rem' }],
			'lg': ['1.125rem', { lineHeight: '1.75rem' }],
			'xl': ['1.25rem', { lineHeight: '1.75rem' }],
			'2xl': ['1.5rem', { lineHeight: '2rem' }],
			'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
			'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
			'5xl': ['3rem', { lineHeight: '1' }],
			'6xl': ['3.75rem', { lineHeight: '1' }],
			'7xl': ['4.5rem', { lineHeight: '1' }],
			'8xl': ['6rem', { lineHeight: '1' }],
			'9xl': ['8rem', { lineHeight: '1' }],
		},
		extend: {
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'rgb(from var(--radix-accordion-content-height)  r g b / <alpha-value>)' },
				},
				'accordion-up': {
					from: { height: 'rgb(from var(--radix-accordion-content-height)  r g b / <alpha-value>)' },
					to: { height: 0 },
				},
				'backAndForth': {
					'0%': {
						transform: 'translateX(0)',
						opacity: 0,
					},
					'5%': {
						transform: 'translateX(0)',
						opacity: 1,
					},
					'20%': {
						transform: 'translateX(0)',
						opacity: 1,
					},
					'80%': {
						transform: 'translateX(calc(-100% + var(--marquee-width, 250px)))',
						opacity: 1,
					},
					'98%': {
						transform: 'translateX(calc(-100% + var(--marquee-width, 250px)))',
						opacity: 1,
					},
					'99%': {
						transform: 'translateX(calc(-100% + var(--marquee-width, 250px)))',
						opacity: 0,
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: 0,
					},
				},
				'swing': {
					'0%': { transform: 'rotate(0)' },
					'20%': { transform: 'rotate(15deg)' },
					'20.01%': { transform: 'rotate(15deg)' },
					'80%': { transform: 'rotate(-15deg)' },
					'80.01%': { transform: 'rotate(-15deg)' },
					'100%': { transform: 'rotate(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'marquee': 'backAndForth 12s linear infinite',
				'pause': 'animation-play-state: paused',
				'swing': 'swing 0.5s infinite',
			},
			fontFamily: {
				// sans: ['Figtree', ...defaultTheme.fontFamily.sans],
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
			},
			fontWeight: {
				'theme-thin': '100',
				'theme-extralight': '200',
				'theme-light': '300',
				'theme-normal': '400',
				'theme-medium': '500',
				'theme-semibold': '600',
				'theme-bold': '700',
				'theme-extrabold': '800',
				'theme-black': '900',
			},
			zIndex: {
				999: '999',
				1099: '1099',
				1199: '1199',
			},
			outlineWidth: {
				80: '80px',
			},
			width: {
				inherit: 'inherit',
				nav: 'calc(100dvw - 15em)',
				available: [
					'-moz-available',
					'100%',
					'-webkit-fill-available',
					'stretch',
				],
				screen: ['100vw', '100dvw'],
			},
			height: {
				'inherit': 'inherit',
				'nav': 'calc(100dvh - 4rem)',
				'sidebar': 'calc(100dvh - 8rem)',
				'sidebar+': 'calc(100dvh - 9rem)',
				'available': [
					'-moz-available',
					'100%',
					'-webkit-fill-available',
					'stretch',
				],
				'screen': ['100vh', '100dvh'],
			},
			borderWidth: {
				1: '1px',
			},
			minHeight: {
				'inherit': 'inherit',
				'nav': 'calc(100dvh - 4rem)',
				'sidebar': 'calc(100dvh - 8rem)',
				'sidebar+': 'calc(100dvh - 9rem)',
				'available': [
					'-moz-available',
					'100%',
					'-webkit-fill-available',
					'stretch',
				],
				'screen': ['100vh', '100dvh'],
			},
			maxHeight: {
				'inherit': 'inherit',
				'nav': 'calc(100dvh - 4rem)',
				'sidebar': 'calc(100dvh - 8rem)',
				'sidebar+': 'calc(100dvh - 9rem)',
				'available': [
					'-moz-available',
					'100%',
					'-webkit-fill-available',
					'stretch',
				],
				'screen': ['100vh', '100dvh'],
			},
			minWidth: {
				inherit: 'inherit',
				nav: 'calc(100vw - 15em)',
				available: [
					'-moz-available',
					'100%',
					'-webkit-fill-available',
					'stretch',
				],
				screen: ['100vw', '100dvw'],
			},
			margin: {
				scrollbar: 'calc(var(--scrollbar-width) * 2)',
				// '58': 58 * 4,
			},
			padding: {
				scrollbar: 'calc(var(--scrollbar-width) * 2)',
				// '58': 58 * 4,
			},
			inset: {
				highlight: '0px -2px 0px rgba(0, 0, 0, 0.24)',
			},
			backgroundImage: {
				highlight:
                    'radial-gradient(81.87% 66.22% at 0% 0%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
				spotifyBottom:
                    'linear-gradient(0deg, oklch(from var(--color-theme-8) l c h / 0%) 0%, hsl(from var(--color-theme-8) h s 30%) 100%)',
				spotifyTop:
                    'linear-gradient(transparent 0,rgb(0,0,0,var(--bg-opacity, 0.5)) 100%),url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)',
			},
			boxShadow: {
				img: '#000 0px 32px 80px -24px',
				top: 'inset 0px 1px 0px rgb(255 255 255 / 24%)',
				bottom:
                    'inset 0px -1px 0px rgb(0 0 0 / 24%), inset 0px -2px 0px rgb(0 0 0 / 24%)',
				container: 'rgb(255 255 255 / 16%) 0px 1px 0px 0px inset',
				pill: 'inset 0px 1px 0px rgb(255 255 255 / 24%), inset 0px -1px 0px rgb(0 0 0 / 24%), inset 0px -2px 0px rgb(0 0 0 / 24%)',
				highlight: 'inset 0px 1px 0px rgba(255, 255, 255, 0.24)',
				footer:
                    'inset 0px -1px 0px rgba(0, 0, 0, 0.24), inset 0px -2px 0px rgba(0, 0, 0, 0.24)',
				card: 'inset 0px 1px 0px rgba(255, 255, 255, 0.24)',
				glow: '0 0 4px rgb(0 0 0 / 0.1)',
			},
			aspectRatio: {
				poster: '2 / 3',
				backdrop: '16 / 9',
			},
			maxWidth: {
				'lg': '33rem',
				'2xl': '40rem',
				'3xl': '50rem',
				'5xl': '66rem',
				'available': [
					'-moz-available',
					'100%',
					'-webkit-fill-available',
					'stretch',
				],
				'screen': ['100vw', '100dvw'],
			},
			transitionDuration: {
				0: '0ms',
				250: '250ms',
				420: '420ms',
			},
			transitionDelay: {
				0: '0ms',
				250: '250ms',
				420: '420ms',
			},
			transitionProperty: {
				'width': 'width',
				'height': 'height',
				'w-h': 'width, height',
				'w-h-m': 'width, height, margin',
				'w-h-p': 'width, height, padding',
				'w-h-m-p': 'width, height, margin, padding',
				'top': 'top',
				'right': 'right',
				'bottom': 'bottom',
				'left': 'left',
				'leftRight': 'left, right',
				'spacing': 'margin, padding',
				'scale': 'scale',
				'scaleTransform': 'scale, transform',
				'grid': 'grid',
			},
			gridTemplateColumns: {
				14: 'repeat(14, minmax(0, 1fr))',
				16: 'repeat(16, minmax(0, 1fr))',
			},
			transitionTimingFunction: {
				'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'ease': 'cubic-bezier(0,0,0.2,1)',
			},
			opacity: {
				...defaultTheme.opacity,
				1: '0%',
				2: '3%',
				3: '6%',
				4: '8%',
				5: '10%',
				6: '13%',
				7: '17%',
				8: '25%',
				9: '40%',
				10: '46%',
				11: '60%',
				12: '93%',
			},
			colors: {
				...lightColors,
				...surfaceLightColors,
				focus: 'rgb(from var(--color-theme-8, var(--color-theme-9)) r g b / <alpha-value>)',
				theme: {

					DEFAULT: 'rgb(from var(--color-theme-9, var(--color-theme-8)) r g b / <alpha-value>)',
					...Object.fromEntries(
						scales.map(step => [
							step,
							`rgb(from var(--color-theme-${step}) r g b / <alpha-value>)`,
						]),
					),
				},
				surface: {
					DEFAULT: 'rgb(from var(--surface-6) r g b / <alpha-value>)',
					...Object.fromEntries(
						scales.map(step => [
							step,
							`oklch(from var(--surface-${step}) l var(--surface-strength, 0%) h / <alpha-value>)`,
						]),
					),
				},
			},
		},
		dvh: defaultTheme.height,
		markdownBase,
	},
	supports: {},
	plugins: [
		colorsPlugin,
		surfacePlugin,
		// forms,
		scrollBar({ nocompatible: true }),
		animate,
		radialGradientPlugin,
		safeArea,
		primeui,
		plugin(({ addVariant }) => {
			addVariant('compact', '&[data-size="compact"]');
			addVariant('full', '&[data-size="full"]');
			addVariant('sidebar-open', '&[data-sidebar="open"]');
			addVariant('sidebar-closed', '&[data-sidebar="closed"]');
			addVariant('sidebar-hidden', '&[data-sidebar="hidden"]');
			addVariant('indexer-showing', '&[data-indexer="showing"]');
			addVariant('indexer-hidden', '&[data-indexer="hidden"]');
			addVariant('music-showing', '&[data-music="showing"]');
			addVariant('music-hidden', '&[data-music="hidden"]');
			addVariant('music-compact', '&[data-music="compact"]');
			addVariant('music-full', '&[data-music="full"]');
			addVariant('allchildren', '& *');
			// @ts-ignore
			addVariant('children', childrenVariant());
			// @ts-ignore
			addVariant('children-first', childrenVariant('first', ':first-child'));
			// @ts-ignore
			addVariant('children-last', childrenVariant('last', ':last-child'));
			// @ts-ignore
			addVariant('children-odd', childrenVariant('odd', ':nth-child(odd)'));
			// @ts-ignore
			addVariant('children-even', childrenVariant('even', ':nth-child(even)'));
			addVariant(
				'children-not-first',
				// @ts-ignore
				childrenVariant('not-first', ':not(:first-child)'),
			);
			addVariant(
				'children-not-last',
				// @ts-ignore
				childrenVariant('not-last', ':not(:last-child)'),
			);
			// @ts-ignore
			addVariant('children-hover', childrenVariant('hover'));
			// @ts-ignore
			addVariant('children-focus', childrenVariant('focus'));
			// @ts-ignore
			addVariant('children-focus-within', childrenVariant('focus-within'));
			// @ts-ignore
			addVariant('children-active', childrenVariant('active'));
			// @ts-ignore
			addVariant('children-visited', childrenVariant('visited'));
			// @ts-ignore
			addVariant('children-disabled', childrenVariant('disabled'));
		}),
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					vh: value => ({
						height: `${value
							.replace('rem', '')
							.replace('px', '')
							.replace('vh', '')
							.replace('%', '')}dvh`,
						maxHeight: `${value
							.replace('rem', '')
							.replace('px', '')
							.replace('vh', '')
							.replace('%', '')}dvh`,
					}),
				},
				{ values: theme('dvh') },
			);
		}),
		plugin(({ addUtilities }) => {
			addUtilities([
				{
					'.grid-cols-0': {
						'grid-template-columns': 'repeat(1, minmax(0, 0fr))',
					},
				},
				{
					'.grid-rows-0': { 'grid-template-rows': 'repeat(1, minmax(0, 0fr))' },
				},
			]);
		}),
	],
};

function childrenVariant(pseudoClass: string | null = null, childrenSelector: string | null = null) {
	childrenSelector = childrenSelector || (pseudoClass
		? `:${pseudoClass}`
		: '*');
	return ({ modifySelectors, separator }: any) => {
		return modifySelectors(({ selector }: any) => {
			return selectorParser((selectors) => {
				selectors.walkClasses((classNode) => {
					classNode.value = `children${
						pseudoClass ? separator + pseudoClass : ''
					}${separator}${classNode.value}`;
					classNode.parent?.insertAfter(
						classNode,
						selectorParser().astSync(` > ${childrenSelector}`),
					);
				});
			}).processSync(selector);
		});
	};
}
