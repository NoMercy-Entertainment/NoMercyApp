import {groupBy} from '@/lib/stringArray';
import Plugin from 'nomercyplayer/src/plugin';
import {NMPlayer, VTTData} from '@/lib/VideoPlayer';
import {toRaw} from "vue";

export class AutoSkipPlugin extends Plugin {
	player: NMPlayer = <NMPlayer>{};

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
		/^Opening Credits$/ui,
		/^Ending Credits$/ui,
		/^Opening Theme$/ui,
		/^Ending Theme$/ui,
		/^Opening Song$/ui,
		/^Ending Song$/ui,
		/^Prologue$/ui,
		/^Epilogue$/ui,
		/^ED+Cast$/ui,
	];


	initialize(player: NMPlayer) {
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

		const playlist = this.player.getPlaylist().map((item: any) => toRaw(item as any));

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

	getCurrentChapter(currentTime: number): VTTData['cues'][number] | undefined {
		return this.player.chapters.cues.find((chapter: VTTCue) => currentTime >= chapter.startTime && currentTime <= chapter.endTime);
	}

	getNextChapter(currentEndTime: number): VTTData['cues'][number] | undefined {
		return this.player.chapters.cues.find((chapter: VTTCue) => chapter.startTime >= currentEndTime);
	}
}
