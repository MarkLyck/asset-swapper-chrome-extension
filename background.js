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


chrome.webRequest.onBeforeRequest.addListener(details => {
	// source:destination
	var mapping = JSON.parse(localStorage.configuration)
	for (var source in mapping) {
		var redirectTo = mapping[source]
		if (redirectTo.status && details.url.indexOf(source) === 0) {
			return { redirectUrl: redirectTo.url }
		}
	}
}, {
	urls: ["<all_urls>"]
}, ["blocking"])

function onInstall() {
	if (typeof localStorage.configuration === "undefined") {
		localStorage.configuration = "{}";
	}
}

function getVersion() {
	var details = chrome.app.getDetails()
	return details.version
}
