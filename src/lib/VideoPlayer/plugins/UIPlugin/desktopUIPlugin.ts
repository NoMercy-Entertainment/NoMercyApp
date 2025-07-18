import {
  humanTime,
  convertToSeconds,
  limitSentenceByCharacters,
  lineBreakShowTitle,
  unique,
} from "@nomercy-entertainment/nomercy-video-player/src/helpers";

import { BaseUIPlugin } from "./baseUIPlugin";

import {
  Chapter,
  PlaylistItem,
  Position,
  SubtitleStyle,
} from "@nomercy-entertainment/nomercy-video-player/src/types";
import {
  edgeStyles,
  fontFamilies,
  SubtitleSettingAction,
  subtitleSettingActions,
  defaultSubtitleStyles,
} from "./buttons";

export class DesktopUIPlugin extends BaseUIPlugin {
  topBar: HTMLDivElement = <HTMLDivElement>{};
  bottomRow: HTMLDivElement = <HTMLDivElement>{};
  frame: HTMLDivElement = <HTMLDivElement>{};
  center: HTMLDivElement = <HTMLDivElement>{};

  isMouseDown = false;
  pipEnabled = false;
  lockActive = false;

  bottomBar: HTMLDivElement = <HTMLDivElement>{};
  topRow: HTMLDivElement = <HTMLDivElement>{};

  tooltip: HTMLDivElement = <HTMLDivElement>{};
  episodeTip: HTMLDivElement = <HTMLDivElement>{};

  scrollContainerStyles = [
    "scroll-container",
    "flex",
    "flex-col",
    "gap-1",
    "language-scroll-container",
    "overflow-x-hidden",
    "overflow-y-auto",
    "p-2",
    "transition-all",
    "duration-200",
    "w-available",
    "scroll-p-4",
    "scroll-snap-align-center",
    "scroll-smooth",
    "scroll-p-4",
  ];

  subMenuContentStyles = [
    "sub-menu-content",
    "flex",
    "flex-col",
    "max-h-available",
    "w-available",
    "overflow-auto",
    "min-w-52",
  ];

  subtitleSettingActions: SubtitleSettingAction[] = [];

  use() {
    this.subtitleSettingActions = subtitleSettingActions(this.player);

    this.topBar = this.createTopBar(this.overlay);

    this.createBackButton(this.topBar);
    this.createCloseButton(this.topBar);
    this.createDivider(this.topBar);
    this.createTvCurrentItem(this.topBar);

    if (!this.player.options.disableTouchControls) {
      this.center = this.createCenter(this.overlay);
    }

    this.bottomBar = this.createBottomBar(this.overlay);

    this.bottomBar.onmouseleave = (e) => {
      const playerRect = this.player.getVideoElement()?.getBoundingClientRect();
      if (
        !playerRect ||
        (e.x > playerRect.left &&
          e.x < playerRect.right &&
          e.y > playerRect.top &&
          e.y < playerRect.bottom)
      )
        return;
      this.player.emit("hide-tooltip");
    };

    this.topRow = this.createTopRow(this.bottomBar);

    this.player.addClasses(this.topRow, ["mt-4"]);

    this.bottomRow = this.createBottomRow(this.bottomBar);

    this.createProgressBar(this.topRow);

    this.createPlaybackButton(this.bottomRow, true);

    this.createPreviousButton(this.bottomRow, true);

    if (this.player.options.seekButtons) {
      this.createSeekBackButton(this.bottomRow, true);

      this.createSeekForwardButton(this.bottomRow, true);
    }

    this.createChapterBackButton(this.bottomRow, true);

    this.createChapterForwardButton(this.bottomRow, true);

    this.createNextButton(this.bottomRow, true);

    this.createVolumeButton(this.bottomRow, true);

    this.createTime(this.bottomRow, "current", ["ml-2"]);
    this.createDivider(this.bottomRow);
    this.createTime(this.bottomRow, "remaining", ["mr-2"]);

    this.createTheaterButton(this.bottomRow, true);
    this.createPIPButton(this.bottomRow, true);

    this.createPlaylistsButton(this.bottomRow, true);

    // this.createSpeedButton(this.bottomRow, true);
    this.createCaptionsButton(this.bottomRow, true);
    this.createAudioButton(this.bottomRow, true);
    this.createQualityButton(this.bottomRow, true);
    this.createSettingsButton(this.bottomRow, true);

    this.createFullscreenButton(this.bottomRow, true);

    this.frame = this.createMenuFrame(this.bottomRow);

    this.createMainMenu(this.frame);

    this.createToolTip(this.overlay);

    this.episodeTip = this.createEpisodeTip(this.overlay);

    this.modifySpinner(this.overlay);

    this.eventHandlers();
  }

  dispose() {
    this.topBar.remove();
    this.bottomBar.remove();
    this.bottomRow.remove();
    this.frame.remove();
    this.center?.remove();
    this.tooltip.remove();
    this.episodeTip.remove();
    this.loader.remove();
  }

  createTopRow(parent: HTMLDivElement) {
    return this.player
      .createElement("div", "top-row")
      .addClasses([
        "top-row",
        "flex",
        "gap-1",
        "h-2",
        "items-center",
        "pl-2",
        "pr-2",
        "relative",
        "w-available",
      ])
      .appendTo(parent)
      .get();
  }

  createBottomRow(parent: HTMLDivElement) {
    return this.player
      .createElement("div", "bottom-row")
      .addClasses([
        "bottom-row",
        "flex",
        "h-10",
        "lg:mb-2",
        "p-1",
        "lg:px-4",
        "items-center",
        "relative",
        "w-available",
      ])
      .appendTo(parent)
      .get();
  }

  eventHandlers() {
    // this.player.on('controls', (showing) => {
    // 	if (this.player.getElement()) {
    // 		if (showing) {
    // 			this.player.getElement()?.setAttribute('active', 'true');
    // 		} else {
    // 			this.player.getElement()?.setAttribute('active', 'false');
    // 		}
    // 	}
    // });

    this.player.on("chapters", () => {
      this.createChapterMarkers();
    });

    this.player.on("back-button", () => {
      switch (this.currentMenu) {
        case "episode":
        case "language":
        case "quality":
          this.player.emit("showPauseScreen");
          break;
        case "seek":
        case "pause":
          this.seekContainer.style.transform = "";
          this.player.play().then();
          break;
        default:
          break;
      }
    });

    window.addEventListener("resize", () => {
      this.sizeMenuFrame();
    });
  }

  createCenter(parent: HTMLElement) {
    const center = this.player
      .createElement("div", "center")
      .addClasses([
        "center",
        "absolute",
        "grid",
        "grid-cols-3",
        "grid-rows-6",
        "h-full",
        "w-full",
        "z-0",

        "transition-all",
        "duration-200",

        "bg-transparent",
        "group-[&.nomercyplayer:not(.buffering).paused]:bg-gradient-circle-c",

        "from-15%",
        "from-black/50",
        "via-40%",
        "via-black/30",
        "to-100%",
        "to-black/0",
      ])
      .appendTo(parent)
      .get();

    this.createSpinnerContainer(center);

    if (this.player.isMobile()) {
      this.createTouchSeekBack(center, {
        x: { start: 1, end: 1 },
        y: { start: 2, end: 6 },
      });
      this.createTouchPlayback(center, {
        x: { start: 2, end: 2 },
        y: { start: 3, end: 5 },
      });
      this.createTouchSeekForward(center, {
        x: { start: 3, end: 3 },
        y: { start: 2, end: 6 },
      });
      this.createTouchVolUp(center, {
        x: { start: 2, end: 2 },
        y: { start: 1, end: 3 },
      });
      this.createTouchVolDown(center, {
        x: { start: 2, end: 2 },
        y: { start: 5, end: 7 },
      });
    } else {
      this.createTouchSeekBack(center, {
        x: { start: 1, end: 2 },
        y: { start: 2, end: 6 },
      });
      this.createTouchPlayback(center, {
        x: { start: 2, end: 3 },
        y: { start: 2, end: 6 },
      });
      this.createTouchSeekForward(center, {
        x: { start: 3, end: 4 },
        y: { start: 2, end: 6 },
      });
    }

    return center;
  }

  createTouchSeekBack(parent: HTMLElement, currentTime: Position) {
    const touchSeekBack = this.createTouchBox(
      parent,
      "touchSeekBack",
      currentTime
    );
    ["click"].forEach((event) => {
      touchSeekBack.addEventListener(
        event,
        this.player.doubleTap(
          () => {
            if(this.hasNoMercyConnect()){
              this.player.rewindVideo();
              this.sendNoMercyConnectCommand("backward");
            } else {
              this.player.rewindVideo();
            }
          },
          () => {
            if (this.controlsVisible) {
              this.player.emit("hideControls");
            }
          }
        )
      );
    });

    this.createSeekRipple(touchSeekBack, "left");

    return touchSeekBack;
  }

  createTouchSeekForward(parent: HTMLElement, currentTime: Position) {
    const touchSeekForward = this.createTouchBox(
      parent,
      "touchSeekForward",
      currentTime
    );
    ["mouseup", "touchend"].forEach((event) => {
      touchSeekForward.addEventListener(
        event,
        this.player.doubleTap(
          () => {
            if(this.hasNoMercyConnect()){
              this.player.forwardVideo();
              this.sendNoMercyConnectCommand("forward");
            } else {
              this.player.forwardVideo();
            }
          },
          () => {
            if (this.controlsVisible) {
              this.player.emit("hideControls");
            }
          }
        )
      );
    });

    this.createSeekRipple(touchSeekForward, "right");

    return touchSeekForward;
  }

  createTouchPlayback(
    parent: HTMLElement,
    currentTime: Position,
    hovered = false
  ) {
    const touchPlayback = this.createTouchBox(
      parent,
      "touchPlayback",
      currentTime
    );
    this.player.addClasses(touchPlayback, [
      "touch-playback",
      "flex",
      "-ml-2",
      "items-center",
      "justify-center",
    ]);

    ["click"].forEach((event) => {
      touchPlayback.addEventListener(
        event,
        this.player.doubleTap(
          () => {
            this.player.toggleFullscreen();
          },
          () => {
            if(this.controlsVisible){
              if(this.hasNoMercyConnect()){
                this.sendNoMercyConnectCommand(this.player.isPlaying ? "pause" : "play");
              } else {
                this.player.togglePlayback();
              }
            }
          }
        )
      );
    });

    const playButton = this.player.createSVGElement(
      touchPlayback,
      "bigPlay",
      this.buttons.bigPlay,
      false,
      hovered
    );
    this.player.addClasses(playButton, [
      "touch-playback-button",
      "pointer-events-none",
      "fill-white",
    ]);

    this.player.on("ready", () => {
      playButton.style.display = "flex";
    });
    this.player.on("pause", () => {
      playButton.style.display = "flex";
    });

    this.player.on("play", () => {
      playButton.style.display = "none";
    });
    this.player.on("time", () => {
      playButton.style.display = "none";
    });
    this.player.on("firstFrame", () => {
      playButton.style.display = "none";
    });

    return touchPlayback;
  }

  createTouchVolUp(parent: HTMLElement, currentTime: Position) {
    if (!this.player.isMobile()) return;
    const touchVolUp = this.createTouchBox(parent, "touchVolUp", currentTime);
    ["click"].forEach((event) => {
      touchVolUp.addEventListener(
        event,
        this.player.doubleTap(
          () => {
            this.player.volumeUp();
          },
          () => {
            if (this.controlsVisible) {
              this.player.emit("hideControls");
            }
          }
        )
      );
    });

    return touchVolUp;
  }

  createTouchVolDown(parent: HTMLElement, currentTime: Position) {
    if (!this.player.isMobile()) return;
    const touchVolDown = this.createTouchBox(
      parent,
      "touchVolDown",
      currentTime
    );
    ["click"].forEach((event) => {
      touchVolDown.addEventListener(
        event,
        this.player.doubleTap(
          () => {
            this.player.volumeDown();
          },
          () => {
            if (this.controlsVisible) {
              this.player.emit("hideControls");
            }
          }
        )
      );
    });

    return touchVolDown;
  }

  createTouchBox(parent: HTMLElement, id: string, currentTime: Position) {
    const touch = this.player
      .createElement("div", `touch-box-${id}`)
      .addClasses([`touch-box-${id}`, "z-40"])
      .appendTo(parent)
      .get();

    touch.style.gridColumnStart = currentTime.x.start.toString();
    touch.style.gridColumnEnd = currentTime.x.end.toString();
    touch.style.gridRowStart = currentTime.y.start.toString();
    touch.style.gridRowEnd = currentTime.y.end.toString();

    parent.appendChild(touch);

    return touch;
  }

  createSpeedButton(parent: HTMLDivElement, hovered = false) {
    if (this.player.isMobile()) return;
    const speedButton = this.player.createUiButton(parent, "speed").get();

    if (this.player.hasSpeeds()) {
      speedButton.style.display = "flex";
    } else {
      speedButton.style.display = "none";
    }

    this.player.createSVGElement(
      speedButton,
      "speed",
      this.buttons.speed,
      false,
      hovered
    );

    speedButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("hide-tooltip");

      if (this.speedMenuOpen) {
        this.player.emit("show-menu", false);

        this.menuFrame.close();
      } else {
        this.player.emit("show-speed-menu", true);

        this.menuFrame.showModal();
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        speedButton.style.display = "none";
      } else if (this.player.hasSpeeds()) {
        speedButton.style.display = "flex";
      }
    });

    parent.appendChild(speedButton);
    return speedButton;
  }

  createPIPButton(parent: HTMLDivElement, hovered = false) {
    if (this.player.isMobile() || !this.player.hasPipEventHandler) return;
    const pipButton = this.player.createUiButton(parent, "pip").get();

    if (this.player.hasPIP()) {
      pipButton.style.display = "flex";
    } else {
      pipButton.style.display = "none";
    }

    pipButton.ariaLabel = this.buttons.pipEnter?.title;

    this.player.createSVGElement(
      pipButton,
      "pip-enter",
      this.buttons.pipEnter,
      false,
      hovered
    );
    this.player.createSVGElement(
      pipButton,
      "pip-exit",
      this.buttons.pipExit,
      true,
      hovered
    );

    document.addEventListener("visibilitychange", () => {
      if (this.pipEnabled) {
        if (document.hidden) {
          if (document.pictureInPictureEnabled) {
            this.player.getVideoElement().requestPictureInPicture().then();
          }
        } else if (document.pictureInPictureElement) {
          document.exitPictureInPicture().then();
        }
      }
    });

    pipButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("hide-tooltip");

      this.player.emit("controls", false);

      if (this.pipEnabled) {
        this.pipEnabled = false;
        pipButton.querySelector<any>(".pip-exit-icon").style.display = "none";
        pipButton.querySelector<any>(".pip-enter-icon").style.display = "flex";
        pipButton.ariaLabel = this.buttons.pipEnter?.title;
        this.player.emit("pip-internal", false);
        this.player.emit("pip", false);
      } else {
        this.pipEnabled = true;
        pipButton.querySelector<any>(".pip-enter-icon").style.display = "none";
        pipButton.querySelector<any>(".pip-exit-icon").style.display = "flex";
        pipButton.ariaLabel = this.buttons.pipExit?.title;
        this.player.emit("pip-internal", true);
        this.player.emit("pip", true);
        this.player.emit("show-menu", false);
      }
    });

    this.player.on("fullscreen", () => {
      if (this.player.getFullscreen()) {
        pipButton.style.display = "none";
      } else {
        pipButton.style.display = "flex";
      }
    });

    parent.appendChild(pipButton);
    return pipButton;
  }

  createMenuFrame(parent: HTMLDivElement) {
    this.menuFrame = this.player
      .createElement("dialog", "menu-frame-dialog")
      .addClasses([
        "group-[&.nomercyplayer:has(.open)]:backdrop:bg-black/60",
        "group-[&.nomercyplayer:has(.open)]:backdrop:pointer-events-none",
      ])
      .appendTo(parent)
      .get();

    this.menuFrame.setAttribute("popover", "manual");
    this.menuFrame.setAttribute("role", "modal");

    const menuWrapper = this.player
      .createElement("div", "menu-wrapper")
      .addClasses(["menu-wrapper", "text-white"])
      .appendTo(this.menuFrame)
      .get();

    (document.body.parentElement as HTMLElement).addEventListener(
      "click",
      () => {
        this.player.emit("show-menu", false);
        this.player.emit("show-main-menu", false);
        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-subtitleSettings-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
      }
    );

    const menuFrame = this.player
      .createElement("div", "menu-frame")
      .addClasses([
        "menu-frame",
        "absolute",
        "flex-col",
        "h-available",
        "hidden",
        "inset-4",
        "justify-self-end",
        "max-h-[calc(100%-2rem)]",
        "max-w-[min(70rem,calc(100%-2rem))]",
        "overflow-clip",
        "rounded-lg",
        "w-fit",
        "z-50",
      ])
      .appendTo(menuWrapper)
      .get();

      this.sizeMenuFrame();

    const menuContent = this.player
      .createElement("div", "menu-content")
      .addClasses([
        "menu-content",
        "flex",
        "flex-row",
        "h-available",
        "justify-end",
        "mt-auto",
        "overflow-clip",
        "w-full",
      ])
      .appendTo(menuFrame)
      .get();

    this.player.on("ready", () => {
      this.sizeMenuFrame();
    });
    this.player.on("play", () => {
      this.sizeMenuFrame();
    });
    this.player.on("resize", () => {
      this.sizeMenuFrame();
    });
    this.player.on("fullscreen", () => {
      this.sizeMenuFrame();
    });
    this.player.on("show-menu", (showing) => {
      this.menuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        this.sizeMenuFrame();

        menuFrame.style.display = "flex";
        menuFrame.classList.add("open");

        this.menuFrame.showModal();
      } else {
        menuFrame.style.display = "none";
        menuFrame.classList.remove("open");

        this.menuFrame.classList.remove(
          "group-[&.nomercyplayer:has(.open)]:backdrop:!hidden"
        );
        this.center.classList.remove("!bg-none");

        this.menuFrame.close();
      }
      menuContent.classList.add("translate-x-0");
      menuContent.classList.remove("sub-menu-open");

      setTimeout(() => {
        (
          Array.from(this.mainMenu.children).find(
            (el) =>
              (el as HTMLButtonElement).style.display !== "none" &&
              el.id !== "menu-header"
          ) as HTMLButtonElement
        )?.focus();
      }, 200);

      this.player.emit("show-language-menu", false);
      this.player.emit("show-subtitles-menu", false);
      this.player.emit("hide-subtitleSettings-menu");
      this.player.emit("show-subtitleSettings-menu", false);
      this.player.emit("show-subtitleSetting-menu", false);
      this.player.emit("show-quality-menu", false);
      this.player.emit("show-speed-menu", false);
      this.player.emit("show-playlist-menu", false);
    });
    this.player.on("show-main-menu", (showing) => {
      this.mainMenuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        menuFrame.classList.add("open");
        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-subtitleSettings-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
        menuContent.classList.add("translate-x-0");
        menuContent.classList.remove("sub-menu-open");
        menuFrame.style.display = "flex";
        this.menuFrame.classList.remove(
          "group-[&.nomercyplayer:has(.open)]:backdrop:!hidden"
        );
        this.center.classList.remove("!bg-none");

        setTimeout(() => {
          (
            Array.from(this.mainMenu.children).find(
              (el) =>
                (el as HTMLButtonElement).style.display !== "none" &&
                el.id !== "menu-header"
            ) as HTMLButtonElement
          )?.focus();
        }, 200);
      }
    });
    this.player.on("show-language-menu", (showing) => {
      this.languageMenuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        menuFrame.classList.add("open");
        this.player.emit("show-main-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-subtitleSettings-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
        menuContent.classList.remove("translate-x-0");
        menuContent.classList.add("sub-menu-open");
        menuFrame.style.display = "flex";
      }
    });
    this.player.on("show-subtitles-menu", (showing) => {
      this.subtitlesMenuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        menuFrame.classList.add("open");
        this.player.emit("show-main-menu", false);
        this.player.emit("show-language-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
        menuContent.classList.remove("translate-x-0");
        menuContent.classList.add("sub-menu-open");
        menuFrame.style.display = "flex";
      }
    });
    this.player.on("show-subtitleSettings-menu", (showing) => {
      this.subtitleSettingsMenuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        menuFrame.classList.add("open");
        this.player.emit("show-main-menu", false);
        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
        menuContent.classList.remove("translate-x-0");
        menuContent.classList.add("sub-menu-open");
        menuFrame.style.display = "flex";
      }
    });
    this.player.on("show-subtitleSetting-menu", (showing) => {
      this.subtitleSettingMenuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        menuFrame.classList.add("open");
        this.player.emit("show-main-menu", false);
        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-subtitleSettings-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
        menuContent.classList.remove("translate-x-0");
        menuContent.classList.add("sub-menu-open");
        menuFrame.style.display = "flex";
      }
    });
    this.player.on("show-quality-menu", (showing) => {
      this.qualityMenuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        menuFrame.classList.add("open");
        this.player.emit("show-main-menu", false);
        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-subtitleSettings-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
        menuContent.classList.remove("translate-x-0");
        menuContent.classList.add("sub-menu-open");
        menuFrame.style.display = "flex";
      }
    });
    this.player.on("show-speed-menu", (showing) => {
      this.speedMenuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        menuFrame.classList.add("open");
        this.player.emit("show-main-menu", false);
        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-subtitleSettings-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-playlist-menu", false);
        menuContent.classList.remove("translate-x-0");
        menuContent.classList.add("sub-menu-open");
        menuFrame.style.display = "flex";
      }
    });
    this.player.on("show-playlist-menu", (showing) => {
      // this.createCalcMenu(menuContent);
      this.playlistMenuOpen = showing;
      this.lockActive = showing;
      if (showing) {
        menuFrame.classList.add("open");
        this.player.emit("show-main-menu", false);
        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-subtitleSettings-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-speed-menu", false);
        menuContent.classList.remove("translate-x-0");
        menuContent.classList.add("sub-menu-open");
        menuFrame.style.display = "flex";

        this.player.emit("switch-season", this.player.playlistItem().season);
      } else {
        menuFrame.style.width = "";
      }
    });
    this.player.on("controls", (showing) => {
      this.lockActive = showing;
      if (!showing) {
        this.player.emit("show-menu", false);
        this.player.emit("show-main-menu", false);
        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-subtitleSettings-menu", false);
        this.player.emit("show-subtitleSetting-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
      }
    });

    return menuContent;
  }

  sizeMenuFrame() {
    const rect = this.player?.getElement()?.getBoundingClientRect();
    if (!rect) return;

    const { width, height, top, bottom, left } = rect;

    (this.menuFrame.firstChild as HTMLDivElement).style.width = `${width}px`;
    (this.menuFrame.firstChild as HTMLDivElement).style.height = `${height}px`;
    (this.menuFrame.firstChild as HTMLDivElement).style.top = `${top}px`;
    (this.menuFrame.firstChild as HTMLDivElement).style.bottom = `${bottom}px`;
    (this.menuFrame.firstChild as HTMLDivElement).style.left = `${left}px`;
    (this.menuFrame.firstChild as HTMLDivElement).style.padding = "2rem";
    (this.menuFrame.firstChild as HTMLDivElement).style.position = "fixed";
    // (this.menuFrame.firstChild as HTMLDivElement).style.background = 'red';
  }

  createMainMenu(parent: HTMLDivElement) {
    this.mainMenu = this.player
      .createElement("div", "main-menu")
      .addClasses([
        "main-menu",
        "bg-neutral-900/95",
        "flex",
        "flex-col",
        "gap-1",
        "group-[&.nomercyplayer:has(.sub-menu-open)]:!hidden",
        "h-auto",
        "max-h-full",
        "min-w-64",
        "mt-auto",
        "overflow-clip",
        "p-2",
        "pt-0",
        "rounded-lg",
        "pointer-events-auto",
      ])
      .appendTo(parent)
      .get();

    this.mainMenu.style.transform = "translateX(0)";

    const mainHeader = this.createMainMenuHeader(this.mainMenu);
    mainHeader.classList.add("!min-h-[2rem]", "-mr-1");

    this.player.addClasses(this.mainMenu, [
      "main-menu",
      "bg-neutral-900/95",
      "flex",
      "flex-col",
      "gap-1",
      "group-[&.nomercyplayer:has(.sub-menu-open)]:!hidden",
      "h-auto",
      "max-h-full",
      "min-w-64",
      "mt-auto",
      "overflow-clip",
      "p-2",
      "pt-0",
      "rounded-lg",
    ]);

    this.player.once("translationsLoaded", () => {
      this.createMenuButton(this.mainMenu, "language");
      this.createMenuButton(this.mainMenu, "subtitles");
      this.createMenuButton(this.mainMenu, "subtitle settings");
      this.createMenuButton(this.mainMenu, "quality");
      this.createMenuButton(this.mainMenu, "speed");
      this.createMenuButton(this.mainMenu, "playlist");
      if (this.player.plugins.has("autoSkip")) {
        this.createMenuButton(this.mainMenu, "auto skip");
      }
    });

    this.createSubMenu(parent);

    return this.mainMenu;
  }

  createSubMenu(parent: HTMLDivElement) {
    const submenu = this.player
      .createElement("div", "sub-menu")
      .addClasses([
        "sub-menu",
        "bg-neutral-900/95",
        "flex-col",
        "gap-1",
        "group-[&.nomercyplayer:has(.sub-menu-open)]:flex",
        "h-auto",
        "hidden",
        "max-h-full",
        "min-w-64",
        "mt-auto",
        "overflow-clip",
        "rounded-lg",
        "pointer-events-auto",
        "w-full",
      ])
      .appendTo(parent)
      .get();

    submenu.style.transform = "translateX(0)";

    this.createLanguageMenu(submenu);
    this.createSubtitleMenu(submenu);
    this.createSubtitleSettingsMenu(submenu);
    this.createQualityMenu(submenu);
    this.createSpeedMenu(submenu);

    if (
      this.player.options.playlist &&
      Array.isArray(this.player.options.playlist)
    ) {
      this.createEpisodeMenu(submenu);
    } else {
      this.player.once("playlist", () => {
        this.createEpisodeMenu(submenu);
      });
    }

    return submenu;
  }

  createMainMenuHeader(parent: HTMLDivElement, hovered = false) {
    const menuHeader = this.player
      .createElement("div", "main-menu-header")
      .addClasses([
        "menu-header",
        "flex",
        "h-9",
        "items-center",
        "min-h-[2.5rem]",
        "py-2",
        "text-white",
        "w-available",
      ])
      .addClasses(["border-b", "border-gray-300/20", "!p-0"])
      .appendTo(parent)
      .get();

    const close = this.player.createUiButton(menuHeader, "close").get();

    this.player.createSVGElement(close, "menu", this.buttons.close, hovered);
    this.player.addClasses(close, ["ml-auto", "w-8"]);
    close.classList.remove("w-5");

    close.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("show-menu", false);
      this.lockActive = false;
      this.player.emit("controls", false);

      this.menuFrame.close();

      this.player.emit("dynamicControls");
    });

    return menuHeader;
  }

  createMenuHeader(parent: HTMLDivElement, title: string, hovered = false) {
    const menuHeader = this.player
      .createElement("div", "menu-header")
      .addClasses([
        "menu-header",
        "flex",
        "h-9",
        "items-center",
        "min-h-[2.5rem]",
        "py-2",
        "text-white",
        "w-available",
      ])
      .addClasses(["border-b", "border-gray-300/20"])
      .appendTo(parent)
      .get();

    if (title !== "Episodes") {
      const back = this.player.createUiButton(menuHeader, "back").get();
      this.player.createSVGElement(
        back,
        "menu",
        this.buttons.chevronL,
        hovered
      );
      this.player.addClasses(back, ["w-8"]);
      back.classList.remove("w-5");

      back.addEventListener("click", (event) => {
        event.stopPropagation();
        this.player.emit("show-main-menu", true);

        this.player.emit("show-language-menu", false);
        this.player.emit("show-subtitles-menu", false);
        this.player.emit("show-quality-menu", false);
        this.player.emit("show-speed-menu", false);
        this.player.emit("show-playlist-menu", false);
      });
    }

    const menuButtonText = this.player
      .createElement("span", "menu-button-text")
      .addClasses(this.menuButtonTextStyles)
      .appendTo(menuHeader)
      .get();

    menuButtonText.innerText = this.player.localize(title).toTitleCase();

    if (title !== "Seasons") {
      const close = this.player.createUiButton(menuHeader, "close").get();

      this.player.createSVGElement(close, "menu", this.buttons.close, hovered);
      this.player.addClasses(close, ["ml-auto", "w-8"]);
      close.classList.remove("w-5");

      close.addEventListener("click", (event) => {
        event.stopPropagation();
        this.player.emit("show-menu", false);
        this.lockActive = false;
        this.player.emit("controls", false);

        this.menuFrame.close();

        this.player.emit("dynamicControls");
      });
    }

    return menuHeader;
  }

  createSubtitleSettingMenuHeader(parent: HTMLDivElement, title: string) {
    const menuHeader = this.player
      .createElement("div", "menu-header")
      .addClasses([
        "menu-header",
        "flex",
        "h-9",
        "items-center",
        "min-h-[2.5rem]",
        "py-2",
        "text-white",
        "w-available",
      ])
      .addClasses(["border-b", "border-gray-300/20"])
      .appendTo(parent)
      .get();

    const back = this.player.createUiButton(menuHeader, "back").get();
    this.player.createSVGElement(back, "menu", this.buttons.chevronL, false);
    this.player.addClasses(back, ["w-8"]);
    back.classList.remove("w-5");

    back.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("show-subtitleSettings-menu", true);
      this.player.emit("show-subtitleSetting-menu", false);
    });

    const menuButtonText = this.player
      .createElement("span", "menu-button-text")
      .addClasses(this.menuButtonTextStyles)
      .appendTo(menuHeader)
      .get();

    menuButtonText.innerText = this.player.localize(title).toTitleCase();

    const close = this.player.createUiButton(menuHeader, "close").get();

    this.player.createSVGElement(close, "menu", this.buttons.close, false);
    this.player.addClasses(close, ["ml-auto", "w-8"]);
    close.classList.remove("w-5");

    close.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit("show-menu", false);
      this.lockActive = false;
      this.player.emit("controls", false);

      this.menuFrame.close();

      this.player.emit("dynamicControls");
    });

    return menuHeader;
  }

  createMenuButton(parent: HTMLDivElement, item: string, hovered = false) {
    const id = this.player.spaceToCamel(item);

    if (id === "autoSkip") {
      const menuButton = this.player
        .createElement("button", `menu-button-${id}`)
        .addClasses(this.languageMenuStyles)
        .appendTo(parent)
        .get();

      // Icon for enabled/disabled state
      const icon = this.player.createSVGElement(
        menuButton,
        "skipForwardTab",
        this.buttons.skipForwardTab,
        false,
        false
      );
      this.player.addClasses(icon, [
        "w-5",
        "h-5",
        "transition-opacity",
        "duration-200",
      ]);

      const menuButtonText = this.player
        .createElement("span", `menu-button-${id}-text`)
        .addClasses(this.menuButtonTextStyles)
        .appendTo(menuButton)
        .get();
      menuButtonText.innerText = this.player.localize(item.toTitleCase());

      // Icon for enabled/disabled state
      const checkmark = this.player.createSVGElement(
        menuButton,
        "checkmark",
        this.buttons.checkmark,
        false,
        false
      );
      this.player.addClasses(checkmark, ["ml-auto"]);

      // Update button state
      const updateState = () => {
        const enabled = this.player.plugins.get("autoSkip")?.autoSkip;

        if (enabled) {
          checkmark.classList.remove("hidden");
        } else {
          checkmark.classList.add("hidden");
        }
      };

      updateState();

      // Toggle handler
      menuButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const plugin = this.player.plugins.get("autoSkip");
        if (!plugin) return;
        plugin.autoSkip = !plugin.autoSkip;
        this.player.storage
          .set("auto-skip", plugin.autoSkip ? "true" : "false")
          .then();

        updateState();
      });

      return menuButton;
    }

    const menuButton = this.player
      .createElement("button", `menu-button-${id}`)
      .addClasses(this.languageMenuStyles)
      .appendTo(parent)
      .get();

    if (id !== "speed") {
      menuButton.style.display = "none";
    } else if (this.player.hasSpeeds()) {
      menuButton.style.display = "flex";
    } else {
      menuButton.style.display = "none";
    }

    this.player.createSVGElement(menuButton, "menu", this.buttons[id], hovered);

    const menuButtonText = this.player
      .createElement("span", `menu-button-${id}`)
      .addClasses(this.menuButtonTextStyles)
      .appendTo(menuButton)
      .get();

    menuButtonText.innerText = this.player.localize(item.toTitleCase());

    const chevron = this.player.createSVGElement(
      menuButton,
      "menu",
      this.buttons.chevronR,
      false,
      hovered
    );
    this.player.addClasses(chevron, ["ml-auto"]);

    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.player.emit(`show-${id}-menu`, true);

      if (id === "playlist") {
        window
          .nmplayer()
          .emit("switch-season", window.nmplayer().playlistItem().season);
      }
    });

    if (id === "language") {
      this.player.on("id", () => {
        menuButton.style.display = "none";
      });
      if (this.player.hasAudioTracks()) {
        menuButton.style.display = "flex";
      }
      this.player.on("audioTracks", (tracks) => {
        if (tracks.length > 1) {
          menuButton.style.display = "flex";
        } else {
          menuButton.style.display = "none";
        }
      });
    } else if (id === "subtitles") {
      this.player.on("id", () => {
        menuButton.style.display = "none";
      });
      if (this.player.hasCaptions()) {
        menuButton.style.display = "flex";
      }
      this.player.on("captionsList", (captions) => {
        if (captions.length > 1) {
          menuButton.style.display = "flex";
        } else {
          menuButton.style.display = "none";
        }
      });
    } else if (id === "subtitleSettings") {
      menuButton.style.display = "flex";
    } else if (id === "quality") {
      this.player.on("item", () => {
        menuButton.style.display = "none";
      });
      if (this.player.hasQualities()) {
        menuButton.style.display = "flex";
      }
      this.player.on("levels", (levels) => {
        if (levels.length > 1) {
          menuButton.style.display = "flex";
        } else {
          menuButton.style.display = "none";
        }
      });
    } else if (id === "playlist") {
      if (
        this.player.options.playlist &&
        Array.isArray(this.player.options.playlist)
      ) {
        menuButton.style.display = "flex";
      }
      this.player.on("playlist", (playlist) => {
        if (playlist?.length > 1) {
          menuButton.style.display = "flex";
        } else {
          menuButton.style.display = "none";
        }
      });
    }
  }

  createLanguageMenu(parent: HTMLDivElement) {
    const languageMenu = this.player
      .createElement("div", "language-menu")
      .addClasses(this.subMenuContentStyles)
      .appendTo(parent)
      .get();

    this.createMenuHeader(languageMenu, "Language");

    const scrollContainer = this.player
      .createElement("div", "language-scroll-container")
      .addClasses(this.scrollContainerStyles)
      .appendTo(languageMenu)
      .get();

    scrollContainer.style.transform = "translateX(0)";

    this.player.on("item", () => {
      scrollContainer.innerHTML = "";
    });

    if (this.player.hasAudioTracks()) {
      Object.values(this.player.getAudioTracks()).forEach((track) => {
        this.createLanguageMenuButton(scrollContainer, {
          language: track.language!,
          label: track.label!,
          type: "audio",
          id: track.id!,
          buttonType: "audio",
        });
      });
    }

    this.player.on("audioTracks", (tracks) => {
      scrollContainer.innerHTML = "";

      Object.values(tracks).forEach((track) => {
        this.createLanguageMenuButton(scrollContainer, {
          language: track.language!,
          label: track.label!,
          type: "audio",
          id: track.id!,
          buttonType: "audio",
        });
      });
    });

    this.player.on("show-language-menu", (showing) => {
      if (showing) {
        languageMenu.style.display = "flex";

        setTimeout(() => {
          (scrollContainer.firstChild as HTMLButtonElement)?.focus();
        }, 200);
      } else {
        languageMenu.style.display = "none";
      }
    });

    return languageMenu;
  }

  createSubtitleMenu(parent: HTMLDivElement) {
    const subtitleMenu = this.player
      .createElement("div", "subtitle-menu")
      .addClasses(this.subMenuContentStyles)
      .appendTo(parent)
      .get();

    this.createMenuHeader(subtitleMenu, "subtitles");

    const scrollContainer = this.player
      .createElement("div", "subtitle-scroll-container")
      .addClasses(this.scrollContainerStyles)
      .appendTo(subtitleMenu)
      .get();

    scrollContainer.style.transform = "translateX(0)";

    this.player.on("item", () => {
      scrollContainer.innerHTML = "";
    });

    if (this.player.hasCaptions()) {
      Object.values(this.player.getCaptionsList()).forEach((track) => {
        this.createLanguageMenuButton(scrollContainer, {
          language: track.language!,
          label: track.label!,
          type: track.type!,
          id: track.id!,
          buttonType: "subtitle",
        });
      });
    }

    this.player.on("captionsList", (tracks) => {
      scrollContainer.innerHTML = "";

      Object.values(tracks).forEach((track) => {
        this.createLanguageMenuButton(scrollContainer, {
          language: track.language!,
          label: track.label!,
          type: track.type!,
          id: track.id!,
          buttonType: "subtitle",
        });
      });
    });

    this.player.on("show-subtitles-menu", (showing) => {
      if (showing) {
        subtitleMenu.style.display = "flex";

        setTimeout(() => {
          (scrollContainer.firstChild as HTMLButtonElement)?.focus();
        }, 200);
      } else {
        subtitleMenu.style.display = "none";
      }
    });

    return subtitleMenu;
  }

  createSubtitleSettingMenuButton(
    parent: HTMLDivElement,
    data: {
      label: string;
      property: keyof SubtitleStyle | "";
      buttonType: string;
    }
  ) {
    const subtitleSettingButton = this.player
      .createElement(
        "button",
        `subtitleSetting-button-${this.player.spaceToCamel(data.label)}`
      )
      .addClasses(this.languageMenuStyles)
      .appendTo(parent)
      .get();

    const subtitleSettingButtonText = this.player
      .createElement(
        "span",
        `menu-button-text-${this.player.spaceToCamel(data.label)}`
      )
      .addClasses(this.menuButtonTextStyles)
      .appendTo(subtitleSettingButton)
      .get();

    subtitleSettingButtonText.innerText = this.player.localize(data.label);

    const subtitleSettingButtonValueText = this.player
      .createElement(
        "span",
        `menu-button-text-${this.player.spaceToCamel(data.label)}`
      )
      .addClasses(this.menuButtonSubTextStyles)
      .appendTo(subtitleSettingButton)
      .get();
    this.player.addClasses(subtitleSettingButtonValueText, ["ml-auto"]);

    if (data.property) {
      const value = this.player.subtitleStyle[data.property].toString();

      this.makeSubtitleMenuText(data, value, subtitleSettingButtonValueText);

      const chevron = this.player.createSVGElement(
        subtitleSettingButton,
        "menu",
        this.buttons.chevronR,
        false,
        false
      );
      this.player.addClasses(chevron, ["ml-2"]);

      this.createSubtitleSettingMenu(parent, data);

      this.player.on("set-subtitle-style", (style: SubtitleSettingAction) => {
        if (data.property !== style.property) return;

        const value =
          this.player.subtitleStyle[
            style.property as keyof SubtitleStyle
          ].toString();

        this.makeSubtitleMenuText(data, value, subtitleSettingButtonValueText);
      });
    }

    subtitleSettingButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (data.property) {
        this.player.emit("show-subtitleSetting-menu", data.property);
      } else {
        this.player.setSubtitleStyle(defaultSubtitleStyles);
      }
    });

    this.addKeyEventsToLanguageButton(subtitleSettingButton, parent);

    return subtitleSettingButton;
  }

  private makeSubtitleMenuText(
    data: {
      label: string;
      property: keyof SubtitleStyle | "";
      buttonType: string;
    },
    value: string,
    subtitleSettingButtonValueText: HTMLSpanElement
  ) {
    if (data.property === "fontFamily") {
      this.player.options.debug && console.log(fontFamilies.find((f) => f.value === value));
      subtitleSettingButtonValueText.innerText = fontFamilies.find(
        (f) => f.value === value
      )!.name;
    } else if (data.property === "edgeStyle") {
      subtitleSettingButtonValueText.innerText = edgeStyles.find(
        (f) => f.value === value
      )!.name;
    } else {
      subtitleSettingButtonValueText.innerText = (
        value + (this.player.isNumber(value) ? "%" : "")
      ).toTitleCase();
    }
  }

  createSubtitleSettingsMenu(parent: HTMLDivElement) {
    const subtitleSettingsMenu = this.player
      .createElement("div", "subtitleSettings-menu")
      .addClasses(this.subMenuContentStyles)
      .appendTo(parent)
      .get();

    this.createMenuHeader(subtitleSettingsMenu, "subtitle settings");

    const scrollContainer = this.player
      .createElement("div", "subtitleSettings-scroll-container")
      .addClasses([...this.scrollContainerStyles, "!w-80"])
      .appendTo(subtitleSettingsMenu)
      .get();

    scrollContainer.style.transform = "translateX(0)";

    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Font",
      property: "fontFamily",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Text size",
      property: "fontSize",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Text color",
      property: "textColor",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Text opacity",
      property: "textOpacity",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Edge style",
      property: "edgeStyle",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Area color",
      property: "backgroundColor",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Area opacity",
      property: "backgroundOpacity",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Background color",
      property: "areaColor",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Background opacity",
      property: "windowOpacity",
      buttonType: "subtitleSetting",
    });
    this.createSubtitleSettingMenuButton(scrollContainer, {
      label: "Reset",
      property: "",
      buttonType: "subtitleSetting",
    });

    this.player.on("show-subtitleSettings-menu", (value) => {
      if (value) {
        subtitleSettingsMenu.style.display = "flex";
        this.menuFrame.classList.add(
          "group-[&.nomercyplayer:has(.open)]:backdrop:!hidden"
        );
        this.center.classList.add("!bg-none");

        setTimeout(() => {
          (scrollContainer.firstChild as HTMLButtonElement)?.focus();
        }, 200);
      } else {
        subtitleSettingsMenu.style.display = "none";
      }
    });

    return subtitleSettingsMenu;
  }

  createSubtitleSettingMenu(
    parent: HTMLDivElement,
    data: {
      label: string;
      property: keyof SubtitleStyle | "";
      buttonType: string;
    }
  ) {
    const subtitleSettingMenu = this.player
      .createElement("div", `subtitleSetting-menu-${data.property}`)
      .addClasses(this.subMenuContentStyles)
      .appendTo(parent.parentElement!.parentElement!)
      .get();
    subtitleSettingMenu.style.display = "none";

    this.createSubtitleSettingMenuHeader(subtitleSettingMenu, data.label);

    const scrollContainer = this.player
      .createElement("div", `subtitleSetting-scroll-container-${data.property}`)
      .addClasses([...this.scrollContainerStyles, "!w-80"])
      .appendTo(subtitleSettingMenu)
      .get();

    scrollContainer.style.transform = "translateX(0)";

    this.subtitleSettingActions
      .filter((a) => a.property === data.property)
      .forEach((action) => {
        this.createSubtitleSettingActionButton(scrollContainer, action);
      });

    this.player.on("show-subtitleSetting-menu", (property: string) => {
      if (data.property === property) {
        subtitleSettingMenu.style.display = "flex";
        this.menuFrame.classList.add(
          "group-[&.nomercyplayer:has(.open)]:backdrop:!hidden"
        );
        this.center.classList.add("!bg-none");

        setTimeout(() => {
          (scrollContainer.firstChild as HTMLButtonElement)?.focus();
        }, 200);
      } else {
        subtitleSettingMenu.style.display = "none";
      }
    });

    this.player.on("hide-subtitleSetting-menu", () => {
      subtitleSettingMenu.style.display = "none";
    });

    return scrollContainer;
  }

  createSubtitleSettingActionButton(
    parent: HTMLDivElement,
    data: SubtitleSettingAction
  ) {
    const subtitleSettingActionButton = this.player
      .createElement("button", `subtitleSetting-action-button-${data.property}`)
      .addClasses(this.languageMenuStyles)
      .appendTo(parent)
      .get();

    const subtitleSettingActionButtonText = this.player
      .createElement("span", "menu-button-text")
      .addClasses(this.menuButtonTextStyles)
      .appendTo(subtitleSettingActionButton)
      .get();

    subtitleSettingActionButtonText.innerText = this.player
      .localize(data.label)
      .toTitleCase();

    const checkmark = this.player.createSVGElement(
      subtitleSettingActionButton,
      "checkmark",
      this.buttons.checkmark,
      false,
      false
    );
    this.player.addClasses(checkmark, ["ml-auto"]);

    if (
      data.value !=
      this.player.getSubtitleStyle()[data.property as keyof SubtitleStyle]
    ) {
      checkmark.classList.add("hidden");
    }

    this.player.on("set-subtitle-style", (style) => {
      if (data.property !== style.property) return;

      if (data.value === style.value) {
        checkmark.classList.remove("hidden");
      } else {
        checkmark.classList.add("hidden");
      }
    });

    subtitleSettingActionButton.addEventListener("click", (event) => {
      event.stopPropagation();
      data.action(event);

      this.player.emit("set-subtitle-style", data);
    });

    this.addKeyEventsToLanguageButton(subtitleSettingActionButton, parent);

    return subtitleSettingActionButton;
  }

  createSpeedMenu(parent: HTMLDivElement, hovered = false) {
    const speedMenu = this.player
      .createElement("div", "speed-menu")
      .addClasses(this.subMenuContentStyles)
      .appendTo(parent)
      .get();

    this.createMenuHeader(speedMenu, "speed");

    const scrollContainer = this.player
      .createElement("div", "speed-scroll-container")
      .addClasses(this.scrollContainerStyles)
      .appendTo(speedMenu)
      .get();

    scrollContainer.style.transform = "translateX(0)";

    for (const speed of this.player.getSpeeds() ?? []) {
      const speedButton = this.player
        .createElement("button", `speed-button-${speed}`)
        .addClasses(this.languageMenuStyles)
        .appendTo(scrollContainer)
        .get();

      const speedButtonSpan = this.player
        .createElement("span", `menu-button-text-${speed}`)
        .appendTo(speedButton)
        .get();

      const speedButtonText = this.player
        .createElement("span", `menu-button-text-${speed}`)
        .addClasses(this.menuButtonTextStyles)
        .appendTo(speedButtonSpan)
        .get();

      speedButtonText.innerText =
        speed === 1 ? this.player.localize("Normal") : speed.toString();

      const checkmark = this.player.createSVGElement(
        speedButton,
        "menu",
        this.buttons.checkmark,
        false,
        hovered
      );
      this.player.addClasses(checkmark, ["ml-auto", "hidden"]);

      this.player.on("speed", (event) => {
        if (event === speed) {
          checkmark.classList.remove("hidden");
        } else {
          checkmark.classList.add("hidden");
        }
      });

      speedButton.addEventListener("click", () => {
        this.player.emit("show-menu", false);
        this.player.setSpeed(speed);
      });

      if (speed === this.player.getSpeed()) {
        checkmark.classList.remove("hidden");
      }
    }

    this.player.on("show-speed-menu", (showing) => {
      if (showing) {
        speedMenu.style.display = "flex";

        setTimeout(() => {
          (scrollContainer.firstChild as HTMLButtonElement)?.focus();
        }, 200);
      } else {
        speedMenu.style.display = "none";
      }
    });

    return speedMenu;
  }

  createQualityMenu(parent: HTMLDivElement) {
    const qualityMenu = this.player
      .createElement("div", "quality-menu")
      .addClasses(this.subMenuContentStyles)
      .appendTo(parent)
      .get();

    this.createMenuHeader(qualityMenu, "quality");

    const scrollContainer = this.player
      .createElement("div", "quality-scroll-container")
      .addClasses(this.scrollContainerStyles)
      .appendTo(qualityMenu)
      .get();

    scrollContainer.style.transform = "translateX(0)";

    this.player.on("item", () => {
      scrollContainer.innerHTML = "";
    });

    if (this.player.hasQualities()) {
      Object.values(this.player.getQualityLevels()).forEach((level) => {
        this.createQualityMenuButton(scrollContainer, {
          id: level.id,
          width: level.width ?? 0,
          height: level.height ?? 0,
          label: level.label,
          bitrate: level.bitrate ?? 0,
        });
      });
    }

    this.player.on("levels", (levels) => {
      scrollContainer.innerHTML = "";

      Object.values(levels).forEach((level) => {
        this.createQualityMenuButton(scrollContainer, {
          id: level.id,
          width: level.width ?? 0,
          height: level.height ?? 0,
          label: level.label,
          bitrate: level.bitrate ?? 0,
        });
      });
    });

    this.player.on("show-quality-menu", (showing) => {
      if (showing) {
        qualityMenu.style.display = "flex";

        setTimeout(() => {
          (scrollContainer.firstChild as HTMLButtonElement)?.focus();
        }, 200);
      } else {
        qualityMenu.style.display = "none";
      }
    });

    return qualityMenu;
  }

  createQualityMenuButton(
    parent: HTMLDivElement,
    data: {
      width: number;
      id: number;
      bitrate: number;
      label: string;
      height: number;
    },
    hovered = false
  ) {
    const qualityButton = this.player
      .createElement("button", `quality-button-${data.height}-${data.bitrate}`)
      .addClasses(this.languageMenuStyles)
      .appendTo(parent)
      .get();

    const qualityButtonText = this.player
      .createElement("span", "menu-button-text")
      .addClasses(this.menuButtonTextStyles)
      .appendTo(qualityButton)
      .get();

    qualityButtonText.innerText = `${this.player.localize(
      data.label?.replace("segment-metadata", "Off")
    )}`;

    const checkmark = this.player.createSVGElement(
      qualityButton,
      "checkmark",
      this.buttons.checkmark,
      false,
      hovered
    );
    this.player.addClasses(checkmark, ["ml-auto"]);

    if (data.id > 0) {
      checkmark.classList.add("hidden");
    }

    this.player.on("levelsChanging", (level) => {
      if (level.id === data.id) {
        checkmark.classList.remove("hidden");
      } else {
        checkmark.classList.add("hidden");
      }
    });

    qualityButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if(this.hasNoMercyConnect()){
        this.sendNoMercyConnectCommand("quality", data.id);
      } else {
        this.player.setCurrentQuality(data.id);
      }

      this.player.emit("show-menu", false);
    });

    return qualityButton;
  }

  createSeekRipple(parent: HTMLDivElement, side: string) {
    const seekRipple = this.player
      .createElement("div", "seek-ripple")
      .addClasses(["seek-ripple", side])
      .appendTo(parent)
      .get();

    const arrowHolder = this.player
      .createElement("div", "seek-ripple-arrow")
      .addClasses(["seek-ripple-arrow"])
      .appendTo(seekRipple)
      .get();

    const text = this.player
      .createElement("p", "seek-ripple-text")
      .addClasses(["seek-ripple-text"])
      .appendTo(seekRipple)
      .get();

    if (side === "left") {
      seekRipple.style.borderRadius = "0 50% 50% 0";
      seekRipple.style.left = "0px";
      arrowHolder.innerHTML = `
				<div class="arrow arrow2 arrow-left"></div>
				<div class="arrow arrow1 arrow-left"></div>
				<div class="arrow arrow3 arrow-left"></div>
			`;
      this.player.on("rewind", (val: number) => {
        text.innerText = `${Math.abs(val)} ${this.player.localize("seconds")}`;
        seekRipple.style.display = "flex";
      });
      this.player.on("remove-rewind", () => {
        seekRipple.style.display = "none";
      });
    } else if (side === "right") {
      seekRipple.style.borderRadius = "50% 0 0 50%";
      seekRipple.style.right = "0px";
      arrowHolder.innerHTML = `
				<div class="arrow arrow3 arrow-right"></div>
				<div class="arrow arrow1 arrow-right"></div>
				<div class="arrow arrow2 arrow-right"></div>
			`;
      this.player.on("forward", (val: number) => {
        text.innerText = `${Math.abs(val)} ${this.player.localize("seconds")}`;
        seekRipple.style.display = "flex";
      });
      this.player.on("remove-forward", () => {
        seekRipple.style.display = "none";
      });
    }

    return seekRipple;
  }

  createProgressBar(parent: HTMLDivElement) {
    this.sliderBar = this.player
      .createElement("div", "slider-bar")
      .addClasses([
        "slider-bar",
        "bg-white",
        "bg-opacity-20",
        "flex",
        "group/slider",
        "h-2",
        "mx-4",
        "pointer-events-auto",
        "relative",
        "rounded-full",
        "w-available",
      ])
      .appendTo(parent)
      .get();

    const sliderBuffer = this.player
      .createElement("div", "slider-buffer")
      .addClasses([
        "slider-buffer",
        "absolute",
        "bg-white",
        "bg-opacity-20",
        "flex",
        "h-full",
        "overflow-clip",
        "overflow-hidden",
        "pointer-events-none",
        "rounded-full",
        "z-0",
      ])
      .appendTo(this.sliderBar)
      .get();

    const sliderHover = this.player
      .createElement("div", "slider-hover")
      .addClasses([
        "slider-hover",
        "absolute",
        "bg-white/30",
        "flex",
        "h-full",
        "opacity-1",
        "overflow-clip",
        "overflow-hidden",
        "pointer-events-none",
        "rounded-full",
        "z-0",
      ])
      .appendTo(this.sliderBar)
      .get();

    const sliderProgress = this.player
      .createElement("div", "slider-progress")
      .addClasses([
        "slider-progress",
        "absolute",
        "bg-white",
        "flex",
        "h-full",
        "overflow-clip",
        "overflow-hidden",
        "pointer-events-none",
        "rounded-full",
        "z-10",
      ])
      .appendTo(this.sliderBar)
      .get();

    this.chapterBar = this.player
      .createElement("div", "chapter-progress")
      .addClasses([
        "chapter-bar",
        "bg-transparent",
        "flex",
        "h-2",
        "overflow-clip",
        "relative",
        "rounded-full",
        "w-available",
      ])
      .appendTo(this.sliderBar)
      .get();

    const sliderNipple = document.createElement("div");
    this.player.addClasses(sliderNipple, [
      "slider-nipple",
      "!-translate-x-1/2",
      "!-translate-y-1/4",
      "absolute",
      "bg-white",
      "group-hover/slider:flex",
      "h-4",
      "hidden",
      "left-0",
      "rounded-full",
      "top-0",
      "w-4",
      "z-20",
    ]);
    sliderNipple.id = "slider-nipple";

    if (this.player.options.nipple !== false) {
      this.sliderBar.append(sliderNipple);
    }

    const sliderPop = this.player
      .createElement("div", "slider-pop")
      .addClasses([
        "slider-pop",
        "-translate-x-1/2",
        "absolute",
        "bg-neutral-900/95",
        "bottom-4",
        "flex",
        "flex-col",
        "font-semibold",
        "gap-1",
        "hover:scale-110",
        "overflow-clip",
        "pb-1",
        "pointer-events-none",
        "rounded-md",
        "text-center",
        "z-20",
      ])
      .appendTo(this.sliderBar)
      .get();

    sliderPop.style.setProperty("--visibility", "0");
    sliderPop.style.opacity = "var(--visibility)";

    this.sliderPopImage = this.player
      .createElement("div", "slider-pop-image")
      .addClasses(["slider-pop-image"])
      .appendTo(sliderPop)
      .get();

    const sliderText = this.player
      .createElement("div", "slider-text")
      .addClasses(["slider-pop-text", "font-mono"])
      .appendTo(sliderPop)
      .get();

    this.chapterText = this.player
      .createElement("div", "chapter-text")
      .addClasses(["chapter-text"])
      .appendTo(sliderPop)
      .get();

    if (
      this.player.options.chapters &&
      !this.player.isTv() &&
      this.player.getChapters()?.length > 0
    ) {
      this.sliderBar.style.background = "";
    }

    ["mousedown", "touchstart"].forEach((event) => {
      this.sliderBar.addEventListener(
        event,
        () => {
          if (this.isMouseDown) return;

          this.isMouseDown = true;
          this.isScrubbing = true;
        },
        {
          passive: true,
        }
      );
    });

    this.bottomBar.addEventListener(
      "click",
      (e: any) => {
        this.player.emit("hide-tooltip");
        if (!this.isMouseDown) return;

        this.isMouseDown = false;
        this.isScrubbing = false;
        sliderPop.style.setProperty("--visibility", "0");
        const scrubTime = this.getScrubTime(e);
        sliderNipple.style.left = `${scrubTime.scrubTime}%`;
        if(this.hasNoMercyConnect()){
          this.sendNoMercyConnectCommand("seek", parseInt(scrubTime.scrubTimePlayer.toString(), 10));
        } else {
          this.player.seek(scrubTime.scrubTimePlayer);
        }
      },
      {
        passive: true,
      }
    );

    ["mousemove", "touchmove"].forEach((event) => {
      this.sliderBar.addEventListener(
        event,
        (e: any) => {
          const scrubTime = this.getScrubTime(e);
          this.getSliderPopImage(scrubTime);
          sliderText.innerText = humanTime(scrubTime.scrubTimePlayer);

          const sliderPopOffsetX = this.getSliderPopOffsetX(
            sliderPop,
            scrubTime
          );
          sliderPop.style.left = `${sliderPopOffsetX}%`;

          if (
            !this.player.options.chapters ||
            this.player.getChapters()?.length === 0
          ) {
            sliderHover.style.width = `${scrubTime.scrubTime}%`;
          }

          if (!this.isMouseDown) return;

          this.chapterText.innerText =
            this.player.getChapterText(scrubTime.scrubTimePlayer) ?? "";
          sliderNipple.style.left = `${scrubTime.scrubTime}%`;
          if (this.previewTime.length > 0) {
            sliderPop.style.setProperty("--visibility", "1");
          }
        },
        {
          passive: true,
        }
      );
    });

    this.sliderBar.addEventListener(
      "mouseover",
      (e: MouseEvent) => {
        const scrubTime = this.getScrubTime(e);
        this.getSliderPopImage(scrubTime);
        sliderText.innerText = humanTime(scrubTime.scrubTimePlayer);
        this.chapterText.innerText =
          this.player.getChapterText(scrubTime.scrubTimePlayer) ?? "";
        if (this.previewTime.length > 0) {
          sliderPop.style.setProperty("--visibility", "1");
          const sliderPopOffsetX = this.getSliderPopOffsetX(
            sliderPop,
            scrubTime
          );
          sliderPop.style.left = `${sliderPopOffsetX}%`;
        }
      },
      {
        passive: true,
      }
    );

    this.player.on("active", (value) => {
      setTimeout(() => {
        this.controlsVisible = value;
      }, (this.player.options.doubleClickDelay ?? 300) + 10);
      if (value) return;
      sliderPop.style.setProperty("--visibility", "0");
    });

    this.sliderBar.addEventListener(
      "mouseleave",
      () => {
        sliderPop.style.setProperty("--visibility", "0");
        sliderHover.style.width = "0";
      },
      {
        passive: true,
      }
    );

    this.player.on("seeked", () => {
      sliderPop.style.setProperty("--visibility", "0");
    });

    this.player.on("item", () => {
      this.sliderBar.classList.add("bg-white/20");
      this.previewTime = [];
      this.chapters = [];
      sliderBuffer.style.width = "0";
      sliderProgress.style.width = "0";
      this.fetchPreviewTime();
    });

    this.player.on("chapters", () => {
      if (this.player.getChapters()?.length > 0 && !this.player.isTv()) {
        this.sliderBar.classList.remove("bg-white/20");
      } else {
        this.sliderBar.classList.add("bg-white/20");
      }
    });

    this.player.on("time", (data) => {
      if (this.player.getChapters()?.length === 0) {
        sliderProgress.style.width = `${data.percentage}%`;
      }
      if (!this.isScrubbing) {
        sliderNipple.style.left = `${data.percentage}%`;
      }
    });

    this.player.on("controls", (showing) => {
      if (!showing) {
        sliderPop.style.setProperty("--visibility", "0");
        this.menuFrame.close();
      }
    });

    this.player.on("pip-internal", (data) => {
      if (data) {
        this.sliderBar.style.display = "none";
      } else {
        this.sliderBar.style.display = "flex";
      }
    });

    return this.sliderBar;
  }

  createChapterMarker(chapter: Chapter) {
    const chapterMarker = this.player
      .createElement("div", `chapter-marker-${chapter.id.replace(/\s/gu, "-")}`)
      .addClasses([
        "chapter-marker",
        "[&:last-child(2):.5px]",
        "absolute",
        "h-available",
        "last:translate-x-[1.5px]",
        "min-w-[2px]",
        "overflow-hidden",
        "rounded-sm",
      ])
      .appendTo(this.chapterBar)
      .get();
    chapterMarker.style.left = `${chapter.left}%`;
    chapterMarker.style.width = `calc(${chapter.width}% - 2px)`;

    this.player
      .createElement(
        "div",
        `chapter-marker-bg-${chapter.id.replace(/\s/gu, "-")}`
      )
      .addClasses([
        "chapter-marker-bg",
        "absolute",
        "bg-white",
        "bg-opacity-20",
        "h-available",
        "left-0",
        "rounded-sm",
        "w-available",
        "z-0",
      ])
      .appendTo(chapterMarker)
      .get();

    const chapterMarkerHover = this.player
      .createElement(
        "div",
        `chapter-marker-hover-${chapter.id.replace(/\s/gu, "-")}`
      )
      .addClasses([
        "chapter-marker-hover",
        "absolute",
        "bg-gray-200",
        "h-available",
        "left-0",
        "origin-left",
        "rounded-sm",
        "scale-x-0",
        "w-available",
        "z-10",
      ])
      .appendTo(chapterMarker)
      .get();

    const chapterMarkerProgress = this.player
      .createElement(
        "div",
        `chapter-marker-progress-${chapter.id.replace(/\s/gu, "-")}`
      )
      .addClasses([
        "chapter-marker-progress",
        "absolute",
        "bg-white",
        "h-available",
        "left-0",
        "origin-left",
        "rounded-sm",
        "scale-x-0",
        "w-available",
        "z-20",
      ])
      .appendTo(chapterMarker)
      .get();

    const left = chapter.left;
    const right = chapter.left + chapter.width;

    this.player.on("time", (data) => {
      if (data.percentage < left) {
        chapterMarkerProgress.style.transform = "scaleX(0)";
      } else if (data.percentage > right) {
        chapterMarkerProgress.style.transform = "scaleX(1)";
      } else {
        chapterMarkerProgress.style.transform = `scaleX(${
          (data.percentage - left) / (right - left)
        })`;
      }
    });

    ["mousemove", "touchmove"].forEach((event) => {
      this.chapterBar.addEventListener(event, (e: any) => {
        const { scrubTime } = this.getScrubTime(e);

        if (scrubTime < left) {
          chapterMarkerHover.style.transform = "scaleX(0)";
        } else if (scrubTime > right) {
          chapterMarkerHover.style.transform = "scaleX(1)";
        } else {
          chapterMarkerHover.style.transform = `scaleX(${
            (scrubTime - left) / (right - left)
          })`;
        }
      });
    });

    this.chapterBar.addEventListener("mouseleave", () => {
      chapterMarkerHover.style.transform = "scaleX(0)";
    });

    return chapterMarker;
  }

  createChapterMarkers() {
    if (this.player.isTv()) return;

    this.chapterBar.style.background = "";

    this.player.on("item", () => {
      this.chapterBar.style.background = "";
    });

    this.chapterBar.querySelectorAll(".chapter-marker").forEach((element) => {
      this.chapterBar.classList.add("bg-white/20");
      element.remove();
    });
    this.player.getChapters()?.forEach((chapter: Chapter) => {
      this.createChapterMarker(chapter);
    });
  }

  getSliderPopOffsetX(sliderPop: HTMLDivElement, scrubTime: any) {
    const sliderBarRect = this.sliderBar.getBoundingClientRect();
    const sliderPopRect = sliderPop.getBoundingClientRect();
    const sliderPopPercentageWidth =
      ((sliderPopRect.width * 0.5) / sliderBarRect.width) * 100;
    let offsetX = scrubTime.scrubTime;
    if (offsetX <= sliderPopPercentageWidth) {
      offsetX = sliderPopPercentageWidth;
    }
    if (offsetX >= 100 - sliderPopPercentageWidth) {
      offsetX = 100 - sliderPopPercentageWidth;
    }

    return offsetX;
  }

  createEpisodeMenu(parent: HTMLDivElement) {
    if (!this.player.getVideoElement()) return;

    const playlistMenu = this.player
      .createElement("div", "playlist-menu")
      .addClasses([...this.subMenuContentStyles, "!flex-row", "!gap-0"])
      .appendTo(parent)
      .get();

    const subMenu = this.player
      .createElement("div", "sub-menu-content")
      .addClasses([
        ...this.subMenuContentStyles,
        "!w-1/3",
        "border-r-2",
        "border-gray-500/20",
      ])
      .appendTo(playlistMenu)
      .get();

    this.createMenuHeader(subMenu, "Seasons");

    const seasonScrollContainer = this.player
      .createElement("div", "playlist-scroll-container")
      .addClasses(this.scrollContainerStyles)
      .appendTo(subMenu)
      .get();
    seasonScrollContainer.style.transform = "translateX(0)";

    this.player.on("playlist", (data) => {
      seasonScrollContainer.innerHTML = "";
      for (const [, item] of unique(this.player.getPlaylist(), "season").entries() ?? []) {
        this.createSeasonMenuButton(seasonScrollContainer, item);
      }
    });

    const episodeMenu = this.player
      .createElement("div", "episode-menu")
      .addClasses([...this.subMenuContentStyles, "!w-[63rem]"])
      .appendTo(playlistMenu)
      .get();

    this.createMainMenuHeader(episodeMenu);

    const scrollContainer = this.player
      .createElement("div", "playlist-scroll-container")
      .addClasses(this.scrollContainerStyles)
      .appendTo(episodeMenu)
      .get();

    scrollContainer.innerHTML = "";
    scrollContainer.tabIndex = 1;

    scrollContainer.addEventListener("focus", () => {
      (scrollContainer.firstChild as HTMLButtonElement)?.focus();
    });

    this.player.on("playlist", (data) => {
      scrollContainer.innerHTML = "";

      for (const [index, item] of Object.values(data).entries() ?? []) {
        this.createEpisodeMenuButton(scrollContainer, item, index);
      }
    });

    this.player.on("show-playlist-menu", (showing) => {
      if (showing) {
        playlistMenu.style.display = "flex";
        setTimeout(() => {
          (scrollContainer.firstChild as HTMLButtonElement)?.focus();
        }, 200);
      } else {
        playlistMenu.style.display = "none";
      }
    });

    return playlistMenu;
  }

  createSeasonMenuButton(
    parent: HTMLDivElement,
    item: PlaylistItem,
    hovered = false
  ) {
    if (item?.season === null || item?.season === undefined) return;

    const seasonButton = this.player
      .createElement("button", `season-${item.id}`)
      .addClasses(this.languageMenuStyles)
      .appendTo(parent)
      .get();

    const buttonSpan = this.player
      .createElement("span", `season-${item.id}-span`)
      .addClasses(this.menuButtonTextStyles)
      .appendTo(seasonButton)
      .get();

    buttonSpan.innerText = item?.seasonName
      ? item?.seasonName
      : item?.season
      ? this.player.localize("Season") + ` ${item?.season}`
      : "";

    const chevron = this.player.createSVGElement(
      seasonButton,
      "menu",
      this.buttons.chevronR,
      false,
      hovered
    );
    this.player.addClasses(chevron, ["ml-auto"]);

    seasonButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.player.emit("switch-season", item?.season);
    });

    seasonButton.addEventListener("focus", () => {
      setTimeout(() => {
        this.player.scrollCenter(seasonButton, parent, {
          duration: 100,
          margin: 1,
        });
      }, 50);
    });

    return seasonButton;
  }

  createEpisodeMenuButton(
    parent: HTMLDivElement,
    item: PlaylistItem,
    index: number
  ) {
    const button = this.player
      .createElement("button", `playlist-${item.id}`)
      .addClasses([
        "playlist-menu-button",
        "duration-200",
        "flex",
        "focus-visible:outline-2",
        "focus-visible:outline-white",
        "gap-2",
        "hover:bg-neutral-600/20",
        "outline",
        "outline-1",
        "outline-solid",
        "outline-transparent",
        "p-2",
        "relative",
        "rounded-lg",
        "snap-center",
        "text-white",
        "transition-all",
        "w-available",
      ])
      .appendTo(parent)
      .get();

    if (this.player.playlistItem()?.season !== 1) {
      button.style.display = "none";
    }

    const leftSide = this.player
      .createElement("div", `playlist-${item.id}-left`)
      .addClasses([
        "episode-menu-button-left",
        "h-available",
        "overflow-clip",
        "pointer-events-none",
        "relative",
        "rounded-md",
        "self-center",
        "w-[30%]",
      ])
      .appendTo(button)
      .get();

    this.player
      .createElement("div", `episode-${item.id}-shadow`)
      .addClasses([
        "episode-menu-button-shadow",
        "!h-available",
        "absolute",
        "bg-[linear-gradient(0deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_100%)]",
        "bottom-0",
        "left-0",
        "shadow-[inset_0px_1px_0px_rgba(255,255,255,0.24),inset_0px_-1px_0px_rgba(0,0,0,0.24),inset_0px_-2px_0px_rgba(0,0,0,0.24)]",
        "w-available",
      ])
      .appendTo(leftSide)
      .get();

    const image = this.player
      .createElement("img", `episode-${item.id}-image`)
      .addClasses([
        "episode-menu-button-image",
        "aspect-video",
        "h-auto",
        "object-cover",
        "w-available",
      ])
      .appendTo(leftSide)
      .get();
    image.setAttribute("loading", "lazy");
    image.src =
      item.image && item.image !== ""
        ? `${this.imageBaseUrl.includes("https") ? "" : this.imageBaseUrl}${
            item.image
          }`
        : "";

    const progressContainer = this.player
      .createElement("div", `episode-${item.id}-progress-container`)
      .addClasses([
        "episode-menu-progress-container",
        "absolute",
        "bottom-0",
        "flex",
        "flex-col",
        "px-3",
        "w-available",
      ])
      .appendTo(leftSide)
      .get();

    const progressContainerItemBox = this.player
      .createElement("div", `episode-${item.id}-progress-box`)
      .addClasses([
        "episode-menu-progress-box",
        "flex",
        "h-available",
        "justify-between",
        "mb-1",
        "px-1",
        "sm:mx-2",
      ])
      .appendTo(progressContainer)
      .get();

    const progressContainerItemText = this.player
      .createElement("div", `episode-${item.id}-progress-item`)
      .addClasses(["progress-item-text", "text-[0.7rem]"])
      .appendTo(progressContainerItemBox)
      .get();

    if (item.episode) {
      progressContainerItemText.innerText = `${this.player.localize("E")}${
        item.episode
      }`;
    }

    const progressContainerDurationText = this.player
      .createElement("div", `episode-${item.id}-progress-duration`)
      .addClasses(["progress-duration", "text-[0.7rem]"])
      .appendTo(progressContainerItemBox)
      .get();
    progressContainerDurationText.innerText =
      item.duration?.replace(/^00:/u, "") ?? "";

    const sliderContainer = this.player
      .createElement("div", `episode-${item.id}-slider-container`)
      .addClasses([
        "slider-container",
        "bg-gray-500/80",
        "h-1",
        "hidden",
        "mb-2",
        "mx-1",
        "overflow-clip",
        "rounded-md",
        "sm:mx-2",
      ])
      .appendTo(progressContainer)
      .get();

    const progressBar = this.player
      .createElement("div", `episode-${item.id}-progress-bar`)
      .addClasses(["progress-bar", "bg-white"])
      .appendTo(sliderContainer)
      .get();

    if (item.progress?.time) {
      progressBar.style.width = `${
        (item.progress.time / convertToSeconds(item.duration)) * 100
      }%`;
      sliderContainer.style.display = "flex";
    }

    const episodeMenuButtonRightSide = this.player
      .createElement("div", `episode-${item.id}-right-side`)
      .addClasses([
        "playlist-card-right",
        "flex",
        "flex-col",
        "gap-1",
        "pointer-events-none",
        "text-left",
        "w-3/4",
      ])
      .appendTo(button)
      .get();

    const episodeMenuButtonTitle = this.player
      .createElement("span", `episode-${item.id}-title`)
      .addClasses([
        "playlist-menu-button-title",
        "font-bold",
        "line-clamp-2",
        "text-white",
      ])
      .appendTo(episodeMenuButtonRightSide)
      .get();

    if (item.episode) {
      episodeMenuButtonTitle.innerText = lineBreakShowTitle(
        item.title
          ?.replace(item.show ?? "", "")
          .replace("%S", this.player.localize("S"))
          .replace("%E", this.player.localize("E"))
      );
    }

    const episodeMenuButtonOverview = this.player
      .createElement("span", `episode-${item.id}-overview`)
      .addClasses([
        "playlist-menu-button-overview",
        "leading-[1rem]",
        "line-clamp-4",
        "overflow-hidden",
        "text-[0.7rem]",
        "text-white",
      ])
      .appendTo(episodeMenuButtonRightSide)
      .get();
    episodeMenuButtonOverview.innerText = limitSentenceByCharacters(
      item.description,
      600
    );

    this.player.on("item", (playlistItem) => {
      if (playlistItem.season === item.season) {
        button.style.display = "flex";
      } else {
        button.style.display = "none";
      }

      if (
        this.player.playlistItem().season === item.season &&
        this.player.playlistItem().episode === item.episode
      ) {
        button.style.background = "rgba(255,255,255,.1)";
      } else {
        button.style.background = "";
      }
    });

    this.player.on("switch-season", (season) => {
      if (season === item.season) {
        button.style.display = "flex";
      } else {
        button.style.display = "none";
      }
    });

    this.player.on("time", (data) => {
      if (this.player.playlistItem()?.id === item.id) {
        progressBar.style.width = `${data.percentage}%`;
        if (data.percentage > 0) {
          sliderContainer.style.display = "flex";
        }
      }
    });

    if (item.episode && item.show) {
      progressContainerItemText.innerText =
        item.season === undefined
          ? `${item.episode}`
          : `${this.player.localize("S")}${item.season}: ${this.player.localize(
              "E"
            )}${item.episode}`;
    }

    button.addEventListener("click", () => {
      this.player.emit("show-menu", false);

      if (item.episode && item.season) {
        if(this.hasNoMercyConnect()){
          this.sendNoMercyConnectCommand("episode", JSON.stringify({ season: item.season, episode: item.episode }));
        } else {
          this.player.setEpisode(item.season, item.episode);
        }
      } else {
        if(this.hasNoMercyConnect()){
          this.sendNoMercyConnectCommand("item", index);
        } else {
          this.player.playlistItem(index);
        }
      }
      this.player.emit("playlist-menu-button-clicked", item);
    });

    button.addEventListener("focus", () => {
      setTimeout(() => {
        this.player.scrollCenter(button, parent, {
          duration: 100,
          margin: 1,
        });
      }, 50);
    });

    return button;
  }

  createToolTip(parent: HTMLDivElement) {
    this.tooltip = this.player
      .createElement("div", "tooltip")
      .addClasses([
        "tooltip",
        "absolute",
        "bg-neutral-900/95",
        "bottom-0",
        "font-medium",
        "hidden",
        "left-0",
        "pointer-events-none",
        "px-3",
        "py-2",
        "rounded-lg",
        "text-white",
        "text-xs",
        "z-50",
      ])
      .appendTo(parent)
      .get();

    this.tooltip.style.transform = "translateX(10px)";
    this.tooltip.innerText = "Play (space)";

    this.player.on("show-tooltip", (data) => {
      this.tooltip.innerText = data.text;
      this.tooltip.style.display = "block";
      this.tooltip.style.transform = `translate(calc(${data.x} - 50%), calc(${data.y} - 100%))`;
      if (data.currentTime === "top") {
        this.tooltip.classList.add("top-0");
        this.tooltip.classList.remove("bottom-0");
      } else {
        this.tooltip.classList.remove("top-0");
        this.tooltip.classList.add("bottom-0");
      }
    });

    this.player.on("hide-tooltip", () => {
      this.tooltip.style.display = "none";
    });

    return this.tooltip;
  }

  createEpisodeTip(parent: HTMLDivElement) {
    const nextTip = this.player
      .createElement("div", "episode-tip")
      .addClasses([
        "episode-tip",
        "!w-96",
        "-bottom-8",
        "absolute",
        "bg-neutral-900/95",
        "font-medium",
        "gap-2",
        "h-24",
        "hidden",
        "left-0",
        "px-2",
        "py-2",
        "rounded-lg",
        "text-white",
        "text-xs",
        "z-50",
        "group-[&.nomercyplayer:not(.active)]:!hidden",
      ])
      .appendTo(parent)
      .get();

    const leftSide = this.player
      .createElement("div", "next-tip-left")
      .addClasses([
        "next-tip-left",
        "overflow-clip",
        "relative",
        "rounded-sm",
        "self-center",
        "w-[40%]",
      ])
      .appendTo(nextTip)
      .get();

    const image = this.player
      .createElement("img", "next-tip-image")
      .addClasses([
        "playlist-card-image",
        "aspect-video",
        "h-auto",
        "object-cover",
        "rounded-sm",
        "w-available",
      ])
      .appendTo(leftSide)
      .get();
    image.setAttribute("loading", "eager");

    const rightSide = this.player
      .createElement("div", "next-tip-right-side")
      .addClasses([
        "next-tip-right",
        "flex",
        "flex-col",
        "gap-1",
        "text-left",
        "w-[60%]",
      ])
      .appendTo(nextTip)
      .get();

    const header = this.player
      .createElement("span", "next-tip-header")
      .addClasses(["next-tip-header", "font-bold"])
      .appendTo(rightSide)
      .get();

    const title = this.player
      .createElement("span", "next-tip-title")
      .addClasses(["next-tip-header", "font-bold", "font-sm", "line-clamp-3"])
      .appendTo(rightSide)
      .get();

    this.player.on("show-episode-tip", (data) => {
      this.getTipData({ direction: data.direction, header, title, image });
      nextTip.style.display = "flex";
      nextTip.style.transform = `translate(${data.x}, calc(${data.y} - 50%))`;
    });

    this.player.on("hide-episode-tip", () => {
      nextTip.style.display = "none";
    });

    return nextTip;
  }

  getTipDataIndex(direction: string) {
    let index: number = this.player.getPlaylistIndex();
    if (direction === "previous") {
      index -= 1;
    } else {
      index += 1;
    }

    return this.player.getPlaylist().at(index);
  }

  getTipData({
    direction,
    header,
    title,
    image,
  }: {
    direction: string;
    header: HTMLSpanElement;
    title: HTMLSpanElement;
    image: HTMLImageElement;
  }) {
    const item = this.getTipDataIndex(direction);
    if (!item) return;

    image.src =
      item.image && item.image !== "" ? `${this.imageBaseUrl}${item.image}` : "";
    header.innerText = `${this.player.localize(
      `${direction.toTitleCase()} Episode`
    )} ${this.player.getButtonKeyCode(direction)}`;
    title.innerText = item.title
      ?.replace(item.show ?? "", "")
      .replace("%S", this.player.localize("S"))
      .replace("%E", this.player.localize("E"));

    this.player.once("item", () => {
      this.getTipData({ direction, header, title, image });
    });
  }

  getScrubTime(e: any, parent = this.sliderBar) {
    const elementRect = parent.getBoundingClientRect();

    const x =
      e.clientX ??
      e.touches?.[0]?.clientX ??
      e.changedTouches?.[0]?.clientX ??
      0;

    let offsetX = x - elementRect.left;
    if (offsetX <= 0) offsetX = 0;
    if (offsetX >= elementRect.width) offsetX = elementRect.width;

    return {
      scrubTime: (offsetX / parent.offsetWidth) * 100,
      scrubTimePlayer:
        (offsetX / parent.offsetWidth) * this.player.getDuration(),
    };
  }
}
