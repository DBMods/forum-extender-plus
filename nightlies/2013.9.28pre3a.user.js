// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2013.9.28pre3a
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/nightlies/2013.9.28pre3a.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/nightlies/2013.9.28pre3a.user.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_deleteValue
// ==/UserScript==

//Set global variables
var pageUrl = getPageUrl();
var iconIndex = {
	'Super User': '<img src="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" height="16px" width="40px" /> ',
	'Pro User': '<img align="top" src="https://forums.dropbox.com/bb-templates/dropbox/images/star.gif" /> ',
	'Dropboxer': '<img align="absmiddle" src="https://forums.dropbox.com/bb-templates/dropbox/images/dropbox-icon.gif" /> ',
	'empty': ''
};
//*/
var settingsVisible = false;

//Add footer
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Mod Icons ' + versionSlug(GM_info.script.version) + '</div>');

//Modify Super User posts
addIcon('Super User');
highlightPost('Super User', '#fff19d');
changeRole(1618104, 'Master of Super Users');

//Highlight posts by forum regulars green
highlightPost(6845, 3581696, 816535, 2122867, 434127, 85409, 1253356, '#b5ff90');

//Reskin the forums
forumVersion(GM_getValue('theme'));

//Flag threads
highlightThread('#b4ff90', 1);
highlightThread('#fff19d', 2);
highlightThread('#ffd4d4', 3);

//Collapse footer
footerCollapse();

//Add nsvigstion bar
addOptions();
navBar();

//Reload pages
reloadPage('front');
reloadPage('forum');
reloadPage('sticky');

//Allow for post drafting
draftPost();

//Manage post drafts
function draftPost() {
	var thread = window.location.href.split('id=')[1].split('&')[0].split('#')[0];
	$('#post-form-subscription-container').append(' - <a id="modpostdraft">Draft Post</a> - <a id="modpostrestoredraft">Restore Draft</a>');
	$('#modpostdraft').click(function() {
		GM_setValue('draft-' + thread + '-title', $('#topic').val());
		GM_setValue('draft-' + thread + '-post', $('#post_content').val());
	});
	$('#modpostrestoredraft').click(function() {
		$('#topic').val(GM_getValue('draft-' + thread + '-title', ''));
		$('#post_content').val(GM_getValue('draft-' + thread + '-post', ''));
		GM_deleteValue('draft-' + thread + '-title');
		GM_deleteValue('draft-' + thread + '-post');
	});
}

//Add nav bar
function navBar() {
	$('body').prepend('<div id="modicon-nav-slideout-container"></div>');
	$('body').append('<div id="modicon-nav"><span id="modactivitytrigger">Activity</span></div>');
	$('head').append('<style type="text/css">#modicon-nav{position:fixed;bottom:0;height:30px;border-top:1px solid #aaf;width:100%;line-height:30px;padding:0 0 0 125px;background:#fff;z-index:10}#modicon-nav-slideout-container{margin:0 auto;border-bottom:1px solid #ddd}#modicon-nav-slideout-container > *{list-style-type:none;margin:30px auto;width:800px;text-align: center}#modicon-nav > span:hover{cursor:pointer}</style>');
	$('body').css('padding-bottom', '31px');

	//Add list content
	var resp;
	var profile = {
		list: [1618104, 11096, 175532, 561902, 30385, 67305, 857279, 643099, 182504, 1510497, 32911, 222573, 1588860],
		load: function(i) {
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'https://forums.dropbox.com/profile.php?id=' + profile.list[i],
				onload: function(response) {
					resp = response.responseText;
					$('#modactivity li:eq(' + i + ')').html('<a href="https://forums.dropbox.com/profile.php?id=' + profile.list[i] + '">' + resp.split('<title>')[1].split(' &laquo;')[0] + '</a> - ' + ((resp.split('<h4>Recent Replies</h4>')[1].indexOf('<p>No more replies.</p>') > -1) ? 'never active' : 'last active ' + resp.split('<h4>Recent Replies</h4>')[1].split('<li>')[1].split('">')[2].split('</a>')[0]));
				}
			});
		}
	};

	//Add list framework
	$('#modicon-nav-slideout-container').append('<ul id="modactivity" />');
	$('#modactivity').toggle();
	$('#modactivitytrigger').click(function() {
		$('#modactivity').slideToggle();
	});
	for(i in profile.list) {
		$('#modactivity').append('<li>Loading . . .</li>');
		profile.load(i);
	}
}

//Add options
function addOptions() {
	//Add prerequsites
	$("head").append('<style type="text/css" charset="utf-8">#modIcon-option-popup .clear{clear:both}#modIcon-option-popup div.left{float:left;width: 50px}#modIcon-option-popup div.right{float:right;padding-left:10px;width:50%;border-left:1px solid #ddd}#modIcon-option-popup{display:none;position:fixed;width:600px;height:200px;background:#fff;border:2px solid #cecece;z-index:2;padding:12px;font-size:13px}#modIcon-option-popup h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px}#modIcon-option-trigger:hover,#modIcon-option-close:hover{cursor:pointer}#modIcon-option-close{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block}</style>');
	$('body').append('<div id="modIcon-screen-overlay" style="display:none;position:fixed;height:100%;width:100%;top:0;left:0;background:#000;border:1px solid #cecece;z-index:1;opacity:0.7;"></div><img id="modIcon-option-trigger" src="https://2.gravatar.com/avatar/4a62e81113e89800386a9d9aab160aee?s=420" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-35px;z-index:11" />');
	$('body').append('<div id="modIcon-option-popup"><a id="modIcon-option-close">x</a><h1>Mod Icons Options</h1><br/><br/><div class="left"><select name="theme"><optgroup label="Original Themes"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></optgroup><optgroup label="Custom Themes"><optgroup label="-- No Existing Custom Themes --"></optgroup></optgroup></select><br/><input type="checkbox" name="collapseFooter" value="yes">Auto-collapse footer</input></div><div class="right">Reload front page every <select name="reloadFront"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload forum pages every <select name="reloadForums"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload stickies every <select name="reloadSticky"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select></div><br/><input type="button" tabindex="4" value="Save" id="modIcon-option-save" style="clear:both;float:right;"></div>');

	$('#modIcon-option-trigger').click(function() {
		settingsVisible = true;
		var optionHeight = $('#modIcon-option-popup').height(), optionWidth = $('#modIcon-option-popup').width();

		$('#modIcon-option-popup').css({
			'position': 'fixed',
			'top': (document.documentElement.clientHeight - optionHeight) / 2,
			'left': (document.documentElement.clientWidth - optionWidth) / 2
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
		settingsVisible = false;
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
function highlightThread() {
	var args = arguments;
	$('#latest tr:not(.sticky, .super-sticky) td:nth-child(2)').each(function() {
		if((args.length == 2 && parseInt($(this).html(), 10) == args[1]) || (parseInt($(this).html(), 10) >= args[1] && parseInt($(this).html(), 10) <= args[2]))
			$(this).parent().css('background', args[0]);
	});
}

//Reload pages
function reloadPage(pageType) {
	var reloadIndex = {
		'sticky': pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length > 0,
		'sticky2': !$('#topic').val() && !$('#post_content').val(),
		'front': pageUrl == 'forums.dropbox.com',
		'front2': true,
		'forum': pageUrl == 'forum.php',
		'forum2': true
	};
	var reloadDelay = GM_getValue(pageType + '-reload', 0);
	if(reloadIndex[pageType] && reloadDelay > 0) {
		setTimeout(function() {
			if(!settingsVisible && reloadIndex[pageType + '2'])
				document.location.reload();
			else
				reloadPage(pageType);
		}, reloadDelay * 1000);
	}
}

//Add icons to users
function addIcon(addTo) {
	if(pageUrl == 'topic.php') {
		if( typeof addTo == 'string')
			$('.threadauthor small a:contains("' + addTo + '")').parent().parent().find('strong').prepend(iconIndex[addTo]);
		else if( typeof addTo == 'number')
			$('.threadauthor small a[href$="=' + addTo + '"]').parent().parent().find('strong').prepend(iconIndex.empty);
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
function highlightPost() {
	var args = arguments;
	var color = args[args.length - 1];
	var rolePosts, status, message, totalPosts = $('.threadauthor').length;
	args[args.length - 1] = undefined;
	if(pageUrl == 'topic.php')
		for(var i in args) {
			if( typeof args[i] == 'string') {
				//Count posts
				rolePosts = $('.threadauthor p small a:contains("' + args[i] + '")').length;

				//Set highlighting status
				status = ((totalPosts > 5 && rolePosts / totalPosts > 0.2) || (totalPosts == 5 && rolePosts > 2) || (totalPosts < 5 && rolePosts > 1)) ? "disabled" : "enabled";

				//Display message above and below message thread
				message = '<li style="text-align: center;">Highlighting ' + status + ' for all ' + args[i] + 's</li>';
				$('#thread').prepend(message);
				$('#thread').append(message);

				//Highlight posts if enabled
				if(status == 'enabled')
					$('.threadauthor p small a:contains("' + args[i] + '")').parent().parent().parent().parent().find('.threadpost').css('background', color);
			} else if( typeof args[i] == 'number')
				$('.threadauthor small a[href$="=' + args[i] + '"]').parent().parent().parent().parent().find('.threadpost').css('background', color);
		}
}

//Collapse footer
function footerCollapse() {
	if(pageUrl != 'edit.php' && GM_getValue('footer-collapse') == 'yes') {
		//Style footer
		$('#footer').css({
			'border': '1px solid #bbb',
			'border-bottom': 'none',
			'border-radius': '25px 25px 0 0'
		});

		//Bring external content into footer, and wrap footer contents
		$('#footer').append($('span:last'));
		$('#footer').wrapInner('<div id="footercontent" />');

		//Add and style toggle animations
		$('#footer').prepend('<div id="footertoggle"><div id="footertogglearrow"></div></div>');
		$('#footertoggle').css({
			'height': '25px',
			'width': '100%',
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
			'margin': '5px',
			'position': 'static'
		});
	} else if(versionDate == 'original') {
		$('#main, #header').css('width', '866px');
		$('#header a:first img').attr('src', 'http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png');
	}
	if(['forums.dropbox.com', 'forum.php'].indexOf(pageUrl) > -1) {
		if(versionDate == '8.8.2012') {
			$('#latest th:eq(0) a').css('color', '#aaa');
			//TODO: latestHeader widths: 545, 46, 90, 69px
			$('.sticky, .super-sticky').css('background', '#f4faff');

			//Style table headers
			$('#forumlist th, #latest th').css({
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
			for(var i in tagList) {
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

/*
 * Helper functions
 */

function debugLayout(status) {
	if(status == 'enable') {
		$('body *').css({
			'border-style': 'solid',
			'border-width': '5px'
		});
		$('body').css('border-color', 'red');
		$('body *').css('border-color', 'orange');
		$('body * *').css('border-color', 'yellow');
		$('body * * *').css('border-color', 'green');
		$('body * * * *').css('border-color', 'blue');
		$('body * * * * *').css('border-color', 'purple');
		$('body * * * * * *').css('border-color', 'red');
		$('body * * * * * * *').css('border-color', 'orange');
		$('body * * * * * * * *').css('border-color', 'yellow');
		$('body * * * * * * * * *').css('border-color', 'green');
		$('body * * * * * * * * * *').css('border-color', 'blue');
		$('body * * * * * * * * * * *').css('border-color', 'purple');
	} else if(status == 'disable')
		$('body *').css('border', 'none');
}

function getPageUrl() {
	var url = window.location.href.split('?')[0];
	return url.split('/')[url.split('/').length - ((url[url.length - 1] == '/') ? 2 : 1)];
}

function versionSlug(ver) {
	if(ver.indexOf('pre') > -1)
		return (ver[ver.length - 1] == 'a' ? 'Nightly' : 'Beta') + ' Build ' + ver;
	else
		return 'v' + ver;
}

/*
 * Methods
 */