import type { NMPlaylistItem } from '@/lib/VideoPlayer';
import type { SyncPluginArgs } from '@/lib/VideoPlayer/plugins/syncPlugin.ts';
import type { Level, Track } from '@nomercy-entertainment/nomercy-video-player/src/types.ts';

export interface StateEvents {
	events: StateEvent[];
}

export interface StateEvent {
	type: string;
	event: {
		state: PlayerState;
	};
}

export interface PlayerState {
	current_audio: Track;
	current_caption: Track & { codec: string };
	current_quality: Level & { file_name: string };
	actions: Actions;
	device_id: string | null;
	is_playing: boolean;
	item: NMPlaylistItem & SyncPluginArgs;
	playlist: (NMPlaylistItem & SyncPluginArgs)[];
	progress_ms: number;
	duration_ms: number;
	current_list: string;
	muted_state: boolean;
	timestamp: number;
	volume_percentage: number;
	seek_offset: number;
}

export interface Actions {
	disallows: Disallows;
}

export interface Disallows {
	previous: boolean;
	resuming: boolean;
	pausing: boolean;
}
