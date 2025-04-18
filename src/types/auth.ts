import { DeviceIcons } from '@Icons/icons';

export interface User {
	accessToken: string;
	refreshToken: string;
	refreshIn: number;
	expiresIn: number;
	idToken: string;
	name: string;
	email: string;
	id: string;
	avatarUrl: string;
	locale: string | null;
	moderator: boolean;
	servers: Server[];
	currentServer: Server;
	receivedMessages: Message[];
	sendMessages: Message[];
	notifications: Message[];
}

export interface Server {
	id: string;
	user_id: string;
	server_name: string;
	server_version: string;
	platform: keyof typeof DeviceIcons;
	online: boolean;
	external_ip: string;
	internal_ip: string;
	internal_port: string;
	external_port: string;
	internal_domain: string;
	external_domain: string;
	serverApiUrl: string;
	serverBaseUrl: string;
}

export type Message = {
	body?: string;
	from: User | string;
	id: string | number;
	image?: string;
	link?: string;
	notify?: boolean;
	read: boolean;
	title?: string;
	type: string;
	created_at: number;
	updated_at: number;
};

export interface ServerUser {
	id: string,
	name: string,
	email: string,
	avatar: string,
}
