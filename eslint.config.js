import antfu from '@antfu/eslint-config';

export default antfu({
	vue: {
		a11y: true,
		overrides: {
			'vue/no-deprecated-slot-attribute': 'off',
			'vue/multi-word-component-names': 'off',
			'vue/no-reserved-component-names': 'off',
		},
	},
	typescript: {
		overrides: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
		},
	},
	js: {
		overrides: {
			'no-console': 'off',
			'no-debugger': 'off',
		},
	},
	stylistic: {
		indent: 'tab',
		quotes: 'single',
		semi: true,
	},
	formatters: {
		css: true,
		html: true,
		markdown: 'prettier',
		svg: false,
	},
});

// module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   'extends': [
//     'plugin:vue/vue3-essential',
//     'eslint:recommended',
//     '@vue/typescript/recommended',
//   ],
//   parserOptions: {
//     ecmaVersion: 2020
//   },
//   rules: {
//     'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'vue/no-deprecated-slot-attribute': 'off',
//     'vue/multi-word-component-names': 'off',
//     'vue/no-reserved-component-names': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     '@typescript-eslint/ban-ts-comment': 'off',
//   }
// }
