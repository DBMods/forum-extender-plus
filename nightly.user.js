// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2013.11.4pre1a
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/nightly.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/nightly.user.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_deleteValue
// ==/UserScript==

//Set global variables
var day = new Date();
var date = {
	month: day.getMonth()
};
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
var userId = $('#header .login a:first').attr('href').split('profile.php?id=')[1];

//Set up alerts
var alertSummary;

//Add footer
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Mod Icons ' + versionSlug(GM_info.script.version) + '</div>');

//Set up hover messages
$('body').prepend('<span id="modicon-message" style="display:none;border-width:1px;border-radius:5px;border-style:solid;position:fixed;top:10px;left:10px;padding:5px 10px;z-index:200" />');

//Modify Super User posts
highlightPost('Super User', color.gold);
if(pageUrl == 'topic.php') {
	$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').prepend('<img src="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" height="16px" width="40px" /> ');
	$('.threadauthor small a[href$="=1618104"]').html('Master of Super Users');
}

//Highlight posts by forum regulars green
highlightPost(6845, 3581696, 816535, 2122867, 434127, 85409, 1253356, 425513, 96972, color.green);

//Reskin the forums
forumVersion(GM_getValue('theme'));

//Flag threads
highlightThread(color.lightGreen, 1);
highlightThread(color.lightGold, 2);
highlightThread(color.lightRed, 3);

//Collapse footer
if(pageUrl != 'edit.php' && GM_getValue('collapseFooter')) {
	//Style footer
	$('#footer').css({
		'border': '1px solid #bbb',
		'border-bottom': 'none',
		'border-radius': '25px 25px 0 0'
	}).append($('span:last')).wrapInner('<div id="footercontent" />').prepend('<div id="footertoggle"><div id="footerarrowup" /><div id="footerarrowdown" style="display:none" /></div>');
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
reloadPage('Front');
reloadPage('Forum');
reloadPage('Sticky');

//Remove unnecessary stuff
if(pageUrl == 'topic.php')
	$('#post-form-title-container').remove();

//Detect and manage unstickied threads
if(pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length == 0 && $('#topic-info .topictitle:contains(") - ")').length > 0 && $('#topic-info .topictitle:contains(" Build - ")').length > 0) {
	var threadType = $('#topic-info .topictitle:contains(") - ")').html().split(') - ')[1].split(' Build - ')[0];
	if(confirm('This thread is no longer sticky. Would you like to attempt to find the latest ' + threadType.toLowerCase() + ' build thread?'))
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://forums.dropbox.com',
			onload: function(response) {
				var resp = response.responseText;
				var stickies = resp.split('<table id="latest">')[1].split('<td> ')[0].split(threadType)[0].split('<big><a href="');
				stickies = stickies[stickies.length - 1].split('">')[0];
				if(stickies != '')
					window.location.href = stickies;
			}
		});
}

if([0, 1, 11].indexOf(date.month) > -1 && !GM_getValue('disableFallingAnimations'))
	snowfall();

//Add nav bar
function navBar() {
	//Add prerequsites
	$("head").append('<style type="text/css">#modicon-nav > span{margin-left:20px}#modicon-nav{position:fixed;bottom:0;height:30px;border-top:1px solid #aaf;width:100%;line-height:30px;padding:0 0 0 105px;background:#fff;z-index:10}#modicon-nav-slideout-container{margin:0 auto;border-bottom:1px solid #ddd}#modicon-nav-slideout-container > *{list-style-type:none;margin:30px auto;width:800px;text-align: center}#modicon-nav > span:hover{cursor:pointer}#modicon-option-popup .clear{clear:both}#modicon-option-popup div.left{float:left;width: 50px}#modicon-option-popup div.right{float:right;padding-left:10px;width:50%;border-left:1px solid #ddd}#modicon-option-popup{display:none;position:fixed;width:600px;height:200px;background:#fff;border:2px solid #cecece;z-index:200;padding:12px;font-size:13px}#modicon-option-popup h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px}#modicon-option-trigger:hover,#modicon-option-close:hover{cursor:pointer}#modicon-option-close{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block}</style>');
	$('body').append('<div id="modicon-nav"><img id="modicon-option-trigger" src="https://2.gravatar.com/avatar/4a62e81113e89800386a9d9aab160aee?s=420" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-35px;z-index:11" /></div><div id="modicon-screen-overlay" style="display:none;position:fixed;height:100%;width:100%;top:0;left:0;background:#000;border:1px solid #cecece;z-index:50;opacity:0.7;" />');
	$('body').append('<div id="modicon-option-popup" style="position:fixed"><a id="modicon-option-close">x</a><h1>Mod Icons Options</h1><br/><br/><div class="left"><select name="theme"><optgroup label="Original Themes"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></optgroup><optgroup label="Custom Themes"><optgroup label="-- No Existing Custom Themes --"></optgroup></optgroup></select><br/><input type="checkbox" name="collapseFooter" value="y">Auto-collapse footer</input><br><input type="checkbox" name="disableFallingAnimations" value="y">Disable falling animations (like snow) for slower computers</input></div><div class="right">Reload front page every <select name="reloadFront"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload forum pages every <select name="reloadForum"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload stickies every <select name="reloadSticky"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select></div><br/><input type="button" tabindex="4" value="Save" id="modicon-option-save" style="clear:both;float:right;"></div>');
	$('body').prepend('<div id="modicon-nav-slideout-container" />');
	$('body').css('padding-bottom', '31px');

	//Handle options
	var optionDropdown = ['theme', 'reloadSticky', 'reloadForum', 'reloadFront'];
	var optionCheck = ['disableFallingAnimations', 'collapseFooter'];
	$('#modicon-option-trigger').click(function() {
		settingsVisible = true;
		var optionHeight = $('#modicon-option-popup').height(), optionWidth = $('#modicon-option-popup').width();
		
		$('#modicon-option-popup').css({
			'top': (document.documentElement.clientHeight - optionHeight) / 2,
			'left': (document.documentElement.clientWidth - optionWidth) / 2
		});

		//Load current settings
		for(i in optionDropdown) {
			if(GM_getValue(optionDropdown[i]))
				$('#modicon-option-popup [name="' + optionDropdown[i] + '"] option[value="' + GM_getValue(optionDropdown[i]) + '"]').attr('selected', 'selected');
		}
		for(i in optionCheck){
		    if(GM_getValue(optionCheck[i]))
		    $('#modicon-option-popup [name="' + optionCheck[i] + '"]').attr('checked', true);
		}

		$('#modicon-screen-overlay, #modicon-option-popup').show();
	});
	$('#modicon-option-close, #modicon-option-save').click(function() {
		$('#modicon-screen-overlay, #modicon-option-popup').hide();
	});
	$('#modicon-option-save').click(function() {
	    for(i in optionDropdown){
	        GM_setValue(optionDropdown[i], $('#modicon-option-popup [name="' + optionDropdown[i] + '"]').val());
	    }
	    for(i in optionCheck){
	        GM_setValue(optionCheck[i], $('#modicon-option-popup [name="' + optionCheck[i] + '"]').val() == 'y');
	    }
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
	for(i in profile.list) {
		$('#modactivity').append('<li>Loading . . .</li>');
		profile.load(i);
	}

	//Set up alert messages
	if(alertSummary) {
		$('#modicon-nav').append('<span id="modalerttrigger"><strong>Alert!</strong> ' + alertSummary.summary + '</span>');
		$('#modicon-nav-slideout-container').append('<div id="modalert" class="center">' + alertSummary.fullDesc + '</div>');
		$('#modalert').toggle();
		$('#modalerttrigger').click(function() {
			$('#modalert').slideToggle();
		});
	}

	//Add post templates
	if(pageUrl == 'topic.php' || pageUrl == 'edit.php') {
		var snippets = {
			blank: '<option value="">Select a snippet</option>',
			explainGroup: '<optgroup label="Explanations">',
			clientRunning: '<option value="Are you sure that the client is running? The client needs to be running for changes to sync.">Client running</option>',
			mouseOver: '<option value="What does Dropbox say when you mouse over the icon?">Mouseover</option>',
			helpArticleGroup: '</optgroup><optgroup label="Help Center Links">',
			selectiveSync: '<option value="<a href=\'https://www.dropbox.com/help/175\'>Selective Sync</a>">Selective Sync</option>',
			sharedLink: '<option value="<a href=\'https://www.dropbox.com/help/167\'>Shared Links</a>">Shared Links</option>',
			linksGroup: '</optgroup><optgroup label="Links">',
			desktopClient: '<option value="<a href=\'https://www.dropbox.com/install\'>desktop client</a>">Desktop Client</option>',
			supportTicketGroup: '</optgroup><optgroup label="Support tickets">',
			ticketLink: '<option value="Submit a support ticket at https://www.dropbox.com/support">Submit a ticket</option>',
			ticketSummary: '<option value="Tickets typically take 1-3 business days to get a reply, priority given to Pro and Business users.\n\nYou can track the status of your tickets over at <a href=\'http://dropbox.zendesk.com\'>Zendesk</a>.">Ticket summary</option>',
			modEditGroup: '</optgroup><optgroup label="Mod edits">',
			dupeThread: '<option value="Duplicate post: ">Duplicate post</option>',
			removeEmail: (profile.list.indexOf(userId) > -1 ? ('<option value="Edit: Email removed for security issues ~' + $('#header .login a:first').html().split(' ')[0] + '">Email removed</option>') : ''),
			moveThread: (profile.list.indexOf(userId) > -1 ? ('<option value="I moved this to ' + ['everything else', 'bugs &amp; troubleshooting', 'feature requests', 'mobile apps', 'API development'][$('#forum-id').val() - 1] + ' for you.">Move thread</option>') : ''),
			miscGroup: '</optgroup><optgroup label="Miscellaneous">',
			welcome: '<option value="Also, I see you\'re new here, so why don\'t we give you a proper welcome.\n\nDropbox is a wonderful service, and we hope you get to use it to its full potential. If you have an issue, you can always check the <a href=\'https://www.dropbox.com/help\'>Help Center</a>, but if you don\'t get an answer there, or it\'s a more complicated issue, these forums are a great place to visit.\n\nHere on the forums, there are a lot of people just like you, who ask the occasional question. There\'s also a small handful of regulars here, including Super Users like myself. We try to answer as many questions as we can, and most of us are here on an almost-daily basis. I think I can speak for all of us a regulars when I say that we love to see newcomers to the service. The forums are a great place to both ask and answer questions, and if you have another question in the future, don\'t hesitate to ask.\n\nWelcome to Dropbox. We hope you like it.">Welcome</option>',
			miscGroupClose: '</optgroup>'
		};
		$('#modicon-nav').append('<span><select id="snippets" /></span>');
		for(i in snippets) {
			$('#snippets').append(snippets[i]);
		}
		$('#snippets').change(function() {
			$('#post_content').val($('#post_content').val() + $(this).val());
		});
	}

	//Add post drafting
	if(pageUrl == 'topic.php') {
		var thread = window.location.href.split('id=')[1].split('&')[0].split('#')[0];
		$('#modicon-nav').append('<span id="modpostdraft">Draft Post</span><span id="modpostrestoredraft">Restore Draft</span>');
		$('#modpostdraft').click(function() {
			if($('#post_content').val()) {
				GM_setValue('draft-' + thread, $('#post_content').val());
				hoverMessage('Draft saved');
			} else
				hoverMessage('Your draft has no content', 'info');
		});
		$('#modpostrestoredraft').click(function() {
			var draft = GM_getValue('draft-' + thread);
			if(draft) {
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
		if((args.length == 2 && parseInt($(this).html(), 10) == args[1]) || (parseInt($(this).html(), 10) >= args[1] && parseInt($(this).html(), 10) <= args[2]))
			$(this).parent().css('background', args[0]);
	});
}

//Reload pages
function reloadPage(pageType) {
	var reloadIndex = {
		'Sticky': pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length > 0,
		'Front': pageUrl == 'forums.dropbox.com',
		'Forum': pageUrl == 'forum.php'
	};
	var reloadDelay = GM_getValue('reload' + pageType, 0);
	if(reloadIndex[pageType] && reloadDelay > 0) {
		setTimeout(function() {
			if(!settingsVisible && (pageUrl == 'topic.php') ? !$('#post_content').val() : true)
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
	if(pageUrl == 'topic.php')
		var rolePosts, status, message, totalPosts = $('.threadauthor').length;
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

//Skin forums
function forumVersion(versionDate) {
	//Fix UI for new semi-broken theme 10-8-2013
	$('#header').css('margin-top', '0');
	$('#header .home, #header .breadcrumb').hide();
	$('.freshbutton-blue, #postformsub').css('background', '#2180ce');
	$('#header').append($('.search').clone());
	$('#main .search').remove();
	$('#forumlist-container').css('top', '0');
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
	$('#main').css('clear', 'both');

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
			$('#latest tr:not(:first), .bb-root').css('background', '#f7f7f7');
			$('#latest, .alt').css('background', '#fff');
			$('#latest').css({
				'width': '866px',
				'border-top': '1px dotted #ccc'
			});
			$('.sticky, .super-sticky').css('background', '#deeefc');
		}
	} else if(pageUrl == 'forums.dropbox.com') {
		if(versionDate == 'original') {
			//Add tag list and reorder elements
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'love', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];
			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap" /></div>');
			for(var i in tagList) {
				$('#frontpageheatmap').append('<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a>');
			}
			$('#frontpageheatmap a:not(:last)').append(' ');
			$('#forumlist').attr('id', 'forumlist-temp').html('<tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr>');
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist" /><h2>Latest Discussions</h2>');
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
 * Snowfall jQuery plugin
 *
 * ====================================================================
 * LICENSE
 * ====================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ====================================================================
 *
 * Developed by Jason Brown
 * Email: loktar69@hotmail
 * Info: somethinghitme.com
 *
 * Modified for Greasemonkey by Andy Yasger
 */

function snowfall() {
	var options = {
		flakeCount: 100,
		flakeColor: '#eee',
		minSize: 2,
		maxSize: 6,
		minSpeed: 1,
		maxSpeed: 5,
		collection: false,
		collectionHeight: 40,
	};

	function random(min, max) {
		return Math.round(min + Math.random() * (max - min));
	};


	$('body').data("snowfall", this);

	//Snowflake object
	function Flake(_x, _y, _size, _speed, _id) {
		//Flake properties
		this.id = _id;
		this.x = _x;
		this.y = _y;
		this.size = _size;
		this.speed = _speed;
		this.step = 0;
		this.stepSize = random(1, 10) / 100;

		if(options.collection)
			this.target = canvasCollection[random(0, canvasCollection.length - 1)];

		$('body').append('<div id="flake-' + this.id + '" class="snowfall-flakes" />')
		$('#flake-' + this.id).css({
			'width': this.size,
			'height': this.size,
			'top': this.y,
			'left': this.x
		});

		this.element = document.getElementById('flake-' + this.id);

		//Update snowflakes and check current snowflake against bounds
		this.update = function() {
			this.y += this.speed;

			if(this.y > (elHeight) - (this.size + 6))
				this.reset();

			this.element.style.top = this.y + 'px';
			this.element.style.left = this.x + 'px';

			this.step += this.stepSize;

			this.x += Math.cos(this.step);

			//Pileup check
			if(options.collection && this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y) {
				var ctx = this.target.element.getContext("2d"), curX = this.x - this.target.x, curY = this.y - this.target.y, colData = this.target.colData;

				if(colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] !== undefined || curY + this.speed + this.size > this.target.height) {
					if(curY + this.speed + this.size > this.target.height) {
						while(curY + this.speed + this.size > this.target.height && this.speed > 0) {
							this.speed *= .5;
						}

						ctx.fillStyle = "#fff";

						if(colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] == undefined) {
							colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] = 1;
							ctx.fillRect(curX, (curY) + this.speed + this.size, this.size, this.size);
						} else {
							colData[parseInt(curX)][parseInt(curY + this.speed)] = 1;
							ctx.fillRect(curX, curY + this.speed, this.size, this.size);
						}
						this.reset();
					} else {
						//Flow to sides
						this.speed = 1;
						this.stepSize = 0;

						if(parseInt(curX) + 1 < this.target.width && colData[parseInt(curX)+1][parseInt(curY) + 1] == undefined)
							this.x++;
						else if(parseInt(curX) - 1 > 0 && colData[parseInt(curX)-1][parseInt(curY) + 1] == undefined)
							this.x--;
						else {
							//Stop
							ctx.fillStyle = "#fff";
							ctx.fillRect(curX, curY, this.size, this.size);
							colData[parseInt(curX)][parseInt(curY)] = 1;
							this.reset();
						}
					}
				}
			}

			if(this.x > (elWidth) - widthOffset || this.x < widthOffset)
				this.reset();
		}
		//Reset snowflake upon reach of set bounds
		this.reset = function() {
			this.y = 0;
			this.x = random(widthOffset, elWidth - widthOffset);
			this.stepSize = random(1, 10) / 100;
			this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
			this.speed = random(options.minSpeed, options.maxSpeed);
		}
	}

	//Local vars
	var flakes = [], flakeId = 0, i = 0, elHeight = $('body').height(), elWidth = $('body').width(), widthOffset = 0, snowTimeout = 0;

	//Collection Piece
	if(options.collection !== false) {
		var testElem = document.createElement('canvas');
		if(!!(testElem.getContext && testElem.getContext('2d'))) {
			var canvasCollection = [], elements = $(options.collection), collectionHeight = options.collectionHeight;

			for(var i = 0; i < elements.length; i++) {
				var bounds = elements[i].getBoundingClientRect(), canvas = document.createElement('canvas'), collisionData = [];

				if(bounds.top - collectionHeight > 0) {
					document.body.appendChild(canvas);
					canvas.style.position = 'absolute';
					canvas.height = collectionHeight;
					canvas.width = bounds.width;
					canvas.style.left = bounds.left + 'px';
					canvas.style.top = bounds.top - collectionHeight + 'px';

					for(var w = 0; w < bounds.width; w++) {
						collisionData[w] = [];
					}

					canvasCollection.push({
						element: canvas,
						x: bounds.left,
						y: bounds.top - collectionHeight,
						width: bounds.width,
						height: collectionHeight,
						colData: collisionData
					});
				}
			}
		} else
			//Canvas element not supported
			options.collection = false;
	}

	//Prevent horizontal scroll bar
	widthOffset = 25;

	//Bind window resize event to get innerHeight again
	$(window).bind("resize", function() {
		elHeight = $('body').clientHeight;
		elWidth = $('body').offsetWidth;
		console.log(elHeight);
	});
	//Initialize flakes
	for( i = 0; i < options.flakeCount; i += 1) {
		flakeId = flakes.length;
		flakes.push(new Flake(random(widthOffset, elWidth - widthOffset), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed), flakeId));
	}

	$('.snowfall-flakes').css({
		'border-radius': options.maxSize,
		'box-shadow': '1px 1px 1px #aaa',
		'background': options.flakeColor,
		'position': 'absolute',
		'fontSize': 0,
		'zIndex': 999999
	});

	//Control flow of updating snow
	function snow() {
		for( i = 0; i < flakes.length; i += 1) {
			flakes[i].update();
		}
		snowTimeout = setTimeout(function() {
			snow();
		}, 30);
	}

	snow();

	//Clear snowflakes
	this.clear = function() {
		$('.snowfall-flakes').remove();
		flakes = [];
		clearTimeout(snowTimeout);
	};
};

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