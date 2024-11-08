// import type MusicPlayer from '@/lib/MusicPlayer';
// import type {
//     BackLog,
//     CurrentItem,
//     Time,
//     IsPlaying,
//     IsShuffling,
//     Queue,
//     RepeatState,
//     Volume,
//     IsMuted, TimeState
// } from '@/lib/MusicPlayer/lib/types';
//
// interface Actions {
//     setBackLog?: (backlog: BackLog) => void;
//     setCurrenItem?: (item: CurrentItem | null) => void;
//     setCurrenTime?: (time: Time) => void;
//     setDuration?: (duration: Time) => void;
//     setPercentage?: (duration: Time) => void;
//     setIsMuted?: (value: IsMuted) => void;
//     setIsPlaying?: (value: IsPlaying) => void;
//     setQueue?: (queue: Queue) => void;
//     setRemainingTime?: (time: Time) => void;
//     setRepeat?: (state: RepeatState) => void;
//     setIsShuffling?: (value: IsShuffling) => void;
//     setVolume?: (volume: Volume) => void;
// }
//
// class MusicStateManager {
//     private readonly _player: MusicPlayer;
//     private _actions: Actions;
//
//     constructor(player: MusicPlayer, actions: {
//         setBackLog: (payload: BackLog) => void;
//         setCurrenItem: (payload: CurrentItem) => void;
//         setCurrenTime: (payload: Time) => void;
//         setPercentage: (payload: Time) => void;
//         setDuration: (payload: Time) => void;
//         setIsMuted: (payload: IsMuted) => void;
//         setIsPlaying: (payload: IsPlaying) => void;
//         setQueue: (payload: Queue) => void;
//         setRemainingTime: (payload: Time) => void;
//         setRepeat: (payload: RepeatState) => void;
//         setIsShuffling: (payload: IsShuffling) => void;
//         setVolume: (payload: Volume) => void;
//     }) {
//         this._player = player;
//         this._actions = actions;
//
//         this.#_off();
//         this.#_on();
//     }
//
//     #_on() {
//         if (typeof this._actions.setVolume != 'undefined')
//             this._player.on('volume', this._actions.setVolume.bind(this));
//         if (typeof this._actions.setQueue != 'undefined')
//             this._player.on('queue', this._actions.setQueue.bind(this));
//         if (typeof this._actions.setBackLog != 'undefined')
//             this._player.on('backlog', this._actions.setBackLog.bind(this));
//         if (typeof this._actions.setCurrenItem != 'undefined')
//             this._player.on('song', this._actions.setCurrenItem.bind(this));
//         if (typeof this._actions.setDuration != 'undefined')
//             this._player.on('duration', this._actions.setDuration.bind(this));
//         if (typeof this._actions.setCurrenTime != 'undefined')
//             this._player.on('time', this.#_time.bind(this));
//         if (typeof this._actions.setRepeat != 'undefined')
//             this._player.on('repeat', this._actions.setRepeat.bind(this));
//         if (typeof this._actions.setIsShuffling != 'undefined')
//             this._player.on('shuffle', this._actions.setIsShuffling.bind(this));
//         if (typeof this._actions.setIsMuted != 'undefined')
//             this._player.on('mute', this._actions.setIsMuted.bind(this));
//         if (typeof this._actions.setIsPlaying != 'undefined')
//             this._player.on('play', this.#_play.bind(this));
//         if (typeof this._actions.setIsPlaying != 'undefined')
//             this._player.on('pause', this.#_pause.bind(this));
//
//     }
//     #_off() {
//         if (typeof this._actions.setVolume != 'undefined')
//             this._player.off('volume', this._actions.setVolume.bind(this));
//         if (typeof this._actions.setQueue != 'undefined')
//             this._player.off('queue', this._actions.setQueue.bind(this));
//         if (typeof this._actions.setBackLog != 'undefined')
//             this._player.off('backlog', this._actions.setBackLog.bind(this));
//         if (typeof this._actions.setCurrenItem != 'undefined')
//             this._player.off('song', this._actions.setCurrenItem.bind(this));
//         if (typeof this._actions.setDuration != 'undefined')
//             this._player.off('duration', this._actions.setDuration.bind(this));
//         if (typeof this._actions.setRepeat != 'undefined')
//             this._player.off('repeat', this._actions.setRepeat.bind(this));
//         if (typeof this._actions.setIsShuffling != 'undefined')
//             this._player.off('shuffle', this._actions.setIsShuffling.bind(this));
//         if (typeof this._actions.setIsMuted != 'undefined')
//             this._player.off('mute', this._actions.setIsMuted.bind(this));
//         if (typeof this._actions.setIsPlaying != 'undefined')
//             this._player.off('play', this.#_play.bind(this));
//
//     }
//
//     #_play() {
//         if (typeof this._actions.setIsPlaying != 'undefined')
//             this._actions.setIsPlaying(true);
//         else
//             this._player.play().then();
//     }
//     #_pause() {
//         if (typeof this._actions.setIsPlaying != 'undefined') {
//             this._actions.setIsPlaying(false);
//         }
//         else {
//             this._player.pause();
//         }
//     }
//
//     #_time(time: TimeState) {
//         if (typeof this._actions.setCurrenTime != 'undefined')
//             this._actions.setCurrenTime(time.position);
//         if (typeof this._actions.setDuration != 'undefined')
//             this._actions.setDuration(time.duration);
//         if (typeof this._actions.setRemainingTime != 'undefined')
//             this._actions.setRemainingTime(time.remaining);
//         if (typeof this._actions.setPercentage != 'undefined')
//             this._actions.setPercentage(time.percentage);
//     }
// }
//
// export default MusicStateManager;
//
