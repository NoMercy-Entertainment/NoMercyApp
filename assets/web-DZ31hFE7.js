import{bo as e}from"./index-Cy6EBPTS.js";class n extends e{async setMetadata(a){if("mediaSession"in navigator)navigator.mediaSession.metadata=new MediaMetadata(a);else throw this.unavailable("Media Session API not available in this browser.")}async setPlaybackState(a){if("mediaSession"in navigator)navigator.mediaSession.playbackState=a.playbackState;else throw this.unavailable("Media Session API not available in this browser.")}async setActionHandler(a,i){if("mediaSession"in navigator)navigator.mediaSession.setActionHandler(a.action,i);else throw this.unavailable("Media Session API not available in this browser.")}async setPositionState(a){if("mediaSession"in navigator)navigator.mediaSession.setPositionState(a);else throw this.unavailable("Media Session API not available in this browser.")}}export{n as MediaSessionWeb};
//# sourceMappingURL=web-DZ31hFE7.js.map