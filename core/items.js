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
 
// This file contains items and inventory management functions.
// And also custom variables

var inventory = {};
var objects = [];
var customVars = {};

/** Set an item in given inventory location and update display.
 * @param location The inventory location code.
 * @param item The item code to set. */
function setItem(location, item) {
	// Add to inventory
	inventory[location] = item;
	// Display
	// TODO: move this part in gui
	var span = jQuery("#inventory ul li#location-" + escAttr(location) + " .item");
	if (item == null) {
		span.html("");
	} else {
		span.html(escHtml(translate(item)));
	}
}

/** Remove an item from inventory.
 * @param location The location code to remove the item from.
 * @param item The item code to remove. */
function removeItem(location, item) {
	if (location in inventory && inventory[location] == item) {
		setItem(location, null);
	}
}

/** Check if an item is present in inventory. */
function hasItem(location, item) {
	if (location in inventory && inventory[location] == item) {
		return true;
	}
	return false;
}

/** Add an item to available ones. */
function addObject(item) {
	// Add object if not already in list
	for (var i = 0; i < objects.length; i++) {
		if (objects[i] == item) {
			return;
		}
	}
	objects.push(item);
	// Display
	// TODO: move in gui
	jQuery("#objects ul").append("<li id=\"object-" + escAttr(item) + "\" onclick=\"javascript:targetPicked('" + escJs(item) + "');\">" + escHtml(translate(item)) + "</li>");
}

/** Remove an item from available ones. */
function removeObject(item) {
	for (var i = 0; i < objects.length; i++) {
		if (objects[i] == item) {
			jQuery("#object-" + escAttr(item)).remove();
			objects.splice(i, 1);
			return;
		}
	}
}

/** Check if an item is discovered */
function hasObject(item) {
	for (var i = 0; i < objects.length; i++) {
		if (objects[i] == item) {
			return true;
		}
	}
	return false;
}

/** Assign a value to a custom variable. */
function setVar(variable, value) {
	customVars[variable]= value;
}

/** Get a custom variable value.
 * @param variable Variable name.
 * @return Variable value or null if not defined. */
function getVar(variable) {
	if (variable in customVars) {
		return customVars[variable];
	} else {
		return null;
	}
}