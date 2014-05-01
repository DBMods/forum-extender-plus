// ==UserScript==
// @name Dropbox Forum Extender+ Mod Helper
// @namespace DropboxMods
// @description Super User hel-per script for Forum Extender+
// @include https://forums.dropbox.com/*
// @version 1.0.0
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/plugins/mod-helper.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/plugins/mod-helper.user.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

//Handle thread openning and closing from front page
$('#latest tr').find('td:first').each(function(index){
    var topicId = $(this).find('a:first').attr('href').split('?id=')[1];
    var thisStuff = $(this);
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://forums.dropbox.com/topic.php?id=' + topicId,
        onload: function(response) {
            var resp = response.responseText;
            $(thisStuff).prepend('[<a href="https://forums.dropbox.com/bb-admin/topic-toggle.php?id=' + topicId + '&_wp_http_referrer=%2F&_wpnonce=' + resp.split('<div class="admin">')[1].split('<a href="https://forums.dropbox.com/bb-admin/topic-toggle.php')[1].split('">')[0].split('_wpnonce=')[1] + '">Open/Close</a>] - ');
        }
    });
});