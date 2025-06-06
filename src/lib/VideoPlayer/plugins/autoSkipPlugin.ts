import { toRaw } from "vue";

import Plugin from '@nomercy-entertainment/nomercy-video-player/src/plugin';
import { NMPlayer } from '@nomercy-entertainment/nomercy-video-player/src/types';

import { groupBy } from '@/lib/stringArray';
import type {NMPlaylistItem} from "@/lib/VideoPlayer";

export interface AutoSkipPluginArgs {
	playlist: NMPlaylistItem[]
}

export class AutoSkipPlugin extends Plugin {
	player: NMPlayer<AutoSkipPluginArgs> = <NMPlayer<AutoSkipPluginArgs>>{};

	chapterSkipPatterns: RegExp[] = [
		/^OP$/ui,
		/^ED$/ui,
		/^PV$/ui,
		/^NCOP$/ui,
		/^NCED$/ui,
		/^CM$/ui,
		/^Preview$/ui,
		/^Next Episode Preview$/ui,
		/^Next Time Preview$/ui,
		// /^Intro$/ui,
		/^Outro$/ui,
		/^Opening$/ui,
		/^Ending$/ui,
		/^Opening/ui,
		/^Ending/ui,
		/^Opening Credits$/ui,
		/^Ending Credits$/ui,
		/^Opening Theme$/ui,
		/^Ending Theme$/ui,
		/^Opening Song$/ui,
		/^Ending Song$/ui,
		/^Prologue$/ui,
		/^Epilogue$/ui,
		/^ED+Cast$/ui,

		/^Avant$/ui,
		/^Yokoku$/ui,
	];

	initialize(player: NMPlayer<AutoSkipPluginArgs>) {
		this.player = player;

		if (this.player.options.chapterSkipPatterns) {
			this.chapterSkipPatterns = this.player.options.chapterSkipPatterns;
		}
	}

	use() {
		this.player.on('time', this.checkChapters.bind(this));
	}

	dispose() {
		this.player.off('time', this.checkChapters.bind(this));
	}

	lastChapter: string = '';

	checkChapters(): void {
		if (!this.player.chapters || !this.player.chapters.cues || this.player.chapters.cues.length === 0) {
			return;
		}
		if (this.player.chapters.errors.length > 0) {
			console.error('Error parsing chapters:', this.player.chapters.errors);
			return;
		}

		const currentTime = this.player.getVideoElement().currentTime;
		let currentChapter = this.getCurrentChapter(currentTime);
		if (!currentChapter) return;

		while (this.lastChapter != currentChapter.text && this.shouldSkipChapter(currentChapter.text)) {
			this.lastChapter = currentChapter.text;
			const nextChapter = this.getNextChapter(currentChapter.endTime);
			if (!nextChapter) {
				this.player.next();
				this.lastChapter = '';
				return;
			}

			currentChapter = nextChapter;
			this.player.seek(currentChapter.startTime);
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

		return this.chapterSkipPatterns.some(pattern => pattern.test(chapterTitle));
	}

	getCurrentChapter(currentTime: number) {
		return this.player.chapters.cues.find((chapter) => currentTime >= chapter.startTime && currentTime <= chapter.endTime);
	}

	getNextChapter(currentEndTime: number) {
		return this.player.chapters.cues.find((chapter) => chapter.startTime >= currentEndTime);
	}
}
