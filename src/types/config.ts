
export type ColorScheme = 'dark' | 'light' | 'system';

export interface Component {
	id: string;
	component: string;
	props: Record<string, any>;
}
