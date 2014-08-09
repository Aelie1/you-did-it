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
 
// This file contains game state management functions.

var current_state_index = 0;
var current_state = null;

/** Switch current state to the given one. Also updates GUI.
 * @param index State index from game data. */
function setState(index) {
	current_state_index = index;
	current_state = states[index];
	setStatePicture(current_state);
	setStory(current_state);
	setMap(current_state);
	resetHints();
	action_state = PICK_ACTION;
	updateNotification();
}

/** Init and show a game over screen by bad_ends index */
function game_over(end_index) {
	jQuery("#game-screen").hide();
	var state = bad_ends[end_index];
	// Handle hint count
	if ('hint_count' in state) {
		badAction(state['hint_count']);
	} else {
		badAction();
	}
	// Set picture if any
	if ('picture' in state) {
		var html = null;
		var pictHtml = "<img src=\"./games/" + escUrl(game) + "/" + escUrl(state['picture']) + "\" />";
		// If big picture available, link to it on click
		if ('big_picture' in state) {
			html = "<a href=\"./games/" + escUrl(game) + "/" + escUrl(state['big_picture']) + "\">" + pictHtml + "</a>";
		} else {
			html = pictHtml;
		}
		jQuery("#game-over-picture").html(html);
		jQuery("#game-over-picture").show();
	} else {
		// No picture available. Hide it.
		jQuery("#game-over-picture").hide();
	}
	// Set story and show the whole
	lines = state['story']
	jQuery("#game-over-situation").html("");
	for (var i = 0; i < lines.length; i++) {
		jQuery("#game-over-situation").append("<p>" + escHtml(translate(lines[i])) + "</p>");
	}
	jQuery("#game-over-screen").show();
}

/** Init and show an ending screen by good_ends index */
function game_end(end_index) {
	jQuery("#game-screen").hide();
	var state = good_ends[end_index];
	if ('picture' in state) {
		var html = null;
		var pictHtml = "<img src=\"./games/" + escUrl(game) + "/" + escUrl(state['picture']) + "\" />";
		// If big picture available, link to it on click
		if ('big_picture' in state) {
			html = "<a href=\"./games/" + escUrl(game) + "/" + escUrl(state['big_picture']) + "\">" + pictHtml + "</a>";
		} else {
			html = pictHtml;
		}
		jQuery("#game-end-picture").html(html);
		jQuery("#game-end-picture").show();
	} else {
		// No picture available. Hide it.
		jQuery("#game-end-picture").hide();
	}
	lines = state['story']
	jQuery("#game-end-situation").html("");
	for (var i = 0; i < lines.length; i++) {
		jQuery("#game-end-situation").append("<p>" + escHtml(translate(lines[i])) + "</p>");
	}
	jQuery("#game-end-screen").show();
}

/** Switch from intro screen to game screen. */
function start() {
	jQuery("#intro-screen").hide();
	jQuery("#game-screen").show();
}

/** Return to previous game state after a game over. */
function retry() {
	jQuery("#game-over-screen").hide();
	jQuery("#game-screen").show();
}