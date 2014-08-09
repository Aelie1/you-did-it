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
 
// This file contains internationalization (i18n) functions

/** The dictionary holding all translation data. Don't request it
 * directly, use translate() instead. */
var i18n = {};

/** Translate a text
 * @param string The string code to translate
 * @param array An optional array for translation placeholders
 */
function translate(string, array) {
	if (string in i18n) {
		if (Array.isArray(array)) {
			for (var i = 0; i < array.length; i++) {
				array[i] = translate(array[i]);
			}
			return i18n[string].format(array);
		} else {
			return i18n[string];
		}
	}
	return string;
}

/** Load the default language i18n file. This overloads the currently
 * loaded i18n data. */
function loadI18n() {
	for (var key in default_core_language) {
		i18n[key] = default_core_language[key];
	}
	for (var key in default_language) {
		i18n[key] = default_language[key];
	}
}

/** Load an alternative language file.  This overloads the currently
 * loaded i18n data. */
function loadAltI18n(lang) {
	if (lang == null) {
		return;
	}
	jQuery("head").append("<script type=\"text/javascript\" src=\"./core/language-" + escUrl(lang) + ".js\"></script>");
	jQuery("head").append("<script type=\"text/javascript\" src=\"./games/" + escUrl(game) + "/language-" + escUrl(lang) + ".js\"></script>");
	if (!isDefined('language')) {
		return;
	}
	if (isDefined('core_language')) {
		for (var key in core_language) {
			i18n[key] = core_language[key];
		}
	}
	for (var key in language) {
		i18n[key] = language[key];
	}
}