// ==UserScript==
// @name Dropbox Forum Extender+
// @namespace DropboxMods
// @description Beefs up the forums and adds way more functionality
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2.2.6
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @require https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

//Set global variables
var pageUrl = getPageUrl(), modalOpen = false, userId;
var color = {
	green: '#b5ff90',
	lightGreen: '#daffc8',
	gold: '#fff19d',
	lightGold: '#fff8ce',
	red: '#ffd4d4',
	lightRed: '#ffe9e9'
}

if($('#header .login a').length > 1)
	userId = $('#header .login a[href^="https://forums.dropbox.com/profile.php"]').attr('href').split('id=')[1];

//Hover message and modal prerequisites
$("head").append('<style type="text/css">#gsDropboxExtenderModal{display:none;position:fixed;height:200px;width:408px;background:#FFFFFF;border:2px solid #cecece;z-index:50;padding:12px;font-size:13px;}#gsDropboxExtenderModal h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px;}#gsDropboxExtenderModalClose:hover{cursor: pointer;}#gsDropboxExtenderModalClose{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block;}</style>');
$('body').append('<div id="gsDropboxExtender-screen-overlay" style="display:none;position:fixed;bottom:0;right:0;top:0;left:0;background:#000;border:1px solid #cecece;z-index:50;opacity:0.7;" /><div id="gsDropboxExtenderModal"><a id="gsDropboxExtenderModalClose">x</a><h1 id="gsDropboxExtenderModalTitle"></h1><br /><br /><div id="gsDropboxExtenderModalContent"></div>');
$('body').prepend('<span id="gsDropboxExtender-message" style="display:none;border-width:1px;border-radius:5px;border-style:solid;position:fixed;top:10px;left:10px;padding:5px 10px;z-index:200" />');

//Add footer
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Extender+ ' + versionSlug(GM_info.script.version) + '</div>');

//Modify Super User posts
highlightPost('Super User', color.gold);
if(pageUrl == 'topic.php') {
	$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').prepend('<img />');
	$('.threadauthor small a[href$="=1618104"]').html('Master of Super Users');
}

if(pageUrl == 'forums.dropbox.com' || pageUrl == 'forum.php')
	$('#latest tr.closed span.label').show();

//Highlight posts by forum regulars green
highlightPost(6845, 3581696, 816535, 2122867, 434127, 85409, 1253356, 425513, 96972, color.green);

//Flag threads
highlightThread(color.green, 1);
highlightThread(color.gold, 2);
highlightThread(color.lightRed, 3);

navBar();

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

//Fix UI for new semi-broken theme 10-8-2013
$('#header').css('margin-top', '0');
if(pageUrl == 'topic.php')
	$('#topic-info').prepend('<br>').prepend($('#header .breadcrumb').clone()).prepend('<a href="https://forums.dropbox.com">Forums</a> ');
else if(pageUrl == 'forum.php')
	$('#forumlist th').wrapInner('<a href="https://forums.dropbox.com" />');
$('.freshbutton-blue, #postformsub').css('background', '#2180ce');
$('#header').append($('.search').clone());
$('#main .search, #header .breadcrumb, #header .home').remove();
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
	$('body').append('<div id="gsDropboxExtender-nav"><img id="gsDropboxExtenderOption-trigger" src="https://2.gravatar.com/avatar/4a62e81113e89800386a9d9aab160aee?s=420" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-35px;z-index:11" /></div><div id="gsDropboxExtenderOption-popup" style="position:fixed"><a id="gsDropboxExtenderOption-close">x</a><h1>Forum Extender+ Options</h1><br/><br/><div class="left"><select name="theme"><optgroup label="Original Themes"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></optgroup><optgroup label="Custom Themes"><optgroup label="-- No Existing Custom Themes --"></optgroup></optgroup></select><br/><input type="checkbox" name="collapseFooter" value="y">Auto-collapse footer</input><br><br><span id="deleteprefs">Trash Preferences</span><br><span id="deletedrafts">Trash Drafts</span></div><div class="right">Reload front page every<select name="reloadFront"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload forum pages every<select name="reloadForum"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br/>Reload stickies every<select name="reloadSticky"><option value="0">Never</option><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300">5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes</option><option value="1800">30 minutes</option><option value="3600">1 hour</option></select><br><select id="gsDropboxExtendericon" name="modIcon"><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxflat.png">Dropbox Flat</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxflatgreen.png">Dropbox Flat Green</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxflatlime.png">Dropbox Flat Lime</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxflatgold.png">Dropbox Flat Gold</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxflatorange.png">Dropbox Flat Orange</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxflatred.png">Dropbox Flat Red</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxflatpink.png">Dropbox Flat Pink</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxflatpurple.png">Dropbox Flat Purple</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropbox.png">Dropbox</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxgreen.png">Dropbox Green</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxlime.png">Dropbox Lime</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxgold.png">Dropbox Gold</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxorange.png">Dropbox Orange</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxred.png">Dropbox Red</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxpink.png">Dropbox Pink</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/dropboxpurple.png">Dropbox Purple</option><option value="https://d13dii5qg1bety.cloudfront.net/static/forum-mod-icons/goldstar.png">Gold Star</option><option value="https://d13dii5qg1bety.cloudfront.net/static/nyancatright.gif" selected="selected">Nyan Cat (Default)</option></select><img id="gsDropboxExtendericonpreview"/><br/><input type="button" tabindex="4" value="Save" id="gsDropboxExtenderOption-save" style="clear:both;float:right;"></div>');
	$('body').prepend('<div id="gsDropboxExtender-nav-slideout-container" />');
	$('body').css('padding-bottom', '31px');
	$('head').append('<style type="text/css">#gsDropboxExtender-nav>span{margin-left:20px}#gsDropboxExtender-nav{position:fixed;bottom:0;height:30px;border-top:1px solid #aaf;width:100%;line-height:30px;padding:0 0 0 105px;background:#fff;z-index:10}#gsDropboxExtender-nav-slideout-container{margin:0 auto;border-bottom:1px solid #ddd}#gsDropboxExtender-nav-slideout-container>*{list-style-type:none;margin:30px auto;width:800px;text-align:center}#gsDropboxExtender-nav>span:hover{cursor:pointer}#gsDropboxExtenderOption-popup .clear{clear:both}#gsDropboxExtenderOption-popup div.left{float:left;width:49%}#gsDropboxExtenderOption-popup div.right{float:right;padding-left:10px;width:49%;border-left:1px solid #ddd}#gsDropboxExtenderOption-popup{display:none;position:fixed;width:600px;height:225px;background:#fff;border:2px solid #cecece;z-index:200;padding:12px;font-size:13px}#gsDropboxExtenderOption-popup h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px}#gsDropboxExtenderOption-trigger:hover,#gsDropboxExtenderOption-close:hover{cursor:pointer}#gsDropboxExtenderOption-close{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block}</style>');

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

	//Add some goodies
	$('#gsDropboxExtender-nav').append('<span><a href="https://forums.dropbox.com">Take me home!</a></span><span><a href="https://forums.dropbox.com/topic.php?id=109057">Official thread</a></span><span id="modactivitytrigger">Activity</span>');

	//Add list framework
	$('#gsDropboxExtender-nav-slideout-container').append('<ul id="modactivity" />');
	$('#modactivity').toggle();
	$('#modactivitytrigger').click(function() {
		$('#modactivity').slideToggle();
	});
	for(var i = 0; i < profile.list.length; i++) {
		$('#modactivity').append('<li>Loading . . .</li>');
		profile.load(i);
	}

	//Add post templates
	if(pageUrl == 'topic.php' || pageUrl == 'edit.php') {
		$('#gsDropboxExtender-nav').append('<span><select id="snippets"><option value="">Select a snippet</option><optgroup label="Explanations"><option value="Are you sure that the client is running? The client needs to be running for changes to sync.">Client running</option><option value="What does Dropbox say when you mouse over the icon?">Mouseover</option><option value="Ways to send files to Dropbox:\nSendtoDropbox - http://sendtodropbox.com\nAirDropper - https://airdropper.com - Supports files up to 300MB each.\nDropittome - http://dropitto.me\nJot Form / Dropbox Forms - http://www.jotform.com/dropbox\nUpload to Dropbox - http://www.uploadtodropbox.com\nMover - http://mover.io - formerly MyBackUpBox\nIFTTT - http://www.ifttt.com\nAttachemnts from Gmail - http://attachments.me\nSanebox - http://www.sanebox.com - again from GMail\nOtixo - http://otixo.com\nThis list is not exhaustive. More may be listed in the Dropbox Wiki. New services come and go each day.">Ways to Send Files to Dropbox</option></optgroup><optgroup label="Help Center Links"><option value="<a href=\'https://www.dropbox.com/help/406\'>this Help Center article</a>">Overlay Icon Explanation</option><option value="<a href=\'https://www.dropbox.com/help/154\'>this Help Center article</a>">Missing Overlay Icons</option><option value="<a href=\'https://www.dropbox.com/help/175\'>Selective Sync</a>">Selective Sync</option><option value="<a href=\'https://www.dropbox.com/help/167\'>Shared Links</a>">Shared Links</option></optgroup><optgroup label="Links"><option value="<a href=\'https://www.dropbox.com/install\'>desktop client</a>">Desktop Client</option></optgroup><optgroup label="Support tickets"><option value="Submit a support ticket at https://www.dropbox.com/support">Submit a ticket</option><option value="Tickets typically take 1-3 business days to get a reply, priority given to Pro and Business users.\n\nYou can track the status of your tickets over at <a href=\'http://dropbox.zendesk.com\'>Zendesk</a>.">Ticket summary</option></optgroup><optgroup label="Mod edits"><option value="Duplicate post: ">Duplicate post</option><option value="Edit: Email removed for security issues ~' + $('#header .login a:first').html().split(' ')[0] + '">Email removed</option><option value="I moved this to ' + ['everything else', 'bugs &amp;troubleshooting', 'feature requests', 'mobile apps', 'API development'][$('#forum-id').val() - 1] + ' for you.">Move thread</option></optgroup><optgroup label="Miscellaneous"><option value="Also, I see you\'re new here, so why don\'t we give you a proper welcome.\n\nDropbox is a wonderful service, and we hope you get to use it to its full potential. If you have an issue, you can always check the <a href=\'https://www.dropbox.com/help\'>Help Center</a>, but if you don\'t get an answer there, or it\'s a more complicated issue, these forums are a great place to visit.\n\nHere on the forums, there are a lot of people just like you, who ask the occasional question. There\'s also a small handful of regulars here, including Super Users like myself. We try to answer as many questions as we can, and most of us are here on an almost-daily basis. I think I can speak for all of us a regulars when I say that we love to see newcomers to the service. The forums are a great place to both ask and answer questions, and if you have another question in the future, don\'t hesitate to ask.\n\nWelcome to Dropbox. We hope you like it.">Welcome</option></optgroup></select></span>');
		$('#snippets').change(function() {
			insertTextAtCursorPosition($(this).val());
		});
	}

	var client = new Dropbox.Client({
		key: 'qq5ygjct1pt4eud'
	});

	$('#gsDropboxExtender-nav').append('<span id="dropboxlink">Link to Dropbox</span>');

	var prefTable;

	$(function() {
		//Delete table
		function deleteTable(table) {
			var records = table.query();
			for(var i = 0; i < records.length; i++) {
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
			if(error) {
				console.log('Auth error. Retrying');
				document.location.reload();
			}
		});
		if(client.isAuthenticated()) {
			$('#dropboxlink').hide();

			client.getDatastoreManager().openDefaultDatastore(function(error, datastore) {
				if(error) {
					console.log('Error opening default datastore. Rerying');
					document.location.reload();
				}

				//Get tables
				var prefTable = datastore.getTable('prefs'), draftTable = datastore.getTable('draft');

				var theme = prefTable.query({
					preference: 'theme'
				}), collapseFooter = prefTable.query({
					preference: 'collapseFooter'
				});
				if(theme.length > 0)
					forumVersion(theme[0].get('value'));

				//Collapse footer
				if(pageUrl != 'edit.php' && collapseFooter.length > 0 && collapseFooter[0].get('value')) {
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
					$('#footertoggle').css('height', '25px').click(function() {
						$('#footercontent').slideToggle('slow', function() {
							$('#footerarrowup, #footerarrowdown').toggle();
						});
					});
				}

				if(pageUrl == 'topic.php') {
					var modIcon = prefTable.query({
						preference: 'modIcon'
					});
					if(modIcon.length > 0)
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
					if(window.location.href != 'https://forums.dropbox.com/?new=1' && reloadIndex[pageType] && reloadDelay.length > 0 && reloadDelay[0].get('value') > 0) {
						setTimeout(function() {
							if(!modalOpen && (pageUrl == 'topic.php') ? !$('#post_content').val() : true)
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
				var optionDropdown = ['theme', 'reloadSticky', 'reloadForum', 'reloadFront', 'modIcon'];
				var optionCheck = ['collapseFooter'];
				$('#gsDropboxExtenderOption-trigger').click(function() {
					modalOpen = true;
					var optionHeight = $('#gsDropboxExtenderOption-popup').height(), optionWidth = $('#gsDropboxExtenderOption-popup').width(), pref;

					$('#gsDropboxExtenderOption-popup').css({
						'top': (document.documentElement.clientHeight - optionHeight) / 2,
						'left': (document.documentElement.clientWidth - optionWidth) / 2
					});

					//Load current settings
					for(var i = 0; i < optionDropdown.length; i++) {
						pref = prefTable.query({preference: optionDropdown[i]})[0];
						if(pref)
							$('#gsDropboxExtenderOption-popup [name="' + optionDropdown[i] + '"] option[value="' + pref.get('value') + '"]').attr('selected', 'selected');
					}
					$('#gsDropboxExtendericonpreview').attr('src', $('#gsDropboxExtendericon').val());
					for(var i = 0; i < optionCheck.length; i++) {
						pref = prefTable.query({preference: optionCheck[i]})[0];
						if(pref)
							$('#gsDropboxExtenderOption-popup [name="' + optionCheck[i] + '"]').attr('checked', true);
					}

					$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderOption-popup').show();
				});
				$('#gsDropboxExtendericon').change(function() {
					$('#gsDropboxExtendericonpreview').attr('src', $('#gsDropboxExtendericon').val());
				});
				$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderOption-close, #gsDropboxExtenderOption-save').click(function() {
					$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderOption-popup, #gsDropboxExtender-listbox-popup').hide();
					modalOpen = false;
				});
				$('#gsDropboxExtenderOption-save').click(function() {
					var pref;
					for(var i = 0; i < optionDropdown.length; i++) {
						pref = prefTable.query({
							preference: optionDropdown[i]
						});
						if(pref.length > 0)
							pref[0].set('value', $('#gsDropboxExtenderOption-popup [name="' + optionDropdown[i] + '"]').val());
						else
							prefTable.insert({
								preference: optionDropdown[i],
								value: $('#gsDropboxExtenderOption-popup [name="' + optionDropdown[i] + '"]').val()
							});
					}
					for(var i = 0; i < optionCheck.length; i++) {
						pref = prefTable.query({
							preference: optionCheck[i]
						});
						if(pref.length > 0)
							pref[0].set('value', $('#gsDropboxExtenderOption-popup [name="' + optionCheck[i] + '"]').val() == 'y');
						else
							prefTable.insert({
								preference: optionCheck[i],
								value: $('#gsDropboxExtenderOption-popup [name="' + optionCheck[i] + '"]').val() == 'y'
							});
					}
					if(pageUrl == 'topic.php')
						$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').find('img').attr('src', $('#gsDropboxExtendericon').val());
					hoverMessage('Your settings have been saved.\n\nMost new settings won\'t take effect until the page is reloaded.');
				});
				//Manage drafts
				if(pageUrl == 'topic.php') {
					var thread = window.location.href.split('id=')[1].split('&')[0].split('#')[0];
					$('#gsDropboxExtender-nav').append('<span id="modpostdraft">Draft Post</span><span id="modpostrestoredraft">Restore Draft</span>');
					$('#modpostdraft').click(function() {
						var draft = draftTable.query({
							pageid: thread
						});
						if($('#post_content').val()) {
							if(draft.length > 0)
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
						if(draft) {
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
	$('#gsDropboxExtender-nav').append('<span id="gsDropboxExtenderMessageContainer"><form style="display:none" action="http://www.techgeek01.com/dropboxextplus/messages.php" method="post"><input type="hidden" name="returnto" value="' + window.location.href + '" /><input type="hidden" name="for" value="' + $('#header .login a[href^="https://forums.dropbox.com/profile.php"]').attr('href').split('id=')[1] + '" /><input type="hidden" name="timeOffset" value="' + new Date().getTimezoneOffset() + '" /></form><a href="javascript:void(0)" id="gsDropboxExtenderMessageLink">Messages</a><span id="gsDropboxExtenderMsgCounter" /></span>'); (function checkMessages() {
		GM_xmlhttpRequest({
			method: 'GET',
			url: ('http://www.techgeek01.com/dropboxextplus/count-messages.php?to=' + userId),
			onload: function(response) {
				var resp = response.responseText;
				$('#gsDropboxExtenderMsgCounter').html(resp == '0' ? '' : (' (' + resp + ')'));
			}
		});
		setTimeout(checkMessages, 20000);
	})();
	$('#gsDropboxExtenderMessageLink').click(function() {
		$('#gsDropboxExtenderMessageContainer form').submit();
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
			'background': 'url(https://d13dii5qg1bety.cloudfront.net/static/forumsheader.jpg)'
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
		$('#latest th:eq(0) a').css('color', '#aaa');
		//TODO: latestHeader widths: 545, 46, 90, 69px
		$('.sticky, .super-sticky').css('background', '#f4faff');

		//Style table headers
		$('#forumlist th, #latest th').css({
			'background': '#666',
			'color': '#fff'
		});
		$('#forumlist tr').eq(0).css({
			'height': '25px',
			'padding': 'none'
		});

		//Add and style headings
		$('#discussions').prepend('<h2 class="forumheading">Latest Discussions</h2>');
		$('#forumlist-container').prepend('<h2 class="forumheading">' + $('#forumlist th').html() + '</h2>');
		$('.forumheading').css({
			'border-bottom': '1px solid #ddd',
			'padding-bottom': '6px'
		});

		$('#forumlist th').html('Name');
	} else if(versionDate == 'original') {
		$('#main, #header').css('width', '866px');
		$('#header a:first img').attr('src', 'http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png');
		$('#discussions').css('margin-left', '0');
		$('#latest tr:not(:first, .nochange), .bb-root').css('background', '#f7f7f7');
		$('#latest, .alt').css('background', '#fff');
		$('#latest').css({
			'width': '680px',
			'border-top': '1px dotted #ccc'
		});
		$('.sticky, .super-sticky').css('background', '#deeefc');

		//Add tag list and reorder elements
		if(['forums.dropbox.com', 'forum.php'].indexOf(pageUrl) > -1) {
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];
			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap" /></div>');
			for(var i = 0; i < tagList.length; i++) {
				$('#frontpageheatmap').append('<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a>');
			}
			$('#frontpageheatmap a:not(:last)').append(' ');
			$('#forumlist').attr('id', 'forumlist-temp');
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist"><tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr></table><h2>Latest Discussions</h2>');
			for(var i = 1; i < 6; i++) {
				select = $('#forumlist-temp tr:eq(' + i + ') td').html().split('<br>');
				$('#forumlist').append('<tr class="bb-precedes-sibling bb-root"><td>' + select[0] + select[1] + '</td><td class="num">' + select[2].split(' topics')[0] + '</td><td class="num">' + select[2].split(' topics')[0] + '+</td></tr>');
			}
			$('#forumlist-container').remove();
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

function highlightThread() {
	var args = arguments;
	$('#latest tr:not(.sticky, .super-sticky)').find('td:nth-child(2)').each(function() {
		var content = parseInt($(this).html(), 10);
		if((args.length == 2 && content == args[1]) || (content >= args[1] && content <= args[2]))
			$(this).parent().attr('class', 'nochange').css('background', args[0]);
	});
}

function highlightPost() {
	var args = arguments, color = args[args.length - 1], slug = '';

	args[args.length - 1] = undefined;
	if(pageUrl == 'topic.php')
		var rolePosts, status, message, totalPosts = $('.threadauthor').length;
	for(var i = 0; i < args.length; i++) {
		if( typeof args[i] == 'string') {
			rolePosts = $('.threadauthor p small a:contains("' + args[i] + '")').length;
			status = ((totalPosts > 5 && rolePosts / totalPosts > 0.2) || (totalPosts == 5 && rolePosts > 2) || (totalPosts < 5 && rolePosts > 1)) ? 'dis' : 'en';
			$('#thread').prepend(message).append('<li style="text-align: center;">' + args[i] + ' highlighting ' + status + 'abled</li>');

			if(status == 'en')
				$('.threadauthor p small a:contains("' + args[i] + '")').parent().parent().parent().parent().find('.threadpost').css('background', color);
		} else if( typeof args[i] == 'number')
			$('.threadauthor small a[href$="=' + args[i] + '"]').parent().parent().parent().parent().find('.threadpost').css('background', color);
	}
}

/*
 * Helper functions
 */

function showModal(title, content, action) {
	$('#gsDropboxExtenderModalTitle').html(title);
	$('#gsDropboxExtenderModalContent').html(content);

	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $("#gsDropboxExtenderModal").height();
	var popupWidth = $("#gsDropboxExtenderModal").width();

	$("#gsDropboxExtenderModal").css({
		"position": "fixed",
		"top": windowHeight / 2 - popupHeight / 2,
		"left": windowWidth / 2 - popupWidth / 2
	});

	$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderModal').show();
	modalOpen = true;

	$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderModalClose, #gsDropboxExtenderModalAction').click(hideModal);
	$('#gsDropboxExtenderModalAction').click(action);
}

function hideModal() {
	$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderModal').hide();
	modalOpen = false;
}

function hoverMessage() {
	var args = arguments;
	var colorMap = {
		error: [color.lightRed, color.red],
		info: ['#dbf8ff', '#57d3ff'],
		success: ['#c4eca9', '#8fdb5c']
	};
	$('#gsDropboxExtender-message').hide();
	args[1] = args[1] || 'success';
	$('#gsDropboxExtender-message').css({
		'background': colorMap[args[1]][0],
		'border-color': colorMap[args[1]][1]
	});
	$('#gsDropboxExtender-message').html(args[0]);
	$('#gsDropboxExtender-message').fadeIn(400, function() {
		setTimeout(function() {
			$('#gsDropboxExtender-message').fadeOut();
		}, 5000);
	});
}

function getPageUrl() {
	var url = window.location.href;
	url = url.split('?')[(url.split('?')[0] == 'new=1' ? 1 : 0)];
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
 * MARKER: Script split location
 */

var Signature = "Set your custom signature here - use \n for new lines";

//Parameters
var PostTextAreaName = 'post_content', TopicPageRecordLimit = 30;

/*
 * Forum post handlers
 */

if(['topic.php', 'edit.php', 'new=1'].indexOf(pageUrl) > -1) {
	$('head').append('<style type="text/css" charset="utf-8">#gsDropboxExtender-anchor-popup{display:none;position:fixed;height:200px;width:408px;background:#fff;border:2px solid #cecece;z-index:51;padding:12px;font-size:13px;}#gsDropboxExtender-listbox-popup{display:none;position:fixed;height:200px;width:408px;background:#fff;border:2px solid #cecece;z-index:51;padding:12px;font-size:13px;}#gsDropboxExtender-anchor-popup h1, #gsDropboxExtender-listbox-popup h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px;}.gsDropboxExtenderPopupClose:hover{cursor: pointer;}.gsDropboxExtenderPopupClose{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block;}#gsDropboxExtender-listbox-unordered, #gsDropboxExtender-listbox-ordered{margin-left: 20px;}</style>');
	$('body').append('<div id="gsDropboxExtender-listbox-popup"><a id="gsDropboxExtenderListBoxClose" class="gsDropboxExtenderPopupClose">x</a><h1>Add List</h1><div><ul id="gsDropboxExtender-listbox-unordered"></ul><ol id="gsDropboxExtender-listbox-ordered"></ol><br /></div><div><div style="clear: both; height: 20px;"><label style="float: left;">Item: </label><input id="gsDropboxExtenderListBoxTextBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div><br /><input type="submit" tabindex="4" value="Add Item" class="button" name="Submit" id="gsDropboxExtenderListBoxAddItem" style="clear: both; float: right;"><br /><br /><input type="submit" tabindex="4" value="Ok" class="button" name="Submit" id="gsDropboxExtenderListBoxOk" style="clear: both; float: right;"></div>');
}

//Append the posting form if necessary
if(pageUrl == 'topic.php' && $('form#postform:first').length == 0) {
	$.get($('h2.post-form a:first').attr('href'), function(data) {
		$('div#main').append($(data).find('form#postform:first'));
		$('h2.post-form a:first, #post-form-title-container').remove();
		$('.freshbutton-blue, #postformsub').css('background', '#2180ce');
		addMarkupLinks();
	}, 'html');
} else
	addMarkupLinks();

function addMarkupLinks() {
	$('.poststuff').append(' - <a href="javascript:void(0)" class="gsDropboxExtenderQuoteSelected">quote selected</a> - <a href="javascript:void(0)" class="gsDropboxExtenderQuotePost">quote post</a> - <a href="javascript:void(0)" class="gsDropboxExtenderMessageUser">message user</a>');
	$('p.submit').append('<span style="float: left;"> - <a href="javascript:void(0)" class="gsDropboxExtenderAnchorSelected">a</a> - <a href="javascript:void(0)" class="gsDropboxExtenderBlockquoteSelected">blockquote</a> - <a href="javascript:void(0)" class="gsDropboxExtenderStrongSelected">bold</a> - <a href="javascript:void(0)" class="gsDropboxExtenderEmSelected">italic</a> - <a href="javascript:void(0)" class="gsDropboxExtenderCodeSelected">code</a> - <a href="javascript:void(0)" class="gsDropboxExtenderOrderedListInsert">ordered list</a> - <a href="javascript:void(0)" class="gsDropboxExtenderUnorderedListInsert">unordered list</a> - <a href="javascript:void(0)" class="gsDropboxExtenderSignatureInsert">custom signature</a></span>');
}

//Message users
$('.gsDropboxExtenderMessageUser').click(function(evt) {
	showModal('Message User', '<form id="gsDropboxExtenderMessageForm" action="http://www.techgeek01.com/dropboxextplus/process-message.php" method="post"><input name="msgto" id="gsDropboxExtenderMsgTo" type="textbox" style="width:100%" placeholder="Recipient" value="' + getUserId(evt.target) + '"/><br><input name="msgfrom" id="gsDropboxExtenderMsgFrom" type="hidden" value = "' + $('#header .login a:first').attr('href').split('id=')[1] + '"/><textarea name="msgtext" id="gsDropboxExtenderMsgText" style="width:100%" placeholder="Message"></textarea><input type="hidden" name="returnto" id="gsDropboxExtenderMsgReturnLocation" value="' + window.location.href + '" /><br><a href="javascript:void(0)" id="gsDropboxExtenderModalAction">Send</a></form>', function() {
		$('#gsDropboxExtenderModalContent form').submit();
	});
});
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
$('.gsDropboxExtenderBlockquoteSelected, .gsDropboxExtenderStrongSelected, .gsDropboxExtenderEmSelected, .gsDropboxExtenderCodeSelected').click(function() {
	insertAndMarkupTextAtCursorPosition($(this).attr('class').split('gsDropboxExtender')[1].split('Selected')[0].toLowerCase());
});
//Insert a list
var listType = '';
$('.gsDropboxExtenderUnorderedListInsert').click(function() {
	showListBoxPopUp('u');
});
$('.gsDropboxExtenderOrderedListInsert').click(function() {
	showListBoxPopUp('o');
});
$('#gsDropboxExtenderListBoxClose').click(hideListBoxPopUp);
$('#gsDropboxExtenderListBoxAddItem').click(function() {
	if($('#gsDropboxExtenderListBoxTextBox').val().length == 0)
		return;
	$('#gsDropboxExtender-listbox-' + (listType == 'u' ? 'un' : '') + 'ordered').append("<li>" + $('#gsDropboxExtenderListBoxTextBox').val() + "</li>");
	$('#gsDropboxExtenderListBoxTextBox').val('');
	$("#gsDropboxExtender-listbox-popup").height($("#gsDropboxExtender-listbox-popup").height() + 20);
});
$('#gsDropboxExtenderListBoxOk').click(function() {
	var content = $(listType + 'l#gsDropboxExtender-listbox-' + (listType == 'u' ? 'un' : '') + 'ordered').html();
	insertTextAtCursorPosition('<' + listType + 'l>\n' + content + '\n</' + listType + 'l>');
	setCursorPositionInTextArea(PostTextAreaName, $('#' + PostTextAreaName)[0].selectionStart + content.length + 11);
	hideListBoxPopUp();
});
//Insert an anchor
$('.gsDropboxExtenderAnchorSelected').click(function() {
	showModal('Add Link', '<div style="clear: both; height: 20px;"><label style="float: left;">Title: </label><input id="gsDropboxExtenderAnchorTextBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div><div style="clear: both; height: 20px;"><label style="float: left;">Url: </label><input id="gsDropboxExtenderAnchorUrlBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div><br /><input type="submit" tabindex="4" value="Add Link" class="button" name="Submit" id="gsDropboxExtenderModalAction" style="clear: both; float: right;">', function() {
		insertTextAtCursorPosition('<a href="' + $('#gsDropboxExtenderAnchorUrlBox').val() + '">' + $('#gsDropboxExtenderAnchorTextBox').val() + '</a>');
	});
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

	$('#gsDropboxExtender-screen-overlay, #gsDropboxExtender-listbox-popup').show();
}

function hideListBoxPopUp() {
	$('#gsDropboxExtender-screen-overlay, #gsDropboxExtender-listbox-popup').hide();
}

/*
* Generic functions
*/

//Get post author markup TODO: Remove &nbsp; on Pro users
function getPostAuthorDetails(postEventTarget) {
	return "<strong>" + $(postEventTarget).parent().parent().parent().find(".threadauthor").eq(0).find('strong').eq(0).clone().find('img').remove().end().html() + "</strong> scribbled:<br /><br />";
}

function getUserId(postEventTarget) {
	return $(postEventTarget).parent().parent().parent().find(".threadauthor").eq(0).find('a[href^="https://forums.dropbox.com/profile.php"]').eq(0).attr('href').split('id=')[1];
}

//Insert markup at required position
function insertAndMarkupTextAtCursorPosition(wrapper) {
	var SelectedTextStart = $('#' + PostTextAreaName)[0].selectionStart, SelectedTextEnd = $('#' + PostTextAreaName)[0].selectionEnd, EndCursorPosition = SelectedTextStart, SelectedText = '';
	if(SelectedTextEnd - SelectedTextStart > 0)
		SelectedText = $('#' + PostTextAreaName).val().substring(SelectedTextStart, SelectedTextEnd);
	insertTextAtCursorPosition('<' + wrapper + '>' + SelectedText + '</' + wrapper + '>');
	if(SelectedText == '')
		setCursorPositionInTextArea(PostTextAreaName, EndCursorPosition + 2 + wrapper.length);
}

//Insert text at required position
function insertTextAtCursorPosition(TextToBeInserted) {
	var SelectedTextStart = $('#' + PostTextAreaName)[0].selectionStart, SelectedTextEnd = $('#' + PostTextAreaName)[0].selectionEnd;
	$('#' + PostTextAreaName).val($('#' + PostTextAreaName).val().substring(0, SelectedTextStart) + TextToBeInserted + $('#' + PostTextAreaName).val().substring(SelectedTextEnd));
}

//Move cursor to set position in text area
function setCursorPositionInTextArea(Id, Pos) {
	var element = document.getElementById(Id);
	if(element != null) {
		if(element.createTextRange) {
			var range = element.createTextRange();
			range.move('character', Pos);
			range.select();
		} else {
			element.focus();
			if(element.selectionStart)
				element.setSelectionRange(Pos, Pos);
		}
	}
}

//Insert quote
function insertSelectedQuote(TextToQuote, PostAuthorDetails) {
	if(TextToQuote != '') {
		if(PostAuthorDetails == undefined)
			PostAuthorDetails = '';

		var SelectionStart = $('#' + PostTextAreaName)[0].selectionStart;
		var NewlineNeeded = (SelectionStart > 0) && ($('#' + PostTextAreaName).val().charAt(SelectionStart - 1) != "\n");
		var AppendedText = ( NewlineNeeded ? "\n" : "") + "<blockquote>" + PostAuthorDetails + TextToQuote + "</blockquote>\n";
		var EndCursorPosition = SelectionStart + AppendedText.length;

		insertTextAtCursorPosition(AppendedText);
		setCursorPositionInTextArea(PostTextAreaName, EndCursorPosition);
	}
}

//Get selected test for quoting
function getSelectedText() {
	if(window.getSelection)
		return SelectedText = window.getSelection();
	else if(document.selection)
		return SelectedText = document.selection.createRange().text;
}