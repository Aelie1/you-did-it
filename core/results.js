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
 
// This file contains the result parser

/** Parse and proceed a result object. Returns true if it makes
 * the game progress. */
function proceedResult(result) {
	var progressed = false;
	if ('text' in result) {
		showTextResult(result['text']);
	}
	if ('move_to' in result) {
		if (result['move_to'] == 'next') {
			setState(current_state_index + 1);
		} else {
			setState(result['move_to']);
		}
		progressed = true;
	}
	if ('item' in result) {
		if (Array.isArray(result['item'])) {
			for (var i = 0; i < result['item'].length; i++) {
				addObject(result['item'][i]);
			}
		} else {
			addObject(result['item']);
		}
		progressed = true;
	}
	if ('remove_item' in result) {
		if (Array.isArray(result['remove_item'])) {
			for (var i = 0; i < result['remove_item'].length; i++) {
				removeObject(result['remove_item'][i]);
			}
		} else {
			removeObject(result['remove_item']);
		}
		progressed = true;
	}
	if ('inventory' in result) {
		for (var loc in result['inventory']) {
			setItem(loc, result['inventory'][loc]);
		}
		progressed = true;
	}
	if ('remove_inventory' in result) {
		for (var loc in result['remove_inventory']) {
			removeItem(loc, result['remove_inventory'][loc]);
		}
		progressed = true;
	}
	if ('set' in result) {
		var varDict = result['set'];
		for (var variable in varDict) {
			setVar(variable, varDict[variable]);
		}
		progressed = true;
	}
	if ('game_over' in result) {
		game_over(result['game_over']);
		progressed = true;
	}
	if ('congratulations' in result) {
		game_end(result['congratulations']);
		progressed = true;
	}
	return progressed;
}