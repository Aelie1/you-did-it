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

// Game variables
/////////////////
var game;
/** Number of bad actions to suggest before showing hints.
 * Must be ordered. May be overriden in game data. */
var hintThresholds = [5, 10, 15, 20, 25];
/** Counts the number of useless actions to display hints */
var badActions = 0;

// Hints management
///////////////////

/** Incremend the bad action count and check
 * if a hint should be shown.
 * @param hintCount (optional integer) increment the action count
 * to show hints. Default 1. */
function badAction(hintCount) {
	switch (arguments.length) {
	case 0:
		hintCount = 1;
	}
	badActions += hintCount;
	// Check if a threshold is reached (or even multiple)
	while (hintThresholds.length > hintsShown
			&& hintThresholds[hintsShown] <= badActions) {
		showNextHint();
	}
}

// Initializing functions
/////////////////////////

function loadGame() {
	// Get game from g param
	game = _get('g');
	if (game == null) {
		return false;
	}
	// Add scripts and style
	jQuery("head").append("<script type=\"text/javascript\" src=\"./games/" + escUrl(game) + "/game.js\"></script>");
	jQuery("head").append("<script type=\"text/javascript\" src=\"./games/" + escUrl(game) + "/language.js\"></script>");
	jQuery("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"./games/" + escUrl(game) + "/game.css\"/>");
	// Check for game data
	if (!isDefined('states')) {
		return false;
	}
	// Ok
	return true;
}

function setupInventory() {
	for (var loc in starting_inventory) {
		setItem(loc, starting_inventory[loc]);
	}
}

function setupObjects() {
	for (var i = 0; i < starting_objects.length; i++) {
		addObject(starting_objects[i]);
	}
}