import {Helpers} from '@/lib/MusicPlayer/lib/helpers';
import {BackLog, CurrentItem, IsShuffling, Item, RepeatState} from '@/lib/MusicPlayer/lib/types';

export class Queue extends Helpers {
    public currentSong: CurrentItem = null;
    protected _queue: Array<Item> = [];
    protected _backLog: BackLog = [];
    protected _shuffle: IsShuffling = false;
    public _repeat: RepeatState = 'off';

    constructor() {
        super();

        this._initializeQueue();
    }

    public getQueue(): Array<Item> {
        return this._queue;
    }

    public setQueue(payload: Array<Item>) {
        this._queue = [...payload];
        this.emit('queue', this._queue);
    }

    public addToQueue(payload: Item) {
        this._queue.push(payload);
        this.emit('queue', this._queue);
    }

    public pushToQueue(payload: Item[]) {
        payload.forEach((song) => this._queue.push(song));
        this.emit('queue', this._queue);
    }

    public removeFromQueue(payload: Item) {
        this._queue.splice(this._queue.indexOf(payload), 1);
        this.emit('queue', this._queue);
    }

    public addToQueueNext(payload: Item) {
        this._queue.unshift(payload);
        this.emit('queue', this._queue);
    }

    public getBackLog(): Array<Item> {
        return Array.from(this._backLog);
    }

    public setBackLog(payload: Array<Item>) {
        this._backLog = [...payload];
        this.emit('backlog', this._backLog);
    }

    public addToBackLog(payload: Item | null) {
        if (!payload) return;
        this._backLog.push(payload);
        this.emit('backlog', this._backLog);
    }

    public pushToBackLog(payload: Item[]) {
        payload.forEach((song) => this._backLog.push(song));
        this.emit('backlog', this._backLog);
    }

    public removeFromBackLog(payload: Item) {
        this._backLog.splice(this._backLog.indexOf(payload), 1);
        this.emit('backlog', this._backLog);
    }

    public setCurrentSong(payload: Item | null) {
        this.currentSong = payload;

        this.emit('song', payload);

        if (!payload) return;

        this.getNewSource(payload).then((src) => {
            this._currentAudio.setSource(src);
            setTimeout(() => {
                this._currentAudio.play().then();
            }, 150);
            this._currentAudio
                .getAudioElement()
                .setAttribute('data-src', payload?.id?.toString());
        });
    }

    public next() {
        this.addToBackLog(this.currentSong);

        if (this._queue?.length > 0) {
            let nexItem = this._queue[0];

            if (this._shuffle) {
                const index = Math.round(
                    Math.random() * (this._queue.length - 1)
                );
                nexItem = this._queue[index];
            }

            this.setCurrentSong(nexItem);
            this.removeFromQueue(nexItem);
        } else {
            // TODO: find new items to play

            this.setCurrentSong(this._backLog[0]);
            this.setQueue(this._backLog.slice(1));

            this.setBackLog([]);
        }
    }

    public previous() {
        if (this._currentAudio.currentTime > 3) {
            this._currentAudio.setCurrentTime(0);
        } else if (this._backLog.length > 0) {
            const prevSong = this._backLog.at(-1);

            if (!prevSong) return;

            if (this.currentSong) {
                this.addToQueueNext(this.currentSong);
            }

            this.setCurrentSong(prevSong);

            this.removeFromBackLog(prevSong);
        } else {
            this._currentAudio.setCurrentTime(0);
        }
    }

    public playTrack(track: Item, tracks?: Item[]) {
        if (!this.currentSong?.id || this.currentSong?.id != track?.id) {
            this.setCurrentSong(track);
        }

        if (this._queue.length == 0 && tracks) {
            const index = tracks.findIndex((t) => t.id == track.id);
            const list = tracks.filter((t) => t.id != track.id);
            const beforeIndex = [...list];
            const afterIndex = list.splice(index, list.length - index);

            this.setQueue([...afterIndex, ...beforeIndex]);
        } else if (this._queue.some((q) => q.id == track?.id)) {
            this.addToQueue(track);
        } else {
            this.addToQueueNext(track);
        }
    }

    public shuffle(value: IsShuffling) {
        this._shuffle = value;
        this.isShuffling = value;
        this.emit('shuffle', value);
    }

    public repeat(value: RepeatState) {
        this._repeat = value;
        this.emit('repeat', this._repeat);
        this.isRepeating = this._repeat !== 'off';

        this._currentAudio.setRepeating(this._repeat);
        this._nextAudio.setRepeating(this._repeat);
    }

    protected _initializeQueue(): void {

        this.on('ended', () => {
            if (this._repeat === 'one') {
                this._currentAudio.setCurrentTime(0);
                setTimeout(() => {
                    this._currentAudio.play().then();
                }, 150);
            }
        });

        this.on('queueNext', () => {
            if (this._repeat === 'one') return;

            if (this._repeat === 'all' && this._queue.length === 0) {
                this.setQueue(this._backLog);
                this.setBackLog([]);
            }

            if (this._queue.length == 0) return;

            const currentVolume = this.volume;

            this.getNewSource(this._queue[0])
                .then((src) => {
                    this._nextAudio.setSource(src);
                    this._nextAudio.fadeVolume(0);
                    this.once('startFadeOut', () => {
                        if (this._repeat === 'one') return;

                        this._currentAudio.setCrossfadeSteps(
                            currentVolume / this.fadeDuration / 5
                        );
                        this._currentAudio._fadeOut(true);

                        this._nextAudio.setCrossfadeSteps(
                            currentVolume / this.fadeDuration / 5
                        );
                        this._nextAudio._fadeIn(true);

                        this.once('nextSong', () => {
                            if (this._repeat === 'one') return;

                            const nexItem = this._queue[0];

                            this.addToBackLog(this.currentSong);

                            this.currentSong = nexItem;

                            this.removeFromQueue(nexItem);

                            this.emit('song', nexItem);

                            this.once('setCurrentAudio', () => {
                                if (this._repeat == 'one') return;

                                this._currentAudio = this._nextAudio;

                                this._nextAudio =
                                    this._currentAudio == this._audioElement1
                                        ? this._audioElement2
                                        : this._audioElement1;
                            });
                        });
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.currentSong = null;
                });
        });

        this.on('ended', (el) => {
            if (el == this._currentAudio.getAudioElement()) {
                this.currentSong = null;
                // this.emit('song', null);
            }
        });

        this.on('error', this.next.bind(this));
    }
}
