// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb*
// @version 2013.9.9pre1b
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/nightlies/2013.9.9pre1b.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/nightlies/2013.9.9pre1b.user.js
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==

//Set internal version
var internalVersion = 'Nightly Build';

//Set global variables
var pageUrl = getPageUrl();
var iconIndex = {
	'Super User': '<img src="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" height="16px" width="40px" /> ',
	'Pro User': '<img align="top" src="https://forums.dropbox.com/bb-templates/dropbox/images/star.gif" /> ',
	'Dropboxer': '<img align="absmiddle" src="https://forums.dropbox.com/bb-templates/dropbox/images/dropbox-icon.gif" /> ',
	'default': ''
};
var theme = GM_getValue('theme'), collapseFooter = GM_getValue('footer-collapse');

//Add footer
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Mod Icons Version ' + internalVersion + '</div>');

//Modify Super User posts
addIcon('Super User');
postHighlight('Super User', '#fff19d');
changeRole(1618104, 'Master of Super Users');

//Highlight posts by forum regulars green
postHighlight(6845, '#b5ff90');
postHighlight(3581696, '#b5ff90');
postHighlight(816535, '#b5ff90');
postHighlight(2122867, '#b5ff90');
postHighlight(434127, '#b5ff90');
postHighlight(85409, '#b5ff90');
postHighlight(1253356, '#b5ff90');

//Reskin the forums
if(theme)
	forumVersion(theme);

//Flag new threads in green
highlightThread(1, '#b4ff90');

//Collapse footer
if(collapseFooter == 'yes')
	footerCollapse();

//Reload pages
reloadPage('front', GM_getValue('front-reload', 0));
reloadPage('forum', GM_getValue('forum-reload', 0));
reloadStickies(GM_getValue('sticky-reload', 0));

//Add options
addOptions();

//Add script options
function addOptions() {
	//Add prerequsites
	$("head").append('<style type="text/css" charset="utf-8">#modIcon-option-popup .clear{clear:both}#modIcon-option-popup div.right{float:right;padding-left:10px;width:50%;border-left:1px solid #ddd}#modIcon-option-popup div:left{float:left;padding-right:10px;width:50%}#modIcon-option-popup{display:none;position:fixed;height:200px;width:600px;background:#FFFFFF;border:2px solid #cecece;z-index:2;padding:12px;font-size:13px;}#modIcon-option-popup h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px;}#modIcon-option-trigger:hover, #modIcon-option-close:hover{cursor:pointer;}#modIcon-option-close{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block;}</style>');
	$('body').append('<div id="modIcon-option-popup"><a id="modIcon-option-close">x</a><h1>Mod Icons Options</h1><br/><br/><div class="left"><select name="theme"><optgroup label="Original Themes"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></optgroup><optgroup label="Custom Themes"><optgroup label="-- No Existing Custom Themes --"></optgroup></optgroup></select><br/><input type="checkbox" name="collapseFooter" value="yes">Auto-collapse footer</input></div><div class="right">Reload front page every <select name="reloadFront"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload forum pages every <select name="reloadForums"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload stickies every <select name="reloadSticky"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select></div><br/><input type="button" tabindex="4" value="Save" id="modIcon-option-save" style="clear:both;float:right;"></div>');
	$('body').append('<div id="modIcon-screen-overlay" style="display:none;position:fixed;height:100%;width:100%;top:0;left:0;background:#000;border:1px solid #cecece;z-index:1;opacity:0.7;"></div>');
	$('body').append('<img id="modIcon-option-trigger" src="https://2.gravatar.com/avatar/4a62e81113e89800386a9d9aab160aee?s=420" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-35px" />');

	$('#modIcon-option-trigger').click(function() {
		var popupHeight = $('#modIcon-option-popup').height(), popupWidth = $('#modIcon-option-popup').width();

		$('#modIcon-option-popup').css({
			'position': 'fixed',
			'top': document.documentElement.clientHeight / 2 - popupHeight / 2,
			'left': document.documentElement.clientWidth / 2 - popupWidth / 2
		});

		//Load current settings
		var settingDropdown = {
			'theme': theme,
			'reloadSticky': GM_getValue('sticky-reload'),
			'reloadForums': GM_getValue('forum-reload'),
			'reloadFront': GM_getValue('front-reload')
		};
		for(var name in settingDropdown) {
			if(settingDropdown[name])
				$('#modIcon-option-popup [name="' + name + '"] option[value="' + settingDropdown[name] + '"]').attr('selected', 'selected');
		}
		if(collapseFooter)
			$('#modIcon-option-popup [name="collapseFooter"]').attr('checked', true);

		$('#modIcon-screen-overlay').show();
		$('#modIcon-option-popup').show();
	});
	$('#modIcon-option-close, #modIcon-option-save').click(function() {
		$('#modIcon-screen-overlay').hide();
		$('#modIcon-option-popup').hide();
	});
	$('#modIcon-option-save').click(function() {
		GM_setValue('theme', $('[name="theme"] :selected').val());
		GM_setValue('footer-collapse', $('[name="collapseFooter"]').val());
		GM_setValue('front-reload', $('[name="reloadFront"] :selected').val());
		GM_setValue('forum-reload', $('[name="reloadForums"] :selected').val());
		GM_setValue('sticky-reload', $('[name="reloadSticky"] :selected').val());
		alert('Your settings have been saved.\n\nThe new settings won\'t take effect until the page is reloaded.');
	});
}

//Highlight forum threads based on post count
function highlightThread(posts, color) {
	if(['forums.dropbox.com', 'forum.php'].indexOf(pageUrl) > -1)
		$('#latest tr td:nth-child(2)').each(function() {
			if(parseInt(this.innerHTML, 10) <= posts)
				this.parentNode.style.backgroundColor = color;
		});
}

//Reload stickies
function reloadStickies(reloadDelay) {
	if(pageUrl == 'topic.php' && reloadDelay > 0 && $('#topic_labels:contains("[sticky]")').length > 0)
		setTimeout(function() {
			if(!$('#topic').val() && !$('#post_content').val())
				document.location.reload();
			else
				reloadStickies(reloadDelay);
		}, reloadDelay * 1000);
}

//Reload pages
function reloadPage(pageType, reloadDelay) {
	var reloadIndex = {
		'sticky': pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length > 0,
		'sticky2': !$('#topic').val() && !$('#post_content').val(),
		'front': pageUrl == 'forums.dropbox.com',
		'front2': true,
		'forum': pageUrl == 'forum.php',
		'forum2': true
	};
	if(reloadIndex[pageType] && reloadDelay > 0) {
		setTimeout(function() {
			if(reloadIndex[pageType + '2'])
				document.location.reload();
			else
				reloadPageBeta(pageType, reloadDelay);
		}, reloadDelay * 1000);
	}
}

//Add icons to users
function addIcon(addTo) {
	if(pageUrl == 'topic.php') {
		if( typeof addTo == 'string')
			$('.threadauthor small a:contains("' + addTo + '")').parent().parent().find('strong').prepend(iconIndex[addTo]);
		else if( typeof addTo == 'number')
			$('.threadauthor small a[href$="=' + addTo + '"]').parent().parent().find('strong').prepend(iconIndex['default']);
	}
}

//Change role name
function changeRole(changeFor, newRole) {
	if(pageUrl == 'topic.php')
		if( typeof changeFor == 'string')
			$('.threadauthor small a:contains("' + changeFor + '")').html(newRole);
		else if( typeof changeFor == 'number')
			$('.threadauthor small a[href$="=' + changeFor + '"]').html(newRole);
}

//Highlight posts
function postHighlight(highlightFor, color) {
	if(pageUrl == 'topic.php')
		if( typeof highlightFor == 'string') {
			//Count posts
			var rolePosts = $('.threadauthor p small a:contains("' + highlightFor + '")').length;
			var totalPosts = $('.threadauthor').length;

			//Set highlighting status
			var status = ((totalPosts > 5 && rolePosts / totalPosts > 0.2) || (totalPosts == 5 && rolePosts > 2) || (totalPosts < 5 && rolePosts > 1)) ? "disabled" : "enabled";

			//Display message above and below message thread
			var message = '<li style="text-align: center;">Highlighting ' + status + ' for all ' + highlightFor + 's</li>';
			$('#thread').prepend(message);
			$('#thread').append(message);

			//Highlight posts if enabled
			if(status == 'enabled')
				$('.threadauthor p small a:contains("' + highlightFor + '")').parent().parent().parent().parent().find('.threadpost').css('background', color);
		} else if( typeof highlightFor == 'number')
			$('.threadauthor small a[href$="=' + highlightFor + '"]').parent().parent().parent().parent().find('.threadpost').css('background', color);
}

//Collapse footer
function footerCollapse() {
	//Style footer
	$('#footer').css({
		'border-top': '1px solid #bbb',
		'border-left': '1px solid #bbb',
		'border-right': '1px solid #bbb',
		'border-radius': '25px 25px 0 0'
	});

	//Bring external content into footer, and wrap footer contents
	$('#footer').append($('span:last'));
	$('#footer').wrapInner('<div id="footercontent" />');

	//Add and style toggle animations
	$('#footer').prepend('<div id="footertoggle"><div id="footertogglearrow"></div></div>');
	$('#footertoggle').css({
		'height': '25px',
		'width': '25px',
		'margin': '0 auto'
	});
	$('#footertogglearrow').css({
		'height': '0',
		'width': '0',
		'border-left': '5px solid transparent',
		'border-right': '5px solid transparent',
		'border-bottom': '10px solid #bbb',
		'margin': '12px auto 0'
	});
	$('#footercontent').toggle();
	var footerHidden = true;
	$('#footertoggle').click(function() {
		$('#footercontent').slideToggle('slow', function() {
			footerHidden = footerHidden ? false : true;
			$('#footertogglearrow').css({
				'border-top': ( footerHidden ? 'none' : '10px solid #bbb'),
				'border-bottom': ( footerHidden ? '10px solid #bbb' : 'none')
			});
		});
	});
}

//Skin forums
function forumVersion(versionDate) {
	var latestTr = $('#latest tr');
	if(versionDate == '8.8.2012') {
		//Reformat header
		$('#header a:first').remove();
		$('#header').css({
			'width': '990px',
			'height': '174px',
			'padding': '0',
			'background': 'url(https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forumsheader.jpg)'
		});
		$('.login').css({
			'float': 'left',
			'clear': 'none',
			'margin-top': '5px',
			'position': 'static',
			'font-size': '12px',
			'font-weight': 'normal'
		});
		$('.search').css({
			'float': 'right',
			'clear': 'none',
			'margin': '5px 5px 0 0',
			'position': 'static'
		});
	} else if(versionDate == 'original') {
		$('#main, #header').css('width', '866px');
		$('#header a:first img').attr('src', 'http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png');
	}
	if(['forums.dropbox.com', 'forum.php'].indexOf(pageUrl) > -1) {
		if(versionDate == '8.8.2012') {
			$('#latest th').css({
				'background': '#666',
				'color': '#fff'
			});
			$('#latest th:eq(0) a').css('color', '#aaa');
			//TODO: latestHeader widths: 545, 46, 90, 69px
			$('.sticky, .super-sticky').css('background', '#f4faff');
			
			//Style table headers
			$('#forumlist th').css({
				'background': '#666',
				'color': '#fff'
			});
			$('#forumlist th').html('Name');
			$('#forumlist tr').eq(0).css({
				'height': '25px',
				'padding': 'none'
			});

			//Add and style headings
			$('#discussions').prepend('<h2 class="forumheading">Latest Discussions</h2>');
			$('#forumlist-container').prepend('<h2 class="forumheading">Forums</h2>');
			$('.forumheading').css({
				'border-bottom': '1px solid #ddd',
				'padding-bottom': '6px'
			});
		} else if(versionDate == 'original') {
			$('#discussions').css('margin-left', '0');
			$('#forumlist-container').remove();
			$('#latest').css('width', '866px');
			$('#latest tr:not(:first), .bb-root').css('background', '#f7f7f7');
			$('#latest, .alt').css('background', '#fff');
			$('#latest').css('border-top', '1px dotted #ccc');
			$('.sticky, .super-sticky').css('background', '#deeefc');
		}
	} else if(pageUrl == 'forums.dropbox.com') {
		if(versionDate == 'original') {
			//Add tag list and reorder elements
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'love', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];
			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap"></p></div>');
			for(i in tagList) {
				$('#frontpageheatmap').append('<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a>');
			}
			$('#frontpageheatmap a:not(:last)').append(' ');
			$('#forumlist').attr('id', 'forumlist-temp');
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist"></table><h2>Latest Discussions</h2>');
			$('#forumlist').html('<tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr>');
			for( i = 1; i < 6; i++) {
				select = $('#forumlist-temp tr:eq(' + i + ') td').html().split('<br>');
				$('#forumlist').append('<tr class="bb-precedes-sibling bb-root"><td>' + select[0] + select[1] + '</td><td class="num">' + select[2].split(' topics')[0] + '</td><td class="num">' + select[2].split(' topics')[0] + '+</td></tr>');
			}
			$('#forumlist-temp').remove();

			//Style elements
			$('#discussions').css({
				'width': '680px',
				'margin-right': '170px',
				'margin-left': '0'
			});
			$('#hottags').css({
				'position': 'absolute',
				'right': '0',
				'left': 'auto'
			});

			$('frontpageheatmap').css('border-top', '1px dotted #ccc');
			$('#forumlist').css({
				'background': '#fff',
				'border-top': '1px dotted #ccc'
			});
			$('h2').css({
				'color': '#000',
				'margin-bottom': '0'
			});
		}
	}
}

//Debug layout
function debugLayout(item) {
	$('body *').css({
		'border-style': 'solid',
		'border-width': '5px'
	});
	$(item + ' > *').css('border-color', 'red');
	$(item + ' > * > *').css('border-color', 'orange');
	$(item + ' > * > * > *').css('border-color', 'yellow');
	$(item + ' > * > * > * > *').css('border-color', 'green');
	$(item + ' > * > * > * > * > *').css('border-color', 'blue');
	$(item + ' > * > * > * > * > * > *').css('border-color', 'purple');
	$(item + ' > * > * > * > * > * > * > *').css('border-color', 'red');
	$(item + ' > * > * > * > * > * > * > * > *').css('border-color', 'orange');
	$(item + ' > * > * > * > * > * > * > * > * > *').css('border-color', 'yellow');
	$(item + ' > * > * > * > * > * > * > * > * > * > *').css('border-color', 'green');
	$(item + ' > * > * > * > * > * > * > * > * > * > * > *').css('border-color', 'blue');
	$(item + ' > * > * > * > * > * > * > * > * > * > * > * > *').css('border-color', 'purple');
}

//Get URL of current page
function getPageUrl() {
	var url = window.location.href.split('?')[0];
	return url.split('/')[url.split('/').length - ((url[url.length - 1] == '/') ? 2 : 1)];
}