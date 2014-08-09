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
 
// This file contains graphical user interface (GUI) functions

var hintsShown = 0;

/** Show a popup result with text. The title is automaticaly set
 * from the current action.
 * @param textResult The string code to be translated to show. */
function showTextResult(textResult) {
	var title = null;
	if (action_picked != ACTION_MAP) {
		// Get the title on regular command (shows the command itself)
		var i18n = "_pick_target_" + targets_picked.length + "_completed";
		var i18n_args = [];
		i18n_args.push(translate(action_picked['code']));
		for (var i = 0; i < targets_picked.length; i++) {
			i18n_args.push(targets_picked[i]);
		}
		// Look for alternate linker word in picked action
		if ('linker' in action_picked) {
			i18n_args.push(translate(action_picked['linker']));
		} else {
			// Put default linker word
			i18n_args.push(translate('_pick_target_linker'));
		}
		title = translate(i18n, i18n_args);
	}
	showResult(textResult, title);
}

/** Show result popup with message and optionnal title.
 * @param string The string code to be translated to show.
 * @param title (optional) The string code for the popup title. */
function showResult(string, title) {
	switch (arguments.length) {
	case 1:
		title = null;
	}
	var result = null;
	if (Array.isArray(string)) {
		result = "";
		for (var i = 0; i < string.length; i++) {
			result += "<p>" + escHtml(translate(string[i])) + "</p>";
		}
	} else {
		result = "<p>" + escHtml(translate(string)) + "</p>";
	}
	var res = jQuery("#result");
	res.removeClass("result-hidden");
	res.addClass("result-shown");
	html = "";
	if (title != null) {
		html += "<div class=\"title\">" + escHtml(title) + "</div>";
	}
	html += "<div>" + result + "</div><div id=\"click-to-close\">" + escHtml(translate("_click_to_close")) + "</div>"
	res.html(html);
}

/** Hide result popup */
function closeResult() {
	var res = jQuery("#result");
	res.addClass("result-hidden");
	res.removeClass("result-shown");
	res.html("");
}

/** Update notification area with current action state. */
function updateNotification() {
	switch (action_state) {
	case PICK_ACTION:
		// No action picked
		jQuery("#notification div").html(translate("_pick_action"));
		break;
	case PICK_TARGET:
		// Action picked, expecting targets
		var picked_count = targets_picked.length;
		var targets_count = action_picked['targets'];
		var i18n = "_pick_target_" + picked_count + "_of_" + targets_count;
		var i18n_args = [];
		i18n_args.push(translate(action_picked['code']));
		for (var i = 0; i < targets_picked.length; i++) {
			i18n_args.push(translate(targets_picked[i]));
		}
		// Look for alternate linker word in picked action
		if ('linker' in action_picked) {
			i18n_args.push(translate(action_picked['linker']));
		} else {
			// Put default linker word
			i18n_args.push(translate('_pick_target_linker'));
		}
		html = translate(i18n, i18n_args);
		jQuery("#notification div").html(html);
		break;
	}
}

/** Remove all currently shown hints. */
function resetHints() {
	// Hide hints
	jQuery("#hints").html("");
	// Reset counters
	badActions = 0;
	hintsShown = 0;
}

/** Show next hint according to hints already shown. */
function showNextHint() {
	if ('hints' in current_state
			&& current_state['hints'].length > hintsShown) {
		var hint = current_state['hints'][hintsShown];
		var hintTitle = translate("_hint_{0}", [hintsShown + 1])
		var html = "<li onclick=\"javascript:showResult('" + escJs(translate(hint)) + "', '" + escJs(hintTitle) + "');\">" + escHtml(hintTitle) + "</li>";
		jQuery("#hints").append(html);
	}
	hintsShown++;
}


/** Show/update current state picture. */
function setStatePicture(state) {
	if ('picture' in state) {
		var html = null;
		var pictHtml = "<img src=\"./games/" + escUrl(game) + "/" + escUrl(state['picture']) + "\" />";
		// If big picture available, link to it on click
		if ('big_picture' in state) {
			html = "<a href=\"./games/" + escUrl(game) + "/" + escUrl(state['big_picture']) + "\" target=\"_blank\">" + pictHtml + "</a>";
		} else {
			html = pictHtml;
		}
		jQuery("#picture").html(html);
		jQuery("#picture").show();
	} else {
		// No picture available. Check for default or hide it.
		if (isDefined('default_picture')) {
			html = "<img src=\"./games/" + escUrl(game) + "/" + escUrl(default_picture) + "\" />";
			jQuery("#picture").html(html);
			jQuery("#picture").show();
		} else {
			jQuery("#picture").hide();
		}
	}
}

/** Show/update current state story. */
function setStory(state) {
	lines = state['story']
	jQuery("#situation").html("");
	for (var i = 0; i < lines.length; i++) {
		jQuery("#situation").append("<p>" + escHtml(translate(lines[i])) + "</p>");
	}
}

/** Show/update current state map. */
function setMap(state) {
	jQuery("#map img").attr("src", "./games/" + escUrl(game) + "/" + escUrl(state['map']));
	jQuery("#map map").html("");
	var html = "";
	for (var i = 0; i < state['map-items'].length; i++) {
		var item = state['map-items'][i];
		var area = "<area coords=\"" + escAttr(item['area']) + "\" shape=\"" + escAttr(item['shape']) + "\" onclick=\"javascript:proceedMapResult(" + i + ");\" />";
		html += area;
	}
	jQuery("#map map").html(html);
}

/** Initialize main UI with loaded languages. */
function setupUI() {
	// Translate UI labels
	jQuery("#inventory .title").html(escHtml(translate("_inventory")));
	jQuery("#objects .title").html(escHtml(translate("_objects")));
	jQuery("#start-game button").html(escHtml(translate("_start_game")));
	jQuery("#try-again button").html(escHtml(translate("_try_again")));
	// Set game title
	if (isDefined('title')) {
		jQuery("title").html(escHtml(translate(title)));
	}
	// Set game footer (can contain html)
	if (isDefined('footer')) {
		jQuery("#footer").html(translate(footer));
	}
}

/** Setup introduction screen.
 * @return True if an intro was loaded in the game. False otherwise. */
function setupIntro() {
	if (!isDefined('intro')) {
		return;
	}
	if (!Array.isArray(intro)) {
		intro = [intro];
	}
	if (intro.length == 0) {
		return false;
	}
	var html = "";
	for (var i = 0; i < intro.length; i++) {
		var step = intro[i];
		if ('story' in step) {
			if (Array.isArray(step['story'])) {
				for (var j = 0; j < step['story'].length; j++) {
					html += "<p>" + escHtml(translate(step['story'][j])) + "</p>";
				}
			} else {
				html += "<p>" + escHtml(translate(step['story'])) + "</p>";
			}
		}
		if ('picture' in step) {
			html += "<div class=\"intro-picture\">";
			if ('big_picture' in step) {
				html += "<a href=\"./games/" + escUrl(game) + "/" + escUrl(step['big_picture']) + "\">";
			}
			html += "<img src=\"./games/" + escUrl(game) + "/" + escUrl(step['picture']) + "\" />";
			if ('big_picture' in step) {
				html += "</a>";
			}
			html += "</div>";
		}
	}
	jQuery("#intro-screen").prepend(html);
	return true;
}

/** Show all available actions from the game and loaded languages. */
function setupActions() {
	for (var i = 0; i < actions.length; i++) {
		jQuery("#actions ul").append("<li onclick=\"javascript:actionPicked('" + escJs(actions[i]['code']) + "');\"))>" + escHtml(translate(actions[i]['code'])) + "</li>");
	}
}

/** Show all inventory locations from the game and loaded languages. */
function setupLocations() {
	for (var i = 0; i < locations.length; i++) {
		inventory[locations[i]] = null;
		jQuery("#inventory ul").append("<li id=\"location-" + escAttr(locations[i]) + "\"><span class=\"location\" onclick=\"javascript:targetPicked('"+ escJs(locations[i]) + "');\">" + escHtml(translate(locations[i])) + "</span><span class=\"item\" onclick=\"javascript:inventoryPicked('" + escJs(locations[i]) + "');\"></span>");
	}
}

