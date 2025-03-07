export interface DriveState {
    open: boolean;
    path: string;
    label: string;
    metadata: RipperResponse;
}

export interface RipperResponse {
    title: string;
    playlists: null;
    path: string;
    data: Data;
    bluRay_playlists: BluRayPlaylist[];
}

export interface BluRayPlaylist {
    index: number;
    complete_name: string;
    playlist_id: string;
    format: string;
    file_size: number;
    duration: string;
    overall_bit_rate: string;
    video_tracks: VideoTrack[];
    audio_tracks: AudioTrack[];
    subtitle_tracks: SubtitleTrack[];
    chapters: Chapter[];
}

export interface AudioTrack {
    id: number;
    stream_index: number;
    format: string;
    format_info: string;
    commercial_name: null;
    duration: string;
    channels: number | null;
    sampling_rate: number;
    compression_mode: string | null;
    language: string;
    checked: boolean;
}

export interface Chapter {
    timestamp: string;
    title: string;
}

export interface SubtitleTrack {
    id: number;
    stream_index: number;
    format: string;
    duration: string;
    language: string;
    checked: boolean;
}

export interface VideoTrack {
    id: number;
    stream_index: number;
    format: string;
    format_info: string;
    width: number;
    height: number;
    display_aspect_ratio: string;
    frame_rate: number;
    checked: boolean;
}

export interface Data {
    Movie: null;
    TvShow: TvShow;
    Episodes: Episode[];
}

export interface Episode {
    crew: Crew[];
    cast: any[];
    guest_stars: Crew[];
    air_date: Date;
    episode_number: number;
    name: string;
    overview: string;
    id: number;
    production_code: string;
    season_number: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
}

export interface Crew {
    department?: string;
    job?: string;
    credit_id: string;
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: null | string;
    order: number | null;
    character?: string;
    character_name?: null;
}


export interface TvShow {
    first_air_date: Date;
    genre_ids: number[];
    name: string;
    origin_country: string[];
    original_name: string;
    type: string;
    backdrop_path: string;
    id: number;
    original_language: string;
    overview: string;
    popularity: number;
    poster_path: string;
    vote_average: number;
    vote_count: number;
}
