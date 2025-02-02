import i18next from 'i18next';
import Backend from 'i18next-http-backend';

import type {Language} from "@/types/api/shared";

i18next
	.use(Backend)
	.init({
		lng: navigator.language.split('-')?.[0] ?? 'en',
		fallbackLng: 'en',
		debug: false,
		load: 'currentOnly',
		interpolation: {
			escapeValue: false,
		},
	}).then();

export default i18next;

export const availableTranslations = [
	'en',
	'nl',
	'fr',
	'de',
	'it',
];

export const languages: Language[] = [
	{
		id: 1,
		iso_639_1: "kw",
		english_name: "Cornish",
		name: ""
	},
	{
		id: 2,
		iso_639_1: "ff",
		english_name: "Fulah",
		name: "Fulfulde"
	},
	{
		id: 3,
		iso_639_1: "gn",
		english_name: "Guarani",
		name: ""
	},
	{
		id: 4,
		iso_639_1: id,
		english_name"Indonesian",
		name: Bahasaindonesia"
	,	{
		id: 5,
		iso_639_1: "lu",
		english_name: "Luba-Katanga",
		name: ""
	},
	{
		id: 6,
		iso_639_1: "nr",
		english_name: "Ndebele",
		name: ""
	},
	{
		id: 7,
		iso_639_1: "os",
		english_name: "Ossetian; Ossetic",
		name: ""
	},
	{
		id: 8,
		iso_639_1: "ru",
		english_name: "Russian",
		name: "Pусский"
	},
	{
		id: 9,
		iso_639_1: "se",
		english_name: "Northern Sami",
		name: ""
	},
	{
		id: 10,
		iso_639_1: "so",
		english_name: "Somali",
		name: "Somali"
	},
	{
		id: 11,
		iso_639_1: "es",
		english_name: "Spanish",
		name: "Español"
	},
	{
		id: 12,
		iso_639_1: "sv",
		english_name: "Swedish",
		name: "svenska"
	},
	{
		id: 13,
		iso_639_1: "ta",
		english_name: "Tamil",
		name: "தமிழ்"
	},
	{
		id: 14,
		iso_639_1: "te",
		english_name: "Telugu",
		name: "తెలుగు"
	},
	{
		id: 15,
		iso_639_1: "tn",
		english_name: "Tswana",
		name: ""
	},
	{
		id: 16,
		iso_639_1: "uk",
		english_name: "Ukrainian",
		name: "Український"
	},
	{
		id: 17,
		iso_639_1: "uz",
		english_name: "Uzbek",
		name: "ozbek"
	},
	{
		id: 18,
		iso_639_1: "el",
		english_name: "Greek",
		name: "ελληνικά"
	},
	{
		id: 19,
		iso_639_1: "co",
		english_name: "Corsican",
		name: ""
	},
	{
		id: 20,
		iso_639_1: "dv",
		english_name: "Divehi",
		name: ""
	},
	{
		id: 21,
		iso_639_1: "kk",
		english_name: "Kazakh",
		name: "қазақ"
	},
	{
		id: 22,
		iso_639_1: "ki",
		english_name: "Kikuyu",
		name: ""
	},
	{
		id: 23,
		iso_639_1: "or",
		english_name: "Oriya",
		name: ""
	},
	{
		id: 24,
		iso_639_1: "si",
		english_name: "Sinhalese",
		name: "සිංහල"
	},
	{
		id: 25,
		iso_639_1: "st",
		english_name: "Sotho",
		name: ""
	},
	{
		id: 26,
		iso_639_1: "sr",
		english_name: "Serbian",
		name: "Srpski"
	},
	{
		id: 27,
		iso_639_1: "ss",
		english_name: "Swati",
		name: ""
	},
	{
		id: 28,
		iso_639_1: "tr",
		english_name: "Turkish",
		name: "Türkçe"
	},
	{
		id: 29,
		iso_639_1: "wa",
		english_name: "Walloon",
		name: ""
	},
	{
		id: 30,
		iso_639_1: "cn",
		english_name: "Cantonese",
		name: "广州话 / 廣州話"
	},
	{
		id: 31,
		iso_639_1: "bi",
		english_name: "Bislama",
		name: ""
	},
	{
		id: 32,
		iso_639_1: "cr",
		english_name: "Cree",
		name: ""
	},
	{
		id: 33,
		iso_639_1: "cy",
		english_name: "Welsh",
		name: "Cymraeg"
	},
	{
		id: 34,
		iso_639_1: "eu",
		english_name: "Basque",
		name: "euskera"
	},
	{
		id: 35,
		iso_639_1: "hz",
		english_name: "Herero",
		name: ""
	},
	{
		id: 36,
		iso_639_1: "ho",
		english_name: "Hiri Motu",
		name: ""
	},
	{
		id: 37,
		iso_639_1: "ka",
		english_name: "Georgian",
		name: "ქართული"
	},
	{
		id: 38,
		iso_639_1: "kr",
		english_name: "Kanuri",
		name: ""
	},
	{
		id: 39,
		iso_639_1: "km",
		english_name: "Khmer",
		name: ""
	},
	{
		id: 40,
		iso_639_1: "kj",
		english_name: "Kuanyama",
		name: ""
	},
	{
		id: 41,
		iso_639_1: "to",
		english_name: "Tonga",
		name: ""
	},
	{
		id: 42,
		iso_639_1: "vi",
		english_name: "Vietnamese",
		name: "Tiếng Việt"
	},
	{
		id: 43,
		iso_639_1: "zu",
		english_name: "Zulu",
		name: "isiZulu"
	},
	{
		id: 44,
		iso_639_1: "zh",
		english_name: "Mandarin",
		name: "普通话"
	},
	{
		id: 45,
		iso_639_1: "ps",
		english_name: "Pushto",
		name: "پښتو"
	},
	{
		id: 46,
		iso_639_1: "mk",
		english_name: "Macedonian",
		name: ""
	},
	{
		id: 47,
		iso_639_1: "ae",
		english_name: "Avestan",
		name: ""
	},
	{
		id: 48,
		iso_639_1: "az",
		english_name: "Azerbaijani",
		name: "Azərbaycan"
	},
	{
		id: 49,
		iso_639_1: "ba",
		english_name: "Bashkir",
		name: ""
	},
	{
		id: 50,
		iso_639_1: "sh",
		english_name: "Serbo-Croatian",
		name: ""
	},
	{
		id: 51,
		iso_639_1: "lv",
		english_name: "Latvian",
		name: "Latviešu"
	},
	{
		id: 52,
		iso_639_1: "lt",
		english_name: "Lithuanian",
		name: "Lietuvių"
	},
	{
		id: 53,
		iso_639_1: "ms",
		english_name: "Malay",
		name: "Bahasa melayu"
	},
	{
		id: 54,
		iso_639_1: "rm",
		english_name: "Raeto-Romance",
		name: ""
	},
	{
		id: 55,
		iso_639_1: "as",
		english_name: "Assamese",
		name: ""
	},
	{
		id: 56,
		iso_639_1: "gd",
		english_name: "Gaelic",
		name: ""
	},
	{
		id: 57,
		iso_639_1: "ja",
		english_name: "Japanese",
		name: "日本語"
	},
	{
		id: 58,
		iso_639_1: "ko",
		english_name: "Korean",
		name: "한국어/조선말"
	},
	{
		id: 59,
		iso_639_1: "ku",
		english_name: "Kurdish",
		name: ""
	},
	{
		id: 60,
		iso_639_1: "mo",
		english_name: "Moldavian",
		name: ""
	},
	{
		id: 61,
		iso_639_1: "mn",
		english_name: "Mongolian",
		name: ""
	},
	{
		id: 62,
		iso_639_1: "nb",
		english_name: "Norwegian Bokmål",
		name: "Bokmål"
	},
	{
		id: 63,
		iso_639_1: "om",
		english_name: "Oromo",
		name: ""
	},
	{
		id: 64,
		iso_639_1: "pi",
		english_name: "Pali",
		name: ""
	},
	{
		id: 65,
		iso_639_1: "sq",
		english_name: "Albanian",
		name: "shqip"
	},
	{
		id: 66,
		iso_639_1: "vo",
		english_name: "Volapük",
		name: ""
	},
	{
		id: 67,
		iso_639_1: "bo",
		english_name: "Tibetan",
		name: ""
	},
	{
		id: 68,
		iso_639_1: "da",
		english_name: "Danish",
		name: "Dansk"
	},
	{
		id: 69,
		iso_639_1: "kl",
		english_name: "Kalaallisut",
		name: ""
	},
	{
		id: 70,
		iso_639_1: "kn",
		english_name: "Kannada",
		name: "?????"
	},
	{
		id: 71,
		iso_639_1: "nl",
		english_name: "Dutch",
		name: "Nederlands"
	},
	{
		id: 72,
		iso_639_1: "nn",
		english_name: "Norwegian Nynorsk",
		name: ""
	},
	{
		id: 73,
		iso_639_1: "sa",
		english_name: "Sanskrit",
		name: ""
	},
	{
		id: 74,
		iso_639_1: "am",
		english_name: "Amharic",
		name: ""
	},
	{
		id: 75,
		iso_639_1: "hy",
		english_name: "Armenian",
		name: ""
	},
	{
		id: 76,
		iso_639_1: "bs",
		english_name: "Bosnian",
		name: "Bosanski"
	},
	{
		id: 77,
		iso_639_1: "hr",
		english_name: "Croatian",
		name: "Hrvatski"
	},
	{
		id: 78,
		iso_639_1: "mh",
		english_name: "Marshall",
		name: ""
	},
	{
		id: 79,
		iso_639_1: "mg",
		english_name: "Malagasy",
		name: ""
	},
	{
		id: 80,
		iso_639_1: "ne",
		english_name: "Nepali",
		name: ""
	},
	{
		id: 81,
		iso_639_1: "su",
		english_name: "Sundanese",
		name: ""
	},
	{
		id: 82,
		iso_639_1: "ts",
		english_name: "Tsonga",
		name: ""
	},
	{
		id: 83,
		iso_639_1: "ug",
		english_name: "Uighur",
		name: ""
	},
	{
		id: 84,
		iso_639_1: "cs",
		english_name: "Czech",
		name: "Český"
	},
	{
		id: 85,
		iso_639_1: "jv",
		english_name: "Javanese",
		name: ""
	},
	{
		id: 86,
		iso_639_1: "ro",
		english_name: "Romanian",
		name: "Română"
	},
	{
		id: 87,
		iso_639_1: "sm",
		english_name: "Samoan",
		name: ""
	},
	{
		id: 88,
		iso_639_1: "tg",
		english_name: "Tajik",
		name: ""
	},
	{
		id: 89,
		iso_639_1: "wo",
		english_name: "Wolof",
		name: "Wolof"
	},
	{
		id: 90,
		iso_639_1: "br",
		english_name: "Breton",
		name: ""
	},
	{
		id: 91,
		iso_639_1: "fr",
		english_name: "French",
		name: "Français"
	},
	{
		id: 92,
		iso_639_1: "ga",
		english_name: "Irish",
		name: "Gaeilge"
	},
	{
		id: 93,
		iso_639_1: "ht",
		english_name: "Haitian; Haitian Creole",
		name: ""
	},
	{
		id: 94,
		iso_639_1: "kv",
		english_name: "Komi",
		name: ""
	},
	{
		id: 95,
		iso_639_1: "mi",
		english_name: "Maori",
		name: ""
	},
	{
		id: 96,
		iso_639_1: "th",
		english_name: "Thai",
		name: "ภาษาไทย"
	},
	{
		id: 97,
		iso_639_1: "xx",
		english_name: "No Language",
		name: "No Language"
	},
	{
		id: 98,
		iso_639_1: "af",
		english_name: "Afrikaans",
		name: "Afrikaans"
	},
	{
		id: 99,
		iso_639_1: "av",
		english_name: "Avaric",
		name: ""
	},
	{
		id: 100,
		iso_639_1: "bm",
		english_name: "Bambara",
		name: "Bamanankan"
	},
	{
		id: 101,
		iso_639_1: "ca",
		english_name: "Catalan",
		name: "Català"
	},
	{
		id: 102,
		iso_639_1: "ce",
		english_name: "Chechen",
		name: ""
	},
	{
		id: 103,
		iso_639_1: "de",
		english_name: "German",
		name: "Deutsch"
	},
	{
		id: 104,
		iso_639_1: "gv",
		english_name: "Manx",
		name: ""
	},
	{
		id: 105,
		iso_639_1: "rw",
		english_name: "Kinyarwanda",
		name: "Kinyarwanda"
	},
	{
		id: 106,
		iso_639_1: "ky",
		english_name: "Kirghiz",
		name: "??????"
	},
	{
		id: 107,
		iso_639_1: "ln",
		english_name: "Lingala",
		name: ""
	},
	{
		id: 108,
		iso_639_1: "sn",
		english_name: "Shona",
		name: ""
	},
	{
		id: 109,
		iso_639_1: "yi",
		english_name: "Yiddish",
		name: ""
	},
	{
		id: 110,
		iso_639_1: "be",
		english_name: "Belarusian",
		name: "беларуская мова"
	},
	{
		id: 111,
		iso_639_1: "cu",
		english_name: "Slavic",
		name: ""
	},
	{
		id: 112,
		iso_639_1: "dz",
		english_name: "Dzongkha",
		name: ""
	},
	{
		id: 113,
		iso_639_1: "eo",
		english_name: "Esperanto",
		name: "Esperanto"
	},
	{
		id: 114,
		iso_639_1: "fi",
		english_name: "Finnish",
		name: "suomi"
	},
	{
		id: 115,
		iso_639_1: "fy",
		english_name: "Frisian",
		name: ""
	},
	{
		id: 116,
		iso_639_1: "ie",
		english_name: "Interlingue",
		name: ""
	},
	{
		id: 117,
		iso_639_1: "ia",
		english_name: "Interlingua",
		name: ""
	},
	{
		id: 118,
		iso_639_1: "it",
		english_name: "Italian",
		name: "Italiano"
	},
	{
		id: 119,
		iso_639_1: "ng",
		english_name: "Ndonga",
		name: ""
	},
	{
		id: 120,
		iso_639_1: "pa",
		english_name: "Punjabi",
		name: "ਪੰਜਾਬੀ"
	},
	{
		id: 121,
		iso_639_1: "pt",
		english_name: "Portuguese",
		name: "Português"
	},
	{
		id: 122,
		iso_639_1: "rn",
		english_name: "Rundi",
		name: "Kirundi"
	},
	{
		id: 123,
		iso_639_1: "fa",
		english_name: "Persian",
		name: "فارسی"
	},
	{
		id: 124,
		iso_639_1: "ch",
		english_name: "Chamorro",
		name: "Finu' Chamorro"
	},
	{
		id: 125,
		iso_639_1: "cv",
		english_name: "Chuvash",
		name: ""
	},
	{
		id: 126,
		iso_639_1: "en",
		english_name: "English",
		name: "English"
	},
	{
		id: 127,
		iso_639_1: "hu",
		english_name: "Hungarian",
		name: "Magyar"
	},
	{
		id: 128,
		iso_639_1: "ii",
		english_name: "Yi",
		name: ""
	},
	{
		id: 129,
		iso_639_1: "kg",
		english_name: "Kongo",
		name: ""
	},
	{
		id: 130,
		iso_639_1: "li",
		english_name: "Limburgish",
		name: ""
	},
	{
		id: 131,
		iso_639_1: "ml",
		english_name: "Malayalam",
		name: ""
	},
	{
		id: 132,
		iso_639_1: "nv",
		english_name: "Navajo",
		name: ""
	},
	{
		id: 133,
		iso_639_1: "ny",
		english_name: "Chichewa; Nyanja",
		name: ""
	},
	{
		id: 134,
		iso_639_1: "sg",
		english_name: "Sango",
		name: ""
	},
	{
		id: 135,
		iso_639_1: "tw",
		english_name: "Twi",
		name: ""
	},
	{
		id: 136,
		iso_639_1: "ab",
		english_name: "Abkhazian",
		name: ""
	},
	{
		id: 137,
		iso_639_1: "ar",
		english_name: "Arabic",
		name: "العربية"
	},
	{
		id: 138,
		iso_639_1: "ee",
		english_name: "Ewe",
		name: "Èʋegbe"
	},
	{
		id: 139,
		iso_639_1: "fo",
		english_name: "Faroese",
		name: ""
	},
	{
		id: 140,
		iso_639_1: "ik",
		english_name: "Inupiaq",
		name: ""
	},
	{
		id: 141,
		iso_639_1: "ks",
		english_name: "Kashmiri",
		name: ""
	},
	{
		id: 142,
		iso_639_1: "lb",
		english_name: "Letzeburgesch",
		name: ""
	},
	{
		id: 143,
		iso_639_1: "nd",
		english_name: "Ndebele",
		name: ""
	},
	{
		id: 144,
		iso_639_1: "oc",
		english_name: "Occitan",
		name: ""
	},
	{
		id: 145,
		iso_639_1: "sk",
		english_name: "Slovak",
		name: "Slovenčina"
	},
	{
		id: 146,
		iso_639_1: "tt",
		english_name: "Tatar",
		name: ""
	},
	{
		id: 147,
		iso_639_1: "ve",
		english_name: "Venda",
		name: ""
	},
	{
		id: 148,
		iso_639_1: "ay",
		english_name: "Aymara",
		name: ""
	},
	{
		id: 149,
		iso_639_1: "fj",
		english_name: "Fijian",
		name: ""
	},
	{
		id: 150,
		iso_639_1: "gu",
		english_name: "Gujarati",
		name: ""
	},
	{
		id: 151,
		iso_639_1: "io",
		english_name: "Ido",
		name: ""
	},
	{
		id: 152,
		iso_639_1: "lo",
		english_name: "Lao",
		name: ""
	},
	{
		id: 153,
		iso_639_1: "la",
		english_name: "Latin",
		name: "Latin"
	},
	{
		id: 154,
		iso_639_1: "no",
		english_name: "Norwegian",
		name: "Norsk"
	},
	{
		id: 155,
		iso_639_1: "oj",
		english_name: "Ojibwa",
		name: ""
	},
	{
		id: 156,
		iso_639_1: "pl",
		english_name: "Polish",
		name: "Polski"
	},
	{
		id: 157,
		iso_639_1: "qu",
		english_name: "Quechua",
		name: ""
	},
	{
		id: 158,
		iso_639_1: "sl",
		english_name: "Slovenian",
		name: "Slovenščina"
	},
	{
		id: 159,
		iso_639_1: "sc",
		english_name: "Sardinian",
		name: ""
	},
	{
		id: 160,
		iso_639_1: "sw",
		english_name: "Swahili",
		name: "Kiswahili"
	},
	{
		id: 161,
		iso_639_1: "tl",
		english_name: "Tagalog",
		name: ""
	},
	{
		id: 162,
		iso_639_1: "ur",
		english_name: "Urdu",
		name: "اردو"
	},
	{
		id: 163,
		iso_639_1: "bg",
		english_name: "Bulgarian",
		name: "български език"
	},
	{
		id: 164,
		iso_639_1: "hi",
		english_name: "Hindi",
		name: "हिन्दी"
	},
	{
		id: 165,
		iso_639_1: "yo",
		english_name: "Yoruba",
		name: "Èdè Yorùbá"
	},
	{
		id: 166,
		iso_639_1: "ak",
		english_name: "Akan",
		name: ""
	},
	{
		id: 167,
		iso_639_1: "an",
		english_name: "Aragonese",
		name: ""
	},
	{
		id: 168,
		iso_639_1: "bn",
		english_name: "Bengali",
		name: "বাংলা"
	},
	{
		id: 169,
		iso_639_1: "et",
		english_name: "Estonian",
		name: "Eesti"
	},
	{
		id: 170,
		iso_639_1: "gl",
		english_name: "Galician",
		name: "Galego"
	},
	{
		id: 171,
		iso_639_1: "ha",
		english_name: "Hausa",
		name: "Hausa"
	},
	{
		id: 172,
		iso_639_1: "ig",
		english_name: "Igbo",
		name: ""
	},
	{
		id: 173,
		iso_639_1: "iu",
		english_name: "Inuktitut",
		name: ""
	},
	{
		id: 174,
		iso_639_1: "lg",
		english_name: "Ganda",
		name: ""
	},
	{
		id: 175,
		iso_639_1: "mr",
		english_name: "Marathi",
		name: ""
	},
	{
		id: 176,
		iso_639_1: "mt",
		english_name: "Maltese",
		name: "Malti"
	},
	{
		id: 177,
		iso_639_1: "my",
		english_name: "Burmese",
		name: ""
	},
	{
		id: 178,
		iso_639_1: "na",
		english_name: "Nauru",
		name: ""
	},
	{
		id: 179,
		iso_639_1: "sd",
		english_name: "Sindhi",
		name: ""
	},
	{
		id: 180,
		iso_639_1: "xh",
		english_name: "Xhosa",
		name: ""
	},
	{
		id: 181,
		iso_639_1: "za",
		english_name: "Zhuang",
		name: ""
	},
	{
		id: 182,
		iso_639_1: "aa",
		english_name: "Afar",
		name: ""
	},
	{
		id: 183,
		iso_639_1: "is",
		english_name: "Icelandic",
		name: "Íslenska"
	},
	{
		id: 184,
		iso_639_1: "ty",
		english_name: "Tahitian",
		name: ""
	},
	{
		id: 185,
		iso_639_1: "ti",
		english_name: "Tigrinya",
		name: ""
	},
	{
		id: 186,
		iso_639_1: "tk",
		english_name: "Turkmen",
		name: ""
	},
	{
		id: 187,
		iso_639_1: "he",
		english_name: "Hebrew",
		name: "עִבְרִית"
	}
]