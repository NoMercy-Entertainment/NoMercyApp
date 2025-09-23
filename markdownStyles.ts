import defaultTheme from 'tailwindcss/defaultTheme';

const markdownBase = {
	h1: {
		fontSize: defaultTheme.fontSize['4xl'],
		fontWeight: defaultTheme.fontWeight.bold,
		marginTop: 0,
		marginBottom: defaultTheme.spacing[2],
	},

	h2: {
		fontSize: defaultTheme.fontSize['3xl'],
		fontWeight: defaultTheme.fontWeight.bold,
		marginTop: 0,
		marginBottom: defaultTheme.spacing[2],
	},

	h3: {
		fontSize: defaultTheme.fontSize['2xl'],
		fontWeight: defaultTheme.fontWeight.bold,
		marginTop: 0,
		marginBottom: defaultTheme.spacing[2],
	},

	h4: {
		fontSize: defaultTheme.fontSize.xl,
		fontWeight: defaultTheme.fontWeight.bold,
		marginTop: 0,
		marginBottom: defaultTheme.spacing[2],
	},

	h5: {
		fontSize: defaultTheme.fontSize.lg,
		fontWeight: defaultTheme.fontWeight.bold,
		marginTop: 0,
		marginBottom: defaultTheme.spacing[2],
	},

	h6: {
		fontSize: defaultTheme.fontSize.base,
		fontWeight: defaultTheme.fontWeight.bold,
		marginTop: 0,
		marginBottom: defaultTheme.spacing[2],
	},

	p: {
		marginTop: 0,
		marginBottom: defaultTheme.spacing[2],
	},

	li: {
		marginTop: 0,
		marginBottom: defaultTheme.spacing[2],
	},

	a: {
		'color': 'var(--color-theme-8)',
		'textDecoration': 'none',
		'&:hover': {
			color: 'var(--color-theme-8)',
			textDecoration: 'none',
		},
	},

	blockquote: {
		borderLeftWidth: defaultTheme.borderWidth[4],
		fontWeight: defaultTheme.fontWeight.normal,
		fontStyle: 'italic',
		marginTop: defaultTheme.spacing[8],
		marginBottom: defaultTheme.spacing[8],
		paddingLeft: defaultTheme.spacing[6],
		fontSize: defaultTheme.fontSize.lg,
	},

	code: {
		paddingLeft: defaultTheme.spacing[2],
		paddingRight: defaultTheme.spacing[2],
		paddingTop: defaultTheme.spacing.px,
		paddingBottom: defaultTheme.spacing.px,
		fontSize: defaultTheme.fontSize.sm,
	},

	hr: {
		marginTop: defaultTheme.spacing[1],
		marginBottom: defaultTheme.spacing[1],
		borderRadius: defaultTheme.borderRadius.full,
	},

	ul: {
		listStyleType: defaultTheme.listStyleType.disc,
		listStylePosition: 'inside',
		marginTop: defaultTheme.spacing[4],
		marginBottom: defaultTheme.spacing[4],
	},

	ol: {
		listStyleType: defaultTheme.listStyleType.decimal,
		listStylePosition: 'inside',
		marginTop: defaultTheme.spacing[4],
		marginBottom: defaultTheme.spacing[4],
	},

	table: {
		width: '100%',
		marginBottom: '1rem',
		padding: 0,
		borderCollapse: 'collapse',
		tr: {
			'margin': 0,
			'padding': 0,
			'&:nth-child(2n)': {},
			'th': {
				'fontWeight': defaultTheme.fontWeight.bold,
				'textAlign': 'left',
				'margin': 0,
				'padding': '6px 13px',
				'&:first-child': {
					marginTop: 0,
				},
				'&:last-child': {
					marginBottom: 0,
				},
			},
			'td': {
				'textAlign': 'left',
				'margin': 0,
				'padding': '6px 13px',
				'&:first-child': {
					marginTop: 0,
				},
				'&:last-child': {
					marginBottom: 0,
				},
			},
		},
	},
};

export default markdownBase;
