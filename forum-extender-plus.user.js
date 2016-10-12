// ==UserScript==
// @name Dropbox Forum Extender+
// @namespace DropboxMods
// @description Beefs up the forums and adds way more functionality
// @include https://www.dropboxforum.com/*
// @include https://www.techgeek01.com/dropboxextplus/beta/register.php*
// @include http://www.techgeek01.com/dropboxextplus/beta/register.php*
// @include https://techgeek01.com/dropboxextplus/beta/register.php*
// @include http://techgeek01.com/dropboxextplus/beta/register.php*
// @include http://localhost/dropboxextplus/register.php*
// @version 3.0.1
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

/*
 ***** Bugs *****
 * FIXME Super User highlighting notification is displaying on empty threads
 * FIXME Check post ratio for SU highlighting?
 ***** General fixes *****
 * FIXME Thread reply emphasis
 * TODO Fix forum-side messaging
 */

//Set global variables
var fullUrl = window.location.href;
var domain = getDomain(fullUrl);
//var lang = getLang(fullUrl);
var trimmedUrl = fullUrl.split('#')[0],
	strippedUrl = trimmedUrl.split('?')[0],
	slug = strippedUrl.split(domain.full + '/t5/')[1] || strippedUrl.split(domain.full + '/')[1] || '',
	pageUrl = strippedUrl.substr(strippedUrl.lastIndexOf('/') + 1),
	urlVars = getUrlVars(fullUrl);
var modalCount = 0;
var syncWaitCount = 0;
var reloadTimer = new Date().getTime();
var tmp, i, l;

function getDomain(url) {
	var trim = url.split('://');
	var site = trim[0] + '://' + trim[1].split('/')[0];

	return {
		protocol: trim[0],
		site: trim[1].split('/')[0] || undefined,
		full: trim[0] + '://' + trim[1].split('/')[0] || undefined
	};
}
//TODO Remove getLang()?
function getLang(url) {
	//Sanity check
	if (typeof url !== 'string'
			|| domain.site.indexOf('.dropboxforum.com') !== domain.site.length - 17
			|| (url.indexOf('https://www.dropboxforum.com/t5/') !== 0 && url.indexOf('http://www.dropboxforum.com/t5/') !== 0)) {
		return undefined;
	}

	//If stub exists in appropriate location, check if it's a lang stub
	var stub = url.split('https://www.dropboxforum.com/t5/')[1].split('#')[0].split('/')[0].split('?')[0];
	return (stub.length === 2 || (stub.length === 5 && stub.indexOf('-') === 2)) ? stub : 'en-us';
}
function getUrlVars(url) {
	if (typeof url === 'string') {
		var vars = [], hash;
		var hashes = fullUrl.split('#')[0].slice(fullUrl.indexOf('?') + 1).split('&');

		for (i = 0, l = hashes.length; i < l; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}

		return vars;
	} else {
		return url;
	}
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
	front: new Url(['English/ct-p/English', 'Fran%C3%A7ais/ct-p/French', 'Deutsch/ct-p/German', 'Espa%C3%B1ol/ct-p/Spanish', 'Portugu%C3%AAs/ct-p/Portuguese', 'Italiano/ct-p/Italian', '%E6%97%A5%E6%9C%AC%E8%AA%9E/ct-p/Japanese']),
	posts: {
		list: new Url(['Find-answers/ct-p/101001000', 'Share-an-idea/ct-p/101002000', 'Beta-testers/ct-p/101003000', 'API-support/bd-p/101000014']),
		new: new Url('forums/postpage/*'),
		reply: new Url('forums/replypage/*')
	},
	notifs: new Url('notificationfeed/page'),
	topic: {
		account: new Url('Manage-account/bd-p/101001003'),
		api: new Url('API-support/bd-p/101000014'),
		betaTest: new Url('Beta-testers/ct-p/101003000'),
		client: new Url('Desktop-client-builds/bd-p/101003016'),
		communityImprove: new Url('Community-improvements/idb-p/101002024'),
		dfb: new Url('Dropbox-Business-admins/bd-p/101001011'),
		dropbox: new Url('Dropbox/idb-p/101002013'),
		edTest: new Url('test-board-ed/bd-p/test-ed'),
		errors: new Url('Error-messages/bd-p/101001006'),
		findAnswers: new Url('Find-answers/ct-p/101001000'),
		installIssues: new Url('Installation-and-desktop-app/bd-p/101001007'),
		missingFiles: new Url('Missing-files-and-folders/bd-p/101001005'),
		paper: new Url('Dropbox-Paper/bd-p/101001008'),
		paperIdea: new Url('Dropbox-Paper/idb-p/101002012'),
		photos: new Url('Photos-and-videos/bd-p/101001009'),
		shareIdea: new Url('Share-an-idea/ct-p/101002000'),
		sharing: new Url('Sharing-and-collaboration/bd-p/101001001'),
		space: new Url('Space/bd-p/101001004'),
		syncing: new Url('Syncing-and-uploads/bd-p/101001002'),
		teams: new Url('Teams/bd-p/101001010')
	},
	meta: {
		authhelp: new Url('authhelp'),
		credits: new Url('credits')
	},
	isPost: ['idc-p', 'idi-p', 'm-p'].indexOf(slug.split('/')[2]) > -1,
	isTopic: ['idb-p', 'bd-p', 'ct-p'].indexOf(slug.split('/')[1]) > -1
};

//Detect user login status and type
var loggedIn = $('#header .header-top a.UserAvatar').length > 0,
		//userIsMod = $('#user-menu a:contains("Open agent interface")').length > 0,
		userUid = '';

//Cache body and head
var $body = $('body'),
		$head = $('head');

//Append necessary elements
$head.append('<style>#gsDropboxExtenderNav,#gsDropboxExtenderModal{font-weight:100}.bluebtn{margin:0 3px;padding:5.25px 8px;background:#007ee5;color:#fff;font-weight:600;border:1px solid #0083e3;border-radius:4px;cursor:pointer}.clickable{cursor:pointer;color:#007ee5}.clickable:hover{color:#004a94;text-decoration:underline}#gsDropboxExtenderNav > span{margin-left:20px}#gsDropboxExtenderHelpCenterLinkContainer div{padding:2px 10px}#gsDropboxExtenderHelpCenterLinkContainer div strong{color:#000;font-size:14px}#gsDropboxExtenderHelpCenterLinkContainer div span{margin-left:16px;font-size:12px}#gsDropboxExtenderHelpCenterLinkContainer div:hover{background:#439fe0;border-bottom:1px solid #2a80b9;padding-bottom:1px !important;cursor:pointer}#gsDropboxExtenderHelpCenterLinkContainer div:hover strong,#gsDropboxExtenderHelpCenterLinkContainer div:hover span{color:#fff !important}.gsDropboxExtenderModal h2{color:#007ee5;font-size:16px;font-weight:600;margin:7px 0 6px;padding-bottom:4px;border-bottom:1px solid #ddd}.gsDropboxExtenderModal select,.gsDropboxExtenderModal select.fancy{border-radius:6px 0 0 6px}.gsDropboxExtenderModal input[type="text"],.gsDropboxExtenderModal select{height:28px}.gsDropboxExtenderModal input[type="text"],.gsDropboxExtenderModal textarea,.gsDropboxExtenderModal select,input[type="text"].fancy,textarea.fancy,select.fancy{box-sizing:border-box;padding:0 8px;margin-bottom:8px;border:1px solid #c3c3c3}.gsDropboxExtenderModal input[type="text"],.gsDropboxExtenderModal textarea,input[type="text"].fancy,textarea.fancy{width:100%;border-radius:6px}.alert p{margin-bottom:0}.alert-warning{background-color:#fcf8e3;border-color:#f5e79e;color:#8a6d3b}.alert-danger{background-color:#fef1f1;border-color:#e2a8a8;color:#d46d6d}.alert-success{background-color:#e8f7ed;border-color:#30b661;color:#1ba84e}.alert-info{background-color:#d9edf7;border-color:#9acfea;color:#31708f}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(359deg)}}</style>');
$body.append('<div style="z-index:9999;position:fixed"><div id="gsDropboxExtenderModalContainer" style="position:fixed;z-index:50" /><div id="gsDropboxExtenderNav" style="position:fixed;bottom:0;height:32px;border-top:1px solid #bbb;width:100%;line-height:30px;background:#fff;z-index:10;padding:0 0 0 105px;font-size:13px"><img id="gsDropboxExtenderLogo" class="clickable" src="https://raw.githubusercontent.com/DBMods/forum-extender-plus/master/bin/img/plus-sync-logo.png" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-33px;z-index:11" /><span id="gsDropboxExtenderSyncIcon" style="position:fixed;left:65px;bottom:-4px;z-index:12"></span><span><a href="https://www.dropboxforum.com/t5/Dropbox/Dropbox-Forum-Extender-for-Greasemonkey/idc-p/225">Official thread</a></span><span id="gsDropboxExtenderMessageContainer"><a id="gsDropboxExtenderMessageLink" href="https://www.techgeek01.com/dropboxextplus/index.php" target="blank">Messages</a><span id="gsDropboxExtenderMsgCounter"></span></span><span style="font-weight:bold;display:none">Important Notice: The messaging system has been updated. If you have previously registered, please trash your preferences and register again.</span></div></div>').css('padding-bottom', '33px');
$body.append('<div id="gsDropboxExtenderReloadTimerWrap" style="color:rgba(0,0,0,0.3);text-shadow:0 0 rgba(256,256,256,0.5);position:fixed;bottom:40px;right:8px;font-family:Helvetica,Arial,sans-serif;display:none"><div style="display:inline-block;width:17px"><div id="accent" style="transform:rotate(270deg);font-weight:bold;font-size:14px">RELOAD</div></div><div id="gsDropboxExtenderReloadTimer" style="display:inline-block;font-weight:bold;font-size:72px;line-height:64px">0:30</div></div>');

//Default synced icon to false until we can connect to the user's config
manageSynced(false);

//Main element caching
var $header = $('#header'),
		$postForm = $('form.MessageEditorForm, form.CommentEditorForm'),
		$postField = $('#tinyMceEditor, #lia-body_0, .lia-form-input-wrapper textarea'),
		$thread = $('div.lia-component-reply-list'),
		$threadAuthor = $('div.lia-message-author-username'),
		$userRole = $threadAuthor.parent().find('div.lia-message-author-rank'),
		$latest = $('div.thread-list'),
		$latestQuestions = $latest.find('tbody tr'),
		$navBar = $('#gsDropboxExtenderNav');
//var $forumList = $('.community-nav .pinned-categories');

//Add version number
$header.after('<div style="text-align:center;font-size:11px;margin-top:12px">Dropbox Forum Extender+ v' + GM_info.script.version + '</div>');

highlightPost('Super User', color.lightGold, 0.25);

function highlightPost(check, color, threshold) {
	threshold = threshold || false;
	if (page.isPost && typeof check === 'string' && typeof color === 'string' && (typeof threshold === 'boolean' || typeof threshold === 'number')) {
		var $targets = $userRole.filter(function() {return $(this).text() === check}).parent().parent().parent().parent();
		var status = !threshold || $targets.length / $('.comment').length <= threshold;

		if (status) {
			$targets.css('background-color', color);
		}

		//Append message
		var msg = '<div>' + check + ' highlighting ' + (status ? 'en' : 'dis') + 'abled</div>';
		$thread.before(msg).after(msg);
	}
}

//Highlight threads
//highlightThread(postCount, color)
//highlightThread(minPosts, maxPosts, color)
$latestQuestions.filter('.post-pinned').css('background', color.lightBlue); //NOTE Do we still need this with the new forums?
highlightThread(1, color.lightGreen);
highlightThread(2, color.lightGold);
highlightThread(3, color.lightRed);

function highlightThread() {
	var args = arguments;

	//Sanity check
	if (page.isTopic && typeof args[0] === 'number' && typeof args[args.length - 2] === 'number' && typeof args[args.length - 1] === 'string') {
		var $threadList = $latestQuestions.filter(':not(.post-pinned)').find('td.cRepliesCountColumn span.lia-message-stats-count'), content;
		i = $threadList.length;
		while (i--) {
			content = parseInt($threadList.eq(i).html(), 10);
			if (content >= args[0] - 1 && content <= args[args.length - 2] - 1) {
				$threadList.eq(i).parent().parent().parent().addClass('nochange').css('background', args[args.length - 1]);
			}
		}
	}
}

//Clone pagination to the top of the page for easier navigation
$thread.before($('#pager').clone().attr('id', 'pagerTop'));

//Emphasize new replies to threads you've interacted with FIXME Fix thread activity highlighting
/*var postNumbers = GM_getValue('postNumbers', []);

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
}*/

//Modify user tags
$threadAuthor.find('a').filter('[href$="/1843"]').parent().parent().parent().find('div.lia-message-author-rank').html('Master of Super Users');
$threadAuthor.find('a').filter('[href$="/4"]').parent().parent().parent().find('div.lia-message-author-rank').append('<span style="font-size:11.2px;color:#bbb"> - Hi dee di dee di dee di dee di dee di dee di!</span>');

//Detect and manage unstickied threads FIXME Fix sticky managing
/*if ($('#topic-info .topictitle:contains(") - "):contains(" Build - ")').length) {
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
}*/

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

//Fix post replying
/*if (page.isPost) {
	$('.lia-button-wrapper.lia-component-reply-button').remove();
}*/

if (page.posts.new.active || page.posts.reply.active || page.isPost) {
	//Remove rich text tab
	$('.lia-tabs.rich-tab').remove();
	$('.lia-tabs.html-tab').removeClass('lia-tabs-inactive').addClass('lia-tabs-active');

	//Force show HTML form
	$head.append('<style>#tinyMceEditor{visibility:visible!important}</style>');

	//Listen for addition of TinyMCE stuff, and kill it
	$body.on('DOMNodeInserted', '#mceu_16', function() {
		$(this).remove();
	});

	$postField.before('<div id="gsDropboxExtenderPostExtras" style="margin:20px 12px" />');

	$('#gsDropboxExtenderPostExtras').append('<span><span class="gsDropboxExtenderLinkInsert clickable">a</span> - <span class="gsDropboxExtenderImgInsert clickable">img</span> - <span class="gsDropboxExtenderBlockquoteSelected clickable">blockquote</span> - <span class="gsDropboxExtenderStrongSelected clickable">bold</span> - <span class="gsDropboxExtenderEmSelected clickable">italic</span> - <span class="gsDropboxExtenderCodeSelected clickable">code</span> (<span class="gsDropboxExtenderQuoteCodeSelected clickable">quoted</span>) - <span class="gsDropboxExtenderListInsert clickable">ordered list</span> - <span class="gsDropboxExtenderListInsert clickable">unordered list</span><span id="siglink" style="display:none"> - <span class="gsDropboxExtenderSignatureInsert clickable">custom signature</span></span></span>');

	var quoteBtn = '<span class="gsDropboxExtenderQuoteSelected clickable">Quote Selected</span> - <span class="gsDropboxExtenderQuotePost clickable">Quote Post</span>';

	//Append quote options
	if (page.isPost) {
		$thread.find('.lia-button-image-kudos-wrapper').parent().parent().append('<span><span><span><span>' + quoteBtn + '</span></span></span></span>');
		$('div.first-message .lia-rating-metoo .lia-button-group-left').append(quoteBtn);
	} else if (page.posts.reply.active) {
		$('#messagebodydisplay').after('<span><span><span><span>' + quoteBtn + '</span></span></span></span>'); //TODO Fix positioning of quote buttons
	}

	//Quoting
	$('.gsDropboxExtenderQuotePost').on('click', function(evt) {
		var $postContainer = $(evt.target).parent().parent().parent().parent().parent().parent().parent().parent(); //Yeah, that's 8 .parent() calls.
		var selectedText = $postContainer.find('.lia-message-body div.lia-message-body-content').eq(0).html();

		//Regex here will match div, paragraph, and break tags, as well as a link's rel attribute
		selectedText = selectedText.replace(/( rel="(nofollow|noopen|noreferrer)?( (nofollow|noopen|noreferrer)){0,2}")|(<(\/?(div|p)|br( ?\/)?)>)|\\(n|t)|&nbsp;/g, '').trim();
		insertSelectedQuote(selectedText, getPostAuthorDetails(evt.target));
	});
	$('.gsDropboxExtenderQuoteSelected').on('mouseover', function(evt) {
		//Regex here will match div, paragraph, and break tags, as well as a link's rel attribute
		var selectedText = getSelectedHtml().replace(/( rel="(nofollow|noopen|noreferrer)?( (nofollow|noopen|noreferrer)){0,2}")|(<(\/?(div|p)|br( ?\/)?)>)|\\(n|t)|&nbsp;/g, '').trim();

		$('.gsDropboxExtenderQuoteSelected').on('click', function(evt) {
			insertSelectedQuote(selectedText, getPostAuthorDetails(evt.target));
		});
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
			title: 'Add ' + listType[0].toUpperCase() + listType.substring(1, listType.length) + ' List',
			content: '<' + listType[0] + 'l id="gsDropboxExtenderListBox" style="padding-left:16px;margin:0;box-sizing:border-box"></' + listType[0] + 'l><input id="gsDropboxExtenderListBoxTextBox" class="textinput" placeholder="Item" type="text" />',
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
					$('#gsDropboxExtenderListBox').css('padding-bottom', '8px');
					$('#gsDropboxExtenderListBox').append('<li>' + $('#gsDropboxExtenderListBoxTextBox').val() + '</li>');
					$('#gsDropboxExtenderListBoxTextBox').val('');
				}
			}
		});
	});

	//Insert a link
	$('.gsDropboxExtenderLinkInsert').on('click', function() {
		showModal({
			buttons: ['Add'],
			title: 'Add Link',
			content: '<input id="gsDropboxExtenderAnchorTextBox" class="textinput" placeholder="Title" type="text" /><input id="gsDropboxExtenderAnchorUrlBox" class="textinput" placeholder="Link URL" type="text" />',
			action: function() {
				insertTextAtCursorPosition('<a href="' + $('#gsDropboxExtenderAnchorUrlBox').val() + '">' + $('#gsDropboxExtenderAnchorTextBox').val() + '</a>');
			}
		});
	});

	//Insert an image
	$('.gsDropboxExtenderImgInsert').on('click', function() {
		showModal({
			buttons: ['Add'],
			title: 'Add Image',
			content: '<input id="gsDropboxExtenderImgUrlBox" class="textinput" placeholder="Image source" type="text" /><input id="gsDropboxExtenderImgAltBox" class="textinput" placeholder="Alt text" type="text" />',
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

		var match = beforeCursor.match(/(^|[^\w])@\d*$/gm); //Everybody stand back! I know regular expressions
		if (match) {
			match = match + '';
			match = match.split('@').pop() || '';
			var tb = new Date().getTime();
			var arr = Object.keys(helpList);
			var items = [];

			for (i = 0, l = arr.length; i < l; i++) {
				if (arr[i].indexOf(match) === 0) {
					items.push(i);
				}
			}

			console.log('Test ' + (new Date().getTime() - tb) + 'ms');

			items = items.map(function(num) {
                return '<div><strong>' + arr[num] + '</strong><span>' + helpList[arr[num]] + '</span></div>';
			});
			$('#gsDropboxExtenderHelpCenterLinkContainer').html(items.join(''));
			var tc = new Date().getTime();
			var tt = tc - tb;
			console.log('Loop executed in ' + tt + 'ms');
			if (items) {
				//Show autocomplete list only if there are items in it
				$('#gsDropboxExtenderHelpCenterLinkContainer div').click(function() {
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

	$postForm.find('input.lia-button-primary[type="submit"]').on('click', function() {
    var postFormVal = $postField.val();

    //Link @n[text] => Custom text as text
    postFormVal = postFormVal.replace(/(^|[^\w])@(\d+)\[(.+)\]([^\w]|$)/gm, '$1<a href="https://www.dropbox.com/help/$2">$3</a>$4');

    //Link @n[] => Help Center article title as text
    postFormVal = postFormVal.replace(/(^|[^\w])@(\d+)\[\]([^\w]|$)/gm, function(match, p1, p2, p3) {
			return p1 + '<a href="https://www.dropbox.com/help/' + p2 + '">' + helpList[p2] + '</a>' + p3;
		});

    //Link @n => Link URL as text
    postFormVal = postFormVal.replace(/(^|[^\w])@(\d+)([^\w]|$)/gm, '$1<a href="https://www.dropbox.com/help/$2">https://www.dropbox.com/help/$2</a>$3');
		$postField.val(postFormVal);
	});
}

//Add custom pages by swapping out 404s
makePage('credits', 'A Special Thanks', '<p>This project has been in ongoing development since May of 2013, and I could not have done it without the help of a select few individuals. I\'d like to give a special thanks to those that have helped contribute to the script in some way.</p><p><strong>Nathan Cheek</strong> - Co-development of message system, and side development of userscript<br><span style="display:inline-block;padding-left:5em;color:#bbb">Also, for claiming he knows nothing about UI design, and leaving me to design a graphical interface from scratch ;)</span><br><strong>Raymond Ma</strong> - Side development of userscript and CDN links to resources<br><span style="display:inline-block;padding-left:5em;color:#bbb">Quite a lot of work for a guy that\'s only like, 16 :)</span><br><strong>Richard Price</strong> - Inspiration for all of the features, and permission to incorporate the old Forum Extender into the script<br><span style="display:inline-block;padding-left:5em;color:#bbb">The same Forum Extender he probably wrote on whatever Windows phone or tablet he had at the time :)</span><br><br><strong>Chris Jones</strong> - Extensive error reporting and debugging of the script before pushing early versions to the public<br><br><strong>Ed Giansante</strong> - Helping with gathering resources, and not <em>always</em> sitting behind a desk and doing nothing :)<br><span style="display:inline-block;padding-left:5em;color:#bbb">Oh, hi dee di dee di dee di dee di dee di dee di!</span><br><br><strong>XKCD</strong> - Providing inspiration for the many easter eggs hidden within the code<br><span style="display:inline-block;padding-left:5em;color:#bbb">Random number: ' + getRandomNumber() + '</span></p>');
makePage('authhelp', 'Authenticate Dropbox Forum Extender+', '<p>In order for the Dropbox API to authenticate, the request must be sent from specific URLs defined for the app. However, the URL has to match exactly, down to the anchors or parameters passed into the page. This is why, for example, if your front page URL is <code>https://www.dropboxforum.com/hc/en-us?flash_digest=k5m3...</code>, you cannot auth from that page. The URLs do not match, and as such, will not work.</p><p>When you authenticate with the Dropbox API, this gives the Forum Extender+ extension access to its own folder. From this folder, it will read and write to config files it uses to store data. Simply put, this allows you to set preferences, snippets, even post drafts, and no matter what you do in the script config, it will sync to your Dropbox. This allows every installation of the userscript that you\'ve linked to access this data as well, and so your preferences will travel between conputers.</p><p>For convenience, you can also authenticate the script straight from this page by clicking <span class="dropboxlink clickable">here</span>.</p>');

//makePage(slug, title, [pageTitle,] content)
function makePage() {
	//Set up vars
	var args = arguments;
	var targetSlug = args[0], title = args[1];
	var content = args[args.length - 1];
	var pageTitle = args.length === 4 ? args[2] : title;

	//Sanity check
	if (typeof targetSlug === 'string' && typeof title === 'string' && typeof pageTitle === 'string' && typeof content === 'string') {
		if (slug === targetSlug) {
			var $cont = $('.error-page');

			//Remove junk
			$cont.siblings().remove();
			$cont.find('.error-page__image').remove();
			$cont.find('h2').remove();
			$cont.find('p').remove();

			//Add page title
			$cont.find('h1').html(title).css({'border-bottom': '2px solid #007ee5', 'padding': '0 8px 4px'});
			$('head title').html(pageTitle + ' - Dropbox Forums');
			$('li.lia-breadcrumb-node.crumb.final-crumb span').html(title);
			$cont.append('<div>' + content + '</div>');

			//Left-align paragraphs
			$cont.find('p').css('text-align', 'left');
		}
		return slug === targetSlug;
	} else {
		return undefined;
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

		//Add Super User icons
		$userRole.filter(function() {return $(this).text() === 'Super User' || $(this).text() === 'Master of Super Users'}).prepend('<img src="' + prefs.modIcon + '" style="margin:0 6px 0 2px" />');

		//Auto reload Pages
		reloadPage('Front');
		reloadPage('Forum');
		reloadPage('Sticky');

		function reloadPage(pageType) {
			var reloadIndex = {
				'Sticky': page.isPost && $('article.post.post-pinned').length > 0,
				'Front': page.front.active || page.posts.list.active,
				'Forum': !page.front.active && !page.posts.list.active && page.isTopic
			};
			var reloadDelay = parseInt(prefs['reload' + pageType], 10);

			console.log(pageType + ': ' + reloadIndex[pageType] + ' = ' + reloadDelay);

			if (reloadIndex[pageType] && reloadDelay !== 0) {
				var timeLeft = reloadDelay * 1000 - (new Date().getTime() - reloadTimer);
				if (timeLeft > 0) {
					$('#gsDropboxExtenderReloadTimerWrap').show();
				}

				(function updateTimer() {
					timeLeft = reloadDelay * 1000 - (new Date().getTime() - reloadTimer);

					//Update timer display
					if (timeLeft > 0) {
						var min = Math.floor(timeLeft / 1000 / 60);
						var sec = Math.floor(timeLeft / 1000) - 60 * min;
						$('#gsDropboxExtenderReloadTimer').html(min + ':' + (sec < 10 ? '0' : '') + sec);

						//Color timer
						$('#gsDropboxExtenderReloadTimerWrap').css('color', 'rgba(' + (sec <= 30 && min === 0 ? '153' : '0') + ', 0, 0, 0.3)');

						setTimeout(updateTimer, 250);
					} else {
						//Timer has run out, so check if user is busy
						if (modalCount === 0 && !$postField.val() && $('.lia-slide-menu-content-right.lia-slide-menu-content-open').length === 0) {
							//User not busy, so reload the page
							document.location.reload();
						} else {
							//User busy, so add 1 minute to the timer
							reloadDelay += 60;
							updateTimer();
						}
					}
				})();
			}
		}

		if (page.posts.new.active || page.posts.reply.active || page.isPost) {
			//Add post snippets
			$('h3.answer-list-heading').css('margin-top', '5px');
			$('#gsDropboxExtenderPostExtras').append('<div id="gsDropboxExtenderPostExtras-inner" style="display:flex;padding-top:4px"><div style="flex:2"><select id="snippets" class="fancy" style="margin-bottom:0;margin-left:-12px;height:28px;font-size:14px"><option name="default" value="">' + (len(snippets) ? 'Select a snippet' : 'You don\'t have any snippets') + '</option><optgroup label="--Snippets--" /></select></div></div>');

			var snipOptionList = [];
			for (i in snippets) {
				if (snippets.hasOwnProperty(i)) {
					snipOptionList.push($('<option />', {
						text: i,
						value: snippets[i]
					}));
				}
			}
			$('#snippets optgroup').append(snipOptionList);

			$('#snippets').change(function() {
				if ($(this).val()) {
					insertTextAtCursorPosition($(this).val());
					$(this).val('');
				}
			});
		}

		//Manage drafts
		if (page.posts.reply.active || page.isPost) {
			var thread = strippedUrl;
			$('#gsDropboxExtenderPostExtras-inner').append('<div style="line-height24px;padding-top:4px"><span id="modpostdraft" class="clickable">Draft Post</span> - <span id="modpostrestoredraft" class="clickable">Restore Draft</span></div>');
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
			var link = page.front.value;
			var $options = $('.btn-group.language-selector a.dropdown-item');
			for (i = 0, l = $options.length; i < l; i++) {
				if (link.indexOf($options.eq(i).attr('href')) > -1) {
					link.splice(link.indexOf($options.eq(i).attr('href')), 1);
				}
			}

			$('.error-page div').html('<p style="text-align:center">Looks like you\'re all set! <a href="' + link[0] + '">Take me home!</a></p>');
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

			var modList = '<div style="flex:2"><select id="modIcon" class="gsDropboxExtenderPrefItem" name="modIcon"><option value="https://github.com/DBMods/forum-extender-plus/raw/master/bin/img/icons/nyancatright.gif" selected="selected">Nyan Cat (Default)</option>';

			var modIconList = ['Dropbox Flat', 'Dropbox Flat Green', 'Dropbox Flat Lime', 'Dropbox Flat Gold', 'Dropbox Flat Orange', 'Dropbox Flat Red', 'Dropbox Flat Pink', 'Dropbox Flat Purple', 'Dropbox', 'Dropbox Green', 'Dropbox Lime', 'Dropbox Gold', 'Dropbox Orange', 'Dropbox Red', 'Dropbox Pink', 'Dropbox Purple', 'Gold Star'];
			for (i = 0, l = modIconList.length; i < l; i++) {
				modList += '<option value="https://github.com/DBMods/forum-extender-plus/raw/master/bin/img/icons/' + modIconList[i].toLowerCase().replace(/ /g, '') + '.png">' + modIconList[i] + '</option>';
			}
			modList += '</select></div><div style="line-height:28px"><img id="modIconPreview" /></div>';

			//Load current settings
			var pref, $elemList = $('#main select, #main textarea, #main input[type="checkbox"]'), $elem;
			for (i = 0, l = $elemList.length; i < l; i++) {
				$elem = $elemList.eq(i), pref = prefTable.query({preferences: $elem.attr('name')})[0];
				if (pref) {
					if ($elem.is('select')) {
						$elem.find('option[value="' + pref[0].get('value') + '"]').attr('selected', 'selected');
					} else if ($elem.is('texarea')) {
						$elem.val(pref[0].get('value'));
					} else if ($elem.is('input[type="checkbox"]')) {
						$elem.prop('checked', pref[0].get('value'));
					}
				}
			}

			showModal({
				buttons: ['OK', 'Cancel'],
				title: 'Preferences',
				content: '<div style="padding-bottom:10px"><div style="box-sizing:border-box;display:inline-block;width:50%"><span id="gsDropboxExtenderSnippetManager" class="clickable">Snippet manager</span><a href="' + page.meta.credits.value + '" style="margin-left:20px">Script credits and thanks</a></div><div style="box-sizing:border-box;display:inline-block;width:50%;text-align:right"><button id="deleteprefs" class="bluebtn">Trash Preferences</button><button id="deletedrafts" class="bluebtn" style="margin-left:8px">Trash Drafts</button></div></div>'
						 + '<div style="display:flex"><div style="flex:2;padding-right:8px"><h2>Super User Icon</h2><div style="display:flex">' + modList + '</div><h2>Signature</h2><textarea class="gsDropboxExtenderPrefItem" name="signature" placeholder="Signature" rows="7" style="width:100%"></textarea></div><div style="padding-left:8px"><h2>Forum Theme</h2><select class="gsDropboxExtenderPrefItem" name="theme" disabled><option value="">No theme</option><option value="8.8.2012">8.8.2012 Original forum revamp</option></select><h2>Reload</h2><div><div style="display:inline-block;width:125.5px">Front page every</div><div style="display:inline-block;text-align:right;width:111px"><select class="gsDropboxExtenderPrefItem" name="reloadFront" style="margin-bottom:4px">' + reloadTimeList + '</select></div></div><div><div style="display:inline-block;width:125.5px">Forum pages every</div><div style="display:inline-block;text-align:right;width:111px"><select class="gsDropboxExtenderPrefItem" name="reloadForum" style="margin-bottom:4px">' + reloadTimeList + '</select></div></div><div><div style="display:inline-block;width:125.5px">Stickies every</div><div style="display:inline-block;text-align:right;width:111px"><select class="gsDropboxExtenderPrefItem" name="reloadSticky">' + reloadTimeList + '</select></div></div></div></div>',
				width: 750,
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

					$('#modIconPreview').attr('src', $('#modIcon').val());

					$('#modIcon').change(function() {
						$('#modIconPreview').attr('src', $('#modIcon').val());
					});

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
							content: '<div style="display:flex"><div style="flex:2"><select id="snippetlist"><option value="">' + (len(snippets) ? 'Select a snippet' : 'You don\'t have any snippets') + '</option></select></div><div><button id="loadsnippet" class="bluebtn">Load</button><button id="deletesnippet" class="bluebtn" style="margin-left:8px">Delete</button><button id="clearsnippet" class="bluebtn" style="margin-left:8px">Clear form</button></div></div><input type="hidden" id="oldname" value="" /><input id="friendlyname" type="text" placeholder="Friendly name"/><br><textarea id="snippetfull" placeholder="Snippet text" rows="7"></textarea><button id="savesnippet" class="bluebtn">Save</button>',
							width: 800,
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
										var snipKeys = Object.keys(snippets).sort();

										//Sort object alphabetically by property name
										var snipCache = snippets;
										snippets = {};
										for (i = 0, l = snipKeys.length; i < l; i++) {
											snippets[snipKeys[i]] = snipCache[snipKeys[i]];
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
                    //Save preferences
					$('.gsDropboxExtenderPrefItem').each(function() {
						prefs[$(this).attr('name')] = $(this).is('input[type="checkbox"]') ? $(this).prop('checked') : $(this).val();
					});

					//Modify existing Super User icons
					$userRole.filter(function() {return $(this).text() === 'Super User' || $(this).text() === 'Master of Super Users'}).find('img').attr('src', prefs.modIcon);

					write('prefs', prefs, function() {
						hoverMsg('success', 'Your preferences have been saved.');
					});
				}
			});
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

		if ((domain.site.indexOf('techgeek01.com') > 0 || domain.site === 'localhost') && slug.indexOf('dropboxextplus/') === 0 && pageUrl === 'register.php') {
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
	});
} else {
	console.log('Core API not authed');

	if (strippedUrl.indexOf('https://www.dropboxforum.com') === 0) {
		//If we're on the forums, append link to navbar
		$navBar.append(page.front.active || page.meta.authhelp.active ? '<span class="dropboxlink clickable" style="color:#c00;font-weight:bold">Link to Dropbox</span>' : '<span><a href="' + page.meta.authhelp.value + '" style="color:#c00;font-weight:bold">Link to Dropbox</a></span>');
	} else if (slug.indexOf('dropboxextplus/') === 0 && pageUrl === 'register.php') {
		//Otherwise, if we're working with the message system, append notice to page

		if (domain.site === 'localhost' || domain.site.indexOf('techgeek01.com') >= 0) { //TODO regex .match() this
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

		//Add home link
		$('#gsDropboxExtenderNav a:first').after('<span><a href="' + page.front.value + '">Take me home!</a></span>');

		//Remove large header block and  annoucement
		$('div.segment.segment--hero, div.segment.segment--announcement').remove();

		//Set up header and floats
		$latest.prepend('<div id="header" class="clearfix" />');
		$('#header').css('height', '94px');

		//Append user login nav
		var $langChange = $('.dropdown.language-selector .dropdown-menu a'), userNav;
		if (loggedIn) {
			userNav = 'Welcome, <a href="/hc/requests?community_id=public">' + $('#user-name').html() + '</a>'
					+ ' | <a href="https://www.dropbox.com/help" target="_blank">Help</a>'
					+ ' | <a href="' + $langChange.attr('href') + '">' + $langChange.html() + '</a>'
					+ ' | <a href="/access/logout">Log Out</a>';
		} else {
			var loginBtn = $('a.login');
			userNav = 'Welcome. <a href="' + loginBtn.attr('href') + '">Log in</a>'
					+ ' | <a href="https://www.dropbox.com/help" target="_blank">Help</a>'
					+ ' | <a href="' + $langChange.attr('href') + '">' + $langChange.html() + '</a>';
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
					'feedback': ['Product Feedback', ''],
					'recents': ['Recents', '']
				};
				//Create width topic list on front page
				var forumList = new ThemedTable('forumlist', ['Topic', 'Posts', 'Followers'], ['690px', '150px', '150px']);

				var names = Object.keys(desc);
				for (i = 0, l = desc.length; i < l; i++) {
					addTopicItem(forumList, names[i]);
				}

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
	} else {
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

//Url(value[, captureParams])
function Url() {
	var args = arguments;
	var val = args[0];
	var capParam = args[1] || false;

	//Sanity check
	if (typeof val === 'string') {
		this.value = 'https://www.dropboxforum.com/t5';

		if (val) {
			var bits = val.split('/');
			//If last directory is a wildcard, match everything starting with the parent, else match exact
			if (bits.pop() === '*') {
				if (bits.length >= 1) {
					this.value += '/' + bits.join('/');
				}

				this.value = this.value.split('#')[0];

				//If we don't capture params, trim them
				if (!capParam) {
					this.value = this.value.split('?')[0];
				}

				this.active = this.value === strippedUrl || strippedUrl.indexOf(this.value + '/') === 0;
			} else {
				this.value += '/' + val;
				this.value = this.value.split('#')[0];

				//If we don't capture params, trim them
				if (!capParam) {
					this.value = this.value.split('?')[0];
				}

				this.active = this.value === strippedUrl;
			}
		}
	} else if (typeof val === 'object') {
		this.value = [];
		for (i = 0, l = val.length; i < l; i++) {
			this.value[i] = 'https://www.dropboxforum.com/t5';
			if (val[i]) {
				var bits = val[i].split('/');
				//If last directory is a wildcard, match everything starting with the parent, else match exact
				if (bits.pop() === '*') {
					if (bits.length >= 1) {
						this.value[i] += '/' + bits.join('/');
					}

					this.value[i] = this.value[i].split('#')[0];

					//If we don't capture params, trim them
					if (!capParam) {
						this.value[i] = this.value[i].split('?')[0];
					}

					this.active = this.active || this.value[i] === strippedUrl || strippedUrl.indexOf(this.value[i] + '/') === 0;
				} else {
					this.value[i] += '/' + val[i];
					this.value[i] = this.value[i].split('#')[0];

					//If we don't capture params, trim them
					if (!capParam) {
						this.value[i] = this.value[i].split('?')[0];
					}

					this.active = this.active || this.value[i] === strippedUrl;
				}
			}
		}
	} else {
		this.value = null;
		this.active = false;
	}
}

//Create a table themed with the 8.8.2012 theme
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
		var mdString = base.replace(/<h1(?:\b.*)?>(.*)<\/h1>/g, '# $1\n')
				.replace(/<h2(?:\b.*)?>(.*)<\/h2>/g, '## $1\n')
				.replace(/<h3(?:\b.*)?>(.*)<\/h3>/g, '### $1\n')
				.replace(/<h4(?:\b.*)?>(.*)<\/h4>/g, '#### $1\n')
				.replace(/<h5(?:\b.*)?>(.*)<\/h5>/g, '##### $1\n')
				.replace(/<h6(?:\b.*)?>(.*)<\/h6>/g, '###### $1\n')
				.replace(/<strong(?:\b.*)?>(.*)<\/strong>/g, '**$1**')
				.replace(/<i(?:\b.*)?>(.*)<\/i>/g, '*$1*')
				.replace(/<p(?:\b.*)?>(.*)<\/p>/g, '$1\n')
				.replace(/<ol(?:\b.*)?><li(?:\b.*)?>(.*)<\/li><\/ol>/g, '1. $1')
				.replace(/<ul(?:\b.*)?><li(?:\b.*)?>(.*)<\/li><\/ul>/g, '* $1')
				.replace(/<a href="(.*)" *>(.*)<\/a>/g, '[$2]($1)')
				.replace(/<\/?[ou]l(?:\b.)*>/g, '')
				.replace(/(\n){3,}/g, '\n\n');
		return $.trim(baseSelect);
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
	var $stuff = $(postEventTarget).parent().parent().parent().parent().parent().parent().parent().parent()
            .find('div.lia-quilt-row-header div.lia-quilt-column-left span.UserName a');

	return '<strong><a href="' + $stuff.attr('href') + '">' + $stuff.find('span').html() + '</a></strong> scribbled:';
}

function getUserId(postEventTarget) {
	return $(postEventTarget).parent().parent().parent().find('.question-avatar, .answer-avatar').find('img').attr('src').split('/hc/user_avatars/')[1].split('?')[0];
}

//Insert markup at required position
function insertAndMarkupTextAtCursorPosition() {
	var args = arguments;
	var SelectedTextStart = $postField[0].selectionStart;
	var SelectedTextEnd = $postField[0].selectionEnd;
	var EndCursorPosition = SelectedTextStart;
	var SelectedText = '';

	//Sanity check
	for (i = 0, l = args.length; i < l; i++) {
		if (args[i].match(/[^a-zA-Z]*$/g) === null) {
			return false;
		}
	}

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

	return true;
}

//Insert text at required position
function insertTextAtCursorPosition(TextToBeInserted) {
	//Sanity check
	if (typeof TextToBeInserted !== 'string') {
		return;
	}

	console.log($postField.val());

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
	if (typeof quote === 'string' && typeof postAuthorDetails === 'string') {
		postAuthorDetails = postAuthorDetails || '';

		var SelectionStart = $postField[0].selectionStart;
		var newlineNeeded = SelectionStart && $postField.val().charAt(SelectionStart - 1) != '\n';
		var appendedText = '<blockquote>' + postAuthorDetails + '\n' + quote + '</blockquote>';
		appendedText = (newlineNeeded ? '\n' : '') + appendedText;

		insertTextAtCursorPosition(appendedText);
		$postField.setCursorPosition(SelectionStart + appendedText.length);

		return quote;
	}

	return undefined;
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
	if (typeof type === 'string' && typeof message === 'string') {
		$('.alertcontain').remove();
		$body.prepend('<div class="alertcontain" style="position:fixed;top:55px;left:0;right:0;text-align:center;z-index:9999"><div class="alert alert-' + type + '" style="display:inline-block;max-width:500px;padding:5px 15px;font-size:13px;border:1px solid;border-radius:4px">' + message + '</div></div>');
		setTimeout(function() {
			$('.alertcontain').fadeOut();
		}, 5000);
	} else {
		//Message type and content not both strings
		console.log('Cannot display hoverMsg, type and content must be valid strings');
	}
}

function showModal(modConfig) {
	//Sanity check
	if (typeof modConfig !== 'object') {
		return undefined;
	}

	var buttons = (modConfig.hasOwnProperty('buttons') && typeof modConfig.buttons === 'object') ? modConfig.buttons : undefined;
	var title = (modConfig.hasOwnProperty('title') && typeof modConfig.title === 'string') ? modConfig.title : undefined;
	var content = (modConfig.hasOwnProperty('content') && typeof modConfig.content === 'string') ? modConfig.content : undefined;

	var width = (modConfig.hasOwnProperty('width') && typeof modConfig.width === 'number') ? modConfig.width : 475;
	var init = (modConfig.hasOwnProperty('init') && typeof modConfig.init === 'function') ? modConfig.init : undefined;
	var action = (modConfig.hasOwnProperty('action') && typeof modConfig.action === 'function') ? modConfig.action : undefined;
	var actionTwo = (modConfig.hasOwnProperty('actionTwo') && typeof modConfig.actionTwo === 'function') ? modConfig.actionTwo : undefined;

	//Sanity check
	if (!buttons || !title || !content) {
		console.log('showModal() missing required parameters');
		return undefined;
	}

	modalCount++;

	$('#gsDropboxExtenderModalContainer').append('<div id="gsDropboxExtenderModalGroup' + (modalCount - 1) + '" style="position:fixed;display:none"><div class="gsDropboxExtenderScreenOverlay" style="position:fixed;bottom:0;right:0;top:0;left:0;background:#000;opacity:' + (modalCount > 1 ? '0.4' : '0.7') + ';border:1px solid #cecece;z-index:50" /><div class="gsDropboxExtenderModal" style="position:fixed;box-sizing:border-box;background:#fff;border:2px solid #cecece;border-radius:4px;z-index:50;padding:12px 12px 6px;font-size:13px"><a class="gsDropboxExtenderModalClose clickable" style="font-size:14px;line-height:14px;right:3.5px;top:4px;position:absolute;color:#007ee5;font-weight:700;display:block">X</a><h1 class="gsDropboxExtenderModalTitle" style="text-align:left;color:#007ee5;font-size:22px;font-weight:700;border-bottom:1px solid #ddd;margin:-2px 0 8px;padding-bottom:4px"></h1><div class="gsDropboxExtenderModalContent" /><div class="gsDropboxExtenderModalActionButtons" style="text-align:right" /></div></div>');
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

	$modal.css({
		'width': width + 'px',
		'left': (document.documentElement.clientWidth - width) / 2
	});

	if (init) {
		init();
	}

	$mGroup.show();

	$modal.css('top', ((document.documentElement.clientHeight - ($modal.height() + parseInt($modal.css('padding-top'), 10) + parseInt($modal.css('padding-bottom'), 10) + 4)) / 2) + 'px');

	$action.on('click', function() {
		action();
		$modal.css('top', ((document.documentElement.clientHeight - ($modal.height() + parseInt($modal.css('padding-top'), 10) + parseInt($modal.css('padding-bottom'), 10) + 4)) / 2) + 'px');
	});
	if (actionTwo) {
		$mGroup.find('.gsDropboxExtenderModalActionTwo').on('click', function() {
			actionTwo();
			$modal.css('top', ((document.documentElement.clientHeight - ($modal.height() + parseInt($modal.css('padding-top'), 10) + parseInt($modal.css('padding-bottom'), 10) + 4)) / 2) + 'px');
		});
	}

	$mGroup.find('.gsDropboxExtenderModalClose').add($mGroup.find('.gsDropboxExtenderModalCloseLink')).add($action).add($mGroup.find('.gsDropboxExtenderScreenOverlay')).on('click', function(){
		$mGroup.remove();
		modalCount--;
	});
}

function getRandomNumber() {
	return 4;
	//Chosen by fair dice roll. Guaranteed to be random.
}
