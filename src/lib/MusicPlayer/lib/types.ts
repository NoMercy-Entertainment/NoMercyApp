import {Song} from '@/types/musicPlayer';

export interface PlayerOptions {}

export interface AudioOptions {
    id: number;
    volume?: number;
    prefetchLeeway?: number;
    fadeDuration?: number;
    bands: EQBand[];
}

export enum PlayerState {
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    STOPPED = 'STOPPED',
    ENDED = 'ENDED',
    LOADING = 'LOADING',
    ERROR = 'ERROR',
    IDLE = 'IDLE',
    BUFFERING = 'BUFFERING',
}

export enum VolumeState {
    MUTED = 'MUTED',
    UNMUTED = 'UNMUTED',
}

export interface TimeState {
    buffered: number;
    duration: any;
    percentage: number;
    position: any;
    remaining: number;
}

export type RepeatState = 'off' | 'one' | 'all';
export type Time = number;
export type Volume = number;
export type Item = Song;
export type IsPlaying = boolean;
export type IsMuted = boolean;
export type IsShuffling = boolean;
export type IsRepeating = boolean;

export interface EQSliderValues {
    pan: {
        min: number;
        max: number;
        step: number;
        default: number;
    }
    pre: {
        min: number;
        max: number;
        step: number;
        default: number;
    }
    band: {
        min: number;
        max: number;
        step: number;
        default: number;
    }
}

export interface EQBand {
    frequency: number | 'Pre';
    gain: number;
}

export interface EqualizerPreset {
    name: string;
    values: { frequency: number, gain: number }[];
}

