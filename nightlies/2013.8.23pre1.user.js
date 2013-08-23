// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-*
// @version 2013.8.23pre1
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/nightlies/2013.8.23pre1.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/nightlies/2013.8.23pre1.user.js
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==

//Set internal version
var internalVersion = 'Nightly Build';

//Set global variables
var pageUrl = getPageUrl();
var iconIndex = {
	'Super User': '<img src="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" height="16px" width="40px"> ',
	'Pro User': '<img align="top" src="https://forums.dropbox.com/bb-templates/dropbox/images/star.gif"> ',
	'Dropboxer': '<img align="absmiddle" src="https://forums.dropbox.com/bb-templates/dropbox/images/dropbox-icon.gif"> ',
	'default': ''
};
var forumTheme = GM_getValue('theme');

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

//Reskin the forums
if(forumTheme)
	forumVersion(forumTheme);

//Collapse footer
if(GM_getValue('footer-collapse') == 'yes')
	footerCollapse();

//Reload pages
reloadFront(GM_getValue('front-reload'), 0);
reloadStickies(GM_getValue('sticky-reload'), 0);

//Add options
addOptions();

//Add script options
function addOptions() {
	$("head").append('<style type="text/css" charset="utf-8">#modIcon-option-popup .clear{clear:both}#modIcon-option-popup div.right{float:right;padding-left:10px;width:50%;border-left:1px solid #ddd}#modIcon-option-popup div:left{float:left;padding-right:10px;width:50%}#modIcon-option-popup{display:none;position:fixed;height:200px;width:600px;background:#FFFFFF;border:2px solid #cecece;z-index:2;padding:12px;font-size:13px;}#modIcon-option-popup h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px;}#modIcon-option-close:hover{cursor:pointer;}#modIcon-option-close{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block;}</style>');
	$('body').append('<div id="modIcon-option-popup"><a id="modIcon-option-close">x</a><h1>Mod Icons Options</h1><br/><br/><div class="left"><select id="theme"><optgroup label="Original Themes"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="">Current Theme (No Change)</option></optgroup><optgroup label="Custom Themes"><option value="beta">Beta</option></optgroup></select><br/><input type="checkbox" id="footer-collapse" value="yes">Auto-collapse footer</input></div><div class="right">Reload front page every <select id="front-reload"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload stickies every <select id="sticky-reload"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select></div><br/><input type="button" tabindex="4" value="Save" id="modIcon-option-save" style="clear:both;float:right;"></div>');
	$('body').append('<div id="modIcon-screen-overlay" style="display:none;position:fixed;height:100%;width:100%;top:0;left:0;background:#000000;border:1px solid #cecece;z-index:1;opacity:0.7;"></div>');

	//Add option trigger
	//This will be moved elsewhere on the page shortly
	$('body').append('<div id="modIcon-option-trigger">Open Options</div>');

	$('#modIcon-option-trigger').click(function() {
		var windowWidth = document.documentElement.clientWidth;
		var windowHeight = document.documentElement.clientHeight;
		var popupHeight = $('#modIcon-option-popup').height();
		var popupWidth = $('#modIcon-option-popup').width();

		$('#modIcon-option-popup').css({
			'position': 'fixed',
			'top': windowHeight / 2 - popupHeight / 2,
			'left': windowWidth / 2 - popupWidth / 2
		});

		$('#modIcon-screen-overlay').show();
		$('#modIcon-option-popup').show();
	});
	$('#modIcon-option-close, #modIcon-option-save').click(function() {
		$('#modIcon-screen-overlay').hide();
		$('#modIcon-option-popup').hide();
	});
	$('#modIcon-option-save').click(function() {
		GM_setValue('theme', $('#theme :selected').val());
		GM_setValue('footer-collapse', $('#footer-collapse').val());
		GM_setValue('front-reload', $('#front-reload :selected').val());
		GM_setValue('sticky-reload', $('#sticky-reload :selected').val());
		alert('Your settings have been saved.\n\nThe new settings won\'t take effect until the page is reloaded.');
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

//Reload the front page
function reloadFront(reloadDelay) {
	if(reloadDelay > 0 && pageUrl == 'forums.dropbox.com')
		setTimeout(function() {
			document.location.reload();
		}, reloadDelay * 1000);
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
	if(pageUrl == 'topic.php') {
		if( typeof changeFor == 'string')
			$('.threadauthor small a:contains("' + changeFor + '")').html(newRole);
		else if( typeof changeFor == 'number')
			$('.threadauthor small a[href$="=' + changeFor + '"]').html(newRole);
	}
}

//Highlight posts
function postHighlight(highlightFor, color) {
	if(pageUrl == 'topic.php') {
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
}

//Collapse footer
function footerCollapse() {
	//Style footer
	$('#footer').css({
		'border-top': '1px solid #bbb',
		'border-left': '1px solid #bbb',
		'border-right': '1px solid #bbb',
		'border-top-left-radius': '25px',
		'border-top-right-radius': '25px'
	});

	//Bring text into the footer div
	$('#footer').append($('span:last').clone());
	$('span:last').remove();
	$('#footer').wrapInner('<div id="footercontent"></div>');
	$('#footer').prepend('<div id="footertoggle"><div id="footertogglearrow"></div></div>');

	//Add and style toggle animations
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
		'margin': '12px auto 0 auto'
	});
	$('#footercontent').toggle();
	var footerHidden = true;
	$('#footertoggle').click(function() {
		$('#footercontent').slideToggle('slow', function() {
			footerHidden = footerHidden ? false : true;
			var toggleBottom = footerHidden ? '10px solid #bbb' : 'none';
			var toggleTop = footerHidden ? 'none' : '10px solid #bbb';
			$('#footertogglearrow').css({
				'border-top': toggleTop,
				'border-bottom': toggleBottom
			});
		});
	});
}

//TODO Skin forums
function forumVersionBeta(){
	
}

//Revert forums
function forumVersion(versionDate) {
	if(versionDate == ('8.8.2012' || 'beta')) {
		//Hide logo
		$('#header a:first').remove();

		//Reformat header
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
	}
	if(pageUrl == 'forums.dropbox.com') {
		var latestTr = $('#latest').find('tr');
		var forumList = $('#forumlist');
		var forumListTr = $(forumList).find('tr');
		if(versionDate == "original") {
			//Add tag list and reorder elements
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'love', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];

			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap"></p></div>');
			for(i in tagList) {
				$('#frontpageheatmap').append('<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a>');
				if(i < tagList.length)
					$('#frontpageheatmap').append(' ');
			}
			$('#forumlist').attr('id', 'forumlist-temp');
			var topicDesc = [$('#forumlist-temp').find('tr').eq(1).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(1).find('td').html().split('<br>')[1], $('#forumlist-temp').find('tr').eq(2).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(2).find('td').html().split('<br>')[1], $('#forumlist-temp').find('tr').eq(3).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(3).find('td').html().split('<br>')[1], $('#forumlist-temp').find('tr').eq(4).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(4).find('td').html().split('<br>')[1], $('#forumlist-temp').find('tr').eq(5).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(5).find('td').html().split('<br>')[1]];
			var topicPosts = [$('#forumlist-temp').find('tr').eq(1).find('td').html().split('<br>')[2].split(' topics')[0], $('#forumlist-temp').find('tr').eq(2).find('td').html().split('<br>')[2].split(' topics')[0], $('#forumlist-temp').find('tr').eq(3).find('td').html().split('<br>')[2].split(' topics')[0], $('#forumlist-temp').find('tr').eq(4).find('td').html().split('<br>')[2].split(' topics')[0], $('#forumlist-temp').find('tr').eq(5).find('td').html().split('<br>')[2].split(' topics')[0]];

			$('#forumlist-temp').remove();
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist"></table><h2>Latest Discussions</h2>');
			$('#forumlist').html('<tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr>');
			for(i in topicPosts) {
				$('#forumlist').append('<tr class="bb-precedes-sibling bb-root"><td>' + topicDesc[i] + '</td><td class="num">' + topicPosts[i] + '</td><td class="num">' + topicPosts[i] + '+</td></tr>');
			}

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
			$('#main').css('width', '866ps');
			$('#header').css('width', '866px');
			$('#header').find('a').eq(0).find('img').eq(0).attr('src', 'http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png');
			$(latestTr).not(':first').css('background', '#f7f7f7');
			$('.bb-root').css('background', '#f7f7f7');
			$('.alt').css('background', '#fff');
			$('.super-sticky').css('background', '#deeefc');
			$('#forumlist, #latest').css({
				'background': '#fff',
				'border-top': '1px dotted #ccc'
			});
			$('frontpageheatmap').css('border-top', '1px dotted #ccc');
			$('h2').css({
				'color': '#000',
				'margin-bottom': '0'
			});
		}
		if(versionDate == '8.8.2012' || versionDate == 'beta') {
			//Set variables
			var latestHeader = $(latestTr).eq(0).find('th');

			//Style table headers
			$(forumListTr).eq(0).find('th').eq(0).css({
				'background': '#666',
				'color': '#fff'
			});
			$(forumListTr).eq(0).css({
				'height': '25px',
				'padding': 'none'
			});
			$(latestHeader).css({
				'background': '#666',
				'color': '#fff'
			});
			$(latestHeader).eq(0).find('a').eq(0).css('color', '#aaa');
			//latestHeader widths: 545, 46, 90, 69px

			//Style stickies
			$('.super-sticky').css('background', '#f4faff');

			//Add and style headings
			$('#discussions').prepend('<h2 class="forumheading">Latest Discussions</h2>');
			$('#forumlist-container').prepend('<h2 class="forumheading">Forums</h2>');
			$('.forumheading').css({
				'border-bottom': '1px solid #ddd',
				'padding-bottom': '6px'
			});
			$('#forumlist').find('tr').eq(0).find('th').html('Name');
		}
	}
}

//Get URL of current page
function getPageUrl() {
	var url = window.location.href.split('?')[0];
	return url.split('/')[url.split('/').length - ((url[url.length - 1] == '/') ? 2 : 1)];
}