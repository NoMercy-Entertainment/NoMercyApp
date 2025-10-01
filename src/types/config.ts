import type { Message, Server } from '@/types/auth';

export type ColorScheme = 'dark' | 'light' | 'system';

export interface Component {
	id: string;
	component: string;
	props: Record<string, any>;
}

export interface AppConfig {
	status: string;
	data: AppConfigData;
}

export interface AppConfigData {
	id: string;
	name: string;
	email: string;
	currentServer: Server;
	locale: string;
	avatarUrl: string;
	admin: boolean;
	moderator: boolean;
	servers: Server[];
	messages: Message[];
	notifications: Message[];
	features: {
		[key: string]: boolean;
	};
}
