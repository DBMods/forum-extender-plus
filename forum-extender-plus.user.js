// ==UserScript==
// @name Dropbox Forum Extender+
// @namespace DropboxMods
// @description Beefs up the forums and adds way more functionality
// @include https://forums.dropbox.com/*
// @include https://www.dropboxforum.com/*
// @include https://www.techgeek01.com/dropboxextplus/beta/register.php*
// @include http://www.techgeek01.com/dropboxextplus/beta/register.php*
// @include https://techgeek01.com/dropboxextplus/beta/register.php*
// @include http://techgeek01.com/dropboxextplus/beta/register.php*
// @include http://localhost/dropboxextplus/register.php*
// @exclude https://www.dropboxforum.com/hc/admin/*
// @exclude https://www.dropboxforum.com/hc/user_avatars/*
// @version 2.7.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js
// @require https://github.com/DBMods/forum-extender-plus/raw/master/bin/js/helpList.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

'use strict';

//Set global variables
var fullUrl = window.location.href;
var domain = getDomain();
var lang = getLang();
var trimmedUrl = fullUrl.split('#')[0],
	strippedUrl = trimmedUrl.split('?')[0],
	slug = strippedUrl.split('https://www.dropboxforum.com/hc/' + lang + '/')[1] || strippedUrl.split(domain + '/')[1] || '',
	pageUrl = strippedUrl.substr(strippedUrl.lastIndexOf('/') + 1),
	urlVars = getUrlVars();
var modalCount = 0;
var syncWaitCount = 0;
var tmp, tmpb, i, l;

function getDomain() {
	var trim = fullUrl.split('://');
	return trim[0] + '://' + trim[1].split('/')[0];
}
function getLang() {
	if (fullUrl.indexOf('https://www.dropboxforum.com/hc/') !== 0) {
		return null;
	}
	return fullUrl.split('https://www.dropboxforum.com/hc/')[1].split('#')[0].split('/')[0].split('?')[0];
}

//Set color list
var color = {
	lightBlue: '#e7f2fc',
	dropboxBlue: '#007ee5',
	green: '#beff9e',
	lightGreen: '#daffc7',
	gold: '#fff19d',
	lightGold: '#fff8ce',
	lightRed: '#ffe9e9'
};

//Set up page parameters and list
var page = {
	front: new Url(''),
	posts: {
		list: new Url('community/posts'),
		sortedList: {
			activity: new WholeUrl('community/posts?sort_by=recent_activity'),
			create: new WholeUrl('community/posts?sort_by=created_at')
		},
		new: new Url('community/posts/new')
	},
	//unanswered: new Url('https://www.dropboxforum.com/hc/communities/public/questions/unanswered'),
	topic: {
		//list: new Url('https://www.dropboxforum.com/hc/communities/public/topics'),
		apiDev: new Url('community/topics/200209245-API-Development'),
		archBeta: new Url('community/topics/200324789-Archive-file-type-beta-community'),
		badgeBeta: new Url('community/topics/200329795-Badge-Beta-Community'),
		bugs: new Url('community/topics/200203389-Issues-Troubleshooting'),
		basicPro: new Url('community/topics/200204189-Dropbox-Basic-Pro'),
		carousel: new Url('community/topics/200211225-Carousel-Photos'),
		desktopClient: new Url('community/topics/200210355-Desktop-Client-Builds'),
		dfbe: new Url('community/topics/200284219-Dropbox-Business-Enterprise'),
		//everythingElse: new Url('https://www.dropboxforum.com/hc/communities/public/topics/200209235-Everything-Else'),
		feedback: new Url('community/topics/200209235-Product-Feedback'),
		//gettingStarted: new Url('https://www.dropboxforum.com/hc/communities/public/topics/200204189-Getting-Started'),
		mailbox: new Url('community/topics/200211215-Mailbox'),
		mobile: new Url('community/topics/200277665-Mobile'),
		mods: new Url('community/topics/200211775-Moderators-only'),
		//personal: new Url('community/topics/200204189-Your-Personal-Dropbox'),
		recents: new Url('community/topics/200330365-Recents')
		//deBugs: new Url('community/topics/200220199--DE-Fehler-und-Probleml%C3%B6sungen'),
		//deOther: new Url('community/topics/200229725--DE-Allgemeine-Fragen'),
		//esBugs: new Url('community/topics/200321729--ES-Problemas-y-resoluciones'),
		//esOther: new Url('community/topics/200321739--ES-Otros-temas'),
		//frBugs: new Url('community/topics/200303965--FR-Probl%C3%A8mes-et-r%C3%A9solution'),
		//frOther: new Url('community/topics/200294229--FR-Autres-sujets'),
		//ptBugs: new Url('community/topics/200321709--PT-Problemas-e-solu%C3%A7%C3%B5es'),
		//ptOther: new Url('community/topics/200321719--PT-Outros-assuntos')
	},
	isPost: slug.indexOf('community/posts/') > -1,
	isTopic: slug.indexOf('community/topics/') > -1
};

//Detect user login status and type
var loggedIn = $('#user-avatar').length > 0,
	userIsMod = $('#user-menu a:contains("Open agent interface")').length > 0,
	userUid = '';

//Cache body and head
var $body = $('body.community-enabled'),
	$head = $('head');

//Append necessary elements
$head.append('<style>@keyframes "spin"{from{transform:rotate(0deg);}to{transform:rotate(359deg);}}#gsDropboxExtenderNav{position:fixed;bottom:0;height:32px;border-top:1px solid #bbb;width:100%;line-height:30px;background:#fff;z-index:10;padding:0 0 0 105px}#gsDropboxExtenderNav > span{margin-left:20px}.gsDropboxExtenderHelpCenterLinkItem{padding:2px 10px}.gsDropboxExtenderHelpCenterLinkItem strong{color:#000}.gsDropboxExtenderHelpCenterLinkItem span{margin-left:16px}.gsDropboxExtenderHelpCenterLinkItem:hover{background:#439fe0;border-bottom:1px solid #2a80b9;padding-bottom:1px !important;cursor:pointer}.gsDropboxExtenderHelpCenterLinkItem:hover strong,.gsDropboxExtenderHelpCenterLinkItem:hover span{color:#fff !important}.clickable{cursor:pointer;color:#007ee5}.textinput{padding:0px !important}.alert-center{width:500px;position:absolute;left:50%;margin-left:-250px;z-index:1}.alert{max-width:500px;margin:20px auto;text-align:center;padding:15px;border:1px solid transparent;border-radius:4px;text-shadow:0 1px 0 rgba(255, 255, 255, 0.2);box-shadow:inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 1px 2px rgba(0, 0, 0, 0.5);-webkit-box-shadow:inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 1px 2px rgba(0, 0, 0, 0.5)}.alert p{margin-bottom:0}.alert-warning{background-color:rgba(252, 248, 227, 0.8);background-image:linear-gradient(to bottom, rgba(252, 248, 227, 0.8) 0%, rgba(248, 239, 192, 0.8) 100%);background-image:-webkit-linear-gradient(top, #fcf8e3 0%, #f8efc0 100%);background-repeat:repeat-x;border-color:#f5e79e;color:rgba(138, 109, 59, 0.8)}.alert-danger{background-color:rgba(242, 222, 222, 0.8);background-image:linear-gradient(to bottom, rgba(242, 222, 222, 0.8) 0%, rgba(231, 195, 195, 0.8) 100%);background-image:-webkit-linear-gradient(top, #f2dede 0%, #e7c3c3 100%);background-repeat:repeat-x;border-color:#dca7a7;color:rgba(169, 68, 66, 0.8)}.alert-success{background-color:rgba(223, 240, 216, 0.8);background-image:linear-gradient(to bottom, rgba(223, 240, 216, 0.8) 0%, rgba(200, 229, 188, 0.8) 100%);background-image:-webkit-linear-gradient(top, #dff0d8 0%, #c8e5bc 100%);background-repeat:repeat-x;border-color:#b2dba1;color:rgba(60, 118, 61, 0.8)}.alert-info{background-color:rgba(217, 237, 247, 0.8);background-image:linear-gradient(to bottom, rgba(217, 237, 247, 0.8) 0%, rgba(185, 222, 240, 0.8) 100%);background-image:-webkit-linear-gradient(top, #d9edf7 0%, #b9def0 100%);background-repeat:repeat-x;border-color:#9acfea;color:rgba(49, 112, 143, 0.8)}</style>');
$body.append('<div id="gsDropboxExtenderModalContainer" style="position:fixed" /><div id="gsDropboxExtenderNav"><a class="clickable"><img id="gsDropboxExtenderLogo" src="https://raw.githubusercontent.com/DBMods/forum-extender-plus/master/bin/img/plus-sync-logo.png" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-33px;z-index:11" /></a><span id="gsDropboxExtenderSyncIcon" style="position:fixed;left:65px;bottom:-15px;z-index:12"></span><span><a href="' + page.posts.sortedList.activity.value + '">All posts by activity</a></span><span><a href="' + page.posts.sortedList.create.value + '">All posts by create date</a></span><span><a href="https://www.dropboxforum.com/hc/en-us/community/posts/201168809-Dropbox-Forum-Extender-for-Greasemonkey">Official thread</a></span><span id="gsDropboxExtenderMessageContainer"><a id="gsDropboxExtenderMessageLink" href="https://www.techgeek01.com/dropboxextplus/index.php" target="blank">Messages</a><span id="gsDropboxExtenderMsgCounter"></span></span><span style="font-weight:bold;display:none">Important Notice: The messaging system has been updated. If you have previously registered, please trash your preferences and register again.</span></div>').css('padding-bottom', '33px');

//Default synced icon to false until we can connect to the user's config
manageSynced(false);

//Main lement caching
var $postForm = $('form.comment-form'),
	$postField = $('#community_comment_body'),
	$thread = $('section.answers'),
	$threadAuthor = $('.answer-meta'),
	$userRole = $threadAuthor.find('small a'),
	$latest = $('main'),
	$latestQuestions = $latest.find('div.post-overview'),
	$navBar = $('#gsDropboxExtenderNav');
//var $forumList = $('.community-nav .pinned-categories');

//Add version number
$latest.append('<div style="text-align: center; font-size: 11px;">Dropbox Forum Extender+ v' + GM_info.script.version + '</div>').css('margin-top', '14px');
$latest.find('nav.community-nav').css('padding-top', '14px');

if (page.isPost) {
	//Resize the text box
	$postField.css('height', '250px');

	//Bypass TinyMCE text box - Props to Zendesk for making this nearly impossible to do
	$postField.attr('name', 'niceTry-Zendesk');
	$postField.on('focus', function() {
		$postField.attr('name', 'community_comment[body]');
		$postField.show();
		$postField.off('focus');
	});
}

highlightPost('.moderator', color.gold, 'Super User');
//highlightPost(500, color.green, 'Forum regular');
//highlightPost(100, color.lightGreen, 'New forum regular');

/*function highlightPost(check, color, label) {
	//Sanity check
	if ((typeof check === 'number' || typeof check === 'string') && typeof color === 'string') {
		var selectors = {
			'string': ':contains("' + check + '")',
			'number': function() {
				return parseInt($(this).parent().parent().html().split('Posts: ')[1], 10) >= check;
			}
		}, $postList = $userRole.filter(selectors[typeof check]).filter(':not(.checkedHighlight)'), rolePosts = $postList.length;
		label = label || check;
		if (rolePosts) {
			$postList.addClass('checkedHighlight');

			//Enable highlighting if post count doesn't exceed the 60% threshold
			var totalPosts = $threadAuthor.length, highlightingEnabled = !(totalPosts > 1 && rolePosts / totalPosts > 0.6), message = '<li style="text-align: center;">' + label + ' highlighting ' + (highlightingEnabled ? 'enabled' : 'disabled') + '</li>';
			if (highlightingEnabled) {
				$postList.parent().parent().parent().parent().find('.threadpost').css('background', color);
			}

			//Append message
			if (typeof label === 'string') {
				$thread.prepend(message).append(message);
			}
		}
	}
}*/
function highlightPost(check, color, label, threshold) {
	threshold = threshold || false;
	label = label || false;
	if (page.isPost && typeof check === 'string' && typeof color === 'string' && (typeof label === 'boolean' || typeof label === 'number') && (typeof threshold === 'boolean' || typeof threshold === 'number')) {
		var $targets = $('.comment .comment-avatar' + check).parent();
		var status = !threshold || $targets.length / $('.comment').length <= threshold;

		if (status) {
			$targets.css('background', color);
		}

		//Append message
		if (label) {
			var msg = '<div>' + label + 'highlighting ' + (status ? 'en' : 'dis') + 'abled</div>';
			$('#comments').before(msg).after(msg);
		}
	}
}

//Highlight threads
$latestQuestions.filter('.post-pinned').css('background', color.lightBlue);
highlightThread(1, color.lightGreen);
highlightThread(2, color.lightGold);
highlightThread(3, color.lightRed);

function highlightThread() {
	var args = arguments;

	//Sanity check
	if (page.isTopic && typeof args[0] === 'number' && typeof args[args.length - 2] === 'number' && typeof args[args.length - 1] === 'string') {
		var $threadList = $latestQuestions.filter(':not(.post-pinned)').find('.post-overview-count:eq(0) strong'), content;
		i = $threadList.length;
		while (i--) {
			content = parseInt($threadList.eq(i).html(), 10);
			if (content >= args[0] - 1 && content <= args[args.length - 2] - 1) {
				$threadList.eq(i).parent().parent().addClass('nochange').css('background', args[args.length - 1]);
			}
		}
	}
}

//Clone pagination to the top of the page for easier navigation
$('div.comment-sorter').before($('nav.pagination').clone());

//Style pagination
$('nav.pagination').css({
	'width': '643px',
	'margin': '25px 0'
});

//Emphasize new replies to threads you've interacted with FIXME Fix thread activity highlighting
var postNumbers = GM_getValue('postNumbers', []);

if (page.isPost) {
	$postForm.on('submit', function() {
		var d = new Date(), today = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
		if (GM_getValue('date', 0) < today) {
			//If we're starting a new day, flush all old threads, and start over
			GM_setValue('date', today);
			GM_setValue('todayThreads', [strippedUrl]);
			GM_setValue('postNumbers', [parseInt($('.post-stats .comment-count').html().split(' ')[0], 10) + 1]);
		} else if (GM_getValue('date') === today) {
			//Otherwise, add the current thread ID to the list
			var todayThreads = GM_getValue('todayThreads', []);
			if (todayThreads.indexOf(strippedUrl) === -1) {
				//Add thread ID to list
				todayThreads.push(strippedUrl);
				GM_setValue('todayThreads', todayThreads.toString());
			}
			//Add post count for tracking purposes
			postNumbers[todayThreads.indexOf(strippedUrl)] = parseInt($('.post-stats .comment-count').html().split(' ')[0], 10) + 1;
		}
	});
}
if (page.posts.list.active || page.isTopic) {
	var todayThreads = GM_getValue('todayThreads', '').split(','),
		$threadPageList = $latest.find('div.post-overview:not(.post-pinned) .post-overview-info');

	//Filter list to only those threads posted on today
	i = todayThreads.length;
	while (i--) {
		tmp = $threadPageList.find('a[href^="' + todayThreads[i] + '"]');
		if (tmp.length && parseInt(tmp.parent().parent().find('.post-overview-count:nth-child(1)'), 10) != postNumbers[i]) {
			//If thread was posted on today, check if post count is different, and emphasize if needed
			tmp.parent().find('a, span.meta-group').css('padding-left', '50px');
		}
	}
}

//Modify user tags TODO Rewrite user tagging for new forums
//$userRole.filter('[href$="=1618104"]').html('Master of Super Users');

//Detect and manage unstickied threads FIXME Fix sticky managing
if ($('#topic-info .topictitle:contains(") - "):contains(" Build - ")').length) {
	var stickyList = GM_getValue('stickies', '').split(',');
	if ($('#topic_labels .sticky').length) {
		if (stickyList.indexOf(urlVars.id) === -1) {
			//If this thread is currently sticky, and is not monitored, start monitoring it
			stickyList.push(urlVars.id);
			GM_setValue('stickies', stickyList.toString());
		}
	} else if (stickyList.indexOf(urlVars.id) > -1) {
		//If this thread is not sticky, but was monitored, offer to load a new one
		stickyList.splice(stickyList.indexOf(urlVars.id), 1);
		GM_setValue('stickies', stickyList.toString());

		var threadType = $('#topic-info .topictitle').html().split(') - ')[1].split(' Build - ')[0];
		showModal({
			buttons: ['Yes', 'No'],
			title: 'Find newer sticky?',
			content: 'This thread is no longer sticky. Would you like to attempt to find the latest ' + threadType.toLowerCase() + ' build thread? Regardless of your preference, you will not be reminded for this thread again.',
			action: function() {
				GM_xmlhttpRequest({
					method: 'GET',
					url: page.front,
					onload: function(response) {
						var newSticky = $(response.responseText).find('td:contains("' + threadType + '") big a');
						if (newSticky.length) {
							window.location.href = newSticky.eq(0).attr('href');
						}
					}
				});
			}
		});
	}
}

/*
 * Forum post handlers
 */

/*
//Append the posting form if necessary
//NOTE Posting form appending not necessary, unless a new forum system makes it so
if (page.isPost && !$postForm.length) {
	$.get($('h2.post-form a').attr('href'), function(data) {
		$('#main').append($(data).find('#postform'));
		$('#post-form-title-container').remove();
		$('h2.post-form').html('Reply');
		addMarkupLinks();
	}, 'html');
} else {
	addMarkupLinks();
}*/

if (page.isPost) {
	$postField.before('<div id="gsDropboxExtenderPostExtras" />');

	$('.comment-vote.vote, .post-follow').append(' - <a class="gsDropboxExtenderQuoteSelected" href="javascript:void(0)">Quote Selected</a> - <span class="gsDropboxExtenderQuotePost clickable">Quote Post</span>');
	$('#gsDropboxExtenderPostExtras').append('<span><span class="gsDropboxExtenderLinkInsert clickable">a</span> - <span class="gsDropboxExtenderImgInsert clickable">img</span> - <span class="gsDropboxExtenderBlockquoteSelected clickable">blockquote</span> - <span class="gsDropboxExtenderStrongSelected clickable">bold</span> - <span class="gsDropboxExtenderEmSelected clickable">italic</span> - <span class="gsDropboxExtenderCodeSelected clickable">code</span> (<span class="gsDropboxExtenderQuoteCodeSelected clickable">quoted</span>) - <span class="gsDropboxExtenderListInsert clickable">ordered list</span> - <span class="gsDropboxExtenderListInsert clickable">unordered list</span><span id="siglink" style="display:none"> - <span class="gsDropboxExtenderSignatureInsert clickable">custom signature</span></span></span>');

	//Quoting
	$('.gsDropboxExtenderQuotePost').on('click', function(evt) {
		var $postContainer = $(evt.target).parent().parent();
		if ($postContainer.hasClass('post-footer')) {
			//If we're in the post footer of a post, back out one more element
			//The post quoting needs 3 .parent() calls to get to the post itself, as opposed to 2 for comments
			$postContainer = $postContainer.parent();
		}

		var selectedText = $.trim($postContainer.find('.comment-body, .post-body').eq(0).html());
		//Regex here will match paragraph and break tags, as well as a link's rel attribute
		selectedText = selectedText.replace(/( rel="(nofollow|noreferrer)?( (nofollow|noreferrer))?")|(<(\/?p|br( ?\/)?)>)/g, '');
		insertSelectedQuote(selectedText, getPostAuthorDetails(evt.target));
	});
	$('.gsDropboxExtenderQuoteSelected').on('click', function(evt) {
		//Regex here will match paragraph and break tags, as well as a link's rel attribute
		insertSelectedQuote(getSelectedHtml().replace(/( rel="(nofollow|noreferrer)?( (nofollow|noreferrer))?")|(<(\/?p|br( ?\/)?)>)/g, ''), getPostAuthorDetails(evt.target));
	});

	//Markup text
	$('.gsDropboxExtenderBlockquoteSelected, .gsDropboxExtenderStrongSelected, .gsDropboxExtenderEmSelected, .gsDropboxExtenderCodeSelected').on('click', function() {
		insertAndMarkupTextAtCursorPosition($(this).attr('class').split('gsDropboxExtender')[1].split('Selected')[0].toLowerCase());
	});
	$('.gsDropboxExtenderQuoteCodeSelected').on('click', function() {
		insertAndMarkupTextAtCursorPosition('blockquote', 'code');
	});

	//Insert a list
	$('.gsDropboxExtenderListInsert').on('click', function() {
		var listType = $(this).html().split(' ')[0];
		showModal({
			buttons: ['Add', 'OK'],
			title: 'Add List',
			content: '<' + listType[0] + 'l id="gsDropboxExtenderListBox" style="padding-left:16px"></' + listType[0] + 'l><br /></div><div><div style="clear:both;height:20px;"><label style="float:left;">Item: </label><input id="gsDropboxExtenderListBoxTextBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" />',
			heightMod: [false, '#gsDropboxExtenderListBox li:last'],
			action: function() {
				var content = '</' + listType[0] + 'l>', $elems = $('#gsDropboxExtenderListBox li');
				i = $elems.length;
				while (i--) {
					content = '<li>' + $elems.eq(i).html() + '</li>' + content;
				}
				content = '<' + listType[0] + 'l>' + content;

				insertTextAtCursorPosition(content);
				$postField.setCursorPosition($postField[0].selectionStart + content.length);
			},
			actionTwo: function() {
				if ($('#gsDropboxExtenderListBoxTextBox').val()) {
					$('#gsDropboxExtenderListBox').append('<li>' + $('#gsDropboxExtenderListBoxTextBox').val() + '</li>');
					$('#gsDropboxExtenderListBoxTextBox').val('');
				}
			}
		});
	});

	//Insert a link
	$('.gsDropboxExtenderLinkInsert').on('click', function() {
		//FIXME Text boxes used to be 16px - Padding needs to be fixed
		showModal({
			buttons: ['Add'],
			title: 'Add Link',
			content: '<div style="clear:both;height:20px"><label style="float: left;">Title: </label><input id="gsDropboxExtenderAnchorTextBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" /></div><div style="clear: both; height: 20px;"><label style="float:left;">Url: </label><input id="gsDropboxExtenderAnchorUrlBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" /></div>',
			action: function() {
				insertTextAtCursorPosition('<a href="' + $('#gsDropboxExtenderAnchorUrlBox').val() + '">' + $('#gsDropboxExtenderAnchorTextBox').val() + '</a>');
			}
		});
	});

	//Insert an image
	$('.gsDropboxExtenderImgInsert').on('click', function() {
		//FIXME Text boxes used to be 16px - Padding needs to be fixed
		showModal({
			buttons: ['Add'],
			title: 'Add Image',
			content: '<div style="clear:both;height:20px"><input id="gsDropboxExtenderImgUrlBox" class="textinput" placeholder="Image source" type="text" size="100" style="height:22px;width:300px" /></div><div style="clear:both;height:20px"><input id="gsDropboxExtenderImgAltBox" class="textinput" placeholder="Alt text" type="text" size="100" style="height:22px;width:300px" /></div>',
			action: function() {
				insertTextAtCursorPosition('<img src="' + $('#gsDropboxExtenderImgUrlBox').val() + '" alt="' + $('#gsDropboxExtenderImgAltBox').val() + '" />');
			}
		});
	});

	//Insert help center links with @n like a total badass
	//Manage popup suggestion menu TODO Make this sufficiently fast, then remove debug timer (promises?)
	$postField.after('<div id="gsDropboxExtenderHelpCenterFlyout" style="display:none;color:#aaa;background:white;border:1px solid #eee"><div id="gsDropboxExtenderHelpCenterFlyoutHeader" style="background:#f3f3f3;padding:5px 10px;font-size:11px;font-family:Arial">Help Center Links</div><div id="gsDropboxExtenderHelpCenterLinkContainer" style="max-height:133.75px;overflow-y:scroll" /></div>');
	$('#gsDropboxExtenderHelpCenterFlyout').css('width', $postField.css('width'));

	$postField.on('input', function() {
		var ta = new Date().getTime();
		var beforeCursor = $postField.val().substring(0, $postField[0].selectionStart);

		var match = beforeCursor.match(/(^|[^\w])@\d*$/g); //Everybody stand back! I know regular expressions
		if (match) {
			match = match + '';
			match = match.split('@').pop() || '';
			var tb = new Date().getTime();
			var arr = Object.keys(helpList);
			var items = [];
			/*for (i = 0, l = arr.length; i < l; i++) {
				if (arr[i].indexOf(match) === 0) {
					items.push('<div class="gsDropboxExtenderHelpCenterLinkItem"><strong>' + arr[i] + '</strong><span>' + helpList[arr[i]] + '</span></div>');
				}
			}*/
			for (i = 0, l = arr.length; i < l; i++) {
				if (arr[i].indexOf(match) === 0) {
					items.push(i);
				}
			}
			items = items.map(function(num) {
				return '<div class="gsDropboxExtenderHelpCenterLinkItem"><strong>' + items[num] + '</strong><span>' + helpList[items[num]] + '</span></div>';
			});
			$('#gsDropboxExtenderHelpCenterLinkContainer').html(items.join(''));
			var tc = new Date().getTime();
			var tt = tc - tb;
			console.log('Loop executed in ' + tt + 'ms');
			if (items) {
				//Show autocomplete list only if there are items in it
				$('.gsDropboxExtenderHelpCenterLinkItem').click(function() {
					var item = $(this).find('strong').html();
					var text = item.substring(match.length, item.length);

					var afterCursor = $postField.val().substring($postField[0].selectionStart, $postField.val().length);
					if (afterCursor.length && afterCursor[0].match(/\w/)) {
						//If the cursor isn't at the end of a file, and there's not already a non-word character after the match, add a space after it
						text += ' ';
					}

					insertTextAtCursorPosition(text);
					$('#gsDropboxExtenderHelpCenterFlyout').hide();
				});
				$('#gsDropboxExtenderHelpCenterFlyout').show();
			}
			var td = new Date().getTime();
			tt = td - ta;
			console.log('Change executed in ' + tt + 'ms');
		} else {
			$('#gsDropboxExtenderHelpCenterFlyout').hide();
		}
	});

	$postForm.find('.comment-container .comment-form-controls input[type="submit"]').on('click', function() {
		$postField.val($postField.val().replace(/(^|[^\w])@(\d+)/g, '<a href="https://www.dropbox.com/help/$2">https://www.dropbox.com/help/$2</a>'));
	});
}

//Add custom pages by swapping out 404s
makePage('credits', 'A Special Thanks', '<p>This project has been in ongoing development since May of 2013, and I could not have done it without the help of a select few individuals. I\'d like to give a special thanks to those that have helped contribute to the script in some way.</p><p><strong>Nathan Cheek</strong> - Co-development of message system, and side development of userscript<br><span style="display:inline-block;padding-left:5em;color:#bbb">Also, for claiming he knows nothing about UI design, and leaving me to design a graphical interface from scratch ;)</span><br><strong>Raymond Ma</strong> - Side development of userscript and CDN links to resources<br><span style="display:inline-block;padding-left:5em;color:#bbb">Quite a lot of work for a guy that\'s only like, 16 :)</span><br><strong>Richard Price</strong> - Inspiration for all of the features, and permission to incorporate the old Forum Extender into the script<br><span style="display:inline-block;padding-left:5em;color:#bbb">The same Forum Extender he probably wrote on whatever Windows phone or tablet he had at the time :)</span><br><br><strong>Chris Jones</strong> - Extensive error reporting and debugging of the script before pushing early versions to the public<br><br><strong>Ed Giansante</strong> - Helping with gathering resources, and not <em>always</em> sitting behind a desk and doing nothing :)<br><span style="display:inline-block;padding-left:5em;color:#bbb">Oh, hi dee di dee di dee di dee di dee di dee di!</span><br><br><strong>XKCD</strong> - Providing inspiration for the many easter eggs hidden within the code<br><span style="display:inline-block;padding-left:5em;color:#bbb">Random number: ' + getRandomNumber() + '</span></p>');
makePage('authhelp', 'Authenticate Dropbox Forum Extender+', '<p>In order for the Dropbox API to authenticate, the request must be sent from specific URLs defined for the app. However, the URL has to match exactly, down to the anchors or parameters passed into the page. This is why, for example, if your front page URL is <code>https://www.dropboxforum.com/fc/en-us?flash_digest=k5m3 ...</code>, you will be prompted to go to the front page to authenticate. The URLs do not match, and as such, will not work.</p><p>When you authenticate with the Dropbox API, this gives the Forum Extender+ extension access to its own folder. From this folder, it will read and write to config files it uses to store data. Simply put, this allows you to set preferences, snippets, even post drafts, and no matter what you do in the script config, it will sync to your Dropbox. This allows every installation of the userscript that you\'ve linked to access this data as well, and so your preferences will travel between conputers.</p><p>For convenience, you can also authenticate the script straight from this page by clicking <span class="dropboxlink clickable">here</span>.</p>');

//makePage(slug, title, [head,] content)
function makePage() {
	//Set up vars
	var args = arguments;
	var slug = args[0], title = args[1];
	var content = args[args.length = 1];
	var head = args.length === 4 ? args[2] : title;

	//Sanity check
	if (pageUrl === slug && typeof title === 'string' && typeof content === 'string') {
		var $cont = $('.segment__container .error-page');

		//Remove junk
		$cont.find('h2').remove();
		$cont.find('a').remove();
		$cont.find('.error-page__image').remove();
		$cont.find('p').remove();

		//Add page title
		$cont.find('h1').html(title);
		$cont.find('head title').html(head + ' - Dropbox Forums');
		$cont.append(content);

		//Left-align paragraphs
		$cont.find('p').css('text-align', 'left');
	}
}

/*
 * Work with Dropbox Core API
 */

var client = new Dropbox.Client({key: '7c1z8hgsri89yhp'});

//Attempt to finish OAuth authorization
client.authenticate({
	interactive: false
}, function(error) {
	if (error) {
		console.log('Auth error. Retrying');
		document.location.reload();
	}
});

//Shorthand for getting length of an object TODO Move this to helper functions?
function len(obj) {
	return Object.keys(obj).length;
}

function read(file, Deferred) {
	//Sanity check
	if (file && typeof file === 'string') {
		console.log('Reading from file "' + file + '"');
		client.readFile(file, function(error, data) {
			if (error) {
				console.log('Error reading ' + file + ': ' + showError(error));
				Deferred.resolve({});
			} else {
				Deferred.resolve(JSON.parse(data));
			}
		});
	} else {
		//Throw error on invalid filename
		console.log('Error reading file: Invalid filename');
	}
}

function write(file, obj, callback) {
	//Sanity check
	if (file && typeof file === 'string') {
		//If object is not empty, write to file, otherwise, delete it
		manageSynced(false);
		console.log('Writing to file "' + file + '"');
		if (Object.keys(obj).length) {
			client.writeFile(file, JSON.stringify(obj), function(error, stat) {
				if (error) {
					console.log('Error writing ' + file + ': ' + showError(error));
					return;
				}
				if (callback) {
					callback();
				}
				manageSynced(true);
			});
		} else {
			syncWaitCount--;
			if (callback) {
				remove(file, callback);
			} else {
				remove(file);
			}
		}
	} else {
		//Throw error on invalid filename
		console.log('Error writing file: Invalid filename');
	}
}

function remove(file, callback) {
	//Sanity check
	if (file && typeof file === 'string') {
		manageSynced(false);
		console.log('Removing file "' + file + '"');
		client.remove(file, function(error) {
			if (error) {
				console.log('Error removing ' + file + ': ' + showError(error));
			}
			if (callback) {
				callback();
			}
			manageSynced(true);
		});
	} else {
		//Throw error on invalid filename
		console.log('Error removing file: Invalid filename');
	}
}

function showError(e) {
	switch (e.status) {
		case Dropbox.ApiError.INVALID_TOKEN:
			//If you're using dropbox.js, only cause is the user token expired
			//Get the user through authentication flow again
			return 'Bad token';

		case Dropbox.ApiError.NOT_FOUND:
			//File or folder is not in user's Dropbox
			return 'File not found';

		case Dropbox.ApiError.OVER_QUOTA:
			//User is over quota - Refreshing won't help
			return 'User over quota';

		case Dropbox.ApiError.RATE_LIMITED:
			//Too many API requests. Tell the user to try again later.
			//Long term, optimize code to use fewer API calls
			return 'Too many API calls';

		case Dropbox.ApiError.NETWORK_ERROR:
			//An error occurred at the XMLHttpRequest layer
			//Most likely, user's network connection is down
			//API calls will not succeed until user is back online
			return 'Network error';

		case Dropbox.ApiError.INVALID_PARAM:
			return 'Invalid parameters';

		case Dropbox.ApiError.OAUTH_ERROR:
			return 'OAuth Authentication error';

		case Dropbox.ApiError.INVALID_METHOD:
			return 'Invalid method';

		default:
			//Caused by a bug in dropbox.js, in the application, or in Dropbox
			//Tell user error occurred, ask to refresh page
			return 'Default dropbox.js error';
	}
}

if (client.isAuthenticated()) {
	console.log('Authed Core API');

	//Grab UID
	userUid = client.dropboxUid();

	/*
	 * Messaging system data querying
	 */

	//Query data
	var prefsFile = new $.Deferred();
	read('prefs', prefsFile);
	var draftsFile = new $.Deferred();
	read('drafts', draftsFile);
	var snippetsFile = new $.Deferred();
	read('snippets', snippetsFile);
	var configFile = new $.Deferred();
	read('config', configFile);

	$.when(prefsFile, draftsFile, snippetsFile, configFile).done(function(prefs, drafts, snippets, config) {
		console.log('Loaded all files');
		manageSynced(true);

		//Grab key data
		var token = config.token;
		var theme = prefs.theme;

		//Apply theme, if there is any set
		if (theme) {
			if (document.readyState === 'complete') {
				forumVersion(theme);
			} else {
				window.onload = function() {
					forumVersion(theme);
				};
			}
		}

		//Custom signature
		var sig = prefs.signature;
		if (sig) {
			$('#siglink').show();
			$('.gsDropboxExtenderSignatureInsert').on('click', function() {
				$postField.setCursorPosition($postField.val().length);
				insertTextAtCursorPosition('\n\n--\n' + sig);
			});
		}

		//Auto reload Pages
		reloadPage('Front');
		reloadPage('Forum');
		reloadPage('Sticky');

		function reloadPage(pageType) {
			var reloadIndex = {
				'Sticky': page.isPost && $('article.post.post-pinned').length,
				'Front': page.posts.list.active,
				'Forum': page.isTopic
			};
			var reloadDelay = prefs['reload' + pageType];
			if (reloadIndex[pageType] && reloadDelay != '0') {
				setTimeout(function() {
					if (modalCount === 0 && !$postField.val()) {
						document.location.reload();
					} else {
						reloadPage(pageType);
					}
				}, reloadDelay * 1000);
			}
		}

		if (page.isPost) {
			//Add post snippets
			$('h3.answer-list-heading').css('margin-top', '5px');
			$('#gsDropboxExtenderPostExtras').append('<br><span id="gsDropboxExtenderPostExtras-inner"><select id="snippets"><option name="default" value="">' + (len(snippets) ? 'Select a snippet' : 'You don\'t have any snippets') + '</option><optgroup label="--Snippets--" /></select></span>');

			tmp = [];
			for (i in snippets) {
				if (snippets.hasOwnProperty(i)) {
					tmp.push($('<option />', {
						text: i,
						value: snippets[i]
					}));
				}
			}
			$('#snippets optgroup').append(tmp);

			$('#snippets').change(function() {
				if ($(this).val()) {
					insertTextAtCursorPosition($(this).val());
					$(this).val('');
				}
			});

			//Manage drafts
			var thread = strippedUrl;
			$('#gsDropboxExtenderPostExtras-inner').append(' - <span id="modpostdraft" class="clickable">Draft Post</span> - <span id="modpostrestoredraft" class="clickable">Restore Draft</span>');
			$('#modpostdraft').on('click', function() {
				if ($postField.val()) {
					drafts[thread] = $postField.val();
					$postField.focus();
					write('drafts', drafts, function() {
						hoverMsg('success', 'Draft saved');
					});
				} else {
					hoverMsg('info', 'Your draft has no content');
				}
			});
			$('#modpostrestoredraft').on('click', function() {
				if (drafts[thread]) {
					$postField.val(drafts[thread]);
					delete drafts[thread];
					$postField.focus();
					write('drafts', drafts, function() {
						hoverMsg('success', 'Draft successfully restored');
					});
				} else {
					hoverMsg('info', 'You don\'t have a draft for this thread');
				}
			});
		}

		//Redefine page
		if (pageUrl === 'authhelp') {
			$('.segment__container .error-page p').remove();
			$('.segment__container .error-page').append('<p style="text-align:center">Looks like you\'re all set! <a href="' + page.front.value + '">Take me home!</a></p>');
		}

		/*
		 * Preferences
		 */

		//Manage Preferences
		$('#gsDropboxExtenderLogo').on('click', function() {
			var reloadTimeList, reloadTimes = [0, 30, 60, 120, 300, 600, 900, 1200, 1800, 2700, 3600];
			for (i = 0, l = reloadTimes.length; i < l; i++) {
				reloadTimeList += '<option value="' + reloadTimes[i] + '">' + (reloadTimes[i] ? (reloadTimes[i] < 60 ? (reloadTimes[i] + ' seconds') : ((reloadTimes[i] / 60) + ' minute' + (reloadTimes[i] > 60 ? 's' : ''))) : 'Never') + '</option>';
			}

			showModal({
				buttons: ['OK', 'Cancel'],
				title: 'Preferences',
				content: '<span id="gsDropboxExtenderSnippetManager" class="clickable">Snippet manager</span><br><br><textarea class="gsDropboxExtenderPrefItem" name="signature" placeholder="Signature" rows="5" style="width:100%"></textarea><br><br>Forum theme <select class="gsDropboxExtenderPrefItem" name="theme"><option value="">No theme</option><option value="8.8.2012">8.8.2012 Original forum revamp</option></select><br><br>Reload front page every <select class="gsDropboxExtenderPrefItem" name="reloadFront">' + reloadTimeList + '</select><br>Reload forum pages every <select class="gsDropboxExtenderPrefItem" name="reloadForum">' + reloadTimeList + '</select><br>Reload stickies every <select class="gsDropboxExtenderPrefItem" name="reloadSticky">' + reloadTimeList + '</select><br><br><button id="deleteprefs">Trash Preferences</button><button id="deletedrafts">Trash Drafts</button><br><br><a href="https://www.dropboxforum.com/hc/' + lang + '/credits">Script credits and thanks</a>',
				dimm: [500, 750],
				init: function() {
					//Load current settings
					var pref, $elemList = $('.gsDropboxExtenderPrefItem'), $elem;
					for (i = 0, l = $elemList.length; i < l; i++) {
						$elem = $elemList.eq(i);
						pref = prefs[$elem.attr('name')];
						if (pref) {
							if ($elem.is('select')) {
								$elem.find('option[value="' + pref + '"]').attr('selected', 'selected');
							} else if ($elem.is('texarea')) {
								$elem.val(pref);
							} else if ($elem.is('input[type="checkbox"]')) {
								$elem.prop('checked', pref);
							}
						}
					}

					//Other buttons
					$('#deleteprefs').on('click', function() {
						remove('prefs', function() {
							hoverMsg('warning', 'Preferences trashed.');
						});
						prefs = {};
					});
					$('#deletedrafts').on('click', function() {
						remove('drafts', function() {
							hoverMsg('warning', 'Drafts trashed.');
						});
						drafts = {};
					});

					//Handle snippet manager
					$('#gsDropboxExtenderSnippetManager').on('click', function() {
						showModal({
							buttons: ['Close'],
							title: 'Snippet Manager',
							content: '<select id="snippetlist"><option value="">' + (len(snippets) ? 'Select a snippet' : 'You don\'t have any snippets') + '</option></select>&nbsp;&nbsp;<button id="loadsnippet" class="btn btn-success">Load</button><button id="deletesnippet" class="btn btn-danger">Delete</button><button id="clearsnippet" class="btn btn-primary">Clear form</button><br><br><input type="hidden" id="oldname" value="" /><input id="friendlyname" type="textbox" style="width:100%" placeholder="Friendly name"/><br><textarea id="snippetfull" placeholder="Snippet text" rows="9" style="width:100%"></textarea><button id="savesnippet" class="btn btn-success">Save</button>',
							dimm: [450, 800],
							init: function() {
								//Load list of snippets
								if (len(snippets)) {
									tmp = '';
									for (i in snippets) {
										if (snippets.hasOwnProperty(i)) {
											tmp += '<option value="' + i + '">' + i + '</option>';
										}
									}
									$('#snippetlist').append(tmp);
								}

								$('#loadsnippet').on('click', function() {
									if ($('#snippetlist').html() !== '') {
										$('#friendlyname, #oldname').val($('#snippetlist').val());
										$('#snippetfull').val(snippets[$('#snippetlist').val()]);
									}
								});
								$('#deletesnippet').on('click', function() {
									if ($('#snippetlist').html() !== '') {
										delete snippets[$('#snippetlist').val()];
										$('#snippetlist option[value="' + $('#snippetlist').val() + '"]').remove();

										//If we're deleting the last snippet, change the default select text, and delete the file
										if (!len(snippets)) {
											$('#snippetlist option[value=""]').html('You don\'t have any snippets');
										}
										//Save to user's Dropbox
										write('snippets', snippets, function() {
											hoverMsg('warning', 'Snippet deleted');
										});
										$('#friendlyname, #snippetfull').val('');
									}
								});
								$('#clearsnippet').on('click', function() {
									$('#oldname, #friendlyname, #snippetfull').val('');
								});

								$('#savesnippet').on('click', function() {
									$('#snippetlist option[value=""]').html('Select a snippet');
									if ($('#friendlyname').val() !== '' && $('#snippetfull').val() !== '') {
										var targetName = $('#oldname').val() === '' ? $('#friendlyname').val() : $('#oldname').val();
										if (snippets[targetName]) {
											//If the snippet exists, delete and recreate
											delete snippets[targetName];
											if ($('#oldname').val() !== '') {
												$('#snippetlist option[value="' + $('#oldname').val() + '"]').val($('#friendlyname').val()).html($('#friendlyname').val());
											}
										}

										//Then, save the new value, sort the list, and save the list to user's list
										snippets[$('#friendlyname').val()] = $('#snippetfull').val();
										tmp = Object.keys(snippets).sort();

										//Sort object alphabetically by property name
										tmpb = snippets;
										snippets = {};
										for (i = 0, l = tmp.length; i < l; i++) {
											snippets[tmp[i]] = tmpb[tmp[i]];
										}
										write('snippets', snippets, function() {
											hoverMsg('success', 'Snippet saved.');
										});

										//Update dropdown
										tmp = '<option value="">' + $('#snippetlist option').eq(0).html() + '</option>';
										for (i in snippets) {
											if (snippets.hasOwnProperty(i)) {
												tmp += '<option value="' + i + '">' + i + '</option>';
											}
										}
										$('#snippetlist').html(tmp);

										//Empty the form, and display success message
										$('#friendlyname, #snippetfull, #oldname').val('');
									} else {
										hoverMsg('danger', 'Please fill out both fields.');
									}
								});
							}
						});
					});
				},
				action: function() {
					$('.gsDropboxExtenderPrefItem').each(function() {
						prefs[$(this).attr('name')] = $(this).is('input[type="checkbox"]') ? $(this).prop('checked') : $(this).val();
					});
					write('prefs', prefs, function() {
						hoverMsg('success', 'Your preferences have been saved.');
					});
				}
			});

			///$('#main .topline').html('<a href="snippets">Manage your snippets here!</a><br><br><textarea name="signature" placeholder="Signature" rows="5" style="width:100%"></textarea><br><br><select name="theme"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></select><br><input type="checkbox" id="collapseFooter" name="collapseFooter" /> <label for="collapseFooter" style="font-weight:normal">Automatically collapse footer</label><br><br>Reload front page every <select name="reloadFront">' + reloadTimeList + '</select><br>Reload forum pages every <select name="reloadForum">' + reloadTimeList + '</select><br>Reload stickies every <select name="reloadSticky">' + reloadTimeList + '</select><br><br><select id="modIcon" name="modIcon"><option value="https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/nyancatright.gif" selected="selected">Nyan Cat (Default)</option></select>&nbsp;<img id="modIconPreview"/><br><br><button class="btn btn-success" id="save">Save</button><button class="btn btn-warning btn-right" id="deleteprefs">Trash Preferences</button><button class="btn btn-warning btn-right" id="deletedrafts">Trash Drafts</button>');

			//Mod icons TODO Remove mod icons?
			/*
			var modIconList = ['Dropbox Flat', 'Dropbox Flat Green', 'Dropbox Flat Lime', 'Dropbox Flat Gold', 'Dropbox Flat Orange', 'Dropbox Flat Red', 'Dropbox Flat Pink', 'Dropbox Flat Purple', 'Dropbox', 'Dropbox Green', 'Dropbox Lime', 'Dropbox Gold', 'Dropbox Orange', 'Dropbox Red', 'Dropbox Pink', 'Dropbox Purple', 'Gold Star'];
			tmp = '';
			for (i = 0, l = modIconList.length; i < l; i++) {
				tmp += '<option value="https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/' + modIconList[i].toLowerCase().replace(' ', '') + '.png">' + modIconList[i] + '</option>';
			}
			$('#modIcon').append(tmp);*/

			//$('#modIconPreview').attr('src', $('#modIcon').val());

			/*$('#modIcon').change(function() {
				$('#modIconPreview').attr('src', $('#modIcon').val());
			});*/
		});

		/*
		 * Messaging
		 */

		if (userUid) {
			//If the message system is returning a token, log it
			if (urlVars.msgtoken) {
				var tokenval = urlVars.msgtoken;
				var redirUrl = fullUrl.indexOf('?msgtoken=') > -1 ? fullUrl.split('?msgtoken=')[0] : fullUrl.split('&msgtoken=')[0]; //Grab redirect URL
				config.userToken = tokenval;

				//Save token, and reload the page
				write('config', config, function() {
					window.location.href = redirUrl;
				});
			}

			token = config.userToken || '';
			var msgFormAction;

			//If user token not present, check if user is registered, and repond appropriately with form action
			if (!token) {
				GM_xmlhttpRequest({
					method: 'GET',
					url: ('https://www.techgeek01.com/dropboxextplus/check-uid.php?uid=' + userUid),
					onload: function(response) {
						var resp = response.responseText;
						if (resp === 'Pass') {
							msgFormAction = '';
							//Bad auth, offer to fix
							$('#gsDropboxExtenderMessageContainer form').html('<input type="hidden" name="uid" value="' + userUid + '" />');
							if (resp != 'Bad UID') {
								$('#gsDropboxExtenderMessageContainer form').append('<input type="hidden" name="uToken" value="' + token + '" />');
							}
							$('#gsDropboxExtenderMessageContainer form').attr('action', 'https://www.techgeek01.com/dropboxextplus/fix-auth.php');
							$('#gsDropboxExtenderMsgCounter').html(' (Bad auth. Click to fix)');
						} else {
							msgFormAction = '<input type="hidden" name="action" value="create-account" />';
						}
					}
				});
			}

			//Handle messages FIXME This will be broken once private UIDs are assigned
			/*$('article.post .post-footer, .comment .comment-vote.vote').append('<img src="https://github.com/DBMods/forum-extender-plus/raw/master/bin/img/send-envelope.png" style="height:12px;position:relative;top:1px;margin-left:1.2rem;" /> <span class="gsDropboxExtenderMessageUser clickable">Message User</a>');
			$('article.post .post-footer .post-follow').css('margin-right', '0.4rem');
			$('.gsDropboxExtenderMessageUser').click(function(evt) {
				showModal({
					buttons: ['Send'],
					title: 'Message User',
					content: '<form id="gsDropboxExtenderMessageForm" action="https://www.techgeek01.com/dropboxextplus/process-message.php" method="post"><input type="hidden" name="userToken" value="' + token + '" />' + msgFormAction + '<input name="msgto" id="gsDropboxExtenderMsgTo" type="textbox" style="width:100%" placeholder="Recipient" value="' + getUserId(evt.target) + '"/><br><input name="msgfrom" id="gsDropboxExtenderMsgFrom" type="hidden" value = "' + userId + '"/><textarea name="msgtext" id="gsDropboxExtenderMsgText" style="width:100%" placeholder="Message"></textarea><input type="hidden" name="returnto" id="gsDropboxExtenderMsgReturnLocation" value="' + fullUrl + '" /></form>'
				});
			});*/

			$('#gsDropboxExtenderMessageContainer').prepend('<form style="display:none" action="https://www.techgeek01.com/dropboxextplus/index.php" method="post"><input type="hidden" name="userToken" value="' + token + '" />' + msgFormAction + '<input type="hidden" name="returnto" value="' + fullUrl + '" /><input type="hidden" name="userid" value="' + userUid + '" /><input type="hidden" name="timeOffset" value="' + new Date().getTimezoneOffset() + '" /></form>');
			$('#gsDropboxExtenderMessageLink').remove();
			$('#gsDropboxExtenderMessageContainer').prepend('<span id="gsDropboxExtenderMessageLink" class="clickable">Messages</span>');

			$('#gsDropboxExtenderMessageLink').on('click', function() {
				$('#gsDropboxExtenderMessageContainer form').submit();
			});


			(function pollServer() {
				if (token) {
					GM_xmlhttpRequest({
						method: 'GET',
						url: ('https://www.techgeek01.com/dropboxextplus/count-messages.php?to=' + userUid + '&token=' + token),
						onload: function(response) {
							var resp = response.responseText;
							if (resp != 'Bad auth' && resp != 'Bad UID') {
								//Display message count
								$('#gsDropboxExtenderMsgCounter').html(resp > 0 ? (' (' + resp + ')') : '');
							} else {
								//Bad auth, offer to fix
								$('#gsDropboxExtenderMessageContainer form').html('<input type="hidden" name="uid" value="' + userUid + '" />');
								if (resp != 'Bad UID') {
									$('#gsDropboxExtenderMessageContainer form').append('<input type="hidden" name="uToken" value="' + token + '" />');
								}
								$('#gsDropboxExtenderMessageContainer form').attr('action', 'https://www.techgeek01.com/dropboxextplus/fix-auth.php');
								$('#gsDropboxExtenderMsgCounter').html(' (Bad auth. Click to fix)');
							}
						}
					});
					setTimeout(pollServer, 20000);
				}
			})();
		}

		/*
		 * Message system registration
		 */

		console.log(domain);
		console.log(slug);
		console.log(pageUrl);
		if ((domain.indexOf('techgeek01.com') > 0 || domain === 'http://localhost') && slug.indexOf('dropboxextplus/') === 0 && pageUrl === 'register.php') {
			console.log($('#content h1').eq(0).html());
			if ($('#content h1').eq(0).attr('data-status') === 'loading') {
				//We're on register page, so append form info if we haven't already submitted a form
				$('#content').html('<h1>Register Your Account</h1>')
					.append('<p>In order to properly link the messaging system to your Dropbox account, we need to make sure it\'s really you. To do this, we will need to collect your email.</p>')
					.append('<p>Please be aware that the Forum Extender+ script, nor this message system are affiliated with Dropbox in any way. Your email will be used only for verifying your identity.</p>')
					.append('<p>Do you wish to continue with registration?</p>')
					.append('<span class="buttongroup"><a href="javascript:void(0)" id="registerConsent" class="button blue">Yes, proceed</a><a href="https://www.dropboxforum.com" class="button">No, get me out of here!</a></span>');

				$('#registerConsent').click(function() {
					$('#content .buttongroup').html('<a href="javascript:void(0)" class="button blue">Getting email, please wait</a><a href="javascript:void(0)" class="button grayed">No, get me out of here!</a>');
					client.getAccountInfo(function(err, accountInfo) {
						if (err) {
							console.log('AccountInfo error: ' + err);
							return;
						}
						$('#content').html('<h1>Register Your Account</h1>')
							.append('<p>It appears your Dropbox is associated with the email <strong>' + accountInfo.email + '</strong>. Is this the correct account to link?</p>')
							.append('<span class="buttongroup"><a href="javascript:void(0)" id="registerConfirm" class="button blue">Yes, proceed</a><a href="https://www.dropboxforum.com" class="button">No, get me out of here!</a></span>');

						$('#registerConfirm').click(function() {
							$('#content').html('<h1>Register Your Account</h1>')
								.append('<p>Please fill out the registration form below to complete registration.</p>')
								.append('<form action="register.php" method="post"><input type="hidden" name="userid" value="' + userUid + '" /><input name="email" type="text" placeholder="Dropbox Email" value="techgeek01help@gmail.com" readonly /><br /><input name="username" type="text" placeholder="Username" maxlength="60" required /><br /><input name="password" type="password" placeholder="Password" required /><br /><input name="passwordagain" type="password" placeholder="Confirm password" required /><br /><button class="button blue">Create account</button></form>');
						});
					});
				});
			}
		}

		/*
		 * Aesthetics
		 */

		 //Collapse footer TODO Rewrite footer collapsing if we ever use it again
		 /*if ($(window).height() + $('#footer').height() < $(document).height() && collapseFooter.length && collapseFooter[0].get('value')) {
			 //Style footer
			 $('#footer').css({
				 'border': '1px solid #bbb',
				 'border-bottom': 'none',
				 'border-radius': '25px 25px 0 0'
			 }).append($('span:contains("Protected by Arash")')).wrapInner('<div id="footercontent" />').prepend('<div id="footertoggle"><div id="footerarrowup" /><div id="footerarrowdown" style="display:none" /></div>');
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
			 $('#footertoggle').css('height', '25px').on('click', function() {
				 $('#footercontent').slideToggle('slow', function() {
					 $('#footerarrowup, #footerarrowdown').toggle();
				 });
			 });
		 }*/

		 //Super User icons TODO: Rewrite this for new forums
		 //var modIcon = prefTable.query({preference: 'modIcon'});
		 //$userRole.filter(':contains("Super User")').parent().parent().find('strong').find('img').attr('src', modIcon.length ? modIcon[0].get('value') : 'https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/nyancatright.gif');
	});
} else {
	console.log('Core API not authed');
	console.log(pageUrl);

	if (strippedUrl.indexOf('https://www.dropboxforum.com') === 0) {
		//If we're on the forums, append link to navbar
		$navBar.append(page.front.active ? '<span class="dropboxlink clickable">Link to Dropbox</span>' : '<span>You haven\'t linked to Dropbox yet. You can do so from the <a href="' + page.front.value + '">front page</a></span>.');
	} else if (slug.indexOf('dropboxextplus/') === 0 && pageUrl === 'register.php') {
		//Otherwise, if we're working with the message system, append notice to page

		if (domain === 'http://localhost' || domain.indexOf('techgeek01.com') > 0) {
			//Local testing, or secure protocol, so let user do their thing
			$('#content').html('<h1>Register Your Account</h1><p>The userscript is installed and running, but in order to properly register, you need to <span class="dropboxlink clickable">link it to Dropbox</span>.</p>');
		} else {
			//Not a secure protocol, so the Dropbox API will not auth
			var newUrl = 'https://' + strippedUrl.split('://')[1];
			$('#content').html('<h1>Register Your Account</h1><p>The userscript is installed and running, but the Dropbox API disallows authentication over http. Click <a href="' + newUrl + '">here</a> to fix that.</p>');
		}
	}

	//Start authentication process
	$('.dropboxlink').on('click', function(e) {
		e.preventDefault();
		client.authenticate();
	});
}

/*
 * Graphics handling
 */

//Fix header logo height - sticks over header
$('header.header .logo a').css('height', '115px');

//Front page and topic page question list styles
//For some reason, appending a style to the head element doesn't work here, so we have to style things as they load
$('body').on('DOMNodeInserted', '.question-list li', function() {
	$(this).css('padding', '15px 20px');
	$(this).find('.question-title').css('margin', '0');
	$(this).find('.question-meta').css({
		'padding': '0 20px',
		'top': '15px'
	});
}).on('DOMNodeInserted', '.question-list li .question-meta p', function() {
	$(this).css({
		'position': 'relative',
		'top': '-5px'
	});
});
$latestQuestions.css('padding', '15px 20px').find('.question-title').css('margin', '0').parent().find('.question-meta').css({
	'padding': '0 20px',
	'top': '15px'
}).find('p').css({
	'position': 'relative',
	'top': '-5px'
});

//Skin forums
function forumVersion(versionDate) {
	//Sanity check
	if (typeof versionDate !== 'string') {
		console.log('Invalid theme name');
		return;
	}

	//Amazon link https://forum-extender-plus.s3-us-west-2.amazonaws.com/forumsheader.jpg
	if (versionDate === '8.8.2012') {
		$latest.css({
			'width': '990px',
			'margin': '0 auto',
			'background': 'url(https://github.com/DBMods/forum-extender-plus/raw/master/bin/img/forumheader.jpg) no-repeat center top'
		});

		//Move annoucement to nav bar, and add home link
		$('#gsDropboxExtenderNav').append('<span class="annoucement">Important updates on Carousel and Mailbox - <a href="https://www.dropboxforum.com/hc/en-us/articles/207049853-Important-updates-on-Carousel-and-Mailbox-">Learn more</a></span>');
		$('#gsDropboxExtenderNav a:first').after('<span><a href="' + page.front.value + '">Take me home!</a></span>');

		//Remove large header block and  annoucement
		$('div.segment.segment--hero, div.segment.segment--announcement').remove();

		//Set up header and floats
		$latest.prepend('<div id="header" class="clearfix" />');
		$('#header').css('height', '94px');

		//Append user login nav
		var $langChange = $('.dropdown.language-selector .dropdown-menu a'), userNav;
		if (loggedIn) {
			userNav = 'Welcome, <a href="/hc/requests?community_id=public">' + $('#user-name').html() + '</a>';
			userNav += ' | <a href="https://www.dropbox.com/help" target="_blank">Help</a>';
			if (userIsMod) {
				userNav += ' | <a href="/access/return_to?return_to=https://dropboxforum.zendesk.com/agent" target="_blank">Admin</a>';
			}
			userNav += ' | <a href="' + $langChange.attr('href') + '">' + $langChange.html() + '</a>';
			userNav += ' | <a href="/access/logout">Log Out</a>';
		} else {
			var loginBtn = $('a.login');
			userNav = 'Welcome. <a href="' + loginBtn.attr('href') + '">Log in</a>';
			userNav += ' | <a href="https://www.dropbox.com/help" target="_blank">Help</a>';
			userNav += ' | <a href="' + $langChange.attr('href') + '">' + $langChange.html() + '</a>';
		}
		$('#header').append('<span id="greet">' + userNav + '</span>');
		$('#header a').css({
			'text-decoration': 'none',
			'color': '#1f75cc'
		});
		$('#greet').css({
			'float': 'left',
			'clear': 'none',
			'font-size': '12px',
			'font-weight': 'normal'
		});

		//Append logo
		/*$('#header').append('<a id="logoLink" href="' + page.front.value + '"><svg width="140px" height="120px"></svg></a>');
		$('#logoLink').html('<svg width="143px" height="165px" viewBox="1.536 14.451 3.535 2.695">' + $('#header-logo svg#logo').html() + '</svg>');
		$('#logoLink g#text').remove();
		$('#logoLink').css({
			'float': 'left',
			'position': 'absolute',
			'top': '-25px',
			'left': '50%',
			'margin-left': '-66px'
		});*/

		//Append search form
		$('#header').append('<form class="search" method="get" action="' + $('form.search').attr('action') + '" accept-charset="UTF-8" />');
		$('header').remove();
		$('form.search').html('<input id="q" size="14" style="height:28px;width:170px;margin-right:3px"></input><input class="bluebutton" type="button" style="height:30px;width:101px" value="Search »"></input>');
		$('form.search').css({
			'float': 'right',
			'clear': 'none'
		});

		//Style tables
		if (page.front.active || page.isTopic) {
			//Cache topic block list
			var $topics = $('#categories-list h3.categories-list__title, #topic-overview li a h3');

			if (page.front.active) {
				//Set up data for topic list
				var desc = {
					'basicPro': ['Dropbox Basic & Pro', ''],
					'desktopClient': ['Desktop Client Builds', 'All things desktop client!'],
					'dfbe': ['Dropbox Business & Enterprise', ''],
					'apiDev': ['API Development', 'Questions relating to our API'],
					'archBeta': ['Archive File Type Beta Community', ''],
					'badgeBeta': ['Badge Beta Community', ''],
					'carousel': ['Carousel & Photos', ''],
					'bugs': ['Bugs & Troubleshooting', 'Tell us what\'s wrong'],
					'mailbox': ['Mailbox', ''],
					'mobile': ['Mobile', ''],
					'mods': ['Moderators Only', 'A place for Super Users to discuss stuff'],
					'feedback': ['Profuct Feedback', ''],
					'recents': ['Recents', '']
				};
				//Create width topic list on front page
				var forumList = new ThemedTable('forumlist', ['Topic', 'Posts', 'Followers'], ['690px', '150px', '150px']);

				var names = Object.keys(desc);
				for (i = 0, l = desc.length; i < l; i++) {
					addTopicItem(forumList, names[i]);
				}
				/*forumList.add(['<a href="' + page.topic.basicPro.value + '">Dropbox Basic & Pro</a>', topicData('Dropbox Basic & Pro', 'posts'), topicData('Dropbox Basic & Pro', 'followers')]);
				forumList.add(['<a href="' + page.topic.desktopClient.value + '">Desktop Client Builds</a><span>All things desktop client!</span>', topicData('Desktop Client Builds', 'posts'), topicData('Desktop Client Builds', 'followers')]);
				forumList.add(['<a href="' + page.topic.dfbe.value + '">Dropbox Business & Enterprise</a>', topicData('Dropbox Business & Enterprise', 'posts'), topicData('Dropbox Business & Enterprise', 'followers')]);
				forumList.add(['<a href="' + page.topic.apiDev.value + '">API Development</a><span>Questions relating to our API', topicData('API Development', 'posts'), topicData('API Development', 'followers')]);
				forumList.add(['<a href="' + page.topic.archBeta.value + '">Archive File Type Beta Community</a>', topicData('Archive file type beta community', 'posts'), topicData('Archive file type beta community', 'followers')]);
				forumList.add(['<a href="' + page.topic.badgeBeta.value + '">Badge Beta Community</a>', topicData('Badge Beta Community', 'posts'), topicData('Badge Beta Community', 'followers')]);
				forumList.add(['<a href="' + page.topic.carousel.value + '">Carousel & Photos</a>', topicData('Carousel & Photos', 'posts'), topicData('Carousel & Photos', 'followers')]);
				forumList.add(['<a href="' + page.topic.bugs.value + '">Bugs & Troubleshooting</a><span>Tell us what\'s wrong</span>', topicData('Issues & Troubleshooting', 'posts'), topicData('Issues & Troubleshooting', 'followers')]);
				forumList.add(['<a href="' + page.topic.mailbox.value + '">Mailbox</a>', topicData('Mailbox', 'posts'), topicData('Mailbox', 'followers')]);
				forumList.add(['<a href="' + page.topic.mobile.value + '">Mobile</a>', topicData('Mobile', 'posts'), topicData('Mobile', 'followers')]);
				if (userIsMod) {
					forumList.add(['<a href="' + page.topic.mods.value + '">Moderators Only</a><span>A place for Super Users to discuss stuff</span>', topicData('Moderators only', 'posts'), topicData('Moderators only', 'followers')]);
				}
				forumList.add(['<a href="' + page.topic.feedback.value + '">Product Feedback</a>', topicData('Product Feedback', 'posts'), topicData('Product Feedback', 'followers')]);
				forumList.add(['<a href="' + page.topic.recents.value + '">Recents</a>', topicData('Recents', 'posts'), topicData('Recents', 'followers')]);*/

				//Replace front page fancy list with table
				$latest.find('div.segment .segment__container').html(forumList.value);
			} else {
				//TODO: Sidebar topic list on topic pages

				//Append thread list to
				var topicHeader = '<span style="float:left">Topic — <a href="' + page.posts.new.value + '" style="font-style:italic">Add New »</a></span><span style="float:right">Sort by:';
				var sorts = $('.community-sub-nav ul li');
				for (i = 0, l = sorts.length; i < l; i++) {
					topicHeader += ' ' + sorts.eq(i).html();
				}
				topicHeader += '</span>';
				//$('.community-sub-nav').remove();
				var topicList = new ThemedTable('latest', [topicHeader, 'Posts', 'Last Poster', 'Freshness'], ['547px', '48px', '92px', '71px']);
				var topics = $('.question-list li.question:not(.sticky-post)');
				var topic, topicMeta, title, posts, last, freshness;
				for (i = 0, l = topics.length; i < l; i++) {
					topic = topics.eq(i);
					topicMeta = topic.find('.question-meta');

					title = topic.find('.question-title').html();
					posts = parseInt(topicMeta.find('.question-answers').html(), 10) + 1;
					last = topicMeta.find('.question-author').html();
					freshness = topicMeta.find('.question-published').html().split(' ago')[0];

					topicList.add([title, posts, last, freshness]);
				}
				$('#rfloat').append(topicList.value);
				$('#latest th a').css({
					'color': '#ccc',
					'font-weight': 'normal'
				});
				$('#latest a').css('text-decoration', 'none');
				$('#latest td:nth-child(1) a, #latest td:nth-child(2), #latest td:nth-child(4)').css('color', '#1f75cc');
				$('#latest td:not(:nth-child(1))').css('font-size', '11px');
				$('.question-list').hide();
			}
			//$('.community-nav').remove();
			$('#forumlist a').css({
				'color': '#1f75cc',
				'text-decoration': 'none'
			});
			$('#forumlist tr:not(:first)').css('line-height', '17px');
			$('#forumlist td span').css({
				'font-size': '11px',
				'padding-left': '15px',
				'color': '#aaa'
			});

			$('body').on('DOMNodeInserted', '.question-list li.sticky-post', function() {
				var $topic, $topicMeta, title, posts, last, freshness;
				$topic = $(this);
				$topicMeta = $topic.find('.question-meta');

				title = '[sticky] ' + $topic.find('.question-title').html().replace('★	', '');
				posts = '';
				last = '';
				freshness = '';

				topicList.sticky([title, posts, last, freshness]);
				$('#latest').html($(topicList.value).html());
				$('#latest td:nth-child(1) a, #latest td:nth-child(2), #latest td:nth-child(4)').css('color', '#1f75cc');
				$('#latest tr td:not(:nth-child(1))').css('font-size', '11px');
				$('#latest tr.sticky td:nth-child(1)').css('font-size', '14px');
				$('#latest th a').css({
					'color': '#ccc',
					'font-weight': 'normal'
				});
				$('#latest a').css('text-decoration', 'none');
			}).on('DOMNodeInserted', '#latest tr p', function() { //Get rid of those pesky admin user details that mess up our tables
				$(this).remove();
			});/*.on('DOMSubtreeModified', '#latest td:nth-child(4) time', function() {
				if ($.contains(this, ' ago')) {
					$(this).html($(this).html().split(' ago')[0]);
				}
			});*/
		} else {
			$('#header').css('height', '174px');
		}
	} /*else if (versionDate === '8.8.2013') {
		//Reformat header
		$latest.css({
			'width': '990px',
			'margin': '0 auto',
			'background': 'url(https://github.com/DBMods/forum-extender-plus/raw/master/bin/img/forumheader.jpg) no-repeat center top'
		});

		if (page.front.active || page.isTopic) {
			$latest.prepend('<div class="lfloat" style="float:left"><h2>Forums</h2></div><div class="rfloat" style="float:right"><h2>Latest Discussions</h2></div>');
			$('.lfloat h2, .rfloat h2').css({
				'line-height': '15px',
				'margin': '0 0 19px',
				'font-size': '17px',
				'font-weight': 'bold',
				'color': '#555'
			});
		}

		//Set up header and floats
		$latest.prepend('<div id="header" class="clearfix" />');
		$('#header').css('height', '94px');

		//Append user login nav
		var $langChange = $('.dropdown.language-selector .dropdown-menu a'), userNav;
		if (userUid) {
			userNav = 'Welcome, <a href="/hc/requests?community_id=public">' + $('#user-name').html() + '</a>';
			userNav += ' | <a href="https://support.zendesk.com/forums/22315622" target="_blank">Help</a>';
			if ($('#user-menu a:contains("Open agent interface")').length > 0) {
				userNav += ' | <a href="/access/return_to?return_to=https://dropboxforum.zendesk.com/agent" target="_blank">Admin</a>';
			}
			userNav += ' | <a href="' + $langChange.attr('href') + '">' + $langChange.html() + '</a>';
			userNav += ' | <a href="/access/logout">Log Out</a>';
		} else {
			var loginBtn = $('a.login');
			userNav = 'Welcome. <a href="' + loginBtn.attr('href') + '">Log in</a>';
			userNav += ' | <a href="' + $langChange.attr('href') + '">' + $langChange.html() + '</a>';
		}
		$('#header').append('<span id="greet">' + userNav + '</span>');
		$('#header a').css({
			'text-decoration': 'none',
			'color': '#1f75cc'
		});
		$('#greet').css({
			'float': 'left',
			'clear': 'none',
			'font-size': '12px',
			'font-weight': 'normal'
		});

		//Append logo
		$('#header').append('<a id="logoLink" href="' + page.front.value + '"></a>');
		$('#logoLink').html($('.logo img').clone().attr('id', 'logoIcon'));
		$('#logoLink').css({
			'float': 'left',
			'position': 'relative',
			'top': '28px',
			'left': '-278px'
		});

		//Append search form
		$('#header').append('<form class="search" method="get" action="' + $('form.search').attr('action') + '" accept-charset="UTF-8" />');
		$('header').remove();
		$('form.search').html('<input id="q" size="14" style="height:28px;width:170px;margin-right:3px"></input><input class="bluebutton" type="button" style="height:30px;width:101px" value="Search »"></input>');
		$('form.search').css({
			'margin': '0',
			'padding': '0',
			'position': 'relative',
			'top': '-7px'
		});

		//Style tables
		if (page.front.active || page.isTopic) {
			var forumList = new ThemedTable('forumlist', ['Name'], '210px');
			forumList.add(['<a href="' + page.topic.gettingStarted.value + '">Getting Started</a>']);
			forumList.add(['<a href="' + page.topic.bugs.value + '">Bugs & Troubleshooting</a><br /><span>Tell us what\'s wrong</span>']);
			forumList.add(['<a href="' + page.topic.desktopClient.value + '">Desktop Client Beta</a><br /><span>All things Desktop Client Beta!</span>']);
			forumList.add(['<a href="' + page.topic.apiDev.value + '">API Development</a><br /><span>Questions relating to our API</span>']);
			forumList.add(['<a href="' + page.topic.everythingElse.value + '">Everything Else</a><br /><span>For stuff that doesn\'t fit elsewhere</span>']);
			forumList.add(['<a href="' + page.topic.mailbox.value + '">Mailbox</a>']);
			forumList.add(['<a href="' + page.topic.carousel.value + '">Carousel</a>']);
			$('#lfloat').append(forumList.value);
			$('.community-nav').remove();
			$('#forumlist a').css({
				'color': '#1f75cc',
				'text-decoration': 'none'
			});
			$('#forumlist tr:not(:first)').css('line-height', '17px');
			$('#forumlist td span').css('font-size', '11px');

			var topicHeader = '<span style="float:left">Topic — <a href="' + page.posts.new.value + '" style="font-style:italic">Add New »</a></span><span style="float:right">Sort by:';
			var sorts = $('.community-sub-nav ul li');
			for (i = 0, l = sorts.length; i < l; i++) {
				topicHeader += ' ' + sorts.eq(i).html();
			}
			topicHeader += '</span>';
			$('.community-sub-nav').remove();
			var topicList = new ThemedTable('latest', [topicHeader, 'Posts', 'Last Poster', 'Freshness'], ['547px', '48px', '92px', '71px']);
			var topics = $('.question-list li.question:not(.sticky-post)');
			var topic, topicMeta, title, posts, last, freshness;
			for (i = 0, l = topics.length; i < l; i++) {
				topic = topics.eq(i);
				topicMeta = topic.find('.question-meta');

				title = topic.find('.question-title').html();
				posts = parseInt(topicMeta.find('.question-answers').html(), 10) + 1;
				last = topicMeta.find('.question-author').html();
				freshness = topicMeta.find('.question-published').html().split(' ago')[0];

				topicList.add([title, posts, last, freshness]);
			}
			$('#rfloat').append(topicList.value);
			$('#latest th a').css({
				'color': '#ccc',
				'font-weight': 'normal'
			});
			$('#latest a').css('text-decoration', 'none');
			$('#latest td:nth-child(1) a, #latest td:nth-child(2), #latest td:nth-child(4)').css('color', '#1f75cc');
			$('#latest td:not(:nth-child(1))').css('font-size', '11px');
			$('.question-list').hide();
			$('body').on('DOMNodeInserted', '.question-list li.sticky-post', function() {
				var $topic, $topicMeta, title, posts, last, freshness;
				$topic = $(this);
				$topicMeta = $topic.find('.question-meta');

				title = '[sticky] ' + $topic.find('.question-title').html().replace('★	', '');
				posts = '';
				last = '';
				freshness = '';

				topicList.sticky([title, posts, last, freshness]);
				$('#latest').html($(topicList.value).html());
				$('#latest td:nth-child(1) a, #latest td:nth-child(2), #latest td:nth-child(4)').css('color', '#1f75cc');
				$('#latest tr td:not(:nth-child(1))').css('font-size', '11px');
				$('#latest tr.sticky td:nth-child(1)').css('font-size', '14px');
				$('#latest th a').css({
					'color': '#ccc',
					'font-weight': 'normal'
				});
				$('#latest a').css('text-decoration', 'none');
			}).on('DOMNodeInserted', '#latest tr p', function() { //Get rid of those pesky admin user details that mess up our tables
				$(this).remove();
			});.on('DOMSubtreeModified', '#latest td:nth-child(4) time', function() {
				if ($.contains(this, ' ago')) {
					$(this).html($(this).html().split(' ago')[0]);
				}
			});
		} else {
			$('#header').css('height', '174px');
		}

		//Style buttons
		$('.bluebutton').css({
			'text-shadow': '#355782 0 1px 2px',
			'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.3),inset 0px 1px 0px #83C5F1',
			'padding': '5px 16px',
			'background-color': '#2180ce',
			'background-image': '-moz-linear-gradient(top, #33a0e8, #2180ce)',
			'font-weight': 'bold',
			'font-size': '13px',
			'line-height': '15px'
		}).on('mouseover', function() {
			$(this).css({
				'background-color': '#2389dc',
				'background-image': '-moz-linear-gradient(top, #3baaf4, #2389dc)'
			});
		}).on('mouseout', function() {
			$(this).css({
				'background-color': '#2180ce',
				'background-image': '-moz-linear-gradient(top, #33a0e8, #2180ce)'
			});
		});
	}*/ else {
		console.log('Theme ' + versionDate + ' not found');
	}

	function addTopicItem(list, item) {
		var $item = $topics.parent().filter('[href^="' + page.topic[item].value + '"]');
		if ($item.length > 0) {
			list.add(['<a href="' + page.topic[item].value + '">' + desc[item][0] + '</a>' + (desc[item][1] !== '' ? ('<span>' + desc[item][1] + '</span>') : ''), parseInt($item.find('.meta-group span:contains("posts")').html()), parseInt($item.find('.meta-group span:contains("followers")').html())]);
		}
	}
}

/*
 * Methods and prototyping
 */

function WholeUrl(value) {
	//Sanity check
	if (typeof value === 'string') {
		this.value = 'https://www.dropboxforum.com/hc/' + lang;
		if (value) {
			this.value += '/' + value;
			this.value = this.value.split('#')[0];
		}
		this.active = trimmedUrl === this.value;
	} else {
		this.value = null;
		this.activ = false;
	}
}

function Url(value) {
	//Sanity check
	if (typeof value === 'string') {
		this.value = 'https://www.dropboxforum.com/hc/' + lang;
		if (value) {
			this.value += '/' + value;
			this.value = this.value.split('?')[0].split('#')[0];
		}
		this.active = strippedUrl === this.value;
	} else {
		this.value = null;
		this.activ = false;
	}
}

//Create a tabled themed with the 8.8.2012 theme
function ThemedTable(id, cols, width) {
	//Sanity check
	if (typeof id !== 'string' || !(typeof cols === 'object' || typeof cols === 'string') || !(typeof width === 'object' || typeof width === 'string')) {
		return;
	}

	this.count = 0;
	this.id = id;
	this.width = width;
	for (i = 0, l = cols.length; i < l; i++) {
		cols[i] = '<th style="background:#666;color:#fff;padding:1px 9px 2px;font-size:11px;font-weight:bold;border:2px solid #f7f7f7' + (typeof this.width != 'string' ? (';width:' + this.width[i] + ';"') : '') + '">' + cols[i] + '</th>';
	}
	this.headers = '<tr>' + cols.join('') + '</tr>';
	this.content = '';
	this.add = function(vals) {
		this.count++;
		for (i = 0, l = vals.length; i < l; i++) {
			vals[i] = '<td style="border:2px solid #f7f7f7;padding:3px 10px;font-size:12.5px">' + vals[i] + '</td>';
		}
		this.content += '<tr style="background:' + ((this.count % 2 === 0 && this.count > 0) ? '#f7f7f7' : '#fff') + '">' + vals.join('') + '</tr>';
		this.value = '<table id="' + this.id + '" style="margin:0 auto;border:2px solid #f7f7f7' + (typeof this.width === 'string' ? (';width:' + this.width + '"') : '') + '">' + this.headers + this.content + '</table>';
	};
	this.sticky = function(vals) {
		for (i = 0, l = vals.length; i < l; i++) {
			vals[i] = '<td style="border:2px solid #f7f7f7;padding:3px 10px;font-size:12.5px">' + vals[i] + '</td>';
		}
		this.content = '<tr class="sticky" style="background:#f4faff">' + vals.join('') + '</tr>' + this.content;
		this.value = '<table id="' + this.id + '" style="margin:0 auto;border:2px solid #f7f7f7' + (typeof this.width === 'string' ? (';width:' + this.width + '"') : '') + '">' + this.headers + this.content + '</table>';
	};
	this.value = '<table id="' + this.id + '" style="margin:0 auto;border:2px solid #f7f7f7' + (typeof this.width === 'string' ? (';width:' + this.width + '"') : '') + '">' + this.headers + this.content + '</table>';
}

/*
 * Helper functions
 */

function manageSynced(test) {
	//Sanity check
	if (typeof test === 'boolean') {
		//Increment counter - In case we have multiple actions waiting
		if (test && syncWaitCount > 0) {
			syncWaitCount--;
		} else {
			syncWaitCount++;
		}

		//Select appropriate sync icon
		var image;
		if (!test) {
			image = '<img src="https://github.com/DBMods/forum-extender-plus/raw/master/bin/img/sync-flat.png" style="animation:spin 1.5s infinite linear;height:32px;width:32px" />';
		} else {
			image = '<img src="https://github.com/DBMods/forum-extender-plus/raw/master/bin/img/check.png" style="height:32px;width:32px" />';
		}

		//Only change image if it's not already changed
		if ($('#gsDropboxExtenderSyncIcon').html() != image) {
			$('#gsDropboxExtenderSyncIcon').html(image);
		}
	} else {
		//Throw error on invalid test
		console.log('Sync test not a boolean');
	}
}

function htmlToMarkdown(base) {
	//Sanity check
	if (typeof base === 'string') {
		var baseSelect = base.replace(/<li>/g, '* ').replace(/<p>/g, '\n\n').replace(/<h1>/g, '# ').replace(/<h2>/g, '## ').replace(/<h3>/g, '### ').replace(/<h4>/g, '#### ').replace(/<h5>/g, '##### ').replace(/<h6>/g, '###### ').replace(/<\/?strong>/g, '**').replace(/<\/?i>/g, '*').replace(/<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>|<\/?ul>|<\/p>|<\/li>|<ol>|<\/ol>|<ul>|<\/ul>/g, '').replace(/<a\ href="/g, '[').replace(/("\ .{1,})*">/g, '](').replace(/<\/a>/g, ')').replace(/\n\n/g, '\n');

		//Split off links into separate array
		var linkArray = baseSelect.match(/\[.+\]\(.+\)/g);
		if (!!linkArray) {
			var textArray = baseSelect.split(/\[.+\]\(.+\)/g);

			//Swap text and link
			for (i = 0, l = linkArray.length; i < l; i++) {
				linkArray[i] = '[' + linkArray[i].split('](')[1].split(')')[0] + '](' + linkArray[i].split('[')[1].split('](')[0] + ')';
			}

			return $.trim(interleave(textArray, linkArray).join(''));
		} else {
			return $.trim(baseSelect);
		}
	} else {
		//Invalid thing to convert
		console.log('HTML to markdown not a string');
	}
}

function interleave(arr1, arr2) {
	//Sanity check
	if (typeof arr1 === typeof arr2 === 'object') {
		if (arr2.length > arr1.length) {
			arr2.length = arr1.length;
		}
		var combinedArr = $.map(arr1, function(v, i) {
			return [v, arr2[i]];
		});
		var newArr = [];
		for(var i = 0, l = combinedArr.length; i < l; i++){
			if (combinedArr[i]){
				newArr.push(combinedArr[i]);
			}
		}
		return newArr;
	} else {
		//Invalid arrays
		console.log('Arrays not valid, cannot interleave');
	}
}

//Get post author markup
function getPostAuthorDetails(postEventTarget) {
	var $stuff = $(postEventTarget).parent().parent();

	//Grab author element
	if ($stuff.attr('class') === 'post-footer') {
		//If we're quoting an OP, then go up one, as we'll be in the footer, and not the post itself
		$stuff = $stuff.parent().find('.post-container .post-header .post-author');
	} else {
		$stuff = $stuff.find('.comment-container .comment-header .comment-author');
	}

	return '<strong>' + $stuff.attr('title') + '</strong> scribbled:';
}

function getUserId(postEventTarget) {
	return $(postEventTarget).parent().parent().parent().find('.question-avatar, .answer-avatar').find('img').attr('src').split('/hc/user_avatars/')[1].split('?')[0];
}

//Insert markup at required position
function insertAndMarkupTextAtCursorPosition() {
	var args = arguments;
	var SelectedTextStart = $postField[0].selectionStart, SelectedTextEnd = $postField[0].selectionEnd, EndCursorPosition = SelectedTextStart, SelectedText = '';
	if (SelectedTextEnd - SelectedTextStart) {
		SelectedText = $postField.val().slice(SelectedTextStart, SelectedTextEnd);
	}
	var offset = 0, i = args.length, targetText = SelectedText;
	while (i--) {
		targetText = '<' + args[i] + '>' + targetText + '</' + args[i] + '>';
		offset += 2 + args[i].length;
	}
	insertTextAtCursorPosition(targetText);
	if (!SelectedText) {
		$postField.setCursorPosition(EndCursorPosition + offset);
	}
}

//Insert text at required position
function insertTextAtCursorPosition(TextToBeInserted) {
	//Sanity check
	if (typeof TextToBeInserted !== 'string') {
		return;
	}

	var startPos = $postField[0].selectionStart;
	$postField.val($postField.val().slice(0, startPos) + TextToBeInserted + $postField.val().slice($postField[0].selectionEnd));
	$postField.setCursorPosition(startPos + TextToBeInserted.length);
}

//Move cursor to set position in text area
$.fn.setCursorPosition = function(pos) {
	if (typeof pos === 'number') {
		var me = this.get(0);
		if (me.createTextRange) {
			var range = me.createTextRange();
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		} else {
			me.focus();
			me.setSelectionRange(pos, pos);
		}
	} else {
		//Invalid position
		console.log('Cannot set cursor position, position is not a number');
	}
};

//Insert quote
function insertSelectedQuote(quote, postAuthorDetails) {
	//Sanity check
	if (quote && typeof quote === 'string') {
		postAuthorDetails = postAuthorDetails || '';

		var SelectionStart = $postField[0].selectionStart;
		var newlineNeeded = SelectionStart && $postField.val().charAt(SelectionStart - 1) != '\n';
		var appendedText = '<blockquote>' + postAuthorDetails + '\n' + quote + '</blockquote>';
		appendedText = (newlineNeeded ? '\n' : '') + appendedText;

		insertTextAtCursorPosition(appendedText);
		$postField.setCursorPosition(SelectionStart + appendedText.length);
	}
}

//Get selected HTML for quoting
function getSelectedHtml() {
	if (window.getSelection) { //window.getSelection()
		var selection = window.getSelection();
		if (selection.rangeCount > 0) {
			var range = selection.getRangeAt(0);
			var clonedSelection = range.cloneContents();
			var div = document.createElement('div');
			div.appendChild(clonedSelection);
			return div.innerHTML;
		}
	} else if (document.selection) { //document.selection.createRange.text
		return document.selection.createRange().htmlText;
	}
}

//Get selected text for quoting
function getSelectedText() {
	if (window.getSelection) {
		return window.getSelection().getRangeAt(0).toString();
	} else if (document.selection) {
		return document.selection.createRange().text;
	}
}

function hoverMsg(type, message) {
	//Sanity check
	if (typeof type === typeof message === 'string') {
		$('#alert-fade').parent().remove();
		$body.prepend('<div class="alert-center" style="position:fixed;top:50px;z-index:9999;font-size:21px"><div id="alert-fade" class="alert alert-' + type + '"><p><strong>' + message + '</strong></p></div></div>');
		setTimeout(function() {
			$('.alert-center').fadeOut();
		}, 5000);
	} else {
		//Message type and content not both strings
		console.log('Cannot display hoverMsg, type and content must be valid strings');
	}
}

function showModal(modConfig) {
	//Sanity check
	if (typeof modConfig !== 'object') {
		return;
	}

	var buttons = modConfig.buttons;
	var title = modConfig.title;
	var content = modConfig.content;
	var init = modConfig.hasOwnProperty('init') ? modConfig.init : undefined;
	var action = modConfig.hasOwnProperty('action') ? modConfig.action : undefined;
	var actionTwo = modConfig.hasOwnProperty('actionTwo') ? modConfig.actionTwo : undefined;
	var heightMod = modConfig.hasOwnProperty('heightMod') ? modConfig.heightMod : undefined;

	var heightModifier;

	modalCount++;

	$('#gsDropboxExtenderModalContainer').append('<div id="gsDropboxExtenderModalGroup' + (modalCount - 1) + '" style="position:fixed;display:none"><div class="gsDropboxExtenderScreenOverlay" style="position:fixed;bottom:0;right:0;top:0;left:0;background:rgba(0,0,0,' + (modalCount > 1 ? '0.4' : '0.7') + ');border:1px solid #cecece;z-index:50" /><div class="gsDropboxExtenderModal" style="position:fixed;background:#fff;border:2px solid #cecece;z-index:50;padding:12px;font-size:13px"><a class="gsDropboxExtenderModalClose clickable" style="font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block">x</a><h1 class="gsDropboxExtenderModalTitle" style="text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px"></h1><div class="gsDropboxExtenderModalContent" /><div class="gsDropboxExtenderModalActionButtons" style="text-align:right" /></div></div>');
	var $mGroup = $('#gsDropboxExtenderModalGroup' + (modalCount - 1));

	var $modal = $mGroup.find('.gsDropboxExtenderModal');

	//Assign classes to buttons
	var buttonMap = {
		'Add': (buttons.indexOf('OK') > -1 ? 'ActionTwo' : 'Action'),
		'Cancel': 'CloseLink',
		'Close': 'CloseLink',
		'No': 'CloseLink',
		'OK': 'Action',
		'Send': 'Action',
		'Yes': 'Action'
	};
	$mGroup.find('.gsDropboxExtenderModalTitle').html(title);
	$mGroup.find('.gsDropboxExtenderModalContent').html(content);

	tmp = '';
	for (i = 0, l = buttons.length; i < l; i++) {
		tmp += '<span class="gsDropboxExtenderModal' + (buttonMap.hasOwnProperty(buttons[i]) ? buttonMap[buttons[i]] : 'CustomBtn') + ' clickable" style="margin-left:18px">' + buttons[i] + '</span>';
	}
	$('.gsDropboxExtenderModalActionButtons').html(tmp);

	//Cache elements
	var $action = $mGroup.find('.gsDropboxExtenderModalAction');

	if (modConfig.hasOwnProperty('dimm')) {
		$modal.css({
			'height': modConfig.dimm[0] + 'px',
			'width': modConfig.dimm[1] + 'px',
			'top': (document.documentElement.clientHeight - modConfig.dimm[0]) / 2,
			'left': (document.documentElement.clientWidth - modConfig.dimm[1]) / 2
		});
	} else {
		$modal.css({
			'height': '200px',
			'width': '408px',
			'top': (document.documentElement.clientHeight - 200) / 2,
			'left': (document.documentElement.clientWidth - 408) / 2
		});
	}

	if (init) {
		init();
	}

	$mGroup.show();

	$action.on('click', function() {
		action();
		if (heightMod && heightMod[0]) {
			heightModifier = $(heightMod[0]).height();
			$modal.css({
				'top': (parseInt($modal.css('top'), 10) - (heightModifier / 2)),
				'height': parseInt($modal.css('height'), 10) + heightModifier
			});
		}
	});
	if (actionTwo) {
		$mGroup.find('.gsDropboxExtenderModalActionTwo').on('click', function() {
			actionTwo();
			if (heightMod && heightMod[1]) {
				heightModifier = $(heightMod[1]).height();
				$modal.css({
					'top': (parseInt($modal.css('top'), 10) - (heightModifier / 2)),
					'height': parseInt($modal.css('height'), 10) + heightModifier
				});
			}
		});
	}

	$mGroup.find('.gsDropboxExtenderModalClose').add($mGroup.find('.gsDropboxExtenderModalCloseLink')).add($action).add($mGroup.find('.gsDropboxExtenderScreenOverlay')).on('click', function(){
		$mGroup.remove();
		modalCount--;
	});
}

function getUrlVars() {
	var vars = [], hash;
	var hashes = fullUrl.split('#')[0].slice(fullUrl.indexOf('?') + 1).split('&');

	for (i = 0, l = hashes.length; i < l; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}

	return vars;
}

function getRandomNumber() {
	return 4;
	//Chosen by fair dice roll. Guaranteed to be random.
}
