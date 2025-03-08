import { SliderBar } from '@/lib/sliderBar';
import { LogoResponse } from '@/types/server';
import {alphaNumericRange} from "@/lib/stringArray";

HTMLElement.prototype.sliderBar = function (player: any, callbackFn: string, getSizeFn?: string) {
    if (!(this instanceof HTMLElement) || this.dataset.type != 'slider-bar')
        return null;
    return new SliderBar(this, player, callbackFn, getSizeFn);
};

HTMLElement.prototype.scrollHorizontalIntoView = function (parent?: HTMLElement): void {
    if (!(this instanceof HTMLElement)) return;
    const rect = this.getBoundingClientRect();
    const parentElement = parent ?? this.parentElement;
    if (!parentElement) return;
    const elementLeft = rect.left - parentElement.getBoundingClientRect().left;
    parentElement.scrollTo({
        left: elementLeft,
        behavior: 'smooth',
    });
};
HTMLElement.prototype.scrollVerticalIntoView = function (parent?: HTMLElement): void {
    if (!(this instanceof HTMLElement)) return;
    const rect = this.getBoundingClientRect();
    const parentElement = parent ?? this.parentElement;
    if (!parentElement) return;
    const elementTop = rect.top - parentElement.getBoundingClientRect().top;
    parentElement.scrollTo({
        top: elementTop,
        behavior: 'smooth',
    });
};
HTMLElement.prototype.animateVerticalIntoView = function (parentElement: HTMLElement | null = null, duration: number = 420) {
    if (!(this instanceof HTMLElement)) return;
    const rect = this.getBoundingClientRect();
    if (!parentElement) parentElement = this.parentElement;
    if (!parentElement) return;
    const elementTop =
        rect.top -
        parentElement.getBoundingClientRect().top -
        parentElement.getBoundingClientRect().height / 2;
    const startTime = performance.now();
    const startY = parentElement.scrollTop;
    function scrollStep(timestamp: number) {
        if (!parentElement) return;

        const currentTime = timestamp - startTime;
        let progress = Math.min(currentTime / duration, 1);

        progress = easeInOutCubic(progress);

        parentElement.scrollTo(0, startY + elementTop * progress);

        if (currentTime < duration) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
};
HTMLElement.prototype.isVisible = function (parent?: HTMLElement): boolean {
    if (!this) return false;
    const rect = this.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (parent?.offsetHeight || document.documentElement.clientHeight) &&
        rect.right <= (parent?.offsetWidth || document.documentElement.clientWidth)
    );
}

Document.prototype.querySelectorAllArray = function <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][] {
    return Array.from(this.querySelectorAll<K>(selector));
}
Element.prototype.querySelectorAllArray = function <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][] {
    return Array.from(this.querySelectorAll<K>(selector));
}
HTMLElement.prototype.querySelectorAllArray = function <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][] {
    return Array.from(this.querySelectorAll<K>(selector));
}

const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

let timeout: string | number | NodeJS.Timeout | undefined;

export const scrollToDiv = (i: string) => {
    clearTimeout(timeout);

    let target: HTMLDivElement | null = null;
    if (i == '#') {
        target = document.querySelector<HTMLDivElement>('[data-scroll]');
    }
    else {
        target = document.querySelector<HTMLDivElement>(
            `[data-scroll='scroll_${i}']`
        );
    }

    document.dispatchEvent(new CustomEvent("scrollToDiv", { detail: { top: target?.offsetTop } }));

    let scrollContainer =
        document.querySelector<HTMLDivElement>('.ion-page:not(.ion-page-hidden) main .group\\/scrollContainer')!;
    if (!scrollContainer) {
        scrollContainer = document.querySelector<HTMLDivElement>('.ion-page:not(.ion-page-hidden) ion-content .scroll-container')!;
    }

    console.log(scrollContainer, target);

    if (target && scrollContainer) {
        (scrollContainer as HTMLDivElement).scrollTo({
            top: target.offsetTop - 120,
            behavior: 'smooth',
        });

        timeout = setTimeout(() => {
            target?.classList.add('flashing');
            setTimeout(() => {
                target?.classList.remove('flashing');
            }, 3000);
        }, 700);
    }
};

export const keyHandler = (e: KeyboardEvent) => {
    if (e.key && alphaNumericRange('#', 'Z').some((x) => x == e.key.toUpperCase())) {
        scrollToDiv(e.key?.toUpperCase());
    }
};

export const openImageModal = function (data: LogoResponse | null = null, aspectRatio: string = '16:9') {
    if (data) {
        data.aspectRatio = data.aspectRatio ?? aspectRatio;
    }

    // window.Alpine.store('config').imageModalData = data;
    // window.Alpine.store('config').imageModalOpen = true;
};

// HTMLElement.prototype.openImageModal = function (data: LogoResponse | null = null, aspectRatio: string = '16:9') {
//     if (data) {
//         data.aspectRatio = data.aspectRatio ?? aspectRatio;
//     }
// window.Alpine.store('config').screensaverDisabled = true;

// window.Alpine.store('config').imageModalData = data;
// window.Alpine.store('config').imageModalOpen = true;
// };
