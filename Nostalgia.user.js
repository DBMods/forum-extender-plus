// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons
// @include https://forums.dropbox.com/*
// @grant none
// ==/UserScript==

//Minified from github.com/DBMods/forum-mod-icons/blob/287058a902f532e4ee20db5e34984f571de20892/dropbox_forum_mod_icons.user.js

//Add footer
document.getElementById("footer").innerHTML = document.getElementById("footer").innerHTML + "<div style='text-align: right; color: rgb(102, 102, 102); font-size: 11px; clear:both;'>Dropbox Forum Mod Icons Nostalgia</div>";

//Check page for posts by Super Users
var elems = document.getElementsByTagName('*'), i;
for (i in elems) {
	if ((" " + elems[i].className + " ").indexOf(' threadauthor ') > -1 && elems[i].innerHTML.indexOf("</a></small>") - 10 == elems[i].innerHTML.indexOf("Super User"))
		elems[i].innerHTML = "<p><strong><img src='https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif' height='16px' width='40px' >&nbsp;" + elems[i].innerHTML.substring(26, elems[i].innerHTML.length);
}