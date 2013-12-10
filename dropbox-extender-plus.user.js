// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2013.12.9pre1a
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @require https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/dropbox-extender-plus.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/dropbox-extender-plus.user.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

//Set global variables
var day = new Date(), pageUrl = getPageUrl(), settingsVisible = false;
var date = {
	month: day.getMonth()
};
var color = {
	green: '#b5ff90',
	lightGreen: '#daffc8',
	gold: '#fff19d',
	lightGold: '#fff8ce',
	red: '#ffd4d4',
	lightRed: '#ffe9e9'
}
var userId = $('#header .login a:first').attr('href').split('profile.php?id=')[1];

//Set up alerts
var alertSummary;

//Add footer
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Extender+ ' + versionSlug(GM_info.script.version) + '</div>');

//Set up hover messages
$('body').prepend('<span id="modicon-message" style="display:none;border-width:1px;border-radius:5px;border-style:solid;position:fixed;top:10px;left:10px;padding:5px 10px;z-index:200" />');

//Modify Super User posts
highlightPost('Super User', color.gold);
if (pageUrl == 'topic.php') {
	$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').prepend('<img src="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" />');
	$('.threadauthor small a[href$="=1618104"]').html('Master of Super Users');
}

if (pageUrl == 'forums.dropbox.com' || pageUrl == 'forum.php')
	$('#latest tr.closed span.label.closed').show();

//Highlight posts by forum regulars green
highlightPost(6845, 3581696, 816535, 2122867, 434127, 85409, 1253356, 425513, 96972, color.green);

//Flag threads
highlightThread(color.green, 1);
highlightThread(color.gold, 2);
highlightThread(color.lightRed, 3);

navBar();

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

//Fix UI for new semi-broken theme 10-8-2013
$('#header').css('margin-top', '0');
if (pageUrl == 'topic.php') {
	$('#topic-info').prepend('<br>').prepend($('#header .breadcrumb').clone());
}
$('#header .breadcrumb, #header .home').hide();
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

//Add nav bar
function navBar() {
	//Add prerequsites
	$('body').append('<div id="modicon-nav"><img id="modicon-option-trigger" src="https://2.gravatar.com/avatar/4a62e81113e89800386a9d9aab160aee?s=420" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-35px;z-index:11" /></div><div id="modicon-screen-overlay" style="display:none;position:fixed;height:100%;width:100%;top:0;left:0;background:#000;border:1px solid #cecece;z-index:50;opacity:0.7;" /><div id="modicon-option-popup" style="position:fixed" />');
	$('body').prepend('<div id="modicon-nav-slideout-container" />');
	$('body').css('padding-bottom', '31px');
	$('head').append('<style type="text/css">#modicon-nav > span{margin-left: 20px}#modicon-nav{position: fixed;bottom: 0;height: 30px;border-top: 1px solid #aaf;width: 100%;line-height: 30px;padding: 0 0 0 105px;background: #fff;z-index: 10}#modicon-nav-slideout-container{margin: 0 auto;border-bottom: 1px solid #ddd}#modicon-nav-slideout-container > *{list-style-type: none;margin: 30px auto;width: 800px;text-align: center}#modicon-nav > span:hover{cursor: pointer}#modicon-option-popup .clear{clear: both}#modicon-option-popup div.left{float: left;width: 50px}#modicon-option-popup div.right{float: right;padding-left: 10px;width: 50%;border-left: 1px solid #ddd}#modicon-option-popup{display: none;position: fixed;width: 600px;height: 225px;background: #fff;border: 2px solid #cecece;z-index: 200;padding: 12px;font-size: 13px}#modicon-option-popup h1{text-align: left;color: #6FA5FD;font-size: 22px;font-weight: 700;border-bottom: 1px dotted #D3D3D3;padding-bottom: 2px;margin-bottom: 20px}#modicon-option-trigger:hover, #modicon-option-close:hover{cursor: pointer}#modicon-option-close{font-size: 14px;line-height: 14px;right: 6px;top: 4px;position: absolute;color: #6fa5fd;font-weight: 700;display: block}</style>');

	//Add list content
	var resp;
	var profile = {
		list: [1618104, 11096, 175532, 30385, 67305, 857279, 643099, 182504, 1510497, 32911, 222573],
		load: function(i) {
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'https://forums.dropbox.com/profile.php?id=' + profile.list[i],
				onload: function(response) {
					var resp = response.responseText;
					$('#modactivity li:eq(' + i + ')').html('<a href="https://forums.dropbox.com/profile.php?id=' + profile.list[i] + '">' + resp.split('<title>')[1].split(' &laquo;')[0] + '</a> - last active ' + resp.split('<h4>Recent Replies</h4>')[1].split('<li>')[1].split('">')[2].split('</a>')[0]);
				}
			});
		}
	};

	//Add homepage link
	$('#modicon-nav').append('<span><a href="https://forums.dropbox.com">Take me home!</a></span>');

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
		$('#modicon-nav-slideout-container').append('<div d="modalert" class="center">' + alertSummary.fullDesc + '</div>');
		$('#modalert').toggle();
		$('#modalerttrigger').click(function() {
			$('#modalert').slideToggle();
		});
	}

	//Add post templates
	if (pageUrl == 'topic.php' || pageUrl == 'edit.php') {
		$('#modicon-nav').append('<span><select id="snippets"><option value="">Select a snippet</option><optgroup label="Explanations"><option value="Are you sure that the client is running? The client needs to be running for changes to sync.">Client running</option><option value="What does Dropbox say when you mouse over the icon?">Mouseover</option></optgroup><optgroup label="Help Center Links"><option value="<a href=\'https://www.dropbox.com/help/406\'>this Help Center article</a>">Overlay Icon Explanation</option><option value="<a href=\'https://www.dropbox.com/help/154\'>this Help Center article</a>">Missing Overlay Icons</option><option value="<a href=\'https://www.dropbox.com/help/175\'>Selective Sync</a>">Selective Sync</option><option value="<a href=\'https://www.dropbox.com/help/167\'>Shared Links</a>">Shared Links</option></optgroup><optgroup label="Links"><option value="<a href=\'https://www.dropbox.com/install\'>desktop client</a>">Desktop Client</option></optgroup><optgroup label="Support tickets"><option value="Submit a support ticket at https://www.dropbox.com/support">Submit a ticket</option><option value="Tickets typically take 1-3 business days to get a reply, priority given to Pro and Business users.\n\nYou can track the status of your tickets over at <a href=\'http://dropbox.zendesk.com\'>Zendesk</a>.">Ticket summary</option></optgroup><optgroup label="Mod edits"><option value="Duplicate post: ">Duplicate post</option><option value="Edit: Email removed for security issues ~' + $('#header .login a:first').html().split(' ')[0] + '">Email removed</option><option value="I moved this to ' + ['everything else', 'bugs &amp;troubleshooting', 'feature requests', 'mobile apps', 'API development'][$('#forum-id').val() - 1] + ' for you.">Move thread</option></optgroup><optgroup label="Miscellaneous"><option value="Also, I see you\'re new here, so why don\'t we give you a proper welcome.\n\nDropbox is a wonderful service, and we hope you get to use it to its full potential. If you have an issue, you can always check the <a href=\'https://www.dropbox.com/help\'>Help Center</a>, but if you don\'t get an answer there, or it\'s a more complicated issue, these forums are a great place to visit.\n\nHere on the forums, there are a lot of people just like you, who ask the occasional question. There\'s also a small handful of regulars here, including Super Users like myself. We try to answer as many questions as we can, and most of us are here on an almost-daily basis. I think I can speak for all of us a regulars when I say that we love to see newcomers to the service. The forums are a great place to both ask and answer questions, and if you have another question in the future, don\'t hesitate to ask.\n\nWelcome to Dropbox. We hope you like it.">Welcome</option></optgroup></select></span>');
		$('#snippets').change(function() {
			$('#post_content').val($('#post_content').val() + $(this).val());
		});
	}

	var client = new Dropbox.Client({
		key: 'qq5ygjct1pt4eud'
	});

	$('#modicon-nav').append('<span id="dropboxlink">Link to Dropbox</span>');

	var prefTable;

	$(function() {
		//Delete table
		function deleteTable(table) {
			var records = table.query();
			for (var i = 0; i < records.length; i++) {
				records[i].deleteRecord();
			}
		}

		//Start authentication process
		$('#dropboxlink').click(function(e) {
			e.preventDefault();
			client.authenticate();
		});
		//Try to finish OAuth authorization
		client.authenticate({
			interactive: false
		}, function(error) {
			if (error)
				alert('Authentication error: ' + error);
		});
		if (client.isAuthenticated()) {
			$('#dropboxlink').hide();
			$('#modicon-nav').append('<span id="deleteprefs">Trash Preferences</span><span id="deletedrafts">Trash Drafts</span>');

			client.getDatastoreManager().openDefaultDatastore(function(error, datastore) {
				if (error)
					alert('Error opening default datastore: ' + error);

				//Get tables
				var prefTable = datastore.getTable('prefs'), draftTable = datastore.getTable('draft');

				var theme = prefTable.query({
					preference: 'theme'
				}), collapseFooter = prefTable.query({
					preference: 'collapseFooter'
				});
				if (theme.length > 0)
					forumVersion(theme[0].get('value'));

				//Collapse footer
				if (pageUrl != 'edit.php' && collapseFooter.length > 0 && collapseFooter[0].get('value')) {
					//Style footer
					$('#footer').css({
						'border': '1px solid #bbb',
						'border-bottom': 'none',
						'border-radius': '25px 25px 0 0'
					}).append($('span:contains("Protected by Arash")')).wrapInner('<div id="footercontent" />').prepend('<div id="footertoggle"><div id="footerarrowup" /><div id="footerarrowdown" style="display:none" /></div>');
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

				if (pageUrl == 'topic.php') {
					var modIcon = prefTable.query({
						preference: 'modIcon'
					});
					if (modIcon.length > 0)
						$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').find('img').attr('src', modIcon[0].get('value'));
				}

				reloadPage('Front');
				reloadPage('Forum');
				reloadPage('Sticky');

				function reloadPage(pageType) {
					var reloadIndex = {
						'Sticky': pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length > 0,
						'Front': pageUrl == 'forums.dropbox.com',
						'Forum': pageUrl == 'forum.php'
					};
					var reloadDelay = prefTable.query({
						preference: 'reload' + pageType
					});
					if (window.location.href != 'https://forums.dropbox.com/?new=1' && reloadIndex[pageType] && reloadDelay.length > 0 && reloadDelay[0].get('value') > 0) {
						setTimeout(function() {
							if (!settingsVisible && (pageUrl == 'topic.php') ? !$('#post_content').val() : true)
								document.location.reload();
							else
								reloadPage(pageType);
						}, reloadDelay[0].get('value') * 1000);
					}
				}


				$('#deleteprefs').click(function() {
					deleteTable(prefTable);
					hoverMessage('Preferences trashed');
				});
				$('#deletedrafts').click(function() {
					deleteTable(draftTable);
					hoverMessage('Drafts trashed');
				});
				//Manage preferences
				$('#modicon-option-popup').html('<a id="modicon-option-close">x</a><h1>Mod Icons Options</h1><br/><br/><div class="left"><select name="theme"><optgroup label="Original Themes"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></optgroup><optgroup label="Custom Themes"><optgroup label="-- No Existing Custom Themes --"></optgroup></optgroup></select><br/><input type="checkbox" name="collapseFooter" value="y">Auto-collapse footer</input></div><div class="right">Reload front page every<select name="reloadFront"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload forum pages every<select name="reloadForum"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload stickies every<select name="reloadSticky"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br><select id="modiconicon" name="modIcon"><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxflat.png">Dropbox Flat</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxflatgreen.png">Dropbox Flat Green</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxflatlime.png">Dropbox Flat Lime</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxflatgold.png">Dropbox Flat Gold</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxflatorange.png">Dropbox Flat Orange</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxflatred.png">Dropbox Flat Red</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxflatpink.png">Dropbox Flat Pink</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxflatpurple.png">Dropbox Flat Purple</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropbox.png">Dropbox</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxgreen.png">Dropbox Green</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxlime.png">Dropbox Lime</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxgold.png">Dropbox Gold</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxorange.png">Dropbox Orange</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxred.png">Dropbox Red</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxpink.png">Dropbox Pink</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/dropboxpurple.png">Dropbox Purple</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forum-mod-icons/goldstar.png">Gold Star</option><option value="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" selected="selected">Nyan Cat (Default)</option></select><img id="modiconiconpreview"/></div><br/><input type="button" tabindex="4" value="Save" id="modicon-option-save" style="clear:both;float:right;">');

				var optionDropdown = ['theme', 'reloadSticky', 'reloadForum', 'reloadFront', 'modIcon'];
				var optionCheck = ['collapseFooter'];
				$('#modicon-option-trigger').click(function() {
					settingsVisible = true;
					var optionHeight = $('#modicon-option-popup').height(), optionWidth = $('#modicon-option-popup').width(), pref;

					$('#modicon-option-popup').css({
						'top': (document.documentElement.clientHeight - optionHeight) / 2,
						'left': (document.documentElement.clientWidth - optionWidth) / 2
					});

					//Load current settings
					for (i in optionDropdown) {
						pref = prefTable.query({preference: optionDropdown[i]})[0];
						if (pref) {
							$('#modicon-option-popup [name="' + optionDropdown[i] + '"] option[value="' + pref.get('value') + '"]').attr('selected', 'selected');
						}
					}
					$('#modiconiconpreview').attr('src', $('#modiconicon').val());
					for (i in optionCheck) {
						pref = prefTable.query({preference: optionCheck[i]})[0];
						if (pref) {
							$('#modicon-option-popup [name="' + optionCheck[i] + '"]').attr('checked', true);
						}
					}

					$('#modicon-screen-overlay, #modicon-option-popup').show();
				});
				$('#modiconicon').change(function() {
					$('#modiconiconpreview').attr('src', $('#modiconicon').val());
				});
				$('#modicon-option-close, #modicon-option-save').click(function() {
					$('#modicon-screen-overlay, #modicon-option-popup').hide();
				});
				$('#modicon-option-save').click(function() {
					var pref;
					for (i in optionDropdown) {
						pref = prefTable.query({
							preference: optionDropdown[i]
						});
						if (pref.length > 0)
							pref[0].set('value', $('#modicon-option-popup [name="' + optionDropdown[i] + '"]').val());
						else
							prefTable.insert({
								preference: optionDropdown[i],
								value: $('#modicon-option-popup [name="' + optionDropdown[i] + '"]').val()
							});
					}
					for (i in optionCheck) {
						pref = prefTable.query({
							preference: optionCheck[i]
						});
						if (pref.length > 0)
							pref[0].set('value', $('#modicon-option-popup [name="' + optionCheck[i] + '"]').val() == 'y');
						else
							prefTable.insert({
								preference: optionCheck[i],
								value: $('#modicon-option-popup [name="' + optionCheck[i] + '"]').val() == 'y'
							});
					}
					if (pageUrl == 'topic.php')
						$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').find('img').attr('src', $('#modiconicon').val());
					settingsVisible = false;
					hoverMessage('Your settings have been saved.\n\nMost new settings won\'t take effect until the page is reloaded.');
				});
				//Manage drafts
				if (pageUrl == 'topic.php') {
					var thread = window.location.href.split('id=')[1].split('&')[0].split('#')[0];
					$('#modicon-nav').append('<span id="modpostdraft">Draft Post</span><span id="modpostrestoredraft">Restore Draft</span>');
					$('#modpostdraft').click(function() {
						var draft = draftTable.query({
							pageid: thread
						});
						if ($('#post_content').val()) {
							if (draft.length > 0)
								draft[0].set('draft', $('#post_content').val());
							else
								draftTable.insert({
									pageid: thread,
									draft: $('#post_content').val()
								});
							$('#post_content').focus();
							hoverMessage('Draft saved');
						} else
							hoverMessage('Your draft has no content', 'info');
					});
					$('#modpostrestoredraft').click(function() {
						var draft = draftTable.query({pageid: thread})[0];
						if (draft) {
							$('#post_content').val(draft.get('draft'));
							$('#post_content').focus();
							draft.deleteRecord();
							hoverMessage('Draft successfully restored');
						} else
							hoverMessage('You don\'t have a draft for this thread', 'info');
					});
				}
			});
		}
	});
}

//Highlight forum threads based on post count
function highlightThread() {
	var args = arguments;
	$('#latest tr:not(.sticky, .super-sticky) td:nth-child(2)').each(function() {
		if ((args.length == 2 && parseInt($(this).html(), 10) == args[1]) || (parseInt($(this).html(), 10) >= args[1] && parseInt($(this).html(), 10) <= args[2]))
			$(this).parent().css('background', args[0]);
	});
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
			$('#latest tr:not(:first), .bb-root').css('background', '#f7f7f7');
			$('#latest, .alt').css('background', '#fff');
			$('#latest').css({
				'width': '866px',
				'border-top': '1px dotted #ccc'
			});
			$('.sticky, .super-sticky').css('background', '#deeefc');
		}
	} else if (pageUrl == 'forums.dropbox.com') {
		if (versionDate == 'original') {
			//Add tag list and reorder elements
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'love', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];
			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap" /></div>');
			for (var i in tagList) {
				$('#frontpageheatmap').append('<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a>');
			}
			$('#frontpageheatmap a:not(:last)').append(' ');
			$('#forumlist').attr('id', 'forumlist-temp').html('<tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr>');
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist" /><h2>Latest Discussions</h2>');
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
 * Begin Rchard's Forum Extender Stuff
 *
 * TODO Rewrite and minify stuff
 */

var Signature = "Set your custom signature here - use \n for new lines";

//Parameters
var PostTextAreaName = "post_content";
var TopicPageRecordLimit = 30;

/*
 * Forum post handlers
 */

$("head").append('<style type="text/css" charset="utf-8">#gsDropboxExtender-anchor-popup{display:none;position:fixed;height:200px;width:408px;background:#fff;border:2px solid #cecece;z-index:51;padding:12px;font-size:13px;}#gsDropboxExtender-listbox-popup{display:none;position:fixed;_position:absolute;height:200px;width:408px;background:#fff;border:2px solid #cecece;z-index:51;padding:12px;font-size:13px;}#gsDropboxExtender-anchor-popup h1, #gsDropboxExtender-listbox-popup h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px;}.gsDropboxExtenderPopupClose:hover{cursor: pointer;}.gsDropboxExtenderPopupClose{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block;}#gsDropboxExtender-listbox-unordered, #gsDropboxExtender-listbox-ordered{margin-left: 20px;}</style>');
$('body').append('<div id="gsDropboxExtender-anchor-popup"><a id="gsDropboxExtenderAnchorClose" class="gsDropboxExtenderPopupClose">x</a><h1>Add Link</h1><br /><br /><div><div style="clear: both; height: 20px;"><label style="float: left;">Title: </label><input id="gsDropboxExtenderAnchorTextBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div><div style="clear: both; height: 20px;"><label style="float: left;">Url: </label><input id="gsDropboxExtenderAnchorUrlBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div><br /><input type="submit" tabindex="4" value="Add Link" class="button" name="Submit" id="gsDropboxExtenderAnchorAddLink" style="clear: both; float: right;"></div><div id="gsDropboxExtender-listbox-popup"><a id="gsDropboxExtenderListBoxClose" class="gsDropboxExtenderPopupClose">x</a><h1>Add List</h1><div><ul id="gsDropboxExtender-listbox-unordered"></ul><ol id="gsDropboxExtender-listbox-ordered"></ol><br /></div><div><div style="clear: both; height: 20px;"><label style="float: left;">Item: </label><input id="gsDropboxExtenderListBoxTextBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div><br /><input type="submit" tabindex="4" value="Add Item" class="button" name="Submit" id="gsDropboxExtenderListBoxAddItem" style="clear: both; float: right;"><br /><br /><input type="submit" tabindex="4" value="Ok" class="button" name="Submit" id="gsDropboxExtenderListBoxOk" style="clear: both; float: right;"></div>');

//Append the posting form if necessary
if ($('form#postform:first').length == 0) {
	var PostFormPageUrl = $('h2.post-form a:first').attr('href');
	var PostFormPageData = $.get(PostFormPageUrl, function(data) {
		$('div#main').append($(data).find('form#postform:first'));
		$('h2.post-form a:first').remove();
		if (pageUrl == 'topic.php')
			$('#post-form-title-container').remove();
		$('.freshbutton-blue, #postformsub').css('background', '#2180ce');
		addMarkupLinks();
	}, 'html');
} else
	addMarkupLinks();

function addMarkupLinks() {
	//Add the quote links to the posts
	$('.poststuff').append(' - <a href="javascript:void(0)" class="gsDropboxExtenderQuoteSelected">quote selected</a> - <a href="javascript:void(0)" class="gsDropboxExtenderQuotePost">quote post</a>');
	$('p.submit').append('<span style="float: left;"> - <a href="javascript:void(0)" class="gsDropboxExtenderAnchorSelected">a</a> - <a href="javascript:void(0)" class="gsDropboxExtenderBoldSelected">bold</a> - <a href="javascript:void(0)" class="gsDropboxExtenderItalicSelected">italic</a> - <a href="javascript:void(0)" class="gsDropboxExtenderCodeSelected">code</a> - <a href="javascript:void(0)" class="gsDropboxExtenderOrderedListInsert">ordered list</a> - <a href="javascript:void(0)" class="gsDropboxExtenderUnorderedListInsert">unordered list</a> - <a href="javascript:void(0)" class="gsDropboxExtenderSignatureInsert">custom signature</a></span>');
}

//Quote current post
$('.gsDropboxExtenderQuotePost').click(function(evt) {
	var SelectedText = $(evt.target).parent().parent().find(".post").eq(0).text();
	SelectedText = SelectedText.substring(0, SelectedText.length - 1);
	insertSelectedQuote(SelectedText, getPostAuthorDetails(evt.target));
});

//Quote selected text
$('.gsDropboxExtenderQuoteSelected').click(function(evt) {
	insertSelectedQuote(getSelectedText(), getPostAuthorDetails(evt.target));
});

//Markup text
$('.gsDropboxExtenderBoldSelected').click(function() {
	insertAndMarkupTextAtCursorPosition('strong');
});
$('.gsDropboxExtenderItalicSelected').click(function() {
	insertAndMarkupTextAtCursorPosition('em');
});
$('.gsDropboxExtenderCodeSelected').click(function() {
	insertAndMarkupTextAtCursorPosition('code');
});

//Insert a list
var listType = '';
$('.gsDropboxExtenderUnorderedListInsert').click(function() {
	showListBoxPopUp('u');
});
$('.gsDropboxExtenderOrderedListInsert').click(function() {
	showListBoxPopUp('o');
});
$('#gsDropboxExtenderListBoxClose').click(function() {
	hideListBoxPopUp();
});
$('#gsDropboxExtenderListBoxAddItem').click(function() {
	if ($('#gsDropboxExtenderListBoxTextBox').val().length == 0)
		return;

	var slug = listType == 'u' ? 'un' : '';
	$('#gsDropboxExtender-listbox-' + slug + 'ordered').append("<li>" + $('#gsDropboxExtenderListBoxTextBox').val() + "</li>");

	$('#gsDropboxExtenderListBoxTextBox').val('');
	$("#gsDropboxExtender-listbox-popup").height($("#gsDropboxExtender-listbox-popup").height() + 20);
});
$('#gsDropboxExtenderListBoxOk').click(function() {
	var slug = listType == 'u' ? 'un' : '';
	var CursorStartPosition = $('#' + PostTextAreaName)[0].selectionStart;

	var content = $(listType + 'l#gsDropboxExtender-listbox-' + slug + 'ordered').html();
	insertTextAtCursorPosition('<' + listType + 'l>\n' + content + '\n</' + listType + 'l>');
	setCursorPositionInTextArea(PostTextAreaName, CursorStartPosition + content.length + 11);

	hideListBoxPopUp();
});

//Insert an anchor
$('.gsDropboxExtenderAnchorSelected').click(function() {
	showAnchorPopUp();
});
$('#gsDropboxExtenderAnchorClose').click(function() {
	hideAnchorPopUp();
});
$('#gsDropboxExtenderAnchorAddLink').click(function() {
	hideAnchorPopUp();
	insertTextAtCursorPosition("<a href='" + $('#gsDropboxExtenderAnchorUrlBox').val() + "'>" + $('#gsDropboxExtenderAnchorTextBox').val() + "</a>");
});

//Add signature
$('.gsDropboxExtenderSignatureInsert').click(function() {
	setCursorPositionInTextArea(PostTextAreaName, $('#' + PostTextAreaName).val().length);
	insertTextAtCursorPosition("\n\n--\n" + Signature);
});

/*
 * Popup windows
 */

function showListBoxPopUp(_listType) {
	listType = _listType;

	$('ol#gsDropboxExtender-listbox-ordered, ol#gsDropboxExtender-listbox-unordered').empty();
	$('#gsDropboxExtenderListBoxTextBox').val('');

	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $("#gsDropboxExtender-listbox-popup").height();
	var popupWidth = $("#gsDropboxExtender-listbox-popup").width();

	$("#gsDropboxExtender-listbox-popup").css({
		"position": "fixed",
		"top": windowHeight / 2 - popupHeight / 2,
		"left": windowWidth / 2 - popupWidth / 2
	});

	//TODO add #modicon-screen-overlay to this
	$('#gsDropboxExtender-listbox-popup').show();
}

function hideListBoxPopUp() {
	$('#modicon-screen-overlay, #gsDropboxExtender-listbox-popup').hide();
}

function showAnchorPopUp() {
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $("#gsDropboxExtender-anchor-popup").height();
	var popupWidth = $("#gsDropboxExtender-anchor-popup").width();

	$("#gsDropboxExtender-anchor-popup").css({
		"position": "fixed",
		"top": windowHeight / 2 - popupHeight / 2,
		"left": windowWidth / 2 - popupWidth / 2
	});

	$('#modicon-screen-overlay, #gsDropboxExtender-anchor-popup').show();
}

function hideAnchorPopUp() {
	$('#modicon-screen-overlay, #gsDropboxExtender-anchor-popup').hide();
}

/*
* Forum topic indexes
*/

//Add link to last page on each topic post count
$('table#latest').each(function(evt) {
	//Handle each row
	$(this).find('tr').each(function(evt) {
		var PostCountCell = $(this).find('td').eq(1);
		var PostUrl = $(this).find('td').eq(0).find('a').eq(0).attr('href');

		if ($(PostCountCell).html() != null) {
			var PostCount = $(PostCountCell).text();

			if (PostCount / TopicPageRecordLimit > 1) {
				var PageNumber = Math.ceil(PostCount / TopicPageRecordLimit);
				$(PostCountCell).html("<a href='" + PostUrl + "&page=" + PageNumber + "#latest'>" + $(PostCountCell).text() + "</a>");
			} else {
				$(PostCountCell).html("<a href='" + PostUrl + "#latest'>" + $(PostCountCell).text() + "</a>");
			}
		}

	});
});

//Take us to last topic on page
//Deprecated unil further debugging FIXME
if (0 === 1 && window.location.href.indexOf("#latest") != -1)
	$('html,body').animate({
		scrollTop: $('#' + $("ol#thread li:last").attr("id")).offset().top
	}, 50);

/*
 * Profile indexes
 */

$('div#user-replies ol li').each(function(evt) {
	//Handle each row
	$(this).find('a').each(function(evt) {
		var PostUrl = $(this).attr('href');
		var PostCount = PostUrl.split("=")[2];
		var FreshnessSpan = $(this).parent().find('.freshness').eq(0);

		var PageNumber = Math.ceil(PostCount / TopicPageRecordLimit);

		if (PageNumber > 1) {
			$(FreshnessSpan).html("<a href='" + PostUrl + "&page=" + PageNumber + "#latest'>" + $(FreshnessSpan).text() + "</a>");
		} else {
			$(FreshnessSpan).html("<a href='" + PostUrl + "#latest'>" + $(FreshnessSpan).text() + "</a>");
		}

	});
});

$('div#user-threads ol li').each(function(evt) {
	//Handle each row
	$(this).find('a').each(function(evt) {
		var PostUrl = $(this).attr('href');
		var PostCount = PostUrl.split("=")[2];
		var FreshnessSpan = $(this).parent().find('.freshness').eq(0);

		var PageNumber = Math.ceil(PostCount / TopicPageRecordLimit);

		if (PageNumber > 1) {
			$(FreshnessSpan).html("<a href='" + PostUrl + "&page=" + PageNumber + "#latest'>" + $(FreshnessSpan).text() + "</a>");
		} else {
			$(FreshnessSpan).html("<a href='" + PostUrl + "#latest'>" + $(FreshnessSpan).text() + "</a>");
		}

	});
});

/*
* Generic functions
*/

//Get post author markup
function getPostAuthorDetails(PostEventTarget) {
	var SelectedAuthor = $(PostEventTarget).parent().parent().parent().find(".threadauthor").eq(0).find('strong').eq(0).clone();

	return "<strong>" + $(SelectedAuthor).html().replace("<img align=\"top\" src=\"/bb-templates/dropbox/images/star.gif\">", "") + "</strong> scribbled:<br /><br />";
}

//Insert markup at required position
function insertAndMarkupTextAtCursorPosition(wrapper) {
	var SelectedTextStart = $('#' + PostTextAreaName)[0].selectionStart;
	var SelectedTextEnd = $('#' + PostTextAreaName)[0].selectionEnd;
	var EndCursorPosition = SelectedTextStart;

	var SelectedText = '';

	if (SelectedTextEnd - SelectedTextStart > 0)
		SelectedText = $('#' + PostTextAreaName).val().substring(SelectedTextStart, SelectedTextEnd);

	insertTextAtCursorPosition('<' + wrapper + '>' + SelectedText + '</' + wrapper + '>');

	if (SelectedText == '')
		setCursorPositionInTextArea(PostTextAreaName, EndCursorPosition + 2 + wrapper.length);
}

//Insert text at required position
function insertTextAtCursorPosition(TextToBeInserted) {
	var SelectedTextStart = $('#' + PostTextAreaName)[0].selectionStart;
	var SelectedTextEnd = $('#' + PostTextAreaName)[0].selectionEnd;

	$('#' + PostTextAreaName).val($('#' + PostTextAreaName).val().substring(0, SelectedTextStart) + TextToBeInserted + $('#' + PostTextAreaName).val().substring(SelectedTextEnd));
}

//Move cursor to set position in text area
function setCursorPositionInTextArea(Id, Pos) {
	var element = document.getElementById(Id);

	if (element != null) {
		if (element.createTextRange) {
			var range = element.createTextRange();
			range.move('character', Pos);
			range.select();
		} else {
			element.focus();
			if (element.selectionStart) {
				element.setSelectionRange(Pos, Pos);
			}
		}
	}
}

//Function for inserting quote
function insertSelectedQuote(TextToQuote, PostAuthorDetails) {
	if (TextToQuote != '') {
		if (PostAuthorDetails == undefined)
			PostAuthorDetails = '';

		var SelectionStart = $('#' + PostTextAreaName)[0].selectionStart;
		var NewlineNeeded = (SelectionStart > 0) && ($('#' + PostTextAreaName).val().charAt(SelectionStart - 1) != "\n");
		var AppendedText = ( NewlineNeeded ? "\n" : "") + "<blockquote>" + PostAuthorDetails + TextToQuote + "</blockquote>\n";
		var EndCursorPosition = SelectionStart + AppendedText.length;

		insertTextAtCursorPosition(AppendedText);
		setCursorPositionInTextArea(PostTextAreaName, EndCursorPosition);
	}
}

//Function for getting the selected text for quoting
function getSelectedText() {
	if (window.getSelection) {
		return SelectedText = window.getSelection();
	} else if (document.selection) {
		return SelectedText = document.selection.createRange().text;
	}
}

/*
 * Liveness check
 * Check for a pulse
 */
window.onload = function() {
	$('#modicon-nav').append('<span>Pulse:&nbsp;&nbsp;&nbsp;<span id="heartbeatpulse">#</span></span>');
	pulse();
}
function pulse() {
	setTimeout(function() {
		$('#heartbeatpulse').hide();
		setTimeout(function() {
			$('#heartbeatpulse').show();
			pulse();
		}, 1000);
	}, 1000);
}