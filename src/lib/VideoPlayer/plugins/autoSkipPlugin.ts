import { toRaw } from "vue";

import Plugin from '@nomercy-entertainment/nomercy-video-player/src/plugin';
import { NMPlayer } from '@nomercy-entertainment/nomercy-video-player/src/types';

import { groupBy } from '@/lib/stringArray';
import type {NMPlaylistItem} from "@/lib/VideoPlayer";
import type {Icon} from "@nomercy-entertainment/nomercy-video-player/src/types.ts";
import {buttons} from "@/lib/VideoPlayer/plugins/UIPlugin/buttons.ts";

export interface AutoSkipPluginArgs {
	playlist: NMPlaylistItem[]
	introPatterns?: RegExp[];
	outroPatterns?: RegExp[];
	autoSkip?: boolean;
}

export class AutoSkipPlugin extends Plugin {
	player: NMPlayer<AutoSkipPluginArgs> = <NMPlayer<AutoSkipPluginArgs>>{};

	introPatterns: RegExp[] = [
		/^OP$/ui,
		/^NCOP$/ui,
		/^Opening$/ui,
		/^Opening/ui,
		/^Opening Credits$/ui,
		/^Opening Theme$/ui,
		/^Opening Song$/ui,
		/^Epilogue$/ui,
	];

	outroPatterns: RegExp[] = [
		/^ED$/ui,
		/^PV$/ui,
		/^NCED$/ui,
		/^CM$/ui,
		/^Preview$/ui,
		/^Next Episode Preview$/ui,
		/^Next Time Preview$/ui,
		/^Outro$/ui,
		/^Ending/ui,
		/^Prologue$/ui,
		/^ED\+Cast$/ui,
		/^Credits$/ui,
		/^End Credits$/ui,
		/^Closing$/ui,
	];

	buttons: Icon = <Icon>{};

	autoSkip: boolean = false;

	initialize(player: NMPlayer<AutoSkipPluginArgs>) {
		this.player = player;

		if (this.player.options.introPatterns) {
			this.introPatterns = this.player.options.introPatterns;
		}
		if (this.player.options.outroPatterns) {
			this.outroPatterns = this.player.options.outroPatterns;
		}

		if (this.player.options.autoSkip !== undefined) {
			this.autoSkip = this.player.options.autoSkip;
		} else {
			this.autoSkip = localStorage.getItem('nmplayer-auto-skip') === 'true'
		}

		this.buttons = buttons();
	}

	use() {
		this.player.on('time', this.checkChapters.bind(this));
	}

	dispose() {
		this.player.off('time', this.checkChapters.bind(this));
	}

	lastChapter: string = '';

	getChapterType(title: string): 'intro' | 'next' | null {
		if (this.introPatterns.some(re => re.test(title))) return 'intro';
		if (this.outroPatterns.some(re => re.test(title))) return 'next';
		return null;
	}

	checkChapters(): void {
		if (!this.player.chapters || !this.player.chapters.cues || this.player.chapters.cues.length === 0) {
			this.hideSkipButton();
			return;
		}
		if (this.player.chapters.errors.length > 0) {
			console.error('Error parsing chapters:', this.player.chapters.errors);
			this.hideSkipButton();
			return;
		}

		const currentTime = this.player.getVideoElement().currentTime;
		let currentChapter = this.getCurrentChapter(currentTime);
		if (!currentChapter) {
			this.hideSkipButton();
			return;
		}

		if (this.shouldSkipChapter(currentChapter.text)) {
			// Auto-skip logic
			if (this.lastChapter !== currentChapter.text) {
				this.lastChapter = currentChapter.text;
				const nextChapter = this.getNextChapter(currentChapter.endTime);
				if (!nextChapter) {
					this.player.next();
					this.lastChapter = '';
					return;
				}
				if (this.autoSkip) {
					this.hideSkipButton();
					this.player.seek(nextChapter.startTime);
				} else {
					this.showSkipButton();
				}
			}
		} else {
			this.hideSkipButton();
		}
	}

	isFirstOrLastEpisodeOfSeason(): boolean {
		const playlistItem = this.player.playlistItem();
		if (playlistItem.episode == 1) return true;

		const playlist = this.player.getPlaylist().map((item) => toRaw(item as any));

		const seasons = groupBy(playlist, 'season');
		const season = seasons[playlistItem.season as number];

		if (!season) return false;

		return season.at(-1) == playlistItem;
	}

	shouldSkipChapter(chapterTitle: string): boolean {
		if (this.player.getCurrentTime() < this.player.getDuration() / 2 && this.player.getPlaylistIndex() == 0) {
			return false;
		}
		if (this.player.getCurrentTime() > this.player.getDuration() / 2 && this.player.isLastPlaylistItem()) {
			return false;
		}
		if (this.isFirstOrLastEpisodeOfSeason()) {
			return false;
		}

		return this.introPatterns.some(pattern => pattern.test(chapterTitle))
			|| this.outroPatterns.some(pattern => pattern.test(chapterTitle));
	}

	getCurrentChapter(currentTime: number) {
		return this.player.chapters.cues.find((chapter) => currentTime >= chapter.startTime && currentTime <= chapter.endTime);
	}

	getNextChapter(currentEndTime: number) {
		return this.player.chapters.cues.find((chapter) => chapter.startTime >= currentEndTime);
	}

	skipButtonElement: HTMLElement | null = null;

	showSkipButton(): void {
		if (this.skipButtonElement) {
			this.skipButtonElement.classList.add('visible');
			return;
		}

		const button = this.player.createElement('button', 'skip-chapter-button')
			.addClasses([
				'skip-chapter-button',
				'flex',
				'items-center',
				'justify-center',
				'gap-2',
				'text-sm',
				'text-white',
				'bg-neutral-800',
				'rounded',
				'hover:bg-neutral-700',
				'px-2',
				'py-1',
				'absolute',
				'bottom-20',
				'right-6',
				'z-10',
				'transition-opacity',
				'duration-300',
				'opacity-0',
				'invisible',
			])
			.appendTo(this.player.overlay)
			.get();

		const type = this.getChapterType(this.lastChapter);
		let label = type === 'intro'
			? this.player.localize('Skip intro')
			: this.player.localize('Skip outro');

		button.title = label;

		const icon = this.player.createSVGElement(button, 'chevronR', this.buttons.chevronR, false, false);
		icon.classList.add('w-4', 'h-4');

		const text = this.player.createElement('span', 'skip-chapter-text')
			.addClasses(['hidden', 'md:inline'])
			.appendTo(button)
			.get();

		text.textContent = label;

		button.addEventListener('click', this.player.nextChapter.bind(this.player));
		this.skipButtonElement = button;

		requestAnimationFrame(() => {
			button.classList.remove('opacity-0', 'invisible');
			button.classList.add('opacity-100', 'visible');
		});

		button.focus();
	}

	hideSkipButton(): void {
		if (this.skipButtonElement) {
			this.skipButtonElement.classList.remove('opacity-100', 'visible');
			this.skipButtonElement.classList.add('opacity-0', 'invisible');
			setTimeout(() => {
				if (this.skipButtonElement) {
					this.skipButtonElement.remove();
					this.skipButtonElement = null;
				}
			}, 300);
		}
	}
}
