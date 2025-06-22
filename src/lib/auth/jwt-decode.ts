const chars
  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message: string) {
	console.error(message);
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill(input = '') {
	const str = String(input).replace(/[=]+$/u, '');
	if (str.length % 4 === 1) {
		throw new InvalidCharacterError(
			'\'atob\' failed: The string to be decoded is not correctly encoded.',
		);
	}
	let bc = 0;
	let bs = 0;
	let idx = 0;
	let output = '';
	for (
		let buffer;
	// initialize result and counters
	// get next character
		(buffer = str.charAt(idx++));
	// character found in table? initialize bit storage and add its ascii value;
		~buffer
		&& ((bs = bc % 4 ? bs * 64 + buffer : buffer),
		// and if not first of each 4 characters,
		// convert the first 8 bits to one ascii character
		bc++ % 4)
			? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
			: 0
	) {
		// try to find character in table (0-63, not found => -1)
		buffer = chars.indexOf(buffer);
	}
	return output;
}

const atob
  = (typeof window !== 'undefined' && window.atob && window.atob.bind(window))
  	|| polyfill;

function b64DecodeUnicode(str: string) {
	return decodeURIComponent(
		atob(str).replace(/(.)/gu, (m, p) => {
			let code = p.charCodeAt(0).toString(16).toUpperCase();
			if (code.length < 2) {
				code = `0${code}`;
			}
			return `%${code}`;
		}),
	);
}

function base64_url_decode(str: string) {
	let output = str.replace(/-/gu, '+').replace(/_/gu, '/');
	switch (output.length % 4) {
		case 0:
			break;
		case 2:
			output += '==';
			break;
		case 3:
			output += '=';
			break;
		default:
			throw new Error('base64 string is not of the correct length');
	}

	try {
		return b64DecodeUnicode(output);
	}
	catch (err) {
		return atob(output);
	}
}

function InvalidTokenError(message: string) {
	console.error(message);
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

export default function jwtDecode(
	token: string,
	options?: { header?: any } | undefined,
) {
	if (typeof token !== 'string') {
		throw new InvalidTokenError('Invalid token specified: must be a string');
	}

	options = options || {};
	const pos = options.header === true ? 0 : 1;

	const part = token.split('.')[pos];
	if (typeof part !== 'string') {
		throw new InvalidTokenError(
			`Invalid token specified: missing part #${pos + 1}`,
		);
	}
	let decoded;
	try {
		decoded = base64_url_decode(part);
	}
	catch (e: any) {
		throw new InvalidTokenError(
			`Invalid token specified: invalid base64 for part #${pos + 1} (${
				e.message
			})`,
		);
	}

	try {
		return JSON.parse(decoded);
	}
	catch (e: any) {
		throw new InvalidTokenError(
			`Invalid token specified: invalid json for part #${pos + 1} (${
				e.message
			})`,
		);
	}
}
