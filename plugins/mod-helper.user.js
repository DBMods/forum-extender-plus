// ==UserScript==
// @name Dropbox Forum Extender+ Mod Helper
// @namespace DropboxMods
// @description Super User hel-per script for Forum Extender+
// @include https://forums.dropbox.com/*
// @version 1.0.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/plugins/mod-helper.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/plugins/mod-helper.user.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

/*
 * Handle thread openning and closing from front page
 *
 * Must use link instead of wondow.location, since the forum page that closes threads will redirect back to the
 * thread page instead of the front page or forum page. Nothing I can do about that.
 */

$('head').append('<style>.threadToggleLink:hover{cursor:pointer}</style>');
$('#latest tr').find('td:first').each(function(index){
	$(this).prepend('<span class="forumext-mod-topic-toggle">[<span class="threadToggleLink">Toggle</span>]</span> - <menu type="context" id="forumext-mod-post-menu"><menuitem label="Open/Close Thread" onclick="window.location.href = link;"></menuitem></menu>');
});
$('.forumext-mod-topic-toggle').click(function(evt){
	var thisStuff = $(this);
	var topicId = $(this).parent().find('a:first').attr('href').split('?id=')[1];
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://forums.dropbox.com/topic.php?id=' + topicId,
		onload: function(response) {
			var resp = response.responseText;
			var link = 'https://forums.dropbox.com/bb-admin/topic-toggle.php?id=' + topicId + '&_wpnonce=' + resp.split('<div class="admin">')[1].split('<a href="https://forums.dropbox.com/bb-admin/topic-toggle.php')[1].split('">')[0].split('_wpnonce=')[1];
			$(thisStuff).html('[<a class="threadToggleLink" style="color:#000" href="' + link + '">Toggle</a>]');
			setTimeout(function() {
				$(thisStuff).find('.threadToggleLink')[0].click();
			}, 1);
		}
	});
});
if (window.location.href.contains('message='))
	window.location.href = window.location.href.replace('?message=opened', '').replace('?message=closed', '').replace('&message=opened', '').replace('&message=closed', '');