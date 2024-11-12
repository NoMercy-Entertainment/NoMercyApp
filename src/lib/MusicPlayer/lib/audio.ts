import { Helpers } from './helpers';
import { type AudioOptions, PlayerState } from './types';
import { isPlatform} from '@ionic/vue';

export class PlayerAudio {
    public state: PlayerState = PlayerState.STOPPED;
    public duration: number = 0;
    public currentTime: number = 0;
    public volume: number = 100;
    public fadeDuration: number = 3;
    protected _options: AudioOptions = <AudioOptions>{};
    protected _audioElement: HTMLAudioElement = <HTMLAudioElement>{};
    protected parent: Helpers;
    protected _prefetchLeeway: number = 10;
    protected crossfadeSteps = 20;
    protected fadeOutVolume = 0;
    protected fadeInVolume = 100;

    private isFading: boolean = false;
    protected hasNextQueued: boolean = false;
    protected repeat: 'off'|'one'|'all' = 'off';
    protected isCurrentAudio: boolean = true;

    constructor(options: AudioOptions, parent: Helpers) {
        this._options = options;
        this.parent = parent;
        this._prefetchLeeway = options.prefetchLeeway ?? 10;
        this.fadeDuration = options.fadeDuration ?? 3;

        this._initialize();
    }

    public dispose(): void {
        this._removeEvents();
        this._audioElement.remove();
    }

    public setSource(src: string) {
        this._audioElement.src = src;
        return this;
    }

    public play(): Promise<void> {
        return this._audioElement.play();
    }

    public pause(): void {
        this._audioElement.pause();
    }

    public stop(): void {
        this._audioElement.pause();
        this._audioElement.currentTime = 0;

        URL.revokeObjectURL(this._audioElement.src);
        this._audioElement.removeAttribute('src');
        this._audioElement.removeAttribute('data-src');
    }

    public setVolume(volume: number): void {
				const isMobileDevice = isPlatform('android') || isPlatform('ios');
				if (isMobileDevice) {
					this._audioElement.volume = 1;
					return;
				}

        if (volume < 0) volume = 0;
        if (volume > 100) volume = 100;
        this.volume = volume;
        this._audioElement.volume = volume / 100;
    }

    public fadeVolume(volume: number): void {
        if (volume < 0) volume = 0;
        if (volume > 100) volume = 100;
        this._audioElement.volume = volume / 100;
    }

    public getVolume(): number {
        return this.volume;
    }

    public mute() {
        this._audioElement.muted = true;
    }

    public unmute() {
        this._audioElement.muted = false;
    }

    public isPlaying(): boolean {
        return this.state === PlayerState.PLAYING;
    }

    public isPaused(): boolean {
        return this.state === PlayerState.PAUSED;
    }

    public isStopped(): boolean {
        return this.state === PlayerState.STOPPED;
    }

    public getDuration(): number {
        return this.duration;
    }

    public getCurrentTime(): number {
        return this.currentTime;
    }

    public getBuffer(): number {
        return this._audioElement.buffered.length;
    }

    public getPlaybackRate(): number {
        return this._audioElement.playbackRate;
    }

    public setCurrentTime(time: number): this {
        this._audioElement.currentTime = time;
        return this;
    }

    public getAudioElement(): HTMLAudioElement {
        return this._audioElement;
    }

    public getTimeData() {
        return {
            position: Math.abs(this.getCurrentTime()),
            duration: Math.abs(this.getDuration()),
            remaining:
                this.getDuration() < 0
                    ? Infinity
                    : Math.abs(this.getDuration()) -
                      Math.abs(this.getCurrentTime()),
            buffered: this.getBuffer(),
            percentage:
                (Math.abs(this.getCurrentTime()) /
                    Math.abs(this.getDuration())) *
                100,
        };
    }

    public setFadeInVolume(volume: number) {
        this.fadeInVolume = volume;
    }

    public setFadeOutVolume(volume: number) {
        this.fadeOutVolume = volume;
    }

    public setCrossfadeSteps(steps: number) {
        this.crossfadeSteps = steps;
    }

    public _fadeIn(firstRun: boolean = false) {
        if (firstRun) {
            // console.log('first-in', this._audioElement.id, this.fadeInVolume, this.volume, this.crossfadeSteps);
            this.fadeVolume(0);
            this.fadeInVolume = 0;
        }

        this._audioElement.play().then();

        if (this.fadeInVolume < this.volume) {
            this.fadeInVolume += this.crossfadeSteps;

            setTimeout(() => this._fadeIn(), 200);
        } else {
            this.fadeInVolume = this.volume;
            this.isFading = false;
        }

        if (this.fadeInVolume > 100) {
            this.fadeInVolume = 100;
        }

        // console.log('in', this._audioElement.id, this.fadeInVolume, this.volume, this.crossfadeSteps);
        this.fadeVolume(this.fadeInVolume);

        if (this.fadeInVolume >= this.volume - this.crossfadeSteps * 12) {
            this.parent.emit('nextSong');
        }
    }

    public _fadeOut(firstRun: boolean = false) {
        if (firstRun) {
            // console.log('first-out', this._audioElement.id, this.fadeOutVolume, this.volume, this.crossfadeSteps);
            this.fadeOutVolume = this.volume;
        }

        if (this.fadeOutVolume > 0) {
            this.fadeOutVolume -= this.crossfadeSteps;
            setTimeout(() => this._fadeOut(), 200);
        } else {
            this.fadeOutVolume = 0;
        }

        if (this.fadeOutVolume < 0) {
            this.fadeOutVolume = 0;
        }

        // console.log('out', this._audioElement.id, this.fadeOutVolume, this.volume, this.crossfadeSteps);

        this.fadeVolume(this.fadeOutVolume);

        if (this.fadeOutVolume == 0) {
            this.pause();

            URL.revokeObjectURL(this._audioElement?.src);
            this._audioElement?.removeAttribute('src');
            this._audioElement?.removeAttribute('data-src');

            this.parent.emit('endFadeOut');

            setTimeout(() => {
                this.hasNextQueued = false;
                this.isFading = false;
                this.parent.emit('setCurrentAudio', this._audioElement);
            }, 500);
        }
    }

    setRepeating(repeat: 'off'|'one'|'all') {
        this.repeat = repeat;
    }

    protected _initialize(): void {
        this._createAudioElement(this._options.id);

        this._addEvents();
    }

    protected _createAudioElement(id: number): this {

        this._audioElement = document.createElement('audio');
        this._audioElement.id = `audio-${id}`;
        this._audioElement.preload = 'auto';
        this._audioElement.controls = false;
        this._audioElement.autoplay = true;
        this._audioElement.loop = false;
        this._audioElement.setAttribute('tabindex', '-1');
        this._audioElement.volume = this._options.volume ?? 1;
        this._audioElement.style.display = 'none';

        document.body.appendChild(this._audioElement);

        return this;
    }

    private playEvent() {
        this.state = PlayerState.PLAYING;
        this.parent.emit('play-internal', this._audioElement);
        if (!this.isFading) {
            this.parent.emit('play', this._audioElement);
        }
    }

    private pauseEvent() {
        this.state = PlayerState.PAUSED;
        this.parent.emit('pause-internal', this._audioElement);
        if (!this.isFading) {
            this.parent.emit('pause', this._audioElement);
        }
    }

    private endedEvent() {
        this.state = PlayerState.ENDED;
        this.parent.emit('ended', this._audioElement);
    }

    private errorEvent() {
        console.error('Error', this._audioElement.error);
        this.state = PlayerState.ERROR;
        this.parent.emit('error', this._audioElement);
    }

    private waitingEvent() {
        this.state = PlayerState.BUFFERING;
        this.parent.emit('waiting', this._audioElement);
    }

    private canplayEvent() {
        this.parent.emit('canplay', this._audioElement);
        if (this.isPlaying()) return;
        this.state = PlayerState.IDLE;
    }

    private loadedmetadataEvent() {
        this.parent.emit('loadedmetadata', this._audioElement);
        if (this.isPlaying()) return;
        this.state = PlayerState.IDLE;
    }

    private loadstartEvent() {
        this.state = PlayerState.LOADING;
        this.parent.emit('loadstart', this._audioElement);
    }

    private timeupdateEvent() {
        this.state = PlayerState.PLAYING;
        this.currentTime = this._audioElement.currentTime;
        this.duration = this._audioElement.duration;

        this.parent.emit('time-internal', this.getTimeData());
        if (!this.isFading || this.repeat == 'one') {
            this.parent.emit('time', this.getTimeData());
        }

        if (
            !this.hasNextQueued &&
            this.repeat !== 'one' &&
            this._audioElement.currentTime >=
                this._audioElement.duration - this._prefetchLeeway
        ) {
            this.hasNextQueued = true;
            this.parent.emit('queueNext');
        }

        if (
            !this.isFading &&
            this.repeat !== 'one' &&
            this._audioElement.currentTime >=
                this._audioElement.duration - this.fadeDuration * 2
        ) {
            this.isFading = true;
            this.parent.emit('startFadeOut');
        }
    }

    private durationchangeEvent() {
        this.duration = this._audioElement.duration;
        this.parent.emit('duration', this._audioElement.duration);
    }

    private volumechangeEvent() {
        this.parent.emit('volume', this.volume);
    }

    private seekedEvent() {
        console.log('seeked', this._audioElement.currentTime);
        this.parent.emit('seeked', {
            buffered: this._audioElement.buffered.length,
            duration: this._audioElement.duration,
            percentage: (this._audioElement.currentTime / this._audioElement.duration) * 100,
            position: this._audioElement.currentTime,
            remaining: this._audioElement.duration - this._audioElement.currentTime,
        });
    }

    private _addEvents() {
        this._audioElement.addEventListener('play', this.playEvent.bind(this));
        this._audioElement.addEventListener(
            'pause',
            this.pauseEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'ended',
            this.endedEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'error',
            this.errorEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'waiting',
            this.waitingEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'canplay',
            this.canplayEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'loadedmetadata',
            this.loadedmetadataEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'loadstart',
            this.loadstartEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'timeupdate',
            this.timeupdateEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'durationchange',
            this.durationchangeEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'volumechange',
            this.volumechangeEvent.bind(this)
        );
        this._audioElement.addEventListener(
            'seeked',
            this.seekedEvent.bind(this)
        );
    }

    private _removeEvents() {
        this._audioElement.removeEventListener(
            'play',
            this.playEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'pause',
            this.pauseEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'ended',
            this.endedEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'error',
            this.errorEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'waiting',
            this.waitingEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'canplay',
            this.canplayEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'loadedmetadata',
            this.loadedmetadataEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'loadstart',
            this.loadstartEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'timeupdate',
            this.timeupdateEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'durationchange',
            this.durationchangeEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'volumechange',
            this.volumechangeEvent.bind(this)
        );
        this._audioElement.removeEventListener(
            'seeked',
            this.seekedEvent.bind(this)
        );
    }
}
