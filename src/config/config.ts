export const suffix = location.hostname.includes('dev')
	|| location.hostname.includes('vscode')
	|| location.hostname.includes('12')
	|| location.hostname.includes('192')
	|| location.hostname.includes('localhost') ? '-dev' : '';
