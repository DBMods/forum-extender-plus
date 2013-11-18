// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2013.10.28pre1a
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_deleteValue
// ==/UserScript==

//Set global variables
var pageUrl = getPageUrl();
var color = {
	green: '#b5ff90',
	lightGreen: '#daffc8',
	gold: '#fff19d',
	lightGold: '#fff8ce',
	red: '#ffd4d4',
	lightRed: '#ffe9e9'
}
var settingsVisible = false;

//Set up alerts
var alertSummary;

//Add footer
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Mod Icons ' + versionSlug(GM_info.script.version) + '</div>');

//Set up hover messages
$('body').prepend('<span id="modicon-message" style="display:none;border-width:1px;border-radius:5px;border-style:solid;position:fixed;top:10px;left:10px;padding:5px 10px;z-index:200" />');

//Modify Super User posts
addIcon('Super User', '<img src="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" height="16px" width="40px" />');
highlightPost('Super User', color.gold);
changeRole(1618104, 'Master of Super Users');

//Highlight posts by forum regulars green
highlightPost(6845, 3581696, 816535, 2122867, 434127, 85409, 1253356, 425513, color.green);

//Reskin the forums
forumVersion(GM_getValue('theme'));

//Flag threads
highlightThread(color.lightGreen, 1);
highlightThread(color.lightGold, 2);
highlightThread(color.lightRed, 3);

//Collapse footer
if (pageUrl != 'edit.php' && GM_getValue('footer-collapse') == 'yes') {
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
	$('#footer').prepend('<div id="footertoggle"><div id="footerarrowup" /><div id="footerarrowdown" style="display:none" /></div>');
	$('#footertoggle').css('height', '25px');
	$('#footerarrowup, #footerarrowdown').css({
		'height': '0',
		'width': '0',
		'border-left': '5px solid transparent',
		'border-right': '5px solid transparent',
		'margin': '12px auto 0'
	});
	$('#footerarrowup').css('border-bottom', '10px solid #bbb');
	$('#footerarrowdown').css('border-top', '10px solid #bbb');
	$('#footercontent').toggle();
	$('#footertoggle').click(function() {
		$('#footercontent').slideToggle('slow', function() {
			$('#footerarrowup, #footerarrowdown').toggle();
		});
	});
}

navBar();

//Reload pages
reloadPage('front');
reloadPage('forum');
reloadPage('sticky');

//Fix UI for new semi-broken theme 10-8-2013
$('#header').css('margin-top', '0');
$('#header .home, #header .breadcrumb').hide();
$('.freshbutton-blue, #postformsub').css('background', '#2180ce');
$('#header').append($('.search').clone());
$('#main .search').remove();
$('#forumlist-container').css('top', '0');

//Remove unnecessary stuff
if (pageUrl == 'topic.php')
	$('#post-form-title-container').remove();

//Detect and manage unstickied threads
if (pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length == 0 && $('#topic-info .topictitle:contains(") - ")').length > 0 && $('#topic-info .topictitle:contains(" Build - ")').length > 0) {
	var threadType = $('#topic-info .topictitle:contains(") - ")').html().split(') - ')[1].split(' Build - ')[0];
	if (confirm('This thread is no longer sticky. Would you like to attempt to find the latest ' + threadType.toLowerCase() + ' build thread?'))
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://forums.dropbox.com',
			onload: function(response) {
				var resp = response.responseText;
				var stickies = resp.split('<table id="latest">')[1].split('<td> ')[0].split(threadType)[0].split('<big><a href="');
				stickies = stickies[stickies.length - 1].split('">')[0];
				if (stickies != '')
					window.location.href = stickies;
			}
		});
}

//Add nav bar
function navBar() {
	//Add prerequsites
	$("head").append('<style type="text/css">#modicon-nav > span{margin-left:20px}#modicon-nav{position:fixed;bottom:0;height:30px;border-top:1px solid #aaf;width:100%;line-height:30px;padding:0 0 0 105px;background:#fff;z-index:10}#modicon-nav-slideout-container{margin:0 auto;border-bottom:1px solid #ddd}#modicon-nav-slideout-container > *{list-style-type:none;margin:30px auto;width:800px;text-align: center}#modicon-nav > span:hover{cursor:pointer}#modIcon-option-popup .clear{clear:both}#modIcon-option-popup div.left{float:left;width: 50px}#modIcon-option-popup div.right{float:right;padding-left:10px;width:50%;border-left:1px solid #ddd}#modIcon-option-popup{display:none;position:fixed;width:600px;height:200px;background:#fff;border:2px solid #cecece;z-index:200;padding:12px;font-size:13px}#modIcon-option-popup h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px}#modIcon-option-trigger:hover,#modIcon-option-close:hover{cursor:pointer}#modIcon-option-close{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block}</style>');
	$('body').append('<div id="modicon-nav"><img id="modIcon-option-trigger" src="https://2.gravatar.com/avatar/4a62e81113e89800386a9d9aab160aee?s=420" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-35px;z-index:11" /></div><div id="modIcon-screen-overlay" style="display:none;position:fixed;height:100%;width:100%;top:0;left:0;background:#000;border:1px solid #cecece;z-index:50;opacity:0.7;"></div>');
	$('body').append('<div id="modIcon-option-popup" style="position:fixed"><a id="modIcon-option-close">x</a><h1>Mod Icons Options</h1><br/><br/><div class="left"><select name="theme"><optgroup label="Original Themes"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></optgroup><optgroup label="Custom Themes"><optgroup label="-- No Existing Custom Themes --"></optgroup></optgroup></select><br/><input type="checkbox" name="collapseFooter" value="yes">Auto-collapse footer</input></div><div class="right">Reload front page every <select name="reloadFront"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload forum pages every <select name="reloadForums"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload stickies every <select name="reloadSticky"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select></div><br/><input type="button" tabindex="4" value="Save" id="modIcon-option-save" style="clear:both;float:right;"></div>');
	$('body').prepend('<div id="modicon-nav-slideout-container" />');
	$('body').css('padding-bottom', '31px');

	//Handle options
	$('#modIcon-option-trigger').click(function() {
		settingsVisible = true;
		var optionHeight = $('#modIcon-option-popup').height();
		var optionWidth = $('#modIcon-option-popup').width();

		$('#modIcon-option-popup').css({
			'top': (document.documentElement.clientHeight - optionHeight) / 2,
			'left': (document.documentElement.clientWidth - optionWidth) / 2
		});

		//Load current settings
		var settingDropdown = {
			'theme': GM_getValue('theme'),
			'reloadSticky': GM_getValue('sticky-reload'),
			'reloadForums': GM_getValue('forum-reload'),
			'reloadFront': GM_getValue('front-reload')
		};
		for (var name in settingDropdown) {
			if (settingDropdown[name])
				$('#modIcon-option-popup [name="' + name + '"] option[value="' + settingDropdown[name] + '"]').attr('selected', 'selected');
		}
		if (GM_getValue('footer-collapse'))
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
		settingsVisible = false;
		hoverMessage('Your settings have been saved.\n\nThe new settings won\'t take effect until the page is reloaded.');
	});

	//Add list content
	var resp;
	var profile = {
		list: [1618104, 11096, 175532, 561902, 30385, 67305, 857279, 643099, 182504, 1510497, 32911, 222573, 1588860],
		load: function(i) {
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'https://forums.dropbox.com/profile.php?id=' + profile.list[i],
				onload: function(response) {
					var resp = response.responseText;
					$('#modactivity li:eq(' + i + ')').html('<a href="https://forums.dropbox.com/profile.php?id=' + profile.list[i] + '">' + resp.split('<title>')[1].split(' &laquo;')[0] + '</a> - ' + ((resp.split('<h4>Recent Replies</h4>')[1].indexOf('<p>No more replies.</p>') > -1) ? 'never active' : 'last active ' + resp.split('<h4>Recent Replies</h4>')[1].split('<li>')[1].split('">')[2].split('</a>')[0]));
				}
			});
		}
	};

	//Add list framework
	$('#modicon-nav').append('<span id="modactivitytrigger">Activity</span>');
	$('#modicon-nav-slideout-container').append('<ul id="modactivity" />');
	$('#modactivity').toggle();
	$('#modactivitytrigger').click(function() {
		$('#modactivity').slideToggle();
	});
	for (i in profile.list) {
		$('#modactivity').append('<li>Loading . . .</li>');
		profile.load(i);
	}

	//Set up alert messages
	if (alertSummary) {
		$('#modicon-nav').append('<span id="modalerttrigger"><strong>Alert!</strong> ' + alertSummary.summary + '</span>');
		$('#modicon-nav-slideout-container').append('<div id="modalert" class="center">' + alertSummary.fullDesc + '</div>');
		$('#modalert').toggle();
		$('#modalerttrigger').click(function() {
			$('#modalert').slideToggle();
		});
	}

	//Add post templates
	if (pageUrl == 'topic.php' || pageUrl == 'edit.php') {
		var snippets = {
			blank: '<option value="">Select a snippet</option>',
			explainGroup: '<optgroup label="Explanations">',
			clientRunning: '<option value="Are you sure that the client is running? The client needs to be running for changes to sync.">Client running</option>',
			helpArticleGroup: '</optgroup><optgroup label="Help Center Links">',
			selectiveSync: '<option value="<a href=\'https://www.dropbox.com/help/175\'>Selective Sync</a>">Selective Sync</option>',
			sharedLink: '<option value="<a href=\'https://www.dropbox.com/help/167\'>shared links</a>">Shared links</option>',
			supportTicketGroup: '</optgroup><optgroup label="Support tickets">',
			ticketLink: '<option value="Submit a support ticket at https://www.dropbox.com/support">Submit a ticket</option>',
			ticketSummary: '<option value="Tickets typically take 1-3 business days to get a reply, priority given to Pro and Business users.\n\nYou can track the status of your tickets over at <a href=\'http://dropbox.zendesk.com\'>Zendesk</a>.">Ticket summary</option>',
			modEditGroup: '</optgroup><optgroup label="Mod edits">',
			removeEmail: '<option value="Edit: Email removed for security issues ~">Email removed</option>',
			moveThread: '<option value="I moved this to ' + ['everything else', 'bugs &amp; troubleshooting', 'feature requests', 'mobile apps', 'API development'][$('#forum-id').val() - 1] + ' for you.">Move thread</option>',
			dupeThread: '<option value="Duplicate post: ">Email removed</option>',
			miscGroup: '</optgroup><optgroup label="Miscellaneous">',
			welcome: '<option value="Also, I see you\'re new here, so why don\'t we give you a proper welcome.\n\nDropbox is a wonderful service, and we hope you get to use it to its full potential. If you have an issue, you can always check the <a href=\'https://www.dropbox.com/help\'>Help Center</a>, but if you don\'t get an answer there, or it\'s a more complicated issue, these forums are a great place to visit.\n\nHere on the forums, there are a lot of people just like you, who ask the occasional question. There\'s also a small handful of regulars here, including Super Users like myself. We try to answer as many questions as we can, and most of us are here on an almost-daily basis. I think I can speak for all of us a regulars when I say that we love to see newcomers to the service. The forums are a great place to both ask and answer questions, and if you have another question in the future, don\'t hesitate to ask.\n\nWelcome to Dropbox. We hope you like it.">Welcome</option>',
			miscGroupClose: '</optgroup>'
		};
		$('#modicon-nav').append('<span><select id="snippets" /></span>');
		for (i in snippets) {
			$('#snippets').append(snippets[i]);
		}
		$('#snippets').change(function() {
			$('#post_content').val($('#post_content').val() + $('#snippets').val());
		});
	}

	//Add post drafting
	if (pageUrl == 'topic.php') {
		var thread = window.location.href.split('id=')[1].split('&')[0].split('#')[0];
		$('#modicon-nav').append('<span id="modpostdraft">Draft Post</span><span id="modpostrestoredraft">Restore Draft</span>');
		$('#modpostdraft').click(function() {
			if ($('#post_content').val()) {
				GM_setValue('draft-' + thread, $('#post_content').val());
				hoverMessage('Draft saved');
			} else
				hoverMessage('Your draft has no content', 'info');
		});
		$('#modpostrestoredraft').click(function() {
			var draft = GM_getValue('draft-' + thread);
			if (draft) {
				$('#post_content').val(draft);
				GM_deleteValue('draft-' + thread);
				hoverMessage('Draft successfully restored');
			} else
				hoverMessage('You don\'t have a draft for this thread', 'info');
		});
	}
}

//Highlight forum threads based on post count
function highlightThread() {
	var args = arguments;
	$('#latest tr:not(.sticky, .super-sticky) td:nth-child(2)').each(function() {
		if ((args.length == 2 && parseInt($(this).html(), 10) == args[1]) || (parseInt($(this).html(), 10) >= args[1] && parseInt($(this).html(), 10) <= args[2]))
			$(this).parent().css('background', args[0]);
	});
}

//Add icons to users
function addIcon() {
	var args = arguments;
	if (pageUrl == 'topic.php') {
		if ( typeof args[0] == 'string')
			$('.threadauthor small a:contains("' + args[0] + '")').parent().parent().find('strong').prepend(args[1] + ' ');
		else if ( typeof args[0] == 'number')
			$('.threadauthor small a[href$="=' + args[0] + '"]').parent().parent().find('strong').prepend(args[1] + ' ');
	}
}

//Change role name
function changeRole(changeFor, newRole) {
	if (pageUrl == 'topic.php')
		if ( typeof changeFor == 'string')
			$('.threadauthor small a:contains("' + changeFor + '")').html(newRole);
		else if ( typeof changeFor == 'number')
			$('.threadauthor small a[href$="=' + changeFor + '"]').html(newRole);
}

//Reload pages
function reloadPage(pageType) {
	var reloadIndex = {
		'sticky': pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length > 0,
		'front': pageUrl == 'forums.dropbox.com',
		'forum': pageUrl == 'forum.php'
	};
	var reloadDelay = GM_getValue(pageType + '-reload', 0);
	if (reloadIndex[pageType] && reloadDelay > 0) {
		setTimeout(function() {
			if (!settingsVisible && (pageUrl == 'topic.php') ? !$('#post_content').val() : true)
				document.location.reload();
			else
				reloadPage(pageType);
		}, reloadDelay * 1000);
	}
}

//Highlight posts
function highlightPost() {
	var args = arguments;
	var color = args[args.length - 1];

	args[args.length - 1] = undefined;
	if (pageUrl == 'topic.php')
		var rolePosts, status, message, totalPosts = $('.threadauthor').length;
	for (var i in args) {
		if ( typeof args[i] == 'string') {
			//Count posts
			rolePosts = $('.threadauthor p small a:contains("' + args[i] + '")').length;

			//Set highlighting status
			status = ((totalPosts > 5 && rolePosts / totalPosts > 0.2) || (totalPosts == 5 && rolePosts > 2) || (totalPosts < 5 && rolePosts > 1)) ? "disabled" : "enabled";

			//Display message above and below message thread
			message = '<li style="text-align: center;">Highlighting ' + status + ' for all ' + args[i] + 's</li>';
			$('#thread').prepend(message);
			$('#thread').append(message);

			//Highlight posts if enabled
			if (status == 'enabled')
				$('.threadauthor p small a:contains("' + args[i] + '")').parent().parent().parent().parent().find('.threadpost').css('background', color);
		} else if ( typeof args[i] == 'number')
			$('.threadauthor small a[href$="=' + args[i] + '"]').parent().parent().parent().parent().find('.threadpost').css('background', color);
	}
}

//Skin forums
function forumVersion(versionDate) {
	var latestTr = $('#latest tr');
	if (versionDate == '8.8.2012') {
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
	} else if (versionDate == 'original') {
		$('#main, #header').css('width', '866px');
		$('#header a:first img').attr('src', 'http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png');
	}
	if (['forums.dropbox.com', 'forum.php'].indexOf(pageUrl) > -1) {
		if (versionDate == '8.8.2012') {
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
		} else if (versionDate == 'original') {
			$('#discussions').css('margin-left', '0');
			$('#forumlist-container').remove();
			$('#latest').css('width', '866px');
			$('#latest tr:not(:first), .bb-root').css('background', '#f7f7f7');
			$('#latest, .alt').css('background', '#fff');
			$('#latest').css('border-top', '1px dotted #ccc');
			$('.sticky, .super-sticky').css('background', '#deeefc');
		}
	} else if (pageUrl == 'forums.dropbox.com') {
		if (versionDate == 'original') {
			//Add tag list and reorder elements
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'love', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];
			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap"></p></div>');
			for (var i in tagList) {
				$('#frontpageheatmap').append('<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a>');
			}
			$('#frontpageheatmap a:not(:last)').append(' ');
			$('#forumlist').attr('id', 'forumlist-temp');
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist"></table><h2>Latest Discussions</h2>');
			$('#forumlist').html('<tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr>');
			for ( i = 1; i < 6; i++) {
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

function hoverMessage() {
	var args = arguments;
	var colorMap = {
		error: [color.lightRed, color.red],
		info: ['#dbf8ff', '#57d3ff'],
		success: ['#c4eca9', '#8fdb5c']
	};
	$('#modicon-message').hide();
	args[1] = args[1] || 'success';
	$('#modicon-message').css({
		'background': colorMap[args[1]][0],
		'border-color': colorMap[args[1]][1]
	});
	$('#modicon-message').html(args[0]);
	$('#modicon-message').fadeIn(400, function() {
		setTimeout(function() {
			$('#modicon-message').fadeOut();
		}, 5000);
	});
}

function getPageUrl() {
	var url = window.location.href.split('?')[0];
	return url.split('/')[url.split('/').length - ((url[url.length - 1] == '/') ? 2 : 1)];
}

function versionSlug(ver) {
	return (ver.indexOf('pre') > -1 ? ((ver[ver.length - 1] == 'a' ? 'Nightly' : 'Beta') + ' Build ') : 'v') + ver;
}

function getRandomNumber() {
	return 4;
	//Chosen by fair dice roll. Guaranteed to be random.
}

/*
 * Methods
 */