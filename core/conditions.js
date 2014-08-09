/* You DID it!
 * 
 * This file is part of You DID it!
 * 
 * You DID it! is licenced under public domain and or CC-0
 * See http://creativecommons.org/publicdomain/zero/1.0/
 * 
 * You DID it! uses jQuery, licenced by the jQuery Fundation
 * under the MIT Licence (see https://jquery.org/license/)
 * 
 * Please notice that only the game engine is in public domain.
 * Game data (pictures, stories, texts and more) are subject to their
 * own licence which may differ.
 */
 
// This file contains the "if" content parser

// Step1: parser for and, or and boolean data
// Step2: parser for is in, is not in
// Step3: recursive parser for parenthesis

var CND_OR = "or";
var CND_AND = "and";
var CND_IN = "is in";
var CND_IN2 = "in";
var CND_NOT_IN = "is not in";
var CND_NOT_IN2 = "not in";
var CND_ITEMS = "items";
var CND_IS = "is";
var CND_IS_NOT = "is not";

/** Process if data.
 * @param data Array of condition elements (if content).
 * @return True if conditions are met, false otherwise,
 * null in case of syntax error. */
function cnd_processIf(data) {
	var stack = []
	for (var i = 0; i < data.length; i++) {
		// Add a new element on stack and (re)parse
		if (Array.isArray(data[i])) {
			// Process the subdata and add them
			var result = cnd_processIf(data[i]);
			if (result != null) {
				stack.push(result);
			} else {
				// Syntax error
				return null;
			}
		} else {
			// Add an element to stack to process
			stack.push(data[i]);
		}
		while (proceedStack(stack) != false) {
			// Loop on proceedStack until it stops
		}
	}
	// Everything is parsed, check if the result is there
	if (stack.length == 1) {
		if (stack[0] == true || stack[0] == false) {
			return stack[0];
		}
	}
	// Some elements can't be parsed, it's a syntax error
	return null;
}

/** Check if an element is a keyword or a variable. */
function cnd_isKeyword(element) {
	return element == CND_OR || element == CND_AND || element == CND_IN
			|| element == CND_IN2 || element == CND_NOT_IN
			|| element == CND_NOT_IN2 || element == CND_ITEMS
			|| element == CND_IS || element == CND_IS_NOT;
}

/** Try to read the stack and convert a known expression to a boolean.
 * @param stack The array of elements to proceed.
 * @return True if an expression was found and converted in stack,
 * false if nothing changed. */
function proceedStack(stack) {
	// Read by chunk of three from the end and try to merge
	// This works only if all expressions requires 3 elements
	if (stack.length < 3) {
		return false;
	}
	// Extract last operands and operator and execute it
	var i = stack.length - 3;
	var result = cnd_parse(stack.slice(i, i + 3));
	if (result != null) {
		// Replace the chunk by the result
		stack.splice(i, 3, result);
		return true;
	}
	return false;
}

/** Try to parse a chunk of data.
 * @param data An array of condition elements.
 * @return True or false if parsed, null if invalid. */
function cnd_parse(data) {
	var operand = data[1];
	if (operand == CND_OR) {
		return cnd_parseOr(data[0], data[2]);
	} else if (operand == CND_AND) {
		return cnd_parseAnd(data[0], data[2]);
	} else if (operand == CND_IS) {
		return cnd_parseIs(data[0], data[2]);
	} else if (operand == CND_IS_NOT) {
		return cnd_parseIsNot(data[0], data[2]);
	} else if (operand == CND_IN || operand == CND_IN2) {
		return cnd_parseIsIn(data[0], data[2]);
	} else if (operand == CND_NOT_IN || operand == CND_NOT_IN2) {
		return cnd_parseIsNotIn(data[0], data[2]);
	}
	return null;
}

function cnd_parseOr(elem1, elem2) {
	if ((elem1 == true || elem1 == false)
			&& (elem2 == true || elem2 == false)) {
		return elem1 || elem2;
	}
	return null;
}

function cnd_parseAnd(elem1, elem2) {
	if ((elem1 == true || elem1 == false)
			&& (elem2 == true || elem2 == false)) {
		return elem1 && elem2;
	}
	return null;
}

function cnd_parseIs(elem1, elem2) {
	return getVar(elem1) == elem2;
}

function cnd_parseIsNot(elem1, elem2) {
	return getVar(elem1) != elem2;
}

function cnd_parseIsIn(elem1, elem2) {
	if (elem2 == CND_ITEMS) {
		return hasObject(elem1);
	} else {
		return hasItem(elem2, elem1);
	}
}

function cnd_parseIsNotIn(elem1, elem2) {
	if (elem2 == CND_ITEMS) {
		return !hasObject(elem1);
	} else {
		return !hasItem(elem2, elem1);
	}
}