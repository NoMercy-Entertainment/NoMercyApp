import type {PaletteColors} from '@/types/api/shared';

export interface ReleaseGroup {
    id: string;
    title: string;
    description: string;
    cover: string;
    color_palette: {
        cover: PaletteColors,
    },
    library_id: string;
    origin: string;
    type: string;
    year: number
}
