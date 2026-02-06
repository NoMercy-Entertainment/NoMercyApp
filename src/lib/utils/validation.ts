export function isJsonString(str: string) {
	try {
		JSON.parse(str);
	}
	catch {
		return false;
	}
	return true;
}

export function isValidObject(str: unknown): boolean {
	return Array.isArray(str) ? str.length > 0 : typeof str === 'object' && str !== null && Object.keys(str).length > 0;
}

/**
 * Determines the state of a checkbox based on the selected values and total values.
 *
 * @param {unknown[]} selectedArray - An array of selected values.
 * @param {unknown[]} totalArray - An array of all possible values.
 *
 * @returns {false | null | true} - Returns `false` if no values are selected, `true` if all values are selected, and `null` if some but not all values are selected.
 */
export function checkboxValue(selectedArray: unknown[], totalArray: unknown[]): false | null | true {
	if (selectedArray.length === 0) {
		return false;
	}
	else if (selectedArray.length === totalArray?.length) {
		return true;
	}
	else {
		return null;
	}
}
