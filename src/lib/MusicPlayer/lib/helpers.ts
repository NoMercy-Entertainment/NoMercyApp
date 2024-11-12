
import { PlayerAudio } from './audio';
import type {
    BackLog,
    CurrentItem, Time, IsMuted, IsShuffling,
    PlayerOptions, Queue, RepeatState,
    TimeState, Volume, IsRepeating, IsPlaying,
} from './types';

import {Item, PlayerState, VolumeState} from './types';
import promises from '@/router/middleware/beforeResolve';

export class Helpers extends EventTarget {
    public volume: Volume = Number(localStorage.getItem('music-volume')) || 100;
    public muted: IsMuted = false;
    public duration: Time = 0;
    public currentTime: Time = 0;
    public buffered: number = 0;
    public playbackRate: number = 1;
    public fadeDuration: number = 3;
    public currentSong: Item | null = null;
    public state: PlayerState = PlayerState.IDLE;
    public volumeState: VolumeState = VolumeState.UNMUTED;
    public isShuffling: IsShuffling = false;
    public isRepeating: IsRepeating = false;
    public isMuted: IsMuted = false;
    public isPaused: boolean = false;
    public isPlaying: IsPlaying = false;
    public isStopped: boolean = false;
    public isSeeking: boolean = false;
    public isTransitioning: boolean = false;
    public newSourceLoaded: boolean = false;
    public serverLocation?: string = '';
    public accessToken: string = '';
    protected _options: PlayerOptions = <PlayerOptions>{};
    protected _audioElement1: PlayerAudio = new PlayerAudio(
        { id: 1, volume: this.volume / 100 },
        this
    );
    protected _audioElement2: PlayerAudio = new PlayerAudio(
        { id: 2, volume: this.volume / 100 },
        this
    );
    protected _currentAudio: PlayerAudio = this._audioElement1;
    protected _nextAudio: PlayerAudio = this._audioElement2;
    protected _eventElement: HTMLDivElement = <HTMLDivElement>{};

    constructor() {
        super();

        this._eventElement = document.createElement('div');
        this._eventElement.id = 'music-events';
        this._eventElement.style.display = 'none';
        document.body.appendChild(this._eventElement);
    }

    public setAccessToken(accessToken: string): void {
        this.accessToken = accessToken;
    }

    public setServerLocation(serverLocation?: string): void {
        this.serverLocation = serverLocation;
    }

    public getNewSource(newItem: CurrentItem|null): Promise<string> {
        if (!newItem?.folder) return Promise.resolve('');
        return new Promise((resolve) => {
            return resolve(
                encodeURI(
                    `${this.serverLocation}/${newItem?.folder_id}${newItem?.folder}${newItem?.filename}?token=${this.accessToken}`
                ).replace(/#/u, '%23')
            );
        }) as unknown as Promise<string>;

        // return getDataUrl(`${this.serverLocation}/${newItem.libraryId}${newItem.folder}${newItem.filename}`, this.accessToken);
    }

    /**
     * Trigger an event on the player.
     * @param eventType type of event to trigger
     * @param data  data to pass with the event
     */
    emit(eventType: 'duration', data: number): void;
    emit(eventType: 'loadstart', source: HTMLAudioElement): void;
    emit(eventType: 'loadedmetadata', source: HTMLAudioElement): void;
    emit(eventType: 'canplay', source: HTMLAudioElement): void;
    emit(eventType: 'waiting', source: HTMLAudioElement): void;
    emit(eventType: 'error', source: HTMLAudioElement): void;
    emit(eventType: 'ended', source: HTMLAudioElement): void;
    emit(eventType: 'pause', source: HTMLAudioElement): void;
    emit(eventType: 'play', source: HTMLAudioElement): void;
    emit(eventType: 'stop'): void;
    emit(eventType: 'pause-internal', source: HTMLAudioElement): void;
    emit(eventType: 'play-internal', source: HTMLAudioElement): void;
    emit(eventType: 'queueNext'): void;
    emit(eventType: 'startFadeOut'): void;
    emit(eventType: 'endFadeOut'): void;
    emit(eventType: 'nextSong'): void;
    emit(eventType: 'ready'): void;
    emit(eventType: 'song', data: CurrentItem | null): void;
    emit(eventType: 'backlog', data: CurrentItem[]): void;
    emit(eventType: 'queue', data: CurrentItem[]): void;
    emit(eventType: 'shuffle', data: IsShuffling): void;
    emit(eventType: 'mute', data: IsMuted): void;
    emit(eventType: 'repeat', data: RepeatState): void;
    emit(eventType: 'seeked', data: TimeState): void;
    emit(eventType: 'setCurrentAudio', data: HTMLAudioElement): void;
    emit(eventType: 'time', data: TimeState): void;
    emit(eventType: 'time-internal', data: TimeState): void;
    emit(eventType: 'volume', data: Volume): void;
    emit(eventType: any, data?: any): void {
        if (!data || typeof data === 'string') {
            data = data ?? '';
        } else if (typeof data === 'object') {
            data = { ...(data ?? {}) };
        }

        this._eventElement.dispatchEvent?.(
            new CustomEvent(eventType, {
                detail: data,
            })
        );
    }

    /**
     * Adds an event listener to the player.
     * @param event - The event to listen for.
     * @param callback - The function to execute when the event occurs.
     */
    on(event: 'duration', callback: (data: Time) => void): void;
    on(event: 'loadstart', callback: (element: HTMLAudioElement) => void): void;
    on(event: 'loadedmetadata', callback: (element: HTMLAudioElement) => void): void;
    on(event: 'canplay', callback: (element: HTMLAudioElement) => void): void;
    on(event: 'waiting', callback: (element: HTMLAudioElement) => void): void;
    on(event: 'error', callback: (element: HTMLAudioElement) => void): void;
    on(event: 'ended', callback: (element: HTMLAudioElement) => void): void;
    on(event: 'pause', callback: () => void): void;
    on(event: 'play', callback: () => void): void;
    on(event: 'stop', callback: () => void): void;
    on(event: 'pause-internal', callback: () => void): void;
    on(event: 'play-internal', callback: () => void): void;
    on(event: 'queueNext', callback: () => void): void;
    on(event: 'startFadeOut', callback: () => void): void;
    on(event: 'endFadeOut', callback: () => void): void;
    on(event: 'nextSong', callback: () => void): void;
    on(event: 'ready', callback: () => void): void;
    on(event: 'song', callback: (data: CurrentItem | null) => void): void;
    on(event: 'backlog', callback: (data: BackLog) => void): void;
    on(event: 'queue', callback: (data: Queue) => void): void;
    on(event: 'shuffle', callback: (data: IsShuffling) => void): void;
    on(event: 'mute', callback: (data: IsMuted) => void): void;
    on(event: 'repeat', callback: (data: RepeatState) => void): void;
    on(event: 'seeked', callback: (data: TimeState) => void): void;
    on(event: 'setCurrentAudio', callback: () => void): void;
    on(event: 'time', callback: (data: TimeState) => void): void;
    on(event: 'time-internal', callback: (data: TimeState) => void): void;
    on(event: 'volume', callback: (data: Volume) => void): void;
    on(event: any, callback: (arg0: any) => any) {
        this.eventHooks(event, true);
        this._eventElement?.addEventListener(event, (e: { detail: any }) =>
            callback(e.detail)
        );
    }

    /**
     * Removes an event listener from the player.
     * @param event - The event to remove.
     * @param callback - The function to remove.
     */
    off(event: 'duration', callback: (data: Time) => void): void;
    off(event: 'loadstart', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'loadedmetadata', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'canplay', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'waiting', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'error', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'ended', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'pause', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'play', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'stop', callback: () => void): void;
    off(event: 'pause-internal', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'play-internal', callback: (source: HTMLAudioElement) => void): void;
    off(event: 'queueNext', callback: () => void): void;
    off(event: 'startFadeOut', callback: () => void): void;
    off(event: 'endFadeOut', callback: () => void): void;
    off(event: 'nextSong', callback: () => void): void;
    off(event: 'ready', callback: () => void): void;
    off(event: 'song', callback: (data: CurrentItem | null) => void): void;
    off(event: 'backlog', callback: (data: BackLog) => void): void;
    off(event: 'queue', callback: (data: Queue) => void): void;
    off(event: 'shuffle', callback: (data: IsShuffling) => void): void;
    off(event: 'mute', callback: (data: IsMuted) => void): void;
    off(event: 'repeat', callback: (data: RepeatState) => void): void;
    off(event: 'seeked', callback: (data: TimeState) => void): void;
    off(event: 'setCurrentAudio',callback: (data: HTMLAudioElement) => void): void;
    off(event: 'time', callback: (data: TimeState) => void): void;
    off(event: 'time-internal', callback: (data: TimeState) => void): void;
    off(event: 'volume', callback: (data: Volume) => void): void;
    off(event: any, callback: (arg0: any) => any) {
        this.eventHooks(event, false);
        this.removeEventListener(event, (e) => callback((e as any).detail));
    }

    /**
     * Adds an event listener to the player that will only be called once.
     * @param event - The event to listen for.
     * @param callback - The function to execute when the event occurs.
     */
    once(event: 'duration', callback: (data: Time) => void): void;
    once(event: 'loadstart',callback: (source: HTMLAudioElement) => void): void;
    once(event: 'loadedmetadata',callback: (source: HTMLAudioElement) => void): void;
    once(event: 'canplay', callback: (source: HTMLAudioElement) => void): void;
    once(event: 'waiting', callback: (source: HTMLAudioElement) => void): void;
    once(event: 'error', callback: (source: HTMLAudioElement) => void): void;
    once(event: 'ended', callback: (source: HTMLAudioElement) => void): void;
    once(event: 'pause', callback: (source: HTMLAudioElement) => void): void;
    once(event: 'play', callback: (source: HTMLAudioElement) => void): void;
    once(event: 'pause-internal',callback: (source: HTMLAudioElement) => void): void;
    once(event: 'play-internal',callback: (source: HTMLAudioElement) => void): void;
    once(event: 'queueNext', callback: () => void): void;
    once(event: 'startFadeOut', callback: () => void): void;
    once(event: 'endFadeOut', callback: () => void): void;
    once(event: 'nextSong', callback: () => void): void;
    once(event: 'ready', callback: () => void): void;
    once(event: 'song', callback: (data: CurrentItem | null) => void): void;
    once(event: 'backlog', callback: (data: BackLog) => void): void;
    once(event: 'queue', callback: (data: Queue) => void): void;
    once(event: 'shuffle', callback: (data: IsShuffling) => void): void;
    once(event: 'mute', callback: (data: IsMuted) => void): void;
    once(event: 'repeat', callback: (data: RepeatState) => void): void;
    once(event: 'seeked', callback: (data: TimeState) => void): void;
    once(event: 'setCurrentAudio',callback: (data: HTMLAudioElement) => void): void;
    once(event: 'time', callback: (data: TimeState) => void): void;
    once(event: 'time-internal', callback: (data: TimeState) => void): void;
    once(event: 'volume', callback: (data: Volume) => void): void;
    once(event: any, callback: (arg0: any) => any) {
        this.eventHooks(event, true);
        this._eventElement?.addEventListener(
            event,
            (e) => callback((e as any).detail),
            { once: true }
        );
    }

    /**
     * Sets the enabled state of various event hooks.
     * @param event - The event to enable/disable.
     * @param enabled - Whether the event should be enabled or disabled.
     */
    eventHooks(event: any, enabled: boolean) {
        // if (event == 'pip') {
        // 	this.hasPipEventHandler = enabled;
        // } else if (event == 'theaterMode') {
        // 	this.hasTheaterEventHandler = enabled;
        // } else if (event == 'back') {
        // 	this.hasBackEventHandler = enabled;
        // }
    }
}
