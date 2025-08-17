import { WebVTTParser } from "webvtt-parser";

import Plugin from "@nomercy-entertainment/nomercy-video-player/src/plugin";
import type {
  Icon,
  NMPlayer,
  PreviewTime,
  VolumeState,
} from "@nomercy-entertainment/nomercy-video-player/src/types";
import {
  breakEpisodeTitle,
  breakLogoTitle,
  humanTime,
  unique,
} from "@nomercy-entertainment/nomercy-video-player/src/helpers";
import { buttons } from "./buttons";

import type { NMPlaylistItem } from "@/lib/VideoPlayer";

export interface BaseUIPluginArgs {
  basePath: string;
  accessToken: string;
  playlist: NMPlaylistItem[];
}

export class BaseUIPlugin extends Plugin {
  player: NMPlayer<BaseUIPluginArgs> = <NMPlayer<BaseUIPluginArgs>>{};
  overlay: HTMLDivElement = <HTMLDivElement>{};
  buttons: Icon = <Icon>{};

  chapterBar: HTMLDivElement = <HTMLDivElement>{};
  mainMenu: HTMLDivElement = <HTMLDivElement>{};
  menuFrame: HTMLDialogElement = <HTMLDialogElement>{};
  nextUp: HTMLDivElement & {
    firstChild: HTMLButtonElement;
    lastChild: HTMLButtonElement;
  } = <
    HTMLDivElement & {
      firstChild: HTMLButtonElement;
      lastChild: HTMLButtonElement;
    }
  >{};

  seekContainer: HTMLDivElement = <HTMLDivElement>{};
  sliderBar: HTMLDivElement = <HTMLDivElement>{};
  sliderPopImage: HTMLDivElement = <HTMLDivElement>{};
  chapterText: HTMLDivElement = <HTMLDivElement>{};
  episodeScrollContainer: HTMLDivElement = <HTMLDivElement>{};
  playbackButton: HTMLButtonElement = <HTMLButtonElement>{};
  loader: HTMLDivElement = <HTMLDivElement>{};
  thumbnailClone: HTMLDivElement = <HTMLDivElement>{};
  previewImage: HTMLImageElement = new Image();

  chapters: any[] = [];
  previewTime: PreviewTime[] = [];

  timer: NodeJS.Timeout = <NodeJS.Timeout>{};
  timeout: NodeJS.Timeout = <NodeJS.Timeout>{};

  image = "";
  controlsVisible: boolean = false;
  currentScrubTime = 0;
  imageBaseUrl = "";
  isScrubbing = false;
  menuOpen = false;
  mainMenuOpen = false;
  languageMenuOpen = false;
  subtitlesMenuOpen = false;
  subtitleSettingsMenuOpen = false;
  subtitleSettingMenuOpen = false;
  qualityMenuOpen = false;
  speedMenuOpen = false;
  playlistMenuOpen = false;
  theaterModeEnabled = false;
  highQuality = false;
  shouldSlide = true;
  currentTimeFile = "";
  isInitialized = false;

  currentMenu: "language" | "episode" | "pause" | "quality" | "seek" | null =
    null;
  thumbs: {
    time: PreviewTime;
    el: HTMLDivElement;
  }[] = [];

  languageMenuStyles = [
    "language-button",
    "w-available",
    "mr-auto",
    "h-8",
    "px-1",
    "py-2",
    "flex",
    "items-center",
    "rounded",
    "snap-center",
    "outline-transparent",
    "outline",
    "whitespace-nowrap",
    "hover:bg-neutral-600/50",
    "transition-all",
    "duration-200",
    "outline-1",
    "outline-solid",
    "focus-visible:outline-2",
    "focus-visible:outline-white",
    "active:outline-white",
  ];

  menuButtonTextStyles = [
    "menu-button-text",
    "text-white",
    "pointer-events-none",
    "font-semibold",
    "pl-2",
    "flex",
    "gap-2",
    "leading-[normal]",
    "line-clamp-1",
  ];

  menuButtonSubTextStyles = [
    "menu-button-text",
    "text-white/60",
    "cursor-pointer",
    "font-semibold",
    "text-2xs",
    "pl-2",
    "flex",
    "gap-2",
    "leading-[normal]",
    "line-clamp-1",
  ];
  private dataURL?: string;

  constructor() {
    super();
  }

  initialize(player: NMPlayer<BaseUIPluginArgs>) {
    this.player = player;
    this.overlay = player.overlay;
    this.buttons = buttons();
    this.imageBaseUrl = player.options.basePath
      ? ""
      : "https://image.tmdb.org/t/p/w185";
    // Initialize the plugin with the player

    this.player.on("play", () => {
      this.player.emit("hide-episode-tip");
    });

    this.player.on("item", () => {
      this.previewImage?.remove?.();
      this.previewTime = [];
    });
  }

  dispose() {
    // Remove event listeners

    // Clear timeouts
    clearTimeout(this.timer);
    clearTimeout(this.timeout);

    // Clear references
    this.player.plugins.desktopUIPlugin = undefined;
    this.chapters = [];
    this.previewTime = [];

    // Remove DOM elements
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }

  modifySpinner(parent: HTMLDivElement) {
    this.loader = this.player
      .createElement("h2", "loader")
      .addClasses(["loader", "pointer-events-none"])
      .appendTo(parent)
      .get();
  }

  createSpinnerContainer(parent: HTMLDivElement) {
    const spinnerContainer = this.player
      .createElement("div", "spinner-container")
      .addClasses([
        "spinner-container",
        "absolute",
        "inset-0",
        "hidden",
        "w-available",
        "h-available",
        "grid",
        "pointer-events-none",
        "place-content-center",
        "bg-transparent",
        "place-items-center",
        "group-[&.nomercyplayer:not(.paused):not(.playing)]:!flex",
        "group-[&.nomercyplayer:not(.paused):not(.playing)]:!bg-gradient-circle-c",
        "group-[&.nomercyplayer.buffering]:bg-gradient-circle-c",
        "group-[&.nomercyplayer.error]:bg-gradient-circle-c",

        "from-15%",
        "from-black/50",
        "via-40%",
        "via-black/30",
        "to-100%",
        "to-black/0",
      ])
      .appendTo(parent)
      .get();

    const role = this.player
      .createElement("div", "spinner-role")
      .addClasses(["flex", "flex-col", "items-center", "gap-4", "mt-11"])
      .appendTo(spinnerContainer)
      .get();

    role.setAttribute("role", "status");

    this.createSpinner(role);

    const status = this.player
      .createElement("span", "status-text")
      .addClasses([
        "status-text",
        "text-white",
        "group-[&.nomercyplayer:not(.paused):not(.playing)]:!hidden",
        "text-lg",
        "font-bold",
      ])
      .appendTo(role)
      .get();

    status.innerText = this.player.localize("Loading...");

    this.player.on("duration", () => {
      spinnerContainer.style.display = "none";
    });

    this.player.on("waiting", () => {
      spinnerContainer.style.display = "grid";
      status.innerText = `${this.player.localize("Buffering")}...`;
    });

    this.player.on("error", () => {
      spinnerContainer.style.display = "none";
      status.innerText = this.player.localize(
        "Something went wrong trying to play this item"
      );
    });

    this.player.on("ended", () => {
      spinnerContainer.style.display = "none";
    });

    this.player.on("time", () => {
      spinnerContainer.style.display = "none";
    });

    this.player.on("bufferedEnd", () => {
      spinnerContainer.style.display = "none";
    });

    this.player.on("stalled", () => {
      spinnerContainer.style.display = "grid";
      status.innerText = `${this.player.localize("Buffering")}...`;
    });

    this.player.on("item", () => {
      spinnerContainer.style.display = "grid";
    });

    return spinnerContainer;
  }

  createSpinner(parent: HTMLDivElement) {
    const spinner = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    spinner.setAttribute("viewBox", "0 0 100 101");
    spinner.id = "spinner";
    spinner.setAttribute("fill", "none");

    this.player.addClasses(spinner, [
      "spinner-icon",
      "group-[&.nomercyplayer:not(.paused):not(.playing)]:!hidden",
      "inline",
      "w-12",
      "h-12",
      "mr-2",
      "animate-spin",
      "text-white/20",
      "fill-white",
    ]);

    parent.appendChild(spinner);

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute(
      "d",
      "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
    );
    path1.setAttribute("fill", "currentColor");
    spinner.appendChild(path1);

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttribute(
      "d",
      "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
    );
    path2.setAttribute("fill", "currentFill");
    spinner.appendChild(path2);
  }

  getClosestSeekableInterval() {
    const scrubTime = this.player.getCurrentTime();
    const interval = this.previewTime.find((interval) => {
      return scrubTime >= interval.start && scrubTime < interval.end;
    })!;
    return interval?.start;
  }

  async fetchPreviewTime() {
      if (this.previewTime.length === 0) {

        this.previewTime = [<PreviewTime>{}];

        await new Promise(async (resolve) => {
          const imageFile = this.player.getSpriteFile();

          if (imageFile) {
            this.image = imageFile;
            if (this.player.options.accessToken) {
              await this.player
                  .getFileContents<Blob>({
                    url: imageFile,
                    options: {
                      type: "blob",
                    },
                    callback: (data: Blob) => {
                      if (this.dataURL) {
                        URL.revokeObjectURL(this.dataURL);
                      }
                      this.dataURL = URL.createObjectURL(data as Blob);

                      this.previewImage.src = this.dataURL;

                      if (this.sliderPopImage.style) {
                        this.sliderPopImage.style.backgroundImage = `url('${this.dataURL}')`;
                      }

                      setTimeout(() => {
                        this.player.emit("preview-time", this.previewTime);
                      }, 400);
                    },
                  })
                  .then(resolve);
            } else {
              if (this.sliderPopImage.style) {
                this.sliderPopImage.style.backgroundImage = `url('${imageFile}')`;
              }

              this.previewImage.src = imageFile;
              setTimeout(() => {
                this.player.emit("preview-time", this.previewTime);
              }, 400);

              resolve(true);
            }
          }
        });

        await new Promise(async (resolve) => {
          const timeFile = this.player.getTimeFile();
          if (!timeFile) return resolve(true);

          await this.player
              .getFileContents<string>({
                url: timeFile,
                options: {
                  type: "text",
                },
                callback: (data: string) => {
                  const parser = new WebVTTParser();
                  const vtt = parser.parse(data, "metadata");
                  const regex = /(?<x>\d*),(?<y>\d*),(?<w>\d*),(?<h>\d*)/u;

                  vtt.cues.forEach((cue) => {
                    const match = regex.exec(cue.text);
                    if (!match?.groups) return;

                    const {x, y, w, h} = match.groups;

                    const [imgX, imgY, imgW, imgH] = [x, y, w, h].map((val) =>
                        parseInt(val, 10)
                    );

                    this.previewTime.push({
                      start: cue.startTime,
                      end: cue.endTime,
                      x: imgX,
                      y: imgY,
                      w: imgW,
                      h: imgH,
                    });
                  });

                  setTimeout(() => {
                    this.player.emit("preview-time", this.previewTime);
                  }, 400);
                },
              })
              .then(async () => {
                await this.loadSliderPopImage({startTime: 0});
                resolve(true);
              });
        });
      }
  }


  createBackButton(parent: HTMLDivElement, hovered = false) {
    if (!this.player.hasBackEventHandler) return;

    const backButton = this.player.createUiButton(parent, "back").get();
    parent.appendChild(backButton);

    this.player.createSVGElement(
      backButton,
      "back",
      this.buttons.back,
      false,
      hovered
    );

    backButton.addEventListener("click", () => {
      this.player.emit("hide-tooltip");
      this.player.emit("back");
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        backButton.style.display = "none";
      } else {
        backButton.style.display = "flex";
      }
    });

    return backButton;
  }

  createRestartButton(parent: HTMLDivElement, hovered = false) {
    const restartButton = this.player.createUiButton(parent, "restart").get();
    parent.appendChild(restartButton);

    this.player.createSVGElement(
      restartButton,
      "restart",
      this.buttons.restart,
      false,
      hovered
    );

    restartButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("restart");
      } else {
        this.player.restart();
      }
    });

    return restartButton;
  }

  createSettingsButton(parent: HTMLDivElement, hovered = false) {
    if (
      !this.player.hasSpeeds() &&
      !this.player.hasAudioTracks() &&
      !this.player.hasCaptions()
    )
      return;

    const settingsButton = this.player.createUiButton(parent, "settings").get();

    this.player.createSVGElement(
      settingsButton,
      "settings",
      this.buttons.settings,
      false,
      hovered
    );

    settingsButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("hide-tooltip");
      if (this.menuOpen && this.mainMenuOpen) {
        this.player.emit("show-menu", false);
      } else if (!this.menuOpen && this.mainMenuOpen) {
        this.player.emit("show-menu", true);
      } else if (this.menuOpen && !this.mainMenuOpen) {
        this.player.emit("show-main-menu", true);
        this.player.emit("show-menu", true);
      } else {
        this.player.emit("show-main-menu", true);
        this.player.emit("show-menu", true);
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        settingsButton.style.display = "none";
      } else {
        settingsButton.style.display = "flex";
      }
    });

    parent.append(settingsButton);
    return settingsButton;
  }

  createCloseButton(parent: HTMLDivElement, hovered = false) {
    if (!this.player.hasCloseEventHandler) return;

    const closeButton = this.player.createUiButton(parent, "close").get();
    parent.appendChild(closeButton);

    this.player.createSVGElement(
      closeButton,
      "close",
      this.buttons.close,
      false,
      hovered
    );

    closeButton.addEventListener("click", () => {
      this.player.emit("hide-tooltip");
      this.player.emit("close");
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        closeButton.style.display = "none";
      } else {
        closeButton.style.display = "flex";
      }
    });

    return closeButton;
  }

  hasNoMercyConnect(): boolean {
    return this.player.plugins.has('videoNoMercyConnect');
  }

  getNoMercyConnect() {
    if (this.hasNoMercyConnect()) {
      return this.player.plugins.get('videoNoMercyConnect');
    }
    return null;
  }

  getNoMercyConnectSocket() {
    if (this.hasNoMercyConnect()) {
      return this.player.plugins.get('videoNoMercyConnect')?.socket;
    }
    return null;
  }

  sendNoMercyConnectCommand(
    command: string,
    value?: any,
  ) {
    if (this.hasNoMercyConnect()) {
      try {
        const socket = this.getNoMercyConnectSocket();
        if (socket) {
          socket.invoke('PlaybackCommand', command, value !== null ? value : null);
        } else {
          console.error("No NoMercyConnect socket available");
        }
      } catch (error) {
        console.error("Error invoking PlaybackCommand:", error);
      }
    } else {
      console.warn("No NoMercyConnect plugin available");
    }
  }

  createPlaybackButton(parent: HTMLElement, hovered = false) {
    this.playbackButton = this.player.createUiButton(parent, "playback").get();
    parent.appendChild(this.playbackButton);

    this.playbackButton.ariaLabel = this.buttons.play?.title;

    const pausedIcon = this.player.createSVGElement(
      this.playbackButton,
      "paused",
      this.buttons.play,
      false,
      hovered
    );
    const playIcon = this.player.createSVGElement(
      this.playbackButton,
      "playing",
      this.buttons.pause,
      true,
      hovered
    );

    this.playbackButton.addEventListener("click", (event) => {
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand(this.player.isPlaying ? "pause" : "play");
      } else {
        event.stopPropagation();
        this.player.togglePlayback();
        this.player.emit("hide-tooltip");
      }
    });

    this.playbackButton.addEventListener("keydown", () =>
      this.player.emit.bind(this)("dynamicControls")
    );

    this.player.getVideoElement().addEventListener("focus", () => {
      this.player.emit("dynamicControls");
      this.player.getVideoElement().scrollIntoView();
    });

    this.player.on("pause", () => {
      playIcon.style.display = "none";
      pausedIcon.style.display = "flex";
    });
    this.player.on("play", () => {
      pausedIcon.style.display = "none";
      playIcon.style.display = "flex";
    });
    this.player.on("item", () => {
      // this.playbackButton.focus();
    });
  }

  createSeekBackButton(parent: HTMLDivElement, hovered = false) {
    if (this.player.isMobile()) return;
    const seekBack = this.player.createUiButton(parent, "seekBack").get();

    this.player.createSVGElement(
      seekBack,
      "seekBack",
      this.buttons.seekBack,
      false,
      hovered
    );

    seekBack.addEventListener("click", () => {
      this.player.emit("hide-tooltip");
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("rewind");
      } else {
        this.player.rewindVideo();
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        seekBack.style.display = "none";
      } else {
        seekBack.style.display = "flex";
      }
    });

    parent.append(seekBack);
    return seekBack;
  }

  createSeekForwardButton(parent: HTMLDivElement, hovered = false) {
    if (this.player.isMobile()) return;
    const seekForward = this.player.createUiButton(parent, "seekForward").get();

    this.player.createSVGElement(
      seekForward,
      "seekForward",
      this.buttons.seekForward,
      false,
      hovered
    );

    seekForward.addEventListener("click", () => {
      this.player.emit("hide-tooltip");
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("forward");
      } else {
        this.player.forwardVideo();
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        seekForward.style.display = "none";
      } else {
        seekForward.style.display = "flex";
      }
    });

    parent.append(seekForward);
    return seekForward;
  }

  createChapterBackButton(parent: HTMLDivElement, hovered = false) {
    const chapterBack = this.player.createUiButton(parent, "chapterBack").get();
    this.player.addClasses(chapterBack, ["portrait:!hidden"]);

    this.player.on("item", () => {
      chapterBack.style.display = "none";
    });

    this.player.on("chapters", (data) => {
      if (data.cues.length > 0) {
        chapterBack.style.display = "flex";
      } else {
        chapterBack.style.display = "none";
      }
    });

    this.player.createSVGElement(
      chapterBack,
      "chapterBack",
      this.buttons.chapterBack,
      false,
      hovered
    );

    chapterBack.addEventListener("click", () => {
      this.player.emit("hide-tooltip");
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("previousChapter");
      } else {
        this.player.previousChapter()
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        chapterBack.style.display = "none";
      } else {
        chapterBack.style.display = "flex";
      }
    });

    parent.append(chapterBack);
    return chapterBack;
  }

  createChapterForwardButton(parent: HTMLDivElement, hovered = false) {
    const chapterForward = this.player
      .createUiButton(parent, "chapterForward")
      .get();
    this.player.addClasses(chapterForward, ["portrait:!hidden"]);

    this.player.on("item", () => {
      chapterForward.style.display = "none";
    });

    this.player.on("chapters", (data) => {
      if (data.cues.length > 0) {
        chapterForward.style.display = "flex";
      } else {
        chapterForward.style.display = "none";
      }
    });

    this.player.createSVGElement(
      chapterForward,
      "chapterForward",
      this.buttons.chapterForward,
      false,
      hovered
    );

    chapterForward.addEventListener("click", () => {
      this.player.emit("hide-tooltip");
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("nextChapter");
      } else {
        this.player.nextChapter();
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        chapterForward.style.display = "none";
      } else {
        chapterForward.style.display = "flex";
      }
    });

    parent.append(chapterForward);
    return chapterForward;
  }

  createTime(
    parent: HTMLDivElement,
    type: "current" | "remaining" | "duration",
    classes: string[]
  ) {
    const time = this.player
      .createElement("div", `${type}-time`)
      .addClasses([
        ...classes,
        "time",
        "flex",
        "font-mono",
        "items-center",
        "pointer-events-none",
        "select-none",
        "text-sm",
        "justify-center",
        `${type}-time`,
      ])
      .appendTo(parent)
      .get();

    time.innerText = humanTime(this.player.getDuration());

    switch (type) {
      case "current":
        this.player.on("time", (data) => {
          if (this.player.container.classList.contains("active")) {
            time.innerText = humanTime(data.currentTime);
          }
        });

        this.player.on("currentScrubTime", (data) => {
          time.innerText = humanTime(data.currentTime);
        });
        break;

      case "remaining":
        this.player.on("duration", (data) => {
          if (data.remaining === Infinity) {
            time.innerText = "Live";
          } else {
            time.innerText = humanTime(data.remaining);
          }
        });

        this.player.on("time", (data) => {
          if (data.remaining === Infinity) {
            time.innerText = "Live";
          } else if (this.player.container.classList.contains("active")) {
            time.innerText = humanTime(data.remaining);
          }
        });

        break;

      case "duration":
        this.player.on("duration", (data) => {
          if (data.duration === Infinity) {
            time.innerText = "Live";
          } else {
            time.innerText = humanTime(data.duration);
          }
        });
        break;

      default:
        break;
    }

    this.player.on("pip-internal", (data) => {
      if (data) {
        time.style.display = "none";
      } else {
        time.style.display = "";
      }
    });

    return time;
  }

  createVolumeButton(parent: HTMLDivElement, hovered = false) {
    if (this.player.isMobile()) return;

    const volumeContainer = this.player
      .createElement("div", "volume-container")
      .addClasses([
        "volume-container",
        "group/volume",
        "flex",
        "overflow-clip",
        "pointer-events-auto",
      ])
      .appendTo(parent)
      .get();

    const volumeButton = this.player
      .createUiButton(volumeContainer, "volume")
      .get();
    volumeButton.ariaLabel = this.buttons.volumeHigh?.title;

    const volumeSlider = this.player
      .createElement("input", "volume-slider")
      .addClasses([
        "volume-slider",
        "w-0",
        "rounded-full",
        "opacity-0",
        "duration-200",
        "group-hover/volume:w-20",
        "group-hover/volume:mx-2",
        "group-hover/volume:opacity-100",
        "group-focus-within/volume:w-20",
        "group-focus-within/volume:mx-2",
        "group-focus-within/volume:opacity-100",
        "appearance-none",
        "volume-slider",
        "bg-white/70",
        "bg-gradient-to-r",
        "from-white",
        "to-white",
        "self-center",
        "h-1",
        "bg-no-repeat",
        "rounded-full",
        "shadow-sm",
        "transition-all",
        "range-track:appearance-none",
        "range-track:border-none",
        "range-track:bg-transparent",
        "range-track:shadow-none",
        "range-thumb:h-3",
        "range-thumb:w-3",
        "range-thumb:appearance-none",
        "range-thumb:rounded-full",
        "range-thumb:bg-white",
        "range-thumb:shadow-sm",
        "range-thumb:border-none",
      ])
      .appendTo(volumeContainer)
      .get();

    volumeSlider.type = "range";
    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.step = "1";
    volumeSlider.value = this.player.getVolume().toString();
    volumeSlider.style.backgroundSize = `${this.player.getVolume()}% 100%`;

    const mutedButton = this.player.createSVGElement(
      volumeButton,
      "volumeMuted",
      this.buttons.volumeMuted,
      true,
      hovered
    );
    const lowButton = this.player.createSVGElement(
      volumeButton,
      "volumeLow",
      this.buttons.volumeLow,
      true,
      hovered
    );
    const mediumButton = this.player.createSVGElement(
      volumeButton,
      "volumeMedium",
      this.buttons.volumeMedium,
      true,
      hovered
    );
    const highButton = this.player.createSVGElement(
      volumeButton,
      "volumeHigh",
      this.buttons.volumeHigh,
      false,
      hovered
    );

    volumeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("mute", !this.player.getMute());
      } else {
        this.player.toggleMute();
      }
      this.player.emit("hide-tooltip");
    });

    volumeSlider.addEventListener("input", (event) => {
      event.stopPropagation();
      const newVolume = Math.floor(parseInt(volumeSlider.value, 10));
      volumeSlider.style.backgroundSize = `${newVolume}% 100%`;
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("volume", newVolume);
      } else {
        this.player.setVolume(newVolume);
      }
    });

    volumeContainer.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const delta = event.deltaY === 0 ? -event.deltaX : -event.deltaY;
        if (delta === 0) {
          return;
        }

        volumeSlider.style.backgroundSize = `${volumeSlider.value}% 100%`;
        volumeSlider.value = (
          parseFloat(volumeSlider.value) +
          delta * 0.5
        ).toString();

        if(this.hasNoMercyConnect()){
          this.sendNoMercyConnectCommand("volume", parseFloat(volumeSlider.value));
        } else {
          this.player.setVolume(parseFloat(volumeSlider.value));
        }
      },
      {
        passive: true,
      }
    );

    this.player.on("volume", (data) => {
      this.volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
      volumeSlider.style.backgroundSize = `${data.volume}% 100%`;
      volumeSlider.value = data.volume.toString();
    });

    this.player.on("mute", (data) => {
      this.volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
      if (data.muted) {
        volumeSlider.style.backgroundSize = `${0}% 100%`;
        volumeSlider.value = "0";
      } else {
        volumeSlider.style.backgroundSize = `${this.player.getVolume()}% 100%`;
        volumeSlider.value = this.player.getVolume().toString();
      }
    });

    return volumeContainer;
  }

  volumeHandle(
    data: VolumeState,
    mutedButton: SVGElement,
    lowButton: SVGElement,
    mediumButton: SVGElement,
    highButton: SVGElement
  ) {
    if (this.player.getMute() || data.volume === 0) {
      lowButton.style.display = "none";
      mediumButton.style.display = "none";
      highButton.style.display = "none";
      mutedButton.style.display = "flex";
    }
    else if (data.volume <= 30) {
      mediumButton.style.display = "none";
      highButton.style.display = "none";
      mutedButton.style.display = "none";
      lowButton.style.display = "flex";
    }
    else if (data.volume <= 60) {
      lowButton.style.display = "none";
      highButton.style.display = "none";
      mutedButton.style.display = "none";
      mediumButton.style.display = "flex";
    }
    else {
      lowButton.style.display = "none";
      mediumButton.style.display = "none";
      mutedButton.style.display = "none";
      highButton.style.display = "flex";
    }
  }

  createPreviousButton(parent: HTMLDivElement, hovered = false) {
    const previousButton = this.player.createUiButton(parent, "previous").get();

    this.player.addClasses(previousButton, ["portrait:!hidden"]);

    previousButton.style.display = "none";

    this.player.createSVGElement(
      previousButton,
      "previous",
      this.buttons.previous,
      false,
      hovered
    );

    previousButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("previous");
      } else {
        this.player.previous();
      }
      this.player.emit("hide-tooltip");
    });

    if (this.player.getPlaylistIndex() > 0) {
      previousButton.style.display = "flex";
    } else {
      previousButton.style.display = "none";
    }

    this.player.on("item", () => {
      if (this.player.getPlaylistIndex() > 0) {
        previousButton.style.display = "flex";
      } else {
        previousButton.style.display = "none";
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        previousButton.style.display = "none";
      } else if (this.player.playlistItem().episode ?? -0 - 1 === 0) {
        previousButton.style.display = "flex";
      }
    });

    previousButton.addEventListener("mouseenter", () => {
      const playerRect = previousButton.getBoundingClientRect();
      const previousTipRect = parent.getBoundingClientRect();

      let x = Math.abs(previousTipRect.left - playerRect.left + 50);
      const y = Math.abs(previousTipRect.bottom - playerRect.bottom - 60);

      if (x < 30) {
        x = 30;
      }

      if (x > playerRect.right - playerRect.left - 10) {
        x = playerRect.right - playerRect.left - 10;
      }

      this.player.emit("show-episode-tip", {
        direction: "previous",
        currentTime: "bottom",
        x: `${x}px`,
        y: `-${y}px`,
      });
    });

    previousButton.addEventListener("mouseleave", () => {
      this.player.emit("hide-episode-tip");
    });

    parent.appendChild(previousButton);
    return previousButton;
  }

  createNextButton(parent: HTMLDivElement, hovered = false) {
    const nextButton = this.player.createUiButton(parent, "next").get();

    this.player.addClasses(nextButton, ["portrait:!hidden"]);

    nextButton.style.display = "none";
    this.player.hasNextTip = true;

    this.player.createSVGElement(
      nextButton,
      "next",
      this.buttons.next,
      false,
      hovered
    );

    nextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("next");
      } else {
        this.player.next();
      }
      this.player.emit("hide-tooltip");
    });

    if (this.player.isLastPlaylistItem()) {
      nextButton.style.display = "none";
    } else {
      nextButton.style.display = "flex";
    }

    this.player.on("item", () => {
      if (this.player.isLastPlaylistItem()) {
        nextButton.style.display = "none";
      } else {
        nextButton.style.display = "flex";
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        nextButton.style.display = "none";
      } else if (this.player.isLastPlaylistItem()) {
        nextButton.style.display = "flex";
      }
    });

    nextButton.addEventListener("mouseenter", () => {
      const playerRect = nextButton.getBoundingClientRect();
      const nextTipRect = parent.getBoundingClientRect();

      let x = Math.abs(nextTipRect.left - playerRect.left + 50);
      const y = Math.abs(nextTipRect.bottom - playerRect.bottom - 60);

      if (x < 30) {
        x = 30;
      }

      if (x > playerRect.right - playerRect.left - 10) {
        x = playerRect.right - playerRect.left - 10;
      }

      this.player.emit("show-episode-tip", {
        direction: "next",
        currentTime: "bottom",
        x: `${x}px`,
        y: `-${y}px`,
      });
    });

    nextButton.addEventListener("mouseleave", () => {
      this.player.emit("hide-episode-tip");
    });

    parent.appendChild(nextButton);
    return nextButton;
  }

  createCaptionsButton(parent: HTMLElement, hovered = false) {
    const captionButton = this.player.createUiButton(parent, "subtitles").get();

    this.player.addClasses(captionButton, ["portrait:!hidden"]);

    captionButton.style.display = "none";
    captionButton.ariaLabel = this.buttons.subtitles?.title;

    const offButton = this.player.createSVGElement(
      captionButton,
      "subtitle",
      this.buttons.subtitlesOff,
      false,
      hovered
    );
    const onButton = this.player.createSVGElement(
      captionButton,
      "subtitled",
      this.buttons.subtitles,
      true,
      hovered
    );

    captionButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("hide-tooltip");

      if (this.subtitlesMenuOpen) {
        this.player.emit("show-menu", false);
      } else {
        this.player.emit("show-subtitles-menu", true);
        this.player.emit("show-subtitleSettings-menu", false);
        this.menuFrame.showModal();
      }
    });

    if (this.player.hasCaptions()) {
      captionButton.style.display = "flex";
    } else {
      captionButton.style.display = "none";
    }

    this.player.on("captionsList", (tracks) => {
      if (tracks.length > 1) {
        captionButton.style.display = "flex";
      } else {
        captionButton.style.display = "none";
      }
    });

    this.player.on("captionsChanging", (data) => {
      if (data.id === -1) {
        onButton.style.display = "none";
        offButton.style.display = "flex";
      } else {
        onButton.style.display = "flex";
        offButton.style.display = "none";
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        captionButton.style.display = "none";
      } else if (this.player.hasCaptions()) {
        captionButton.style.display = "flex";
      }
    });

    parent.appendChild(captionButton);
    return captionButton;
  }

  createAudioButton(parent: HTMLElement, hovered = false) {
    const audioButton = this.player.createUiButton(parent, "audio").get();

    this.player.addClasses(audioButton, ["portrait:!hidden"]);

    audioButton.style.display = "none";
    audioButton.ariaLabel = this.buttons.language?.title;

    this.player.createSVGElement(
      audioButton,
      "audio",
      this.buttons.languageOff,
      false,
      hovered
    );

    audioButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("hide-tooltip");

      if (this.languageMenuOpen) {
        this.player.emit("show-menu", false);
      } else {
        this.player.emit("show-language-menu", true);
        this.menuFrame.showModal();
      }
    });

    this.player.on("item", () => {
      audioButton.style.display = "none";
    });

    if (this.player.hasAudioTracks()) {
      audioButton.style.display = "flex";
    } else {
      audioButton.style.display = "none";
    }
    this.player.on("audioTracks", (tracks) => {
      if (tracks.length > 1) {
        audioButton.style.display = "flex";
      } else {
        audioButton.style.display = "none";
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        audioButton.style.display = "none";
      } else if (this.player.hasAudioTracks()) {
        audioButton.style.display = "flex";
      }
    });

    parent.appendChild(audioButton);
    return audioButton;
  }

  createQualityButton(parent: HTMLElement, hovered = false) {
    const qualityButton = this.player.createUiButton(parent, "quality").get();

    this.player.addClasses(qualityButton, ["portrait:!hidden"]);

    qualityButton.style.display = "none";

    const offButton = this.player.createSVGElement(
      qualityButton,
      "low",
      this.buttons.quality,
      false,
      hovered
    );
    const onButton = this.player.createSVGElement(
      qualityButton,
      "high",
      this.buttons.quality,
      true,
      hovered
    );

    qualityButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("hide-tooltip");

      if (this.qualityMenuOpen) {
        this.player.emit("show-menu", false);
      } else {
        this.player.emit("show-menu", true);
        this.player.emit("show-quality-menu", true);
        this.menuFrame.showModal();
      }

      if (this.highQuality) {
        this.highQuality = false;
        onButton.style.display = "none";
        offButton.style.display = "flex";
      } else {
        this.highQuality = true;
        offButton.style.display = "none";
        onButton.style.display = "flex";
      }

      // this.player.toggleLanguage();
    });

    this.player.on("item", () => {
      qualityButton.style.display = "none";
    });

    if (this.player.hasQualities()) {
      qualityButton.style.display = "flex";
    } else {
      qualityButton.style.display = "none";
    }

    this.player.on("levels", () => {
      if (this.player.hasQualities()) {
        qualityButton.style.display = "flex";
      } else {
        qualityButton.style.display = "none";
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        qualityButton.style.display = "none";
      } else if (this.player.hasQualities()) {
        qualityButton.style.display = "flex";
      }
    });

    parent.appendChild(qualityButton);
    return qualityButton;
  }

  createTheaterButton(parent: HTMLDivElement, hovered = false) {
    if (this.player.isMobile() || !this.player.hasTheaterEventHandler) return;

    const theaterButton = this.player.createUiButton(parent, "theater").get();

    this.player.createSVGElement(
      theaterButton,
      "theater",
      this.buttons.theater,
      hovered
    );
    this.player.createSVGElement(
      theaterButton,
      "theater-enabled",
      this.buttons.theaterExit,
      true,
      hovered
    );

    theaterButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("hide-tooltip");

      if (this.theaterModeEnabled) {
        this.theaterModeEnabled = false;
        theaterButton.querySelector<any>(
          ".theater-enabled-icon"
        ).style.display = "none";
        theaterButton.querySelector<any>(".theater-icon").style.display =
          "flex";
        this.player.emit("theaterMode", false);
        this.player.emit("resize");
      } else {
        this.theaterModeEnabled = true;
        theaterButton.querySelector<any>(".theater-icon").style.display =
          "none";
        theaterButton.querySelector<any>(
          ".theater-enabled-icon"
        ).style.display = "flex";
        this.player.emit("theaterMode", true);
        this.player.emit("resize");
      }

      // this.player.toggleLanguage();
    });

    this.player.on("fullscreen", () => {
      if (this.player.getFullscreen()) {
        theaterButton.style.display = "none";
      } else {
        theaterButton.style.display = "flex";
      }
    });
    this.player.on("pip-internal", (data) => {
      if (data) {
        theaterButton.style.display = "none";
      } else {
        theaterButton.style.display = "flex";
      }
    });

    parent.appendChild(theaterButton);
    return theaterButton;
  }

  createFullscreenButton(parent: HTMLElement, hovered = false) {
    const fullscreenButton = this.player
      .createUiButton(parent, "fullscreen")
      .get();

    this.player.createSVGElement(
      fullscreenButton,
      "fullscreen",
      this.buttons.fullscreen,
      false,
      hovered
    );
    this.player.createSVGElement(
      fullscreenButton,
      "fullscreen-enabled",
      this.buttons.exitFullscreen,
      true,
      hovered
    );

    fullscreenButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.toggleFullscreen();
      this.player.emit("hide-tooltip");
    });
    this.player.on("fullscreen", (enabled) => {
      if (enabled) {
        fullscreenButton.querySelector<any>(".fullscreen-icon").style.display =
          "none";
        fullscreenButton.querySelector<any>(
          ".fullscreen-enabled-icon"
        ).style.display = "flex";
      } else {
        fullscreenButton.querySelector<any>(
          ".fullscreen-enabled-icon"
        ).style.display = "none";
        fullscreenButton.querySelector<any>(".fullscreen-icon").style.display =
          "flex";
      }
    });

    this.player.on("pip-internal", (enabled) => {
      if (enabled) {
        fullscreenButton.style.display = "none";
      } else {
        fullscreenButton.style.display = "flex";
      }
    });

    parent.appendChild(fullscreenButton);
    return fullscreenButton;
  }

  createPlaylistsButton(parent: HTMLDivElement, hovered = false) {
    const playlistButton = this.player.createUiButton(parent, "playlist").get();

    this.player.addClasses(playlistButton, ["portrait:!hidden"]);

    playlistButton.style.display = "none";

    this.player.createSVGElement(
      playlistButton,
      "playlist",
      this.buttons.playlist,
      false,
      hovered
    );

    playlistButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("hide-tooltip");

      if (this.playlistMenuOpen) {
        this.player.emit("show-menu", false);
      } else {
        this.player.emit("show-playlist-menu", true);
        this.menuFrame.showModal();

        setTimeout(() => {
          document
            .querySelector(`playlist-${this.player.playlistItem().id}`)
            ?.scrollIntoView({ block: "center" });
        }, 100);
      }
    });

    if (this.player.hasPlaylists()) {
      playlistButton.style.display = "flex";
    } else {
      playlistButton.style.display = "none";
    }

    this.player.on("item", () => {
      if (this.player.hasPlaylists()) {
        playlistButton.style.display = "flex";
      } else {
        playlistButton.style.display = "none";
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        playlistButton.style.display = "none";
      } else if (this.player.hasPlaylists()) {
        playlistButton.style.display = "flex";
      }
    });

    parent.appendChild(playlistButton);
    return playlistButton;
  }

  createBottomBar(parent: HTMLElement) {
    const bottomBar = this.player
      .createElement("div", "bottom-bar")
      .addClasses([
        "bottom-bar",
        "absolute",
        "bottom-0",
        "duration-200",
        "flex",
        "flex-col",
        "gap-2",
        "group-[&.nomercyplayer.paused]:translate-y-0",
        "group-[&.nomercyplayer:has(.open)]:translate-y-0",
        "group-[&.nomercyplayer.active]:translate-y-0",
        "group-[&.nomercyplayer:has(.volume-container:hover)]:!translate-y-0",
        "group-[&.nomercyplayer:has(.open)]:!translate-y-40",
        "items-center",
        "mt-auto",
        "text-center",
        "transition-all",
        "translate-y-[100vh]",
        "w-available",
        "z-10",
        "pointer-events-none",
      ])
      .appendTo(parent)
      .get();

    this.player
      .createElement("div", "bottom-bar-shadow")
      .addClasses([
        "absolute",
        "pointer-events-none",
        "pt-[3%]",
        "w-available",
        "bottom-0",
        "bg-gradient-to-t",
        "from-black/85",
        "via-black/60",
        "to-black/0",
      ])
      .appendTo(bottomBar)
      .get();

    return bottomBar;
  }

  createDivider(parent: HTMLElement, content?: any) {
    const dividerStyles = ["divider", "flex", "flex-1", "min-w-4"];
    const divider = this.player
      .createElement("div", "divider")
      .addClasses(dividerStyles)
      .appendTo(parent)
      .get();

    if (content) {
      divider.innerHTML = content;
    } else {
      this.player.addClasses(divider, dividerStyles);
    }

    return divider;
  }

  createOverlayCenterMessage(parent: HTMLDivElement) {
    const playerMessage = this.player
      .createElement("button", "player-message")
      .addClasses([
        "player-message",
        "hidden",
        "absolute",
        "rounded-md",
        "bg-neutral-900/95",
        "left-1/2",
        "px-4",
        "py-2",
        "pointer-events-none",
        "text-center",
        "top-12",
        "-translate-x-1/2",
        "z-50",
      ])
      .appendTo(parent)
      .get();

    this.player.on("display-message", (val: string | null) => {
      playerMessage.style.display = "flex";
      playerMessage.innerText = val ?? "";
    });
    this.player.on("remove-message", () => {
      playerMessage.style.display = "none";
      playerMessage.innerText = "";
    });

    return playerMessage;
  }

  createTopBar(parent: HTMLElement) {
    return this.player
      .createElement("div", "top-bar")
      .addClasses([
        "top-bar",
        "-translate-y-[100vh]",
        "absolute",
        "flex",
        "gap-2",
        "items-start",
        "justify-between",
        "mb-auto",
        "pb-[10%]",
        "px-6",
        "py-4",
        "top-0",
        "w-available",
        "z-10",
        "pointer-events-none",
        "group-[&.nomercyplayer.active]:translate-y-0",
        "group-[&.nomercyplayer.paused]:translate-y-0",
        "group-[&.nomercyplayer:has(.open)]:-translate-y-full",

        "group-[&.nomercyplayer:has(.volume-container:hover)]:!translate-y-0",
        "transition-all",
        "duration-200",

        "bg-gradient-to-b",
        "from-black/85",
        "via-black/40",
        "to-black/0",
      ])
      .appendTo(parent)
      .get();
  }

  createTvCurrentItem(parent: HTMLElement) {
    const currentItemContainer = this.player
      .createElement("div", "current-item-container")
      .addClasses(["flex", "flex-col", "justify-end", "items-end", "gap-2"])
      .appendTo(parent)
      .get();

    const currentItemShow = this.player
      .createElement("div", "current-item-show")
      .addClasses(["text-white", "text-sm", "font-bold"])
      .appendTo(currentItemContainer)
      .get();

    const currentItemTitleContainer = this.player
      .createElement("div", "current-item-title-container")
      .addClasses(["flex", "flex-row", "gap-2"])
      .appendTo(currentItemContainer)
      .get();

    const currentItemEpisode = this.player
      .createElement("div", "current-item-episode")
      .addClasses([])
      .appendTo(currentItemTitleContainer)
      .get();

    const currentItemTitle = this.player
      .createElement("div", "current-item-title")
      .addClasses(["whitespace-pre", "text-sm"])
      .appendTo(currentItemTitleContainer)
      .get();

    this.player.on("item", () => {
      const item = this.player.playlistItem();
      currentItemShow.innerHTML = breakLogoTitle(item.show ?? "");
      currentItemEpisode.innerHTML = "";
      if (item.season) {
        currentItemEpisode.innerHTML += `${this.player.localize("S")}${
          item.season
        }`;
      }
      if (item.season && item.episode) {
        currentItemEpisode.innerHTML += `: ${this.player.localize("E")}${
          item.episode
        }`;
      }
      currentItemTitle.innerHTML = breakEpisodeTitle(
        item.title?.replace(item.show ?? "", "").length > 0
          ? `"${item.title
              ?.replace(item.show ?? "", "")
              .replace("%S", this.player.localize("S"))
              .replace("%E", this.player.localize("E"))}"`
          : ""
      );
    });

    return currentItemContainer;
  }

  createLanguageMenuButton(
    parent: HTMLDivElement,
    data: {
      language: string;
      label: string;
      type: string;
      id: number;
      styled?: boolean;
      buttonType: string;
    },
    hovered = false
  ) {
    const languageButton = this.player
      .createElement("button", `${data.type}-button-${data.language}`)
      .addClasses(this.languageMenuStyles)
      .appendTo(parent)
      .get();

    const languageButtonText = this.player
      .createElement("span", "menu-button-text")
      .addClasses(this.menuButtonTextStyles)
      .appendTo(languageButton)
      .get();

    if (data.buttonType === "subtitle") {
      if (data.styled) {
        languageButtonText.innerText = `${this.player.localize(
          data.language ?? ""
        )} ${this.player.localize(data.label)} ${this.player.localize(
          "styled"
        )}`;
      } else if (data.language === "") {
        languageButtonText.innerText = this.player.localize(data.label);
      } else {
        languageButtonText.innerText = `${this.player.localize(
          data.language ?? ""
        )} (${this.player.localize(data.type)})`;
      }
    }
    else {
      languageButtonText.innerText = this.player.localize(data.language) + ' ' + (this.player.getPlaylistItem().audio.at(data.id)?.channel_layout || '');
    }

    const chevron = this.player.createSVGElement(
      languageButton,
      "checkmark",
      this.buttons.checkmark,
      false,
      hovered
    );

    this.player.addClasses(chevron, ["ml-auto", "hidden"]);

    if (data.buttonType === "audio") {
      if (data.id === this.player.getAudioTrackIndex()) {
        chevron.classList.remove("hidden");
      } else {
        chevron.classList.add("hidden");
      }
      this.player.on("audioTrackChanging", (audio) => {
        if (data.id === audio.id) {
          chevron.classList.remove("hidden");
        } else {
          chevron.classList.add("hidden");
        }
      });

      languageButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if(this.hasNoMercyConnect()){
          this.sendNoMercyConnectCommand("audio", data.id);
        } else {
          this.player.setCurrentAudioTrack(data.id);
        }
        this.player.emit("show-menu", false);
      });
    }
    else if (data.buttonType === "subtitle") {
      if (data.id === this.player.getCaptionIndex()) {
        chevron.classList.remove("hidden");
      } else {
        chevron.classList.add("hidden");
      }

      this.player.on("captionsChanged", (track) => {
        if (data.id === track.id) {
          chevron.classList.remove("hidden");
        } else {
          chevron.classList.add("hidden");
        }
      });

      languageButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if(this.hasNoMercyConnect()){
          this.sendNoMercyConnectCommand("caption", data.id);
        } else {
          this.player.setCurrentCaption(data.id);
        }
        this.player.emit("show-menu", false);
      });
    }

    this.addKeyEventsToLanguageButton(languageButton, parent);

    return languageButton;
  }

  addKeyEventsToLanguageButton(
    languageButton: HTMLButtonElement,
    parent: HTMLDivElement
  ) {
    languageButton.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        this.player
          .getClosestElement(languageButton, '[id^="audio-button-"]')
          ?.focus();
      } else if (e.key === "ArrowRight") {
        this.player
          .getClosestElement(languageButton, '[id^="subtitle-button-"]')
          ?.focus();
      } else if (
        e.key === "ArrowUp" &&
        !this.player.options.disableTouchControls
      ) {
        (languageButton.previousElementSibling as HTMLButtonElement)?.focus();
      } else if (
        e.key === "ArrowDown" &&
        !this.player.options.disableTouchControls
      ) {
        (languageButton.nextElementSibling as HTMLButtonElement)?.focus();
      }
    });

    languageButton.addEventListener("focus", () => {
      setTimeout(() => {
        this.player.scrollCenter(
          languageButton,
          parent.parentElement as HTMLDivElement,
          {
            margin: 1,
            duration: 100,
          }
        );
      }, 50);
    });
  }

  createThumbnail(time: PreviewTime) {
    const thumbnail = this.player
      .createElement("div", `thumbnail-${time.start}`)
      .addClasses([
        "w-1/5",
        "h-auto",
        "object-cover",
        "aspect-video",
        "snap-center",
      ])
      .get();

    thumbnail.style.backgroundImage = `url('${this.previewImage.src}')`;
    thumbnail.style.backgroundPosition = `-${time.x}px -${time.y}px`;
    thumbnail.style.width = `max(232px, ${time.w}px)`;
    thumbnail.style.minWidth = `max(232px, ${time.w}px)`;
    thumbnail.style.aspectRatio = `${time.w} / ${time.h}`;

    this.thumbnailClone.style.aspectRatio = `${time.w} / ${time.h}`;
    this.thumbnailClone.style.width = `max(232px, ${time.w}px)`;
    this.thumbnailClone.style.minWidth = `max(232px, ${time.w}px)`;

    return thumbnail;
  }

  async getSliderPopImage(scrubTime: any) {
    const img = await this.loadSliderPopImage(scrubTime);

    if (img) {
      this.sliderPopImage.style.backgroundPosition = `-${img.x}px -${img.y}px`;
      this.sliderPopImage.style.width = `${img.w}px`;
      this.sliderPopImage.style.height = `${img.h}px`;
      this.chapterText.style.width = `${img.w}px`;
    }
  }

  adjustScaling(imgDimension: number, thumbnailDimension: number) {
    const scaling = imgDimension % thumbnailDimension;
    if (scaling % 1 !== 0) {
      imgDimension /= scaling / Math.round(scaling);
    }
    if (scaling > 1) {
      imgDimension *= scaling;
    }
    return imgDimension;
  }

  async loadSliderPopImage(scrubTime?: any) {
    await this.fetchPreviewTime();

    let img = this.previewTime.find(
      (p: { start: number; end: number }) =>
        scrubTime.scrubTimePlayer >= p.start &&
        scrubTime.scrubTimePlayer < p.end
    );
    if (!img) {
      img = this.previewTime.at(-1);
    }
    return img;
  }
}
