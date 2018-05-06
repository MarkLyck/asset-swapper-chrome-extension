/*
 * Created by Mark Lyck
 * mark.lyck@gmail.com
 * Licence GPL3
 */

// Check if the version has changed.
var currVersion = getVersion();
var prevVersion = localStorage['version'];
if (currVersion != prevVersion) {
	// Check if we just installed this extension.
	if (typeof prevVersion == 'undefined') {
		onInstall();
	}
	localStorage['version'] = currVersion;
}

/**
 * RegExp-escapes all characters in the given string.
 */
function regExpEscape (s) {
	return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
  
function wildcardToRegExp (s) {
	return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$')
}

chrome.webRequest.onBeforeRequest.addListener(details => {
	const rules = JSON.parse(localStorage.rules)
	return rules.reduce((acc, rule) => {
		const sourceRegex = wildcardToRegExp(rule.source)
		if (rule.active && sourceRegex.test(details.url)) {
			acc = { redirectUrl: rule.target }
		}
		return acc
	}, {})
}, {
	urls: ["<all_urls>"]
}, ["blocking"])

function getVersion() {
	const details = chrome.app.getDetails()
	return details.version
}
