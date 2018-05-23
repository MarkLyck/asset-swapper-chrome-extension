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
	// if (typeof prevVersion == 'undefined') {
	// 	onInstall();
	// }
	localStorage['version'] = currVersion;
}


function isURLValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
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
	if (!JSON.parse(localStorage.getItem('rulesActive'))) return
	const rules = JSON.parse(localStorage.rules)
	return rules.reduce((acc, rule) => {
		const sourceRegex = wildcardToRegExp(rule.source)
		if (rule.active && sourceRegex.test(details.url) && isURLValid(rule.source) && isURLValid(rule.target)) {
			let target = rule.target
			if (!target.includes('http') && !target.includes('://')) {
				target = `http://${target}`
			}
			acc = { redirectUrl: target }
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
