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
	features: {
		[key: string]: boolean;
	};
}

export interface Server {
	is_owner: boolean;
	is_manager: boolean;
	id: string;
	name: string;
	platform: string;
	version: string;
	owner_details: OwnerDetails;
	online: boolean;
	auto_connect: boolean;
	external_port: string;
	internal_port: string;
	port: string;
	domain: string;
	public_domain: string;
	external_ip: string;
	internal_ip: string;
	user_id: null;
	internal_domain: string;
	external_domain: string;
	serverApiUrl: string;
	serverBaseUrl: string;
}

export interface OwnerDetails {
	id: null;
	name: string;
	address: string;
}

export interface Message {
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
}

export interface ServerUser {
	user_id: string;
	name: string;
	email: string;
	avatar: string;
}
