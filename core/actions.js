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
 
// This file contains action picking and parsing automat.

var action_state = null;
var PICK_ACTION = 0;
var PICK_TARGET = 1;
var WILDCARD = "*";

var action_picked = null;
var ACTION_MAP = "_map_item_clicked";
var targets_picked = [];

/** Clicked on an action, if action is not already picked pick it
 * and expect a target. Otherwise reset action picking with new one. */
function actionPicked(action_code) {
	var my_action = null;
	// Get action object from action code
	for (var i = 0; i < actions.length; i++) {
		var action = actions[i];
		if (action['code'] == action_code) {
			my_action = action;
			break;
		}
	}
	if (my_action != null) {
		// No state check as picking resets the automat
		action_picked = my_action;
		targets_picked = [];
		if (my_action['targets'] == 0) {
			// Action is not expecting target, proceed it
			proceedAction();
		} else {
			// Expect target
			action_state = PICK_TARGET;
			updateNotification();
		}
	}
}

/** Clicked on a target */
function targetPicked(target_code) {
	if (action_state == PICK_TARGET) {
		// Add the selected target to action
		targets_picked.push(target_code);
		// Look for an available action (even for incomplete action)
		var actions = current_state['actions']
		var selected_action = [action_picked['code']];
		for (var i = 0; i < targets_picked.length; i++) {
			selected_action.push(targets_picked[i]);
		}
		var my_action = null;
		for (var i = 0; i < actions.length; i++) {
			// Check if action is the same length as current action
			var action = actions[i]['action'];
			if (action.length != selected_action.length) {
				continue;
			}
			// Check if the action is the same or wildcard and assign it
			var ok = 1;
			for (var j = 0; j < selected_action.length; j++) {
				if (selected_action[j] != action[j]
						&& action[j] != WILDCARD) {
					ok = 0;
					break;
				}
			}
			if (ok == 1) {
				my_action = actions[i];
				break;
			}
		}
		// If action is fully selected or action found, show result
		if (action_picked['targets'] == targets_picked.length
				|| my_action != null) {
			proceedAction(my_action);
		} else {
			updateNotification();
		}
	}
}

/** Clicked on an inventory item */
function inventoryPicked(location) {
	targetPicked(inventory[location]);
}

/** Proceed an action result. If null show default impossible action. */
function proceedAction(action) {
	// Reset action command and update
	// (action_picked still holds the latest action)
	action_state = PICK_ACTION;
	target_picked = [];
	updateNotification();
	// If no transition show default result
	if (action == null) {
		// TODO: move this in result parser
		showTextResult(translate("_you_cant_do_that"));
		if ('hint_count' in action_picked) {
			badAction(action_picked['hint_count']);
		} else {
			badAction();
		}
		return;
	}
	// Proceed transition if any
	if (!proceedResult(action['result'])) {
		if ('hint_count' in action_picked) {
			badAction(action_picked['hint_count']);
		} else {
			badAction();
		}
	}
}

/** Get action from map and proceed it's result. Called on map click. */
function proceedMapResult(index) {
	// Reset action command to map action
	action_picked = ACTION_MAP;
	target_picked = [];
	proceedResult(current_state['map-items'][index]['result']);
	// Reset action command completely (no state on map action)
	action_state = PICK_ACTION;
	action_picked = null;
	updateNotification();
}