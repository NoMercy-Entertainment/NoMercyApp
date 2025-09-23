export interface Config {
	Colors: Colors;
	Core: Core;
	Components: Components;
}

export interface Colors {
	Tomato: Color;
	Red: Color;
	Crimson: Color;
	Pink: Color;
	Plum: Color;
	Purple: Color;
	Indigo: Color;
	Blue: Color;
	Cyan: Color;
	Teal: Color;
	Green: Color;
	Grass: Color;
	Orange: Color;
	Brown: Color;
	Sky: Color;
	Mint: Color;
	Lime: Color;
	Yellow: Color;
	Color: Color;
	Gray: Color;
	Mauve: Color;
	Slate: Color;
	Sage: Color;
	Olive: Color;
	Sand: Color;
	Gold: Color;
	Bronze: Color;
	Violet: Color;
	OverlayBlackAlpha: { [key: string]: Dark };
	OverlayWhiteAlpha: { [key: string]: Dark };
}

export interface Color {
	Solid: { [key: string]: Dark };
	Alpha: { [key: string]: Dark };
}

export interface Dark {
	$type: Type;
	$value: string;
}

export enum Type {
	Color = 'color',
}

export interface Components {
	Toggles: Toggles;
	Inputs: Inputs;
	Handles: Handles;
	Table: Table;
	Badges: Badges;
	Header: Header;
	Tags: Tags;
	Menu: Menu;
	Buttons: Buttons;
}

export interface Badges {
	Primary: Blue;
	Blue: Blue;
	Indigo: Blue;
	Purple: Blue;
	Pink: Blue;
	Communication: Blue;
	Orange: Blue;
}

export interface Blue {
	background: Dark;
	content: Dark;
}

export interface Buttons {
	'Primary': Primary;
	'Secondary Gray': ButtonGroup;
	'Secondary Colour': SecondaryColour;
	'Tertiary Gray': SecondaryColour;
	'Tertiary Colour': SecondaryColour;
	'Link Gray': Link;
	'Link Colour': Link;
	'Button Group': ButtonGroup;
}

export interface ButtonGroup {
	'Default': ActiveHoverClass;
	':hover': ActiveHoverClass;
	':active': ActiveHoverClass;
	':active :hover'?: ActiveHoverClass;
}

export interface ActiveHoverClass {
	background: Dark;
	border: Dark;
	content: Dark;
}

export interface Link {
	'Default': LinkColourActive;
	':hover': LinkColourActive;
	':active': LinkColourActive;
}

export interface LinkColourActive {
	content: Dark;
}

export interface Primary {
	'content': Dark;
	'border': Dark;
	'Default': Header;
	':hover': Header;
	':active': Header;
}

export interface Header {
	background: Dark;
}

export interface SecondaryColour {
	'Default': Blue;
	':hover': Blue;
	':active': Blue;
	':focus'?: Blue;
}

export interface Handles {
	'background': Dark;
	'background :hover': Dark;
	'background :focus': Dark;
	'border': Dark;
	'border :hover': Dark;
	'border :focus': Dark;
}

export interface Inputs {
	'background': InputsBackground;
	'border': Border;
	'icons': Icons;
	'leading-text': LeadingText;
	'text': Text;
	'helper-icon': HelperIcon;
	'label': InputsLabel;
	'helper-text': HelperText;
}

export interface InputsBackground {
	'background': Dark;
	'background :hover': Dark;
	'background :disabled': Dark;
	'background :error': Dark;
}

export interface Border {
	'border': Dark;
	'border :hover': Dark;
	'border :focus': Dark;
	'border :disabled': Dark;
	'border :error': Dark;
}

export interface HelperIcon {
	'helper-icon': Dark;
	'helper-icon :error': Dark;
	'helper-icon :disabled': Dark;
}

export interface HelperText {
	'helper-text': Dark;
	'helper-text :error': Dark;
	'helper-text :disabled': Dark;
}

export interface Icons {
	'icon': Dark;
	'icon :disabled': Dark;
}

export interface InputsLabel {
	label: Dark;
}

export interface LeadingText {
	'leading-text': Dark;
	'leading-text :disabled': Dark;
}

export interface Text {
	'text-placeholder': Dark;
	'text :hover': Dark;
	'text-filled': Dark;
	'text :disabled': Dark;
}

export interface Menu {
	Option: Option;
	background: Dark;
	border: Dark;
}

export interface Option {
	'background': OptionBackground;
	'border': Dark;
	'border :hover': Dark;
	'border :active': Dark;
	'border :active :hover': Dark;
	'border :disabled': Dark;
	'icon': Icon;
	'label': OptionLabel;
	'ckeck': Ckeck;
}

export interface OptionBackground {
	'background': Dark;
	'background :hover': Dark;
	'background :active': Dark;
	'background :active :hover': Dark;
	'background :disabled': Dark;
}

export interface Ckeck {
	'check': Dark;
	'check :hover': Dark;
	'check :active': Dark;
	'check :active :hover': Dark;
	'check :disabled': Dark;
}

export interface Icon {
	'icon': Dark;
	'icon :hover': Dark;
	'icon :active': Dark;
	'icon :active :hover': Dark;
	'icon :disabled': Dark;
}

export interface OptionLabel {
	'label': Dark;
	'label :hover': Dark;
	'label :active': Dark;
	'label :active :hover': Dark;
	'label :disabled': Dark;
}

export interface Table {
	Cells: Cells;
}

export interface Cells {
	'background': Dark;
	'background :hover': Dark;
}

export interface Tags {
	'X Close': XClose;
	'background': Dark;
	'border': Dark;
	'icon': Dark;
	'label': Dark;
	'count-text': Dark;
	'count-bg': Dark;
}

export interface XClose {
	'background': Dark;
	'background :hover': Dark;
	'background :active': Dark;
	'icon': Dark;
	'icon :hover': Dark;
	'icon :active': Dark;
}

export interface Toggles {
	'Check-Radio': CheckRadio;
	'Switches': Switches;
}

export interface CheckRadio {
	'Default': ActiveHoverClass;
	':hover': ActiveHoverClass;
	':checked': ActiveHoverClass;
	':indistinct': ActiveHoverClass;
	':checked :hover': ActiveHoverClass;
	':indistinct :hover': ActiveHoverClass;
	':disabled': ActiveHoverClass;
}

export interface Switches {
	'Default': Checked;
	':hover': Checked;
	':checked': Checked;
	':disabled': Checked;
}

export interface Checked {
	background: Dark;
	handle: Dark;
}

export interface Core {
	'Light': Dark;
	'Dark': Dark;
	'Elevations': Elevations;
	'Focus Rings': FocusRings;
}

export interface Elevations {
	'0': Dark;
	'10': Dark;
	'20': Dark;
	'30': Dark;
	'40': Dark;
	'50': Dark;
	'-30': Dark;
	'-20': Dark;
	'-10': Dark;
}

export interface FocusRings {
	'accent': Dark;
	'accent-subtle': Dark;
	'gray': Dark;
	'gray-subtle': Dark;
	'error': Dark;
	'error-subtle': Dark;
}
