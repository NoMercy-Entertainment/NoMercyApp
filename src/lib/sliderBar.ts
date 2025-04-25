import PlayerCore from '@nomercy-entertainment/nomercy-music-player';
import {PlaylistItem} from "@/types/musicPlayer";

export class SliderBar<S extends PlaylistItem> {
    player: PlayerCore<S>;
    isMouseDown = false;
    isScrubbing = false;
    valuePercentage = 0;
    dragPercentage = 0;
    sliderBar: HTMLElement = <HTMLElement>{};
    sliderValue: HTMLElement = <HTMLElement>{};
    sliderNipple: HTMLElement = <HTMLElement>{};
    sliderHover: HTMLElement = <HTMLElement>{};
    targetElement: HTMLElement;
    callbackFn: string;
    getSizeFn?: string;

    constructor(
        targetElement: HTMLElement,
        player: PlayerCore<S>,
        callbackFn: string,
        getSizeFn?: string
    ) {
        this.player = player;
        this.targetElement = targetElement;
        this.callbackFn = callbackFn;
        this.getSizeFn = getSizeFn;

        if (!this.targetElement) return;

        this.sliderBar = this.targetElement.querySelector(
            '.slider-bar'
        ) as HTMLElement;
        this.sliderValue = this.targetElement.querySelector(
            '.slider-value'
        ) as HTMLElement;
        this.sliderNipple = this.targetElement.querySelector(
            '.slider-nipple'
        ) as HTMLElement;
        this.sliderHover = this.targetElement.querySelector(
            '.slider-hover'
        ) as HTMLElement;

        if (
            !this.sliderBar ||
            !this.sliderValue ||
            !this.sliderNipple ||
            !this.sliderHover
        )
            return;

        this.init();
    }

    getScrubTime(e: any, parent: HTMLElement) {
        const elementRect = parent.getBoundingClientRect();

        const x =
            e.clientX ??
            e.touches?.[0]?.clientX ??
            e.changedTouches?.[0]?.clientX ??
            0;

        let offsetX = x - elementRect.left;
        if (offsetX <= 0) offsetX = 0;
        if (offsetX >= elementRect.width) offsetX = elementRect.width;

        let maxWidth = 100;
        if (
            this.getSizeFn &&
            typeof (this.player as any)[this.getSizeFn] == 'function'
        ) {
            maxWidth = (this.player as any)[this.getSizeFn]();
        }

        return {
            scrubValue: (offsetX / parent.offsetWidth) * 100,
            scrubValuePlayer: (offsetX / parent.offsetWidth) * maxWidth,
        };
    }

    handleMouseDown() {
        this.isMouseDown = true;
    }
    handleMouseUp(e: MouseEvent) {
        this.isMouseDown = false;
        this.isScrubbing = false;

        this.sliderNipple.style.removeProperty('--force-left');
        this.sliderValue.style.removeProperty('--force-width');

        const value = this.getScrubTime(e, this.sliderBar!);

        if (typeof (this.player as any)[this.callbackFn] == 'function') {
            (this.player as any)[this.callbackFn](value.scrubValuePlayer);
        }
    }
    handleMouseMove(e: MouseEvent) {
        const value = this.getScrubTime(e, this.sliderBar!);

        if (this.isMouseDown) {
            this.sliderNipple.style.setProperty(
                '--force-left',
                `${value.scrubValue}%`
            );
            this.sliderValue.style.setProperty(
                '--force-width',
                `${value.scrubValue}%`
            );

            this.valuePercentage = value.scrubValue;
            if (
                typeof (this.player as any)[this.callbackFn] == 'function' &&
                !this.getSizeFn
            ) {
                (this.player as any)[this.callbackFn](value.scrubValue);
            }
        }

        this.dragPercentage = Math.round(value.scrubValue);
        this.sliderHover.style.width = `${value.scrubValue}%`;
    }
    handleMouseEnter() {
        this.sliderNipple.style.display = 'flex';
    }
    handleMouseLeave() {
        this.isScrubbing = false;
        this.isMouseDown = false;

        this.sliderNipple.style.removeProperty('--force-left');
        this.sliderValue.style.removeProperty('--force-width');

        this.sliderNipple.style.display = '';
        this.sliderHover.style.width = '0';
    }

    handleTouchStart() {
        this.isMouseDown = true;

        this.sliderNipple.style.display = 'flex';
    }
    handleTouchMove(e: TouchEvent) {
        if (this.isMouseDown) {
            this.isScrubbing = true;

            const value = this.getScrubTime(e, this.sliderBar!);

            this.sliderNipple.style.setProperty(
                '--force-left',
                `${value.scrubValue}%`
            );
            this.sliderValue.style.setProperty(
                '--force-width',
                `${value.scrubValue}%`
            );

            if (typeof (this.player as any)[this.callbackFn] == 'function') {
                (this.player as any)[this.callbackFn](value.scrubValuePlayer);
            }
        }
    }
    handleTouchEnd(e: TouchEvent) {
        this.isMouseDown = false;
        this.isScrubbing = false;

        this.sliderNipple.style.display = '';
        this.sliderNipple.style.removeProperty('--force-left');
        this.sliderValue.style.removeProperty('--force-width');

        const value = this.getScrubTime(e, this.sliderBar!);

        if (typeof (this.player as any)[this.callbackFn] == 'function') {
            (this.player as any)[this.callbackFn](value.scrubValuePlayer);
        }
    }

    private init() {
        this.sliderBar.addEventListener(
            'mousedown',
            this.handleMouseDown.bind(this)
        );
        this.sliderBar.addEventListener(
            'mouseup',
            this.handleMouseUp.bind(this)
        );
        this.sliderBar.addEventListener(
            'mousemove',
            this.handleMouseMove.bind(this)
        );
        this.sliderBar.addEventListener(
            'mouseenter',
            this.handleMouseEnter.bind(this)
        );
        this.sliderBar.addEventListener(
            'mouseleave',
            this.handleMouseLeave.bind(this)
        );

        this.sliderBar.addEventListener(
            'touchstart',
            this.handleTouchStart.bind(this)
        );
        this.sliderBar.addEventListener(
            'touchmove',
            this.handleTouchMove.bind(this)
        );
        this.sliderBar.addEventListener(
            'touchend',
            this.handleTouchEnd.bind(this)
        );
    }
}
