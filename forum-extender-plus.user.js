// ==UserScript==
// @name Dropbox Forum Extender+
// @namespace DropboxMods
// @description Beefs up the forums and adds way more functionality
// @include https://forums.dropbox.com/*
// @include https://www.dropboxforum.com/*
// @exclude https://www.dropboxforum.com/hc/admin/*
// @exclude https://www.dropboxforum.com/hc/user_avatars/*
// @version 2.3.0.10pre1a
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require https://www.dropbox.com/static/api/dropbox-datastores-1.2-latest.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @resource customStyle https://github.com/DBMods/forum-extender-plus/raw/master/styles/style.css
// @resource bootstrap https://github.com/DBMods/forum-extender-plus/raw/master/styles/bootstrap.css
// @resource bootstrap-theme https://github.com/DBMods/forum-extender-plus/raw/master/styles/bootstrap-theme.css
// @grant GM_xmlhttpRequest
// @grant GM_getResourceText
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

/*
 * ** List of needed changes **
 *
 * Reemphasize new replies to your threads
 * ** Form values aren't preloaded in preferences menu
 * ** Quoting needs to have differentiation between ordered and unordered lists
 * Messaging users directly from the forums does not work
 * Nested quoting
 * Fix Super User links
 * Messaging link is not appended to the nav bar
 * Fix makePage() styling
 * Fix post drafting
 * Fix forum messaging
 *
 *
 * ** Waiting on a published forum fix **
 *
 * $userRole fix
 * ** Sticky managing needs to be fixed
 * Thread reloading should be fixed now
 */

//Set global variables
var fullUrl = window.location.href, strippedUrl = fullUrl.split('?')[0];
var lang = fullUrl.split('https://www.dropboxforum.com/hc/')[1].split('/')[0];
var pageUrl = strippedUrl.split('https://www.dropboxforum.com/hc/' + lang)[1], urlVars = getUrlVars(), modalOpen = false, userId = '';
var color = {
	lightBlue: '#e7f2fc',
	green: '#beff9e',
	lightGreen: '#daffc7',
	gold: '#fff19d',
	lightGold: '#fff8ce',
	lightRed: '#ffe9e9'
};

$('head').append('<style>.textinput{padding:0px!important}</style>');

//Set up page parameters and list
var page = {
	front: new Url(''),
	newPost: new Url('community/posts/new'),
	//unanswered: new Url('https://www.dropboxforum.com/hc/communities/public/questions/unanswered'),
	topic: {
		//list: new Url('https://www.dropboxforum.com/hc/communities/public/topics'),
		apiDev: new Url('community/topics/200209245-API-Development'),
		bugs: new Url('community/topics/200203389-Bugs-Troubleshooting'),
		carousel: new Url('community/topics/200211225-Carousel-Photos'),
		desktopClient: new Url('community/topics/200210355-Desktop-Client-Builds'),
		dfb: new Url('community/topics/200284219-Dropbox-for-Business'),
		//everythingElse: new Url('https://www.dropboxforum.com/hc/communities/public/topics/200209235-Everything-Else'),
		feedback: new Url('community/topics/200209235-Product-Feedback'),
		//gettingStarted: new Url('https://www.dropboxforum.com/hc/communities/public/topics/200204189-Getting-Started'),
		mailbox: new Url('community/topics/200211215-Mailbox'),
		mobile: new Url('community/topics/200277665-Mobile'),
		mods: new Url('https://www.dropboxforum.com/hc/en-us/community/topics/200211775-Moderators-only'),
		personal: new Url('community/topics/200204189-Your-Personal-Dropbox'),
		deBugs: new Url('community/topics/200220199--DE-Fehler-und-Probleml%C3%B6sungen'),
		deOther: new Url('community/topics/200229725--DE-Allgemeine-Fragen'),
		frBugs: new Url('community/topics/200303965--FR-Probl%C3%A8mes-et-r%C3%A9solution'),
		frOther: new Url('community/topics/200294229--FR-Autres-sujets')
	},
	isPost: pageUrl.indexOf('/community/posts') > -1,
	isTopic: pageUrl.indexOf('/community/topics') > -1,
	check: function(check) {
		if (typeof check == 'string' && check.indexOf('://') > -1) {
			//Check if a URL is listed
			for (i in page) {
				if (page.hasOwnProperty(i)) {
					if (typeof page[i] != 'object') { //If the value is not an object, simply check
						if (page[i] == check) {
							return true;
						}
					} else { //If the value is an object, iterate through the inner loop as well
						for (var prop in page[i]) {
							if (page[i].hasOwnProperty(prop) && page[i][prop] == check) {
								return true;
							}
						}
					}
				}
			}
			return false;
		}
	}
};

//Append necessary elements
$('body.community-enabled').append('<div id="gsDropboxExtenderScreenOverlay" style="display:none;position:fixed;bottom:0;right:0;top:0;left:0;background:#000;border:1px solid #cecece;z-index:50;opacity:0.7" /><div id="gsDropboxExtenderModal" style="display:none;position:fixed;background:#fff;border:2px solid #cecece;z-index:50;padding:12px;font-size:13px"><a class="gsDropboxExtenderModalClose" style="font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block">x</a><h1 id="gsDropboxExtenderModalTitle" style="text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px"></h1><br /><br /><div id="gsDropboxExtenderModalContent" /><div id="gsDropboxExtenderModalActionButtons" style="text-align:right" /></div>');
$('body.community-enabled').append('<div id="gsDropboxExtenderNav"><a href="http://www.dropboxforum.com/hc/' + lang + '/preferences"' + (!page.front.active ? ' target="blank"' : '') + '><img src="https://raw.githubusercontent.com/DBMods/forum-extender-plus/master/resources/images/plus-sync-logo.png" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-33px;z-index:11" /></a><span><a href="https://www.dropboxforum.com/hc/en-us/community/posts/201168809-Dropbox-Forum-Extender-for-Greasemonkey">Official thread</a></span><span id="gsDropboxExtenderMessageContainer"><a id="gsDropboxExtenderMessageLink" href="https://www.techgeek01.com/dropboxextplus/index.php" target="blank">Messages</a><span id="gsDropboxExtenderMsgCounter"> <span style="color:#aaa">(Connecting)</span></span></span></div>').css('padding-bottom', '33px');
$('head').append('<style>.gsDropboxExtenderModalClose:hover{cursor:pointer}.alert-center{width:500px;position:absolute;left:50%;margin-left:-250px;z-index:1}.alert-warning{background-color:rgba(252,248,227,0.8);background-image:linear-gradient(to bottom,rgba(252,248,227,0.8) 0%,rgba(248,239,192,0.8) 100%);border-color:#f5e79e;color:rgba(138,109,59,0.8);background-image:-webkit-linear-gradient(top,#fcf8e3 0,#f8efc0 100%);background-repeat:repeat-x}.alert-danger{background-color:rgba(242,222,222,0.8);background-image:linear-gradient(to bottom,rgba(242,222,222,0.8) 0%,rgba(231,195,195,0.8) 100%);border-color:#dca7a7;color:rgba(169,68,66,0.8);background-image:-webkit-linear-gradient(top,#f2dede 0,#e7c3c3 100%);background-repeat:repeat-x}.alert-success{background-color:rgba(223,240,216,0.8);background-image:linear-gradient(to bottom,rgba(223,240,216,0.8) 0%,rgba(200,229,188,0.8) 100%);border-color:#b2dba1;color:rgba(60,118,61,0.8);background-image:-webkit-linear-gradient(top,#dff0d8 0,#c8e5bc 100%);background-repeat:repeat-x}.alert-info{background-color:rgba(217,237,247,0.8);background-image:linear-gradient(to bottom,rgba(217,237,247,0.8) 0%,rgba(185,222,240,0.8) 100%);border-color:#9acfea;color:rgba(49,112,143,0.8);background-image:-webkit-linear-gradient(top,#d9edf7 0,#b9def0 100%);background-repeat:repeat-x}.alert{max-width:500px;margin-left:auto;margin-right:auto;text-align:center;padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px;text-shadow:0 1px 0 rgba(255,255,255,.2);-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.25), 0 1px 2px rgba(0,0,0,.05);box-shadow:inset 0 1px 0 rgba(255,255,255,.25), 0 1px 2px rgba(0,0,0,.05)}.alert > p{margin-bottom:0}#gsDropboxExtenderNav>span{margin-left:20px}#gsDropboxExtenderNav{position:fixed;bottom:0;height:32px;border-top:1px solid #bbb;width:100%;line-height:30px;background:#fff;z-index:10;padding:0 0 0 105px}</style>');

//Element caching
var $body = $('body.community-enabled'), $head = $('head');
var $postForm = $('.comment-form'), $postField = $('#community_comment_body'), $postFormCleardiv = $postForm.find('div.clear');
var $thread = $('section.answers'), $threadAuthor = $('.answer-meta'), $userRole = $threadAuthor.find('small a');
var $latest = $('main'), $latestQuestions = $latest.find('div.post-overview');
var $forumList = $('.community-nav .pinned-categories'), $forumListRows = $forumList.find('div'), $forumListContainer = $('.community-nav');
var $navBar = $('#gsDropboxExtenderNav'), $modal = $('#gsDropboxExtenderModal'), $screenOverlay = $('#gsDropboxExtenderScreenOverlay');

if ($('#user-avatar').length) {
	userId = $('#user-avatar').attr('src').split('gravatar.com/avatar/')[1].split('?')[0];
}

//Bypass TinyMCE text box - Props to you Dropboxers for making this nearly impossible to do
if (page.isPost) {
	$postField.attr('name', 'gsDropboxExtenderTemp');
	$postField.on('focus', function() {
		console.log('Test');
		$postField.attr('name', 'community_comment[body]');
		$postField.off('focus');
	});
}

//Define empty variables
var temp, i, l;

//Add version number
//Was main.before
$('main').append('<div style="text-align: center; font-size: 11px;">Dropbox Forum Extender+ v' + GM_info.script.version + '</div>').css('margin-top', '14px');
$('main nav.community-nav').css('padding-top', '14px');

//highlightPost('Super User', color.gold);
//highlightPost(500, color.green, 'Forum regular');
//highlightPost(100, color.lightGreen, 'New forum regular');

function highlightPost(check, color, label) {
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
		var totalPosts = $threadAuthor.length, highlightingEnabled = !(totalPosts > 1 && rolePosts / totalPosts > 0.6), message = '<li style="text-align: center;">' + label + ' highlighting ' + (highlightingEnabled ? 'en' : 'dis') + 'abled</li>';
		$thread.prepend(message).append(message);
		if (highlightingEnabled) {
			$postList.parent().parent().parent().parent().find('.threadpost').css('background', color);
		}
	}
}

//Highlight threads
$latestQuestions.filter('.post-pinned').css('background', color.lightBlue);
highlightThread(1, color.lightGreen);
highlightThread(2, color.lightGold);
highlightThread(3, color.lightRed);

function highlightThread() {
	if (page.isTopic) {
		var args = arguments, $threadList = $latestQuestions.filter(':not(.post-pinned)').find('.post-overview-count:eq(0) strong'), content;
		//TODO filter out sticky threads
		for (i = 0, l = $threadList.length; i < l; i++) {
			content = parseInt($threadList.eq(i).html(), 10);
			if (content >= args[0] - 1 && content <= args[args.length - 2] - 1) {
				$threadList.eq(i).parent().parent().addClass('nochange').css('background', args[args.length - 1]);
			}
		}
	}
}
/*
//Emphasize new replies to threads you've interacted with
if (page.isPost) {
	$postForm.on('submit', function() {
		var d = new Date(), today = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
		if (GM_getValue('date', 0) < today) {
			//If we're starting a new day, flush all old threads, and start over
			GM_setValue('date', today);
			GM_setValue('todayThreads', urlVars.id);
			GM_setValue('postNumbers', [parseInt($('#topic_posts').html().split('(')[1].split(' ')[0], 10) + 1]);
		} else if (GM_getValue('date') == today) {
			//Otherwise, add the current thread ID to the list
			var todayThreads = GM_getValue('todayThreads', '').split(',');
			if (todayThreads.indexOf(urlVars.id) == -1) {
				//Add thread ID to list
				todayThreads.push(urlVars.id);
				GM_setValue('todayThreads', todayThreads.toString());
			}
			//Add post count for tracking purposes
			var postNumbers = GM_getValue('postNumbers', [0]);
			postNumbers[todayThreads.indexOf(urlVars.id)] = parseInt($('#topic_posts').html().split('(')[1].split(' ')[0], 10) + 1;
		}
	});
}
if (page.front.active || page.isTopic) {
	var todayThreads = GM_getValue('todayThreads', '').split(','), $threadPageList = $latest.find('tr:not(.sticky, .super-sticky) td:nth-child(1) a');
	for (i = 0, l = todayThreads.length; i < l; i++) {
		$threadPageList.filter('[href$="?id=' + todayThreads[i] + '"]').parent().parent().css('font-weight', 'bold');
	}

	//Later, only bold if post count different - prevents emphasis until change in thread
}

//Modify posts
//$userRole.filter('[href$="=1618104"]').html('Master of Super Users');

//Detect and manage unstickied threads
if ($('#topic-info .topictitle:contains(") - "):contains(" Build - ")').length) {
	var stickyList = GM_getValue('stickies', '').split(',');
	if ($('#topic_labels .sticky').length) {
		if (stickyList.indexOf(urlVars.id) == -1) {
			//If this thread is currently sticky, and is not monitored, start monitoring it
			stickyList.push(urlVars.id);
			GM_setValue('stickies', stickyList.toString());
		}
	} else if (stickyList.indexOf(urlVars.id) > -1) {
		//If this thread is not sticky, but was monitored, offer to load a new one
		stickyList.splice(stickyList.indexOf(urlVars.id), 1);
		GM_setValue('stickies', stickyList.toString());

		var threadType = $('#topic-info .topictitle').html().split(') - ')[1].split(' Build - ')[0];
		showModal(['Yes', 'No'], 'Find newer sticky?', 'This thread is no longer sticky. Would you like to attempt to find the latest ' + threadType.toLowerCase() + ' build thread? Regardless of your preference, you will not be reminded for this thread again.', function() {
			GM_xmlhttpRequest({
				method: 'GET',
				url: page.front,
				onload: function(response) {
					var newSticky = $(response.responseText).find('td:contains("' + threadType + '") big a');
					if (newSticky.length) {
						window.location.href = newSticky.eq(0).attr('href');

}				}
			});
		});
	}
}

/*
 * Forum post handlers
 */

/*
//Append the posting form if necessary
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

	$('.answer-meta, .question .question-meta').append(' - <a href="javascript:void(0)" class="gsDropboxExtenderQuoteSelected">Quote Selected</a> - <a href="javascript:void(0)" class="gsDropboxExtenderQuotePost">Quote Post</a>');
	$('#gsDropboxExtenderPostExtras').append('<span><a href="javascript:void(0)" class="gsDropboxExtenderLinkInsert">a</a> - <a href="javascript:void(0)" class="gsDropboxExtenderBlockquoteSelected">blockquote</a> - <a href="javascript:void(0)" class="gsDropboxExtenderStrongSelected">bold</a> - <a href="javascript:void(0)" class="gsDropboxExtenderEmSelected">italic</a> - <a href="javascript:void(0)" class="gsDropboxExtenderCodeSelected">code</a> (<a href="javascript:void(0)" class="gsDropboxExtenderQuoteCodeSelected">quoted</a>) - <a href="javascript:void(0)" class="gsDropboxExtenderListInsert">ordered list</a> - <a href="javascript:void(0)" class="gsDropboxExtenderListInsert">unordered list</a><span id="siglink" style="display:none"> - <a href="javascript:void(0)" class="gsDropboxExtenderSignatureInsert">custom signature</a></span></span>');

	//Quoting
	$('.gsDropboxExtenderQuotePost').on('click', function(evt) {
		var selectedText = $.trim($(evt.target).parent().parent().find('.question-text, .answer-text').html());
		insertSelectedQuote(selectedText, getPostAuthorDetails(evt.target));
	});
	$('.gsDropboxExtenderQuoteSelected').on('click', function(evt) {
		insertSelectedQuote(getSelectedHtml(), getPostAuthorDetails(evt.target));
	});
	/*$('.gsDropboxExtenderQuotePost').on('click', function(evt) {
		var selectedText = htmlToMarkdown($.trim($(evt.target).parent().parent().find('.question-text, .answer-text').html()));
		insertSelectedQuote(selectedText, getPostAuthorDetails(evt.target));
	});
	$('.gsDropboxExtenderQuoteSelected').on('click', function(evt) {
		insertSelectedQuote(htmlToMarkdown(getSelectedHtml()), getPostAuthorDetails(evt.target));
	});*/

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
		showModal(['Add', 'OK'], 'Add List', '<' + listType[0] + 'l id="gsDropboxExtenderListBox" style="padding-left:16px"></' + listType[0] + 'l><br /></div><div><div style="clear:both;height:20px;"><label style="float:left;">Item: </label><input id="gsDropboxExtenderListBoxTextBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" />', function() {
			var content = '<' + listType[0] + 'l>';
			for (i = 0, l = $('#gsDropboxExtenderListBox li').length; i < l; i++) {
				content += '<li>' + $('#gsDropboxExtenderListBox li').eq(i).html() + '</li>';
			}
			content += '</' + listType[0] + 'l>';
			insertTextAtCursorPosition(content);
			$postField.setCursorPosition($postField[0].selectionStart + content.length);
		}, function() {
			if ($('#gsDropboxExtenderListBoxTextBox').val()) {
				$('#gsDropboxExtenderListBox').append('<li>' + $('#gsDropboxExtenderListBoxTextBox').val() + '</li>');
				$('#gsDropboxExtenderListBoxTextBox').val('');
				var heightModifier = $('#gsDropboxExtenderListBox li:last').height();
				$modal.css({
					'top': (parseInt($modal.css('top'), 10) - (heightModifier / 2)),
					'height': $modal.css('height') + heightModifier
				});
			}
		});
	});
	/*$('.gsDropboxExtenderListInsert').on('click', function() {
		var listType = $(this).html().split(' ')[0];
		showModal(['Add', 'OK'], 'Add List', '<' + listType[0] + 'l id="gsDropboxExtenderListBox" style="padding-left:16px"></' + listType[0] + 'l><br /></div><div><div style="clear:both;height:20px;"><label style="float:left;">Item: </label><input id="gsDropboxExtenderListBoxTextBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" />', function() {
			var content = (listType[0] == 'u' ? '*' : '1.') + ' ' + $('#gsDropboxExtenderListBox li').eq(0).html();
			for (i = 1, l = $('#gsDropboxExtenderListBox li').length; i < l; i++) {
				content += '\n' + (listType[0] == 'u' ? '*' : ((i + 1) + '.')) + ' ' + $('#gsDropboxExtenderListBox li').eq(i).html();
			}
			insertTextAtCursorPosition(content);
			$postField.setCursorPosition($postField[0].selectionStart + content.length);
		}, function() {
			if ($('#gsDropboxExtenderListBoxTextBox').val()) {
				$('#gsDropboxExtenderListBox').append('<li>' + $('#gsDropboxExtenderListBoxTextBox').val() + '</li>');
				$('#gsDropboxExtenderListBoxTextBox').val('');
				var heightModifier = $('#gsDropboxExtenderListBox li:last').height();
				$modal.css({
					'top': (parseInt($modal.css('top'), 10) - (heightModifier / 2)),
					'height': $modal.css('height') + heightModifier
				});
			}
		});
	});*/

	//Insert a link
	$('.gsDropboxExtenderLinkInsert').on('click', function() {
		//TODO: Text boxes used to be 16px - Padding needs to be fixed
		showModal(['Add'], 'Add Link', '<div style="clear:both;height:20px"><label style="float: left;">Title: </label><input id="gsDropboxExtenderAnchorTextBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" /></div><div style="clear: both; height: 20px;"><label style="float:left;">Url: </label><input id="gsDropboxExtenderAnchorUrlBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" /></div>', function() {
			insertTextAtCursorPosition('<a href="' + $('#gsDropboxExtenderAnchorUrlBox').val() + '">' + $('#gsDropboxExtenderAnchorTextBox').val() + '</a>');
		});
	});
	/*$('.gsDropboxExtenderLinkInsert').on('click', function() {
		//TODO: Text boxes used to be 16px - Padding needs to be fixed
		showModal(['Add'], 'Add Link', '<div style="clear:both;height:20px"><label style="float: left;">Title: </label><input id="gsDropboxExtenderAnchorTextBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" /></div><div style="clear: both; height: 20px;"><label style="float:left;">Url: </label><input id="gsDropboxExtenderAnchorUrlBox" class="textinput" type="text" maxlength="500" size="100" style="height:22px;float:right;width:300px" /></div>', function() {
			insertTextAtCursorPosition('[' + $('#gsDropboxExtenderAnchorTextBox').val() + '](' + $('#gsDropboxExtenderAnchorUrlBox').val() + ')');
		});
	});*/
}

//Init pages
makePage('preferences', 'Preferences', 'Please wait while we load your preferences. This should only take a few seconds.');
makePage('snippets', 'Snippets', 'Please wait while we load the snippet manager. This should only take a few seconds.');

function makePage(slug, title, content) {
	if (pageUrl == slug) {
		$head.append('<style>' + GM_getResourceText('customStyle') + GM_getResourceText('bootstrap') + GM_getResourceText('bootstrap-theme') + '</style>').find('title').html('Forum Extender+ ' + title);
		$body.html('<div id="wrapper" class="container"><div class="jumbotron" id="main"><h2>' + title + '</h2><p class="topline">' + content + '</p></div></div><div class="container"><footer><hr><div>Developed by the DBMods team</div></footer></div><div class="container navbar-fixed-top"><div class="header"><ul class="nav nav-pills pull-left"><li class="inactive"><a href="' + page.front.value + '">Back to Forums</a></li></ul><div class="site-title"><h3 class="text-muted">Dropbox Forum Extender+</h3></div></div></div><script src="https://techgeek01.com/dropboxextplus/js/bootstrap.js"></script>');
		$('.header').css('background', 'none');
	}
	//this.active = pageUrl == slug;
}

/*
 * Work with Dropbox datastore API
 */

var client = new Dropbox.Client({key: 'qq5ygjct1pt4eud'});

function deleteTable(table) {
	var records = table.query(), i = records.length;
	while (i--) {
		records[i].deleteRecord();
	}
}

//Try to finish OAuth authorization
client.authenticate({
	interactive: false
}, function(error) {
	if (error) {
		console.log('Auth error. Retrying');
		document.location.reload();
	}
});

if (client.isAuthenticated()) {
	console.log('Authed Datastore API');
	client.getDatastoreManager().openDefaultDatastore(function(error, datastore) {
		if (error) {
			console.log('Error opening default datastore. Retrying');
			document.location.reload();
		}

		console.log('Opened Datastore')

		//Get tables
		var prefTable = datastore.getTable('prefs');
		var draftTable = datastore.getTable('draft');
		var configTable = datastore.getTable('config');
		var snippetTable = datastore.getTable('snippets');

		var snippets = snippetTable.query();
		var theme = prefTable.query({preference: 'theme'});
		var collapseFooter = prefTable.query({preference: 'collapseFooter'});
		var userToken = configTable.query({name: 'userToken'});

		var snippetList = [];
		for (i = 0, l = snippets.length; i < l; i++) {
			snippetList[i] = {
				name: snippets[i].get('name'),
				value: snippets[i].get('value')
			};
		}
		snippetList.sort(function (a, b) {
			if (a.name > b.name) {
				return 1;
			}
			if (a.name < b.name) {
				return -1;
			}
			return 0;
		});

		if (theme.length) {
			//forumVersion(theme[0].get('value'));
		}

		//Custom signature
		var sig = prefTable.query({name: 'signature'});
		$('#siglink').show();
		$('.gsDropboxExtenderSignatureInsert').on('click', function() {
			$postField.setCursorPosition($postField.val().length);
			insertTextAtCursorPosition("\n\n--\n" + (sig.length ? sig[0].get('value') : 'You haven\'t set your signature yet. Head over to the preferences menu to do that.'));
		});

		//reloadPage('Front');
		reloadPage('Forum');
		reloadPage('Sticky');

		function reloadPage(pageType) {
			var reloadIndex = {
				'Sticky': page.isPost && $('#topic_labels .sticky').length,
				'Front': page.front.active,
				'Forum': page.isTopic
			};
			var reloadDelay = prefTable.query({preference: 'reload' + pageType});
			if (reloadIndex[pageType] && reloadDelay.length && reloadDelay[0].get('value') != '0') {
				setTimeout(function() {
					if (!modalOpen && !$postField.val()) {
						document.location.reload();
					} else {
						reloadPage(pageType);
					}
				}, reloadDelay[0].get('value') * 1000);
			}
		}

		if (page.isPost) {
			//Add post snippets
			$('h3.answer-list-heading').css('margin-top', '5px');
			$('#gsDropboxExtenderPostExtras').append('<br><span id="gsDropboxExtenderPostExtras-inner"><select id="snippets"><option name="default" value="">' + (snippetList.length ? 'Select a snippet' : 'You don\'t have any snippets') + '</option><optgroup label="--Snippets--" /></select></span>');

			temp = [];
			for (i = 0, l = snippetList.length; i < l; i++) {
				temp.push($('<option />', {
					text: snippetList[i].name,
					value: snippetList[i].value
				}));
			}
			$('#snippets optgroup').append(temp);

			$('#snippets').change(function() {
				if ($(this).val()) {
					insertTextAtCursorPosition($(this).val());
					$(this).val('');
				}
			});

			//Manage drafts
			var thread = strippedUrl;
			$('#gsDropboxExtenderPostExtras-inner').append(' - <a href="javascript:void(0)" id="modpostdraft">Draft Post</a> - <a href="javascript:void(0)" id="modpostrestoredraft">Restore Draft</a>');
			$('#modpostdraft').on('click', function() {
				var draft = draftTable.query({pageid: thread});
				if ($postField.val()) {
					if (draft.length) {
						draft[0].set('draft', $postField.val());
					} else {
						draftTable.insert({
							pageid: thread,
							draft: $postField.val()
						});
					}
					$postField.focus();
					hoverMsg('success', 'Draft saved');
				} else {
					hoverMsg('info', 'Your draft has no content');
				}
			});
			$('#modpostrestoredraft').on('click', function() {
				var draft = draftTable.query({pageid: thread})[0];
				if (draft) {
					$postField.val(draft.get('draft'));
					$postField.focus();
					draft.deleteRecord();
					hoverMsg('success', 'Draft successfully restored');
				} else {
					hoverMsg('info', 'You don\'t have a draft for this thread');
				}
			});
		}

		//Pages
		if (pageUrl == 'preferences') {
			var reloadTimeList, reloadTimes = [0, 30, 60, 120, 300, 600, 900, 1200, 1800, 2700, 3600];
			for (i = 0, l = reloadTimes.length; i < l; i++) {
				reloadTimeList += '<option value="' + reloadTimes[i] + '">' + (reloadTimes[i] ? (reloadTimes[i] < 60 ? (reloadTimes[i] + ' seconds') : ((reloadTimes[i] / 60) + ' minute' + (reloadTimes[i] > 60 ? 's' : ''))) : 'Never') + '</option>';
			}
			$('#main .topline').html('<a href="snippets">Manage your snippets here!</a><br><br><textarea name="signature" placeholder="Signature" rows="5" style="width:100%"></textarea><br><br><select name="theme"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></select><br><input type="checkbox" id="collapseFooter" name="collapseFooter" /> <label for="collapseFooter" style="font-weight:normal">Automatically collapse footer</label><br><br>Reload front page every <select name="reloadFront">' + reloadTimeList + '</select><br>Reload forum pages every <select name="reloadForum">' + reloadTimeList + '</select><br>Reload stickies every <select name="reloadSticky">' + reloadTimeList + '</select><br><br><select id="modIcon" name="modIcon"><option value="https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/nyancatright.gif" selected="selected">Nyan Cat (Default)</option></select>&nbsp;<img id="modIconPreview"/><br><br><button class="btn btn-success" id="save">Save</button><button class="btn btn-warning btn-right" id="deleteprefs">Trash Preferences</button><button class="btn btn-warning btn-right" id="deletedrafts">Trash Drafts</button>');

			var modIconList = ['Dropbox Flat', 'Dropbox Flat Green', 'Dropbox Flat Lime', 'Dropbox Flat Gold', 'Dropbox Flat Orange', 'Dropbox Flat Red', 'Dropbox Flat Pink', 'Dropbox Flat Purple', 'Dropbox', 'Dropbox Green', 'Dropbox Lime', 'Dropbox Gold', 'Dropbox Orange', 'Dropbox Red', 'Dropbox Pink', 'Dropbox Purple', 'Gold Star'];
			temp = '';
			for (i = 0, l = modIconList.length; i < l; i++) {
				temp += '<option value="https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/' + modIconList[i].toLowerCase().replace(' ', '') + '.png">' + modIconList[i] + '</option>';
			}
			$('#modIcon').append(temp);

			//Load current settings
			var pref, $elemList = $('#main select, #main textarea, #main input[type="checkbox"]'), $elem;
			for (i = 0, l = $elemList.length; i < l; i++) {
				$elem = $elemList.eq(i), pref = prefTable.query({preference: $elem.attr('name')})[0];
				if (pref) {
					if ($elem.is('select')) {
						$elem.find('option[value="' + pref.get('value') + '"]').attr('selected', 'selected');
					} else if ($elem.is('texarea')) {
						$elem.val(pref.get('value'));
					} else if ($elem.is('input[type="checkbox"]')) {
						$elem.prop('checked', pref.get('value'));
					}
				}
			}

			$('#modIconPreview').attr('src', $('#modIcon').val());

			$('#deleteprefs').on('click', function() {
				deleteTable(prefTable);
				hoverMsg('warning', 'Preferences trashed.');
			});
			$('#deletedrafts').on('click', function() {
				deleteTable(draftTable);
				hoverMsg('warning', 'Drafts trashed.');
			});

			$('#modIcon').change(function() {
				$('#modIconPreview').attr('src', $('#modIcon').val());
			});
			$('#save').on('click', function() {
				$('#main select, #main textarea, #main input[type="checkbox"]').each(function() {
					var pref = prefTable.query({preference: $(this).attr('name')});
					if (pref.length) {
						pref[0].set('value', $(this).is('input[type="checkbox"]') ? $(this).prop('checked') : $(this).val());
					} else {
						prefTable.insert({
							preference: $(this).attr('name'),
							value: $(this).is('input[type="checkbox"]') ? $(this).prop('checked') : $(this).val()
						});
					}
				});
				hoverMsg('success', 'Your settings have been saved.');
			});
		}
		if (pageUrl == 'snippets') {
			$('#main .topline').html('<br><select id="snippetlist"><option value="">' + (snippetList.length ? 'Select a snippet' : 'You don\'t have any snippets') + '</option></select>&nbsp;&nbsp;<button id="loadsnippet" class="btn btn-success">Load</button><button id="deletesnippet" class="btn btn-danger">Delete</button><button id="clearsnippet" class="btn btn-primary">Clear form</button><br><br><input type="hidden" id="oldname" value="" /><input id="friendlyname" type="textbox" style="width:100%" placeholder="Friendly name"/><br><textarea id="snippetfull" placeholder="Snippet text" rows="9" style="width:100%"></textarea><button id="savesnippet" class="btn btn-success">Save</button>');

			var snippetName;
			temp = '';
			for (i = 0, l = snippetList.length; i < l; i++) {
				snippetName = snippetList[i].name;
				temp += '<option value="' + snippetName + '">' + snippetName + '</option>';
			}
			$('#snippetlist').append(temp);

			$('#loadsnippet').on('click', function() {
				if ($('#snippetlist').html() !== '') {
					var result = snippetTable.query({name: $('#snippetlist').val()})[0];
					$('#friendlyname, #oldname').val(result.get('name'));
					$('#snippetfull').val(result.get('value'));
				}
			});
			$('#deletesnippet').on('click', function() {
				if ($('#snippetlist').html() !== '') {
					snippetTable.query({name: $('#snippetlist').val()})[0].deleteRecord();
					$('#snippetlist option[value="' + $('#snippetlist').val() + '"]').remove();
					hoverMsg('warning', 'Snippet deleted');
					$('#friendlyname, #snippetfull').val('');
				}
			});
			$('#clearsnippet').on('click', function() {
				$('#oldname, #friendlyname, #snippetfull').val('');
			});

			$('#savesnippet').on('click', function() {
				if ($('#friendlyname').val() !== '' && $('#snippetfull').val() !== '') {
					var targetName = $('#oldname').val() === '' ? $('#friendlyname').val() : $('#oldname').val();
					var snip = snippetTable.query({name: targetName});
					if (snip.length) {
						snip[0].set('value', $('#snippetfull').val());
						snip[0].set('name', $('#friendlyname').val());
						if ($('#oldname').val() !== '') {
						$('#snippetlist option[value="' + $('#oldname').val() + '"]').val($('#friendlyname').val()).html($('#friendlyname').val());
					}
					} else {
						//If the snippet is new, add it to the list, and then re-sort the list to put it in the appropriate spot in the list
						snippetTable.insert({
							name: $('#friendlyname').val(),
							value: $('#snippetfull').val()
						});

						snippetList[snippetList.length] = {
							name: $('#friendlyname').val(),
							value: $('#snippetfull').val()
						};
						snippetList.sort(function (a, b) {
							if (a.name > b.name) {
								return 1;
							}
							if (a.name < b.name) {
								return -1;
							}
							return 0;
						});
						temp = '<option value="">' + $('#snippetlist option').eq(0).html() + '</option>';
						for (i = 0, l = snippetList.length; i < l; i++) {
							temp += '<option value="' + snippetList[i].name + '">' + snippetList[i].name + '</option>';
						}
						$('#snippetlist').html(temp);
					}
					$('#friendlyname, #snippetfull, #oldname').val('');
					hoverMsg('success', 'Snippet saved.');
				} else {
					hoverMsg('danger', 'Please fill out both fields.');
				}
			});
		}

		/*
		 * Messaging
		 */

		if (userId) {
			//If the message system is returning a token, log it
			if (urlVars.msgtoken) {
				var tokenval = urlVars.msgtoken;
				var redirUrl = fullUrl.indexOf('?msgtoken=') > -1 ? fullUrl.split('?msgtoken=')[0] : fullUrl.split('&msgtoken=')[0]; //Grab redirect URL
				if (userToken.length === 0) { //If we don't yet have a token, log it, otherwise, update it
					configTable.insert({
						name: 'userToken',
						value: tokenval
					});
				} else {
					userToken[0].set('value', tokenval);
				}
				datastore.syncStatusChanged.addListener(function() {
					//Wait until we've logged it successfully, then reload the page
					if (!datastore.getSyncStatus().uploading) {
						window.location.href = redirUrl;
					}
				});
			}

			var token = userToken[0].get('value') || '';
			var msgFormAction = userToken.length ? '' : '<input type="hidden" name="action" value="create-account" />';

			//Handle messages
			$('article.post .post-footer, .comment .comment-vote.vote').append('<img src="https://github.com/DBMods/forum-extender-plus/raw/master/resources/images/send-envelope.png" style="height:12px;position:relative;top:1px;margin-left:1.2rem;" /> <a href="javascript:void(0)" class="gsDropboxExtenderMessageUser">Message User</a>');
			$('article.post .post-footer .post-follow').css('margin-right', '0.4rem');
			$('.gsDropboxExtenderMessageUser').click(function() {
				showModal(['Send'], 'Message User', '<form id="gsDropboxExtenderMessageForm" action="https://www.techgeek01.com/dropboxextplus/process-message.php" method="post"><input type="hidden" name="userToken" value="' + token + '" />' + msgFormAction + '<input name="msgto" id="gsDropboxExtenderMsgTo" type="textbox" style="width:100%" placeholder="Recipient" value="' + getUserId(evt.target) + '"/><br><input name="msgfrom" id="gsDropboxExtenderMsgFrom" type="hidden" value = "' + userId + '"/><textarea name="msgtext" id="gsDropboxExtenderMsgText" style="width:100%" placeholder="Message"></textarea><input type="hidden" name="returnto" id="gsDropboxExtenderMsgReturnLocation" value="' + fullUrl + '" /></form>', function() {
					$('#gsDropboxExtenderModalContent form').submit();
				});
			});

			$('#gsDropboxExtenderMessageContainer').prepend('<form style="display:none" action="https://www.techgeek01.com/dropboxextplus/index.php" method="post"><input type="hidden" name="userToken" value="' + token + '" />' + msgFormAction + '<input type="hidden" name="returnto" value="' + fullUrl + '" /><input type="hidden" name="userid" value="' + userId + '" /><input type="hidden" name="timeOffset" value="' + new Date().getTimezoneOffset() + '" /></form>');
			$('#gsDropboxExtenderMsgCounter').html('');
			$('#gsDropboxExtenderMessageLink').attr('href', 'javascript:void(0)').attr('target', '');

			if (token) {
				(function checkMessages() {
					GM_xmlhttpRequest({
						method: 'GET',
						url: ('https://www.techgeek01.com/dropboxextplus/count-messages.php?to=' + userId + '&token=' + token),
						onload: function(response) {
							var resp = response.responseText;
							if (resp != 'Incorrect token') {
								$('#gsDropboxExtenderMsgCounter').html(resp > 0 ? (' (' + resp + ')') : '');
							} else {
								if ($('#gsDropboxExtenderMessageContainer form input[value="create-account"]').length === 0) {
									$('#gsDropboxExtenderMessageContainer form').append('<input type="hidden" name="action" value="create-account" />');
								}
								$('#gsDropboxExtenderMsgCounter').html(' (Bad token. Click to fix)');
							}
						}
					});
					setTimeout(checkMessages, 20000);
				})();
			}

			$('#gsDropboxExtenderMessageLink').on('click', function() {
				$('#gsDropboxExtenderMessageContainer form').submit();
			});
		}

		/*
		 * Aesthetics
		 */

		//Collapse footer
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
	$navBar.append('<span id="dropboxlink">' + ((page.check(fullUrl)) ? 'Link to Dropbox' : 'You\'re not linked to Dropbox yet, but you can do so from the <a href="' + page.front + '">front page</a>') + '</span>');

	//Start authentication process
	$('#dropboxlink').on('click', function(e) {
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
	if (versionDate == '8.8.2012') {
		//Reformat header
		$('main').css({
			'width': '990px',
			'margin': '0 auto',
			'background': 'url(https://forum-extender-plus.s3-us-west-2.amazonaws.com/forumsheader.jpg) no-repeat center top'
		});

		if (page.front.active || page.isTopic) {
			$('main').prepend('<div id="lfloat" style="float:left"><h2>Forums</h2></div><div id="rfloat" style="float:right"><h2>Latest Discussions</h2></div>');
			$('#lfloat h2, #rfloat h2').css({
				'line-height': '15px',
				'margin': '0 0 19px',
				'font-size': '17px',
				'font-weight': 'bold',
				'color': '#555'
			});
		}

		//Set up header and floats
		$('main').prepend('<div id="header" class="clearfix" />');
		$('#header').css('height', '94px');

		//Append user login nav
		var $langChange = $('.dropdown.language-selector .dropdown-menu a'), userNav;
		if (userId) {
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

			var topicHeader = '<span style="float:left">Topic — <a href="' + page.newPost.value + '" style="font-style:italic">Add New »</a></span><span style="float:right">Sort by:';
			var sorts = $('.community-sub-nav ul li');
			for (var i = 0, l = sorts.length; i < l; i++) {
				topicHeader += ' ' + sorts.eq(i).html();
			}
			topicHeader += '</span>';
			$('.community-sub-nav').remove();
			var topicList = new ThemedTable('latest', [topicHeader, 'Posts', 'Last Poster', 'Freshness'], ['547px', '48px', '92px', '71px']);
			var topics = $('.question-list li.question:not(.sticky-post)');
			var topic, topicMeta, title, count, last, freshness;
			for (var i = 0, l = topics.length; i < l; i++) {
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
				var topic, topicMeta, title, count, last, freshness;
				$topic = $(this);
				$topicMeta = $topic.find('.question-meta');

				title = '[sticky] ' + $topic.find('.question-title').html().replace('★  ', '');
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
			$('#header').css('height', '174px')
		}

		//Style buttons
		$('.bluebutton').css({
			'text-shadow': '#355782 0 1px 2px',
			'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.3),inset 0px 1px 0px #83C5F1',
			'padding': '5px 16px',
			'background-color': '#2180ce',
			'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#3baaf4", endColorstr="#2389dc")',
			'background-image': '-webkit-gradient(linear, left top, left bottom, from(#33a0e8), to(#2180ce))',
			'background-image': '-moz-linear-gradient(top, #33a0e8, #2180ce)',
			'font-weight': 'bold',
			'font-size': '13px',
			'line-height': '15px'
		}).on('mouseover', function() {
			$(this).css({
				'background-color': '#2389dc',
				'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#3baaf4", endColorstr="#2389dc")',
				'background-image': '-webkit-gradient(linear, left top, left bottom, from(#3baaf4), to(#2389dc))',
				'background-image': '-moz-linear-gradient(top, #3baaf4, #2389dc)'
			});
		}).on('mouseout', function() {
			$(this).css({
				'background-color': '#2180ce',
				'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#3baaf4", endColorstr="#2389dc")',
				'background-image': '-webkit-gradient(linear, left top, left bottom, from(#33a0e8), to(#2180ce))',
				'background-image': '-moz-linear-gradient(top, #33a0e8, #2180ce)'
			});
		});
	}
}

/*
 * Methods and prototyping
 */

function Url(value) {
	var args = arguments;
	if (args.length == 1) {
		this.value = 'https://www.dropboxforum.com/hc/' + lang;
		if (value) {
			this.value += '/' + value;
		}
		this.active = strippedUrl == this.value;
	}
}

//Create a tabled themed with the 8.8.2012 theme
function ThemedTable(id, cols, width) {
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
		this.content += '<tr style="background:' + ((this.count % 2 == 0 && this.count > 0) ? '#f7f7f7' : '#fff') + '">' + vals.join('') + '</tr>';
		this.value = '<table id="' + this.id + '" style="margin:0 auto;border:2px solid #f7f7f7' + (typeof this.width == 'string' ? (';width:' + this.width + '"') : '') + '">' + this.headers + this.content + '</table>';
	};
	this.sticky = function(vals) {
		for (i = 0, l = vals.length; i < l; i++) {
			vals[i] = '<td style="border:2px solid #f7f7f7;padding:3px 10px;font-size:12.5px">' + vals[i] + '</td>';
		}
		this.content = '<tr class="sticky" style="background:#f4faff">' + vals.join('') + '</tr>' + this.content;
		this.value = '<table id="' + this.id + '" style="margin:0 auto;border:2px solid #f7f7f7' + (typeof this.width == 'string' ? (';width:' + this.width + '"') : '') + '">' + this.headers + this.content + '</table>';
	};
	this.value = '<table id="' + this.id + '" style="margin:0 auto;border:2px solid #f7f7f7' + (typeof this.width == 'string' ? (';width:' + this.width + '"') : '') + '">' + this.headers + this.content + '</table>';
}

/*
 * Helper functions
 */

function htmlToMarkdown(base) {
	var baseSelect = base.replace(/<li>/g, '* ').replace(/<p>/g, '\n\n').replace(/<h1>/g, '# ').replace(/<h2>/g, '## ').replace(/<h3>/g, '### ').replace(/<h4>/g, '#### ').replace(/<h5>/g, '##### ').replace(/<h6>/g, '###### ').replace(/<\/?strong>/g, '**').replace(/<\/?i>/g, '*').replace(/<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>|<\/?ul>|<\/p>|<\/li>|<ol>|<\/ol>|<ul>|<\/ul>/g, '').replace(/<a href="/g, '[').replace(/(" .{1,})*">/g, '](').replace(/<\/a>/g, ')').replace(/\n\n/g, '\n');

	//Split off links into separate array
	var linkArray = baseSelect.match(/\[.+\]\(.+\)/g); //Everybody stand back, I know regular expressions!
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
}

function interleave(arr1, arr2) {
	if (arr2.length > arr1.length) {
		arr2.length = arr1.length;
	}
	var combinedArr = $.map(arr1, function(v, i) {
		return [v, arr2[i]];
	});
	var newArr = new Array();
	for(var i = 0, l = combinedArr.length; i < l; i++){
		if (combinedArr[i]){
			newArr.push(combinedArr[i]);
		}
	}
	return newArr;
}

//Get post author markup
function getPostAuthorDetails(postEventTarget) {
	var stuff = $(postEventTarget).parent().find('.question-author, .answer-author');
	return '<strong>' + ($(stuff).find('a').html() || $(stuff).html()) + '</strong> scribbled:';
}
/*function getPostAuthorDetails(postEventTarget) {
	var stuff = $(postEventTarget).parent().find('.question-author, .answer-author');
	return '**' + ($(stuff).find('a').html() || $(stuff).html()) + '** scribbled:';
}*/

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
	var offset = 0, i = args.length, temp = SelectedText;
	while (i--) {
		temp = '<' + args[i] + '>' + temp + '</' + args[i] + '>', offset += 2 + args[i].length;
	}
	insertTextAtCursorPosition(temp);
	if (!SelectedText) {
		$postField.setCursorPosition(EndCursorPosition + offset);
	}
}
/*function insertAndMarkupTextAtCursorPosition() {
	var args = arguments;
	var markdownMap = {
		'blockquote': ['> ', ''],
		'code': ['`', '`'],
		'em': ['*', '*'],
		'strong': ['**', '**']
	};
	var SelectedTextStart = $postField[0].selectionStart, SelectedTextEnd = $postField[0].selectionEnd, EndCursorPosition = SelectedTextStart, SelectedText = '';
	if (SelectedTextEnd - SelectedTextStart) {
		SelectedText = $postField.val().slice(SelectedTextStart, SelectedTextEnd);
	}
	var offset = 0, i = args.length, temp = SelectedText;
	while (i--) {
		temp = markdownMap[args[i]][0] + temp + markdownMap[args[i]][1], offset += markdownMap[args[i]][0].length;
	}
	insertTextAtCursorPosition(temp);
	if (!SelectedText) {
		$postField.setCursorPosition(EndCursorPosition + offset);
	}
}*/

//Insert text at required position
function insertTextAtCursorPosition(TextToBeInserted) {
	var startPos = $postField[0].selectionStart;
	$postField.val($postField.val().slice(0, startPos) + TextToBeInserted + $postField.val().slice($postField[0].selectionEnd));
	$postField.setCursorPosition(startPos + TextToBeInserted.length);
}

//Move cursor to set position in text area
$.fn.setCursorPosition = function(pos) {
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
};

//Insert quote
function insertSelectedQuote(quote, postAuthorDetails) {
	if (quote) {
		postAuthorDetails = postAuthorDetails || '';

		var SelectionStart = $postField[0].selectionStart;
		var newlineNeeded = SelectionStart && $postField.val().charAt(SelectionStart - 1) != '\n';
		var appendedText = '<blockquote>' + postAuthorDetails + '\n' + quote + '</blockquote>';
		appendedText = (newlineNeeded ? '\n' : '') + appendedText;

		insertTextAtCursorPosition(appendedText);
		$postField.setCursorPosition(SelectionStart + appendedText.length);
	}
}
/*function insertSelectedQuote(quote, postAuthorDetails) {
	if (quote) {
		postAuthorDetails = postAuthorDetails || '';

		var SelectionStart = $postField[0].selectionStart;
		var newlineNeeded = SelectionStart && $postField.val().charAt(SelectionStart - 1) != '\n';
		var appendedText = '> ' + postAuthorDetails + '\n' + quote;
		appendedText = (newlineNeeded ? '\n' : '') + appendedText.split('\n').join('\n> ').split(/> {2,}/g).join('> ').split('\n> \n').join('\n>\n') + '\n\n';

		insertTextAtCursorPosition(appendedText);
		$postField.setCursorPosition(SelectionStart + appendedText.length);
	}
}*/

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

function hoverMsg(type, message) {
	$('#alert-fade').parent().remove();
	$body.prepend('<div class="alert-center" style="position:fixed;top:50px;z-index:9999;font-size:21px"><div id="alert-fade" class="alert alert-' + type + '"><p><strong>' + message + '</strong></p></div></div>');
	setTimeout(function() {
		$('.alert-center').fadeOut();
	}, 5000);
}

function showModal(buttons, title, content, action, actionTwo) {
	modalOpen = true;

	//Assign classes to buttons
	var buttonMap = {
		'Add': (buttons.indexOf('OK') > -1 ? 'ActionTwo' : 'Action'),
		'Cancel': 'CloseLink',
		'No': 'CloseLink',
		'OK': 'Action',
		'Send': 'Action',
		'Yes': 'Action'
	};
	$('#gsDropboxExtenderModalTitle').html(title);
	$('#gsDropboxExtenderModalContent').html(content);

	temp = '';
	for (i = 0, l = buttons.length; i < l; i++) {
		temp += '<a href="javascript:void(0);" class="gsDropboxExtenderModal' + buttonMap[buttons[i]] + '" style="margin-left:18px">' + buttons[i] + '</a>';
	}
	$('#gsDropboxExtenderModalActionButtons').html(temp);

	//Cache elements
	var $action = $('.gsDropboxExtenderModalAction');

	$modal.css({
		'height': '200px',
		'width': '408px',
		'top': (document.documentElement.clientHeight - 200) / 2,
		'left': (document.documentElement.clientWidth - 408) / 2
	});

	$screenOverlay.add($modal).show();

	$('.gsDropboxExtenderModalClose, .gsDropboxExtenderModalCloseLink').add($action).add($screenOverlay).on('click', function(){
		$screenOverlay.add($modal).hide();
		modalOpen = false;
	});
	$action.on('click', action);
	if (actionTwo) {
		$('.gsDropboxExtenderModalActionTwo').on('click', actionTwo);
	}
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
