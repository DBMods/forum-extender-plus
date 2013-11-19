// ==UserScript==
// @name Dropbox Forum Mod Icons Nostalgia
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons
// @include https://forums.dropbox.com/*
// @version 1.0
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/Nostalgia.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/Nostalgia.user.js
// @grant none
// ==/UserScript==

/*
 * DBMods Dropbox Forum Mod Icons Nostalgia
 * 
 * Minified from github.com/DBMods/forum-mod-icons/blob/287058a902f532e4ee20db5e34984f571de20892/dropbox_forum_mod_icons.user.js
 */

$('#footer').append'(<div style="text-align: right; color: rgb(102, 102, 102); font-size: 11px; clear:both;">Dropbox Forum Mod Icons Nostalgia</div>');
$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').prepend('<img src="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" />');