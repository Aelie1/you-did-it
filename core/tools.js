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
 
// This file contains generic tools not directly bound to You DID it!

String.prototype.format = function (args) {
	var str = this;
	return str.replace(String.prototype.format.regex, function(item) {
		var intVal = parseInt(item.substring(1, item.length - 1));
		var replace;
		if (intVal >= 0) {
			replace = args[intVal];
		} else if (intVal === -1) {
			replace = "{";
		} else if (intVal === -2) {
			replace = "}";
		} else {
			replace = "";
		}
		return replace;
	});
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

function _get( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return null;
  else
    return results[1];
}

function isDefined(varName) {
	return typeof(window[varName]) != "undefined";
}

function escHtml(string) {
	return string;
}
function escAttr(string) {
	return string;
}
function escUrl(string) {
	return string;
}
/** Escape string to include it in javascript code, surrounded by ' '
 * and by " " for html element. */
function escJs(string) {
	var esc = string.replace(new RegExp("'", 'g'), "\\'");
	esc = esc.replace(new RegExp("\"", 'g'), "&quot;");
	return esc;
}