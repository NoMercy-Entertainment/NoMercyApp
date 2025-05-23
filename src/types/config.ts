import {EdgeStyle} from "@/lib/VideoPlayer/plugins/UIPlugin/buttons";
import {Message, Server} from "@/types/auth";

export type ColorScheme = 'dark' | 'light' | 'system';

export interface Component {
	id: string;
	component: string;
	props: Record<string, any>;
}

export interface AppConfig {
	status: string;
	data:   AppConfigData;
}

export interface AppConfigData {
	id:            string;
	name:          string;
	email:         string;
	currentServer: null;
	locale:        string;
	avatarUrl:     string;
	admin:         string;
	moderator:     number;
	servers:       Server[];
	messages:	   Message[];
	notifications: Message[];
	features: {
		[key: string]: boolean;
	};
}


export const getEdgeStyle = (edgeStyle: EdgeStyle, opacity: number): string => {
	switch (edgeStyle) {
		case 'depressed':
			return `1px 1px 2px ${parseColorToHex('black', opacity)}`;
		case 'dropShadow':
			return `2px 2px 4px ${parseColorToHex('black', opacity)}`;
		case 'raised':
			return `-1px -1px 2px ${parseColorToHex('black', opacity)}`;
		case 'uniform':
			return `0px 0px 4px ${parseColorToHex('black', opacity)}`;
		case 'textShadow':
			return `${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px`;
		default:
			return '';
	}
}

export const namedColors: Record<string, string> = {
	"aliceblue": "#F0F8FF",
	"antiquewhite": "#FAEBD7",
	"aquamarine": "#7FFFD4",
	"azure": "#F0FFFF",
	"beige": "#F5F5DC",
	"bisque": "#FFE4C4",
	"black": "#000000",
	"blanchedalmond": "#FFEBCD",
	"blue": "#0000FF",
	"blueviolet": "#8A2BE2",
	"brown": "#A52A2A",
	"burlywood": "#DEB887",
	"cadetblue": "#5F9EA0",
	"chartreuse": "#7FFF00",
	"chocolate": "#D2691E",
	"coral": "#FF7F50",
	"cornflowerblue": "#6495ED",
	"cornsilk": "#FFF8DC",
	"crimson": "#DC143C",
	"cyan": "#00FFFF",
	"darkblue": "#00008B",
	"darkcyan": "#008B8B",
	"darkgoldenrod": "#B8860B",
	"darkgray": "#A9A9A9",
	"darkgreen": "#006400",
	"darkkhaki": "#BDB76B",
	"darkmagenta": "#8B008B",
	"darkolivegreen": "#556B2F",
	"darkorange": "#FF8C00",
	"darkorchid": "#9932CC",
	"darkred": "#8B0000",
	"darksalmon": "#E9967A",
	"darkseagreen": "#8FBC8F",
	"darkslateblue": "#483D8B",
	"darkslategray": "#2F4F4F",
	"darkturquoise": "#00CED1",
	"darkviolet": "#9400D3",
	"deeppink": "#FF1493",
	"deepskyblue": "#00BFFF",
	"dimgray": "#696969",
	"dodgerblue": "#1E90FF",
	"firebrick": "#B22222",
	"floralwhite": "#FFFAF0",
	"forestgreen": "#228B22",
	"fuchsia": "#FF00FF",
	"gainsboro": "#DCDCDC",
	"ghostwhite": "#F8F8FF",
	"gold": "#FFD700",
	"goldenrod": "#DAA520",
	"gray": "#808080",
	"green": "#008000",
	"greenyellow": "#ADFF2F",
	"honeydew": "#F0FFF0",
	"hotpink": "#FF69B4",
	"indianred": "#CD5C5C",
	"indigo": "#4B0082",
	"ivory": "#FFFFF0",
	"khaki": "#F0E68C",
	"lavender": "#E6E6FA",
	"lavenderblush": "#FFF0F5",
	"lawngreen": "#7CFC00",
	"lemonchiffon": "#FFFACD",
	"lightblue": "#ADD8E6",
	"lightcoral": "#F08080",
	"lightcyan": "#E0FFFF",
	"lightgoldenrodyellow": "#FAFAD2",
	"lightgray": "#D3D3D3",
	"lightgreen": "#90EE90",
	"lightpink": "#FFB6C1",
	"lightsalmon": "#FFA07A",
	"lightseagreen": "#20B2AA",
	"lightskyblue": "#87CEFA",
	"lightslategray": "#778899",
	"lightsteelblue": "#B0C4DE",
	"lightyellow": "#FFFFE0",
	"lime": "#00FF00",
	"limegreen": "#32CD32",
	"linen": "#FAF0E6",
	"magenta": "#FF00FF",
	"maroon": "#800000",
	"mediumaquamarine": "#66CDAA",
	"mediumblue": "#0000CD",
	"mediumorchid": "#BA55D3",
	"mediumpurple": "#9370DB",
	"mediumseagreen": "#3CB371",
	"mediumslateblue": "#7B68EE",
	"mediumspringgreen": "#00FA9A",
	"mediumturquoise": "#48D1CC",
	"mediumvioletred": "#C71585",
	"midnightblue": "#191970",
	"mintcream": "#F5FFFA",
	"mistyrose": "#FFE4E1",
	"moccasin": "#FFE4B5",
	"navajowhite": "#FFDEAD",
	"navy": "#000080",
	"oldlace": "#FDF5E6",
	"olive": "#808000",
	"olivedrab": "#6B8E23",
	"orange": "#FFA500",
	"orangered": "#FF4500",
	"orchid": "#DA70D6",
	"palegoldenrod": "#EEE8AA",
	"palegreen": "#98FB98",
	"paleturquoise": "#AFEEEE",
	"palevioletred": "#DB7093",
	"papayawhip": "#FFEFD5",
	"peachpuff": "#FFDAB9",
	"peru": "#CD853F",
	"pink": "#FFC0CB",
	"plum": "#DDA0DD",
	"powderblue": "#B0E0E6",
	"purple": "#800080",
	"rebeccapurple": "#663399",
	"red": "#FF0000",
	"rosybrown": "#BC8F8F",
	"royalblue": "#4169E1",
	"saddlebrown": "#8B4513",
	"salmon": "#FA8072",
	"sandybrown": "#F4A460",
	"seagreen": "#2E8B57",
	"seashell": "#FFF5EE",
	"sienna": "#A0522D",
	"silver": "#C0C0C0",
	"skyblue": "#87CEEB",
	"slateblue": "#6A5ACD",
	"slategray": "#708090",
	"snow": "#FFFAFA",
	"springgreen": "#00FF7F",
	"steelblue": "#4682B4",
	"tan": "#D2B48C",
	"teal": "#008080",
	"thistle": "#D8BFD8",
	"tomato": "#FF6347",
	"turquoise": "#40E0D0",
	"violet": "#EE82EE",
	"wheat": "#F5DEB3",
	"white": "#FFFFFF",
	"whitesmoke": "#F5F5F5",
	"yellow": "#FFFF00",
	"yellowgreen": "#9ACD32"
};

export const parseColorToHex = (color: string, opacity: number = 1): string | null => {
	const ctx = document.createElement("canvas").getContext("2d");
	if (!ctx) return null;

	if (color.toLowerCase() === "transparent") {
		return "#00000000";
	}

	// Handle named colors
	if (namedColors[color.toLowerCase()]) {
		return normalizeHex(namedColors[color.toLowerCase()], opacity);
	}

	// Handle other color formats
	ctx.fillStyle = color;
	const computedColor = ctx.fillStyle;

	// Convert RGB(A) to hex
	if (computedColor.startsWith("rgb")) {
		return rgbToHex(computedColor, opacity);
	}

	// Convert HSL(A) to hex
	if (computedColor.startsWith("hsl")) {
		return hslToHex(computedColor, opacity);
	}

	// Handle hex format
	if (/^#[0-9A-Fa-f]{3,8}$/.test(computedColor)) {
		return normalizeHex(computedColor, opacity);
	}

	return computedColor;
};

export const rgbToHex = (rgb: string, opacity: number): string => {
	const match = rgb.match(/\d+/g);
	if (!match) return "#00000000";

	const [r, g, b] = match.map(Number);
	const a = Math.round(opacity * 255);
	return `#${r.toString(16).padStart(2, '0').toUpperCase()}` +
		`${g.toString(16).padStart(2, '0').toUpperCase()}` +
		`${b.toString(16).padStart(2, '0').toUpperCase()}` +
		`${a.toString(16).padStart(2, '0').toUpperCase()}`;
};

export const hslToHex = (hsl: string, opacity: number): string => {
	const match = hsl.match(/\d+/g);
	if (!match || match.length < 3) return "#00000000";

	let [h, s, l] = match.map(Number);
	s /= 100;
	l /= 100;

	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255);

	const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
	return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}${alpha}`;
};

export const normalizeHex = (hex: string, opacity: number): string => {
	if (hex.length === 4) {
		hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase();
	}
	if (hex.length === 7) {
		const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
		return hex.toUpperCase() + alpha;
	}
	return hex.toUpperCase();
};
