// ==UserScript==
// @name Dropbox Forum Extender+
// @namespace DropboxMods
// @description Beefs up the forums and adds way more functionality
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2.2.8.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @resource customStyle http://techgeek01.com/dropboxextplus/css/style.css
// @resource bootstrap http://techgeek01.com/dropboxextplus/css/bootstrap.css
// @resource bootstrap-theme http://techgeek01.com/dropboxextplus/css/bootstrap-theme.css
// @grant GM_xmlhttpRequest
// @grant GM_getResourceText
// @grant GM_addStyle
// ==/UserScript==

//Set global variables
var fullUrl = window.location.href, pageUrl = getPageUrl(), modalOpen = false, userId, appendNavbar = true;
var color = {
	green: '#b5ff90',
	gold: '#fff19d',
	red: '#ffd4d4',
	lightRed: '#ffe9e9'
};

if ($('#header .login a').length > 1)
	userId = $('#header .login a[href^="https://forums.dropbox.com/profile.php"]').attr('href').split('id=')[1];

//Hover message and modal prerequisites
$("head").append('<style type="text/css">#gsDropboxExtenderModal{display:none;position:fixed;height:200px;width:408px;background:#FFFFFF;border:2px solid #cecece;z-index:50;padding:12px;font-size:13px;}#gsDropboxExtenderModal h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px;}.gsDropboxExtenderModalClose:hover{cursor:pointer;}.gsDropboxExtenderModalClose{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block;}</style>');
$('body').append('<div id="gsDropboxExtender-screen-overlay" style="display:none;position:fixed;bottom:0;right:0;top:0;left:0;background:#000;border:1px solid #cecece;z-index:50;opacity:0.7;" /><div id="gsDropboxExtenderModal"><a class="gsDropboxExtenderModalClose">x</a><h1 id="gsDropboxExtenderModalTitle"></h1><br /><br /><div id="gsDropboxExtenderModalContent"></div><div id="gsDropboxExtenderModalActionButtons" style="text-align:right"></div>');
$('body').prepend('<span id="gsDropboxExtender-message" style="display:none;border-width:1px;border-radius:5px;border-style:solid;position:fixed;top:10px;left:10px;padding:5px 10px;z-index:200" />');

//Add footer
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Extender+ ' + versionSlug(GM_info.script.version) + '</div>');

highlightPost(500, color.green);
highlightPost('Super User', color.gold);

highlightThread(color.green, 1);
highlightThread(color.gold, 2);
highlightThread(color.lightRed, 3);

//Modify Super User posts
if (pageUrl == 'topic.php') {
	$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').prepend('<img />');
	$('.threadauthor small a[href$="=1618104"]').html('Master of Super Users');
}

if (pageUrl == 'forums.dropbox.com' || pageUrl == 'forum.php')
	$('#latest tr.closed span.label.closed').show();

//Remove unnecessary stuff
if (pageUrl == 'topic.php')
	$('#post-form-title-container').remove();

//Detect and manage unstickied threads
if (pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length == 0 && $('#topic-info .topictitle:contains(") - ")').length > 0 && $('#topic-info .topictitle:contains(" Build - ")').length > 0) {
	var threadType = $('#topic-info .topictitle:contains(") - ")').html().split(') - ')[1].split(' Build - ')[0];
	showModal('confirm', 'Find newer sticky?', 'This thread is no longer sticky. Would you like to attempt to find the latest ' + threadType.toLowerCase() + ' build thread?', function() {
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
	});
}

//Fix UI for new semi-broken theme 10-8-2013
$('#header').css('margin-top', '0');
if (pageUrl == 'topic.php')
	$('#topic-info').prepend('<br>').prepend($('#header .breadcrumb').clone()).prepend('<a href="https://forums.dropbox.com">Forums</a> ');
else if (pageUrl == 'forum.php')
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
/* CSS Broken
$('.freshbutton-blue, #topic-search-form-submit').css({
	'color': 'white;',
	'border-top': '1px #2270AB solid;',
	'border-right': '1px #18639A solid;',
	'border-bottom': '1px #0F568B solid;',
	'border-left': '1px #18639A solid;',
	'background': '#2180CE;',
	'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#33a0e8", endColorstr="#2180ce");',
	'text-shadow': '#355782 0 1px 2px;',
	'-webkit-text-shadow': '#355782 0 1px 2px;',
	'-moz-text-shadow': '#355782 0 1px 2px;',
	'-moz-box-shadow': '0 1px 1px rgba(0,0,0,0.3),inset 0px 1px 0px #83c5f1;',
	'-webkit-box-shadow': '0 1px 1px rgba(0, 0, 0, 0.3),inset 0px 1px 0px #83C5F1;',
	'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.3),inset 0px 1px 0px #83C5F1;'
});
$('.freshbutton-blue, #topic-search-form-submit').css({
	'-webkit-border-radius': '3px;',
	'-moz-border-radius': '3px;',
	'-ms-border-radius': '3px;',
	'-o-border-radius': '3px;',
	'border-radius': '3px;',
	'text-align': 'center;',
	'padding': '5px 16px;',
	'font-size': '13px;',
	'font-weight': '600;',
	'cursor': 'pointer;',
	'overflow': 'visible;'
});
$('body.future .freshbutton-blue, body.future #topic-search-form-submit').css({
	'-webkit-border-radius': '4px;',
	'-moz-border-radius': '4px;',
	'-ms-border-radius': '4px;',
	'-o-border-radius': '4px;',
	'-webkit-box-shadow': 'rgb(221, 221, 221) 0px 1px 0px 0px, rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset;',
	'-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0);',
	'-webkit-user-select': 'none;',
	'background-color': 'rgba(0, 0, 0, 0);',
	'background-image': '-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(55, 163, 235)), to(rgb(33, 129, 207)));',
	'border-bottom-color': 'rgb(13, 91, 151);',
	'border-bottom-left-radius': '3px;',
	'border-bottom-right-radius': '3px;',
	'border-left-color': 'rgb(28, 116, 179);',
	'border-right-color': 'rgb(28, 116, 179);',
	'border-top-color': 'rgb(44, 142, 209);',
	'border-top-left-radius': '3px;',
	'border-top-right-radius': '3px;',
	'box-shadow': 'rgb(221, 221, 221) 0px 1px 0px 0px, rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset;',
	'font-family': "'Open Sans', 'lucida grande', 'Segoe UI', arial, verdana, 'lucida sans unicode', tahoma, sans-serif;'",
	'text-shadow': 'rgba(0, 0, 0, 0.2) 0px 1px 0px;',
	'vertical-align': 'middle;',
	'zoom': '1;',
	'border-radius': '4px;',
	'text-align': 'center;',
	'padding': '10px 10px;',
	'padding-bottom': '5px;',
	'padding-top': '5px;',
	'margin-bottom': '1px;',
	'font-size': '13px;',
	'font-weight': '600;'
});
$('body.future .freshbutton-blue, body.future #topic-search-form-submit').css({
	'border': '1px solid #1c74b3;',
	'border-top-color': '#2c8ed1;',
	'border-bottom-color': '#0d5b97;',
	'background': '#2389dc;',
	'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#3baaf4", endColorstr="#2389dc");',
	'background': '-webkit-gradient(linear, left top, left bottom, from(#3baaf4), to(#2389dc));',
	'background': '-moz-linear-gradient(top, #3baaf4, #2389dc);'
});
*/

/*
 * External pages
 */

//Init pages
makePage('preferences', 'Preferences', 'Please wait while we load your preferences. This should only take a few seconds.');
makePage('snippets', 'Snippets', 'Please wait while we load the snippet manager. This should only take a few seconds.');

function makePage(slug, title, content) {
	if (pageUrl == slug) {
		appendNavbar = false;
		$('head').append('<link rel="shortcut icon" href="//www.dropbox.com/static/images/favicon.ico" />');
		$('head title').html('Forum Extender+ ' + title);
		$('body').html('<div id="wrapper" class="container"><div class="jumbotron" id="main"><h2>' + title + '</h2><p class="topline">' + content + '</p></div></div><div class="container"><footer><hr><div>Developed by <a href="http://techgeek01.com" target="_blank">Andy Y.</a> and <a href="http://nathancheek.com" target="_blank">Nathan C.</a></div></footer></div><div class="container navbar-fixed-top"><div class="header"><ul class="nav nav-pills pull-left"><li class="inactive"><a href="https://forums.dropbox.com">Back to Forums</a></li></ul><div class="site-title"><h3 class="text-muted">Dropbox Forum Extender+</h3></div></div></div><script src="http://techgeek01.com/dropboxextplus/js/bootstrap.js"></script>');

		window.setTimeout(function() {
			$('#alert-fade').addClass('fade');
		}, 3000);
		$('.open-alertDelete').click(function(sendID) {
			sendID.preventDefault();
			var _self = $(this);
			$('#msgid').val(_self.data('id'));
			$(_self.attr('href')).modal('show');
		});

		GM_addStyle(GM_getResourceText('customStyle'));
		GM_addStyle(GM_getResourceText('bootstrap'));
		GM_addStyle(GM_getResourceText('bootstrap-theme'));
	}
}

if(appendNavbar) {
	//Add prerequsites
	$('body').append('<div id="gsDropboxExtender-nav"><a href="http://forums.dropbox.com/preferences"' + (pageUrl != 'forums.dropbox.com' ? ' target="blank"' : '') + '><img src="https://2.gravatar.com/avatar/4a62e81113e89800386a9d9aab160aee?s=420" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-35px;z-index:11" /></a><span><a href="https://forums.dropbox.com">Take me home!</a></span><span><a href="https://forums.dropbox.com/topic.php?id=109057">Official thread</a></span></div>');
	$('body').css('padding-bottom', '31px');
	$('head').append('<style>#gsDropboxExtender-nav>span{margin-left:20px;}#gsDropboxExtender-nav{position:fixed;bottom:0;height:30px;border-top:1px solid #bbb;width:100%;line-height:30px;background:#fff;z-index:10;padding:0 0 0 105px;}</style>')

	var client = new Dropbox.Client({key: 'qq5ygjct1pt4eud'});

	$('#gsDropboxExtender-nav').append('<span id="dropboxlink">' + ((pageUrl == 'forums.dropbox.com' || pageUrl == 'forum.php') ? 'Link to Dropbox' : 'You\'re not linked to Dropbox yet, but you can do so from the <a href="https://forums.dropbox.com">front page</a>') + '</span>');

	$(function() {
		function deleteTable(table) {
			var records = table.query();
			for (var i = 0; i < records.length; i++) {
				records[i].deleteRecord();
			}
		}

		function postFadeMsg(type, message) {
			$('#alert-fade').parent().remove();
			$('#main').prepend('<div class="alert-center"><div id="alert-fade" class="alert alert-' + type + '"><p><strong>' + message + '</strong></p></div></div>');
			setTimeout(function() {
				$('#alert-fade').addClass('fade');
			}, 3000);
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
			if (error) {
				console.log('Auth error. Retrying');
				document.location.reload();
			}
		});

		if (client.isAuthenticated()) {
			$('#dropboxlink').hide();

			client.getDatastoreManager().openDefaultDatastore(function(error, datastore) {
				if (error) {
					console.log('Error opening default datastore. Rerying');
					document.location.reload();
				}

				//Get tables
				var prefTable = datastore.getTable('prefs');
				var draftTable = datastore.getTable('draft');
				var configTable = datastore.getTable('config');
				var snippetTable = datastore.getTable('snippets');

				var snippets = snippetTable.query();
				var theme = prefTable.query({preference: 'theme'});
				var collapseFooter = prefTable.query({preference: 'collapseFooter'});
				var userToken = configTable.query({name: 'userToken'});

				if (theme.length > 0)
					forumVersion(theme[0].get('value'));

				//Custom signature
				var sig = prefTable.query({name: 'signature'});
				var signature = sig.length > 0 ? sig[0].get('value') : 'You haven\'t set your signature yet. Head over to the preferences menu to do that.';
				$('#siglink').show();
				$('.gsDropboxExtenderSignatureInsert').click(function() {
					$('#post_content').setCursorPosition($('#post_content').val().length);
					insertTextAtCursorPosition("\n\n--\n" + signature);
				});

				//Add post snippets
				if (pageUrl == 'topic.php' || pageUrl == 'edit.php') {
					$('#post-form-subscription-container').append('<br><select id="snippets"><option name="default" value="">' + (snippets.length > 0 ? 'Select a snippet' : 'You don\'t have any snippets') + '</option><optgroup label="--Snippets--" /></select>');

					for (var i = 0; i < snippets.length; i++) {
						$('#snippets optgroup').append('<option />').find('option').eq(i).val(snippets[i].get('value')).html(snippets[i].get('name'));
					}

					$('#snippets').change(function() {
						if ($(this).val() != '') {
							insertTextAtCursorPosition($(this).val());
							$(this).val('');
						}
					});
				}

				//Detect if message system is returning a token, log it, and then reload the page
				if (pageUrl.indexOf('?msgtoken=') > -1 && userToken.length == 0) {
					configTable.insert({
						name: 'userToken',
						value: pageUrl.split('?msgtoken=')[1]
					});
					datastore.syncStatusChanged.addListener(function() {
						if (!datastore.getSyncStatus().uploading)
							window.location.href = 'https://forums.dropbox.com';
					});
				}
				var token = userToken[0].get('value') || '';
				var msgFormAction = userToken.length > 0 ? '' : '<input type="hidden" name="action" value="create-account" />';

				//Handle messages
				$('.poststuff').append(' - <a href="javascript:void(0)" class="gsDropboxExtenderMessageUser">message user</a>');
				$('.gsDropboxExtenderMessageUser').click(function(evt) {
					showModal('confirmsend', 'Message User', '<form id="gsDropboxExtenderMessageForm" action="http://www.techgeek01.com/dropboxextplus/process-message.php" method="post"><input type="hidden" name="userToken" value="' + token + '" />' + msgFormAction + '<input name="msgto" id="gsDropboxExtenderMsgTo" type="textbox" style="width:100%" placeholder="Recipient" value="' + getUserId(evt.target) + '"/><br><input name="msgfrom" id="gsDropboxExtenderMsgFrom" type="hidden" value = "' + $('#header .login a:first').attr('href').split('id=')[1] + '"/><textarea name="msgtext" id="gsDropboxExtenderMsgText" style="width:100%" placeholder="Message"></textarea><input type="hidden" name="returnto" id="gsDropboxExtenderMsgReturnLocation" value="' + fullUrl + '" /></form>', function() {
						$('#gsDropboxExtenderModalContent form').submit();
					});
				});

				$('#gsDropboxExtender-nav').append('<span id="gsDropboxExtenderMessageContainer"><form style="display:none" action="http://www.techgeek01.com/dropboxextplus/index.php" method="post"><input type="hidden" name="userToken" value="' + token + '" />' + msgFormAction + '<input type="hidden" name="returnto" value="' + fullUrl + '" /><input type="hidden" name="userid" value="' + userId + '" /><input type="hidden" name="timeOffset" value="' + new Date().getTimezoneOffset() + '" /></form><a href="javascript:void(0)" id="gsDropboxExtenderMessageLink">Messages</a><span id="gsDropboxExtenderMsgCounter" /></span>');
				
				(function checkMessages() {
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

				//Collapse footer
				if (pageUrl != 'edit.php' && collapseFooter.length > 0 && collapseFooter[0].get('value')) {
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

				//Super User icons
				if (pageUrl == 'topic.php') {
					var modIcon = prefTable.query({preference: 'modIcon'});
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
					var reloadDelay = prefTable.query({preference: 'reload' + pageType});
					if (fullUrl != 'https://forums.dropbox.com/?new=1' && reloadIndex[pageType] && reloadDelay.length > 0 && reloadDelay[0].get('value') > 0) {
						setTimeout(function() {
							if (!modalOpen && (pageUrl == 'topic.php') ? !$('#post_content').val() : true)
								document.location.reload();
							else
								reloadPage(pageType);
						}, reloadDelay[0].get('value') * 1000);
					}
				}

				//Manage preferences page
				if (pageUrl == 'preferences') {
					var reloadTimeList, reloadTimes = [0, 30, 60, 120, 300, 600, 900, 1200, 1800, 2700, 3600];
					for (var i = 0; i < reloadTimes.length; i++) {
						reloadTimeList += '<option value="' + reloadTimes[i] + '">' + (reloadTimes[i] ? (reloadTimes[i] < 60 ? (reloadTimes[i] + ' seconds') : ((reloadTimes[i] / 60) + ' minute' + (reloadTimes[i] > 60 ? 's' : ''))) : 'Never') + '</option>';
					}
					$('#main .topline').html('<a href="https://forums.dropbox.com/snippets">Manage your snippets here!</a><br><br><textarea name="signature" placeholder="Signature" rows="5" style="width:100%"></textarea><br><br><select name="theme"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></select><br><input type="checkbox" id="collapseFooter" name="collapseFooter" /> <label for="collapseFooter" style="font-weight:normal">Automatically collapse footer</label><br><br>Reload front page every <select name="reloadFront">' + reloadTimeList + '</select><br>Reload forum pages every <select name="reloadForum">' + reloadTimeList + '</select><br>Reload stickies every <select name="reloadSticky">' + reloadTimeList + '</select><br><br><select id="modIcon" name="modIcon"><option value="https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/nyancatright.gif" selected="selected">Nyan Cat (Default)</option></select>&nbsp;<img id="modIconPreview"/><br><br><button class="btn btn-success" id="save">Save</button><button class="btn btn-warning btn-right" id="deleteprefs">Trash Preferences</button><button class="btn btn-warning btn-right" id="deletedrafts">Trash Drafts</button>');

					var modIconList = ['Dropbox Flat', 'Dropbox Flat Green', 'Dropbox Flat Lime', 'Dropbox Flat Gold', 'Dropbox Flat Orange', 'Dropbox Flat Red', 'Dropbox Flat Pink', 'Dropbox Flat Purple', 'Dropbox', 'Dropbox Green', 'Dropbox Lime', 'Dropbox Gold', 'Dropbox Orange', 'Dropbox Red', 'Dropbox Pink', 'Dropbox Purple', 'Gold Star'];
					for (var i = 0; i < modIconList.length; i++) {
						$('#modIcon').append('<option value="https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/' + modIconList[i].toLowerCase().replace(' ', '') + '.png">' + modIconList[i] + '</option>');
					}

					//Load current settings
					var pref;
					$('#main select, #main textarea, #main input[type="checkbox"]').each(function() {
						pref = prefTable.query({preference: $(this).attr('name')})[0];
						if(pref) {
							if ($(this).is('select'))
								$(this).find('option[value="' + pref.get('value') + '"]').attr('selected', 'selected');
							if ($(this).is('texarea'))
								$(this).val(pref.get('value'));
							if ($(this).is('input[type="checkbox"]'))
								$(this).prop('checked', pref.get('value'));
						}
					});
					
					$('#modIconPreview').attr('src', $('#modIcon').val());

					$('#deleteprefs').click(function() {
						deleteTable(prefTable);
						postFadeMsg('warning', 'Preferences trashed.');
					});
					$('#deletedrafts').click(function() {
						deleteTable(draftTable);
						postFadeMsg('warning', 'Drafts trashed.');
					});

					$('#modIcon').change(function() {
						$('#modIconPreview').attr('src', $('#modIcon').val());
					});
					$('#save').click(function() {
						$('#main select, #main textarea, #main input[type="checkbox"]').each(function() {
							var pref = prefTable.query({preference: $(this).attr('name')});
							if (pref.length > 0)
								pref[0].set('value', $(this).is('input[type="checkbox"]') ? $(this).prop('checked') : $(this).val());
							else
								prefTable.insert({
									preference: $(this).attr('name'),
									value: $(this).is('input[type="checkbox"]') ? $(this).prop('checked') : $(this).val()
								});
						});
						postFadeMsg('success', 'Your settings have been saved.');
					});
				}
				if (pageUrl == 'snippets') {
					$('#main .topline').html('<br><select id="snippetlist"></select>&nbsp;&nbsp;<button id="loadsnippet" class="btn btn-success">Load</button><button id="deletesnippet" class="btn btn-danger">Delete</button><br><br><input type="hidden" id="oldname" value="" /><input id="friendlyname" type="textbox" style="width:100%" placeholder="Friendly name"/><br><textarea id="snippetfull" placeholder="Snippet text" rows="9" style="width:100%"></textarea><button id="savesnippet" class="btn btn-success">Save</button>');

					$('#snippetlist').html('<option value="">' + (snippets.length > 0 ? 'Select a snippet' : 'You don\'t have any snippets') + '</option>');
					for (var i = 0; i < snippets.length; i++) {
						$('#snippetlist').append('<option value="' + snippets[i].get('name') + '">' + snippets[i].get('name') + '</option>');
					}

					$('#loadsnippet').click(function() {
						if ($('#snippetlist').html() != '') {
							var result = snippetTable.query({name: $('#snippetlist').val()})[0];
							$('#friendlyname, #oldname').val(result.get('name'));
							$('#snippetfull').val(result.get('value'));
						}
					});
					$('#deletesnippet').click(function() {
						if ($('#snippetlist').html() != '') {
							snippetTable.query({name: $('#snippetlist').val()})[0].deleteRecord();
							$('#snippetlist option[value="' + $('#snippetlist').val() + '"]').remove();
							postFadeMsg('warning', 'Snippet deleted');
						}
					});

					$('#savesnippet').click(function() {
						if($('#friendlyname').val() != '' && $('#snippetfull').val() != '') {
							var targetName = $('#oldname').val() == '' ? $('#friendlyname').val() : $('#oldname').val();
							var snip = snippetTable.query({name: targetName});
							if (snip.length > 0) {
								snip[0].set('value', $('#snippetfull').val());
								snip[0].set('name', $('#friendlyname').val());
								$('#snippetlist option[value="' + $('#oldname').val() + '"]').val($('#friendlyname').val()).html($('#friendlyname').val());
							}
							else {
								snippetTable.insert({
									name: $('#friendlyname').val(),
									value: $('#snippetfull').val()
								});
								$('#snippetlist').append('<option value="' + $('#friendlyname').val() + '">' + $('#friendlyname').val() + '</option>');
							}
							$('#friendlyname, #snippetfull, #oldname').val('');
							postFadeMsg('success', 'Snippet saved.');
						} else
							postFadeMsg('danger', 'Please fill out both fields.');
					});
				}

				//Manage drafts
				if (pageUrl == 'topic.php') {
					var thread = fullUrl.split('id=')[1].split('&')[0].split('#')[0];
					$('#post-form-subscription-container').append('<br><a href="javascript:void(0)" id="modpostdraft">Draft Post</a> - <a href="javascript:void(0)" id="modpostrestoredraft">Restore Draft</a>');
					$('#modpostdraft').click(function() {
						var draft = draftTable.query({pageid: thread});
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

//Skin forums
function forumVersion(versionDate) {
	var latestTr = $('#latest tr');
	if (versionDate == '8.8.2012') {
		//Reformat header
		$('#header').css({
			'width': '990px',
			'height': '174px',
			'padding': '0',
			'background': 'url(https://forum-extender-plus.s3-us-west-2.amazonaws.com/forumsheader.jpg)'
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
	} else if (versionDate == 'original') {
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
		if (['forums.dropbox.com', 'forum.php'].indexOf(pageUrl) > -1) {
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];
			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap" /></div>');
			for (var i = 0; i < tagList.length; i++) {
				$('#frontpageheatmap').append('<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a>');
			}
			$('#frontpageheatmap a:not(:last)').append(' ');
			$('#forumlist').attr('id', 'forumlist-temp');
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist"><tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr></table><h2>Latest Discussions</h2>');
			for (var i = 1; i < 6; i++) {
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
		if ((args.length == 2 && content == args[1]) || (content >= args[1] && content <= args[2]))
			$(this).parent().attr('class', 'nochange').css('background', args[0]);
	});
}

function highlightPost(check, color) {
	if ( typeof check == 'string') {
		var totalPosts = $('.threadauthor').length, rolePosts = $('.threadauthor p small a:contains("' + check + '")').length;
		var status = ((totalPosts > 5 && rolePosts / totalPosts > 0.2) || (totalPosts == 5 && rolePosts > 2) || (totalPosts < 5 && rolePosts > 1)) ? 'dis' : 'en';
		var message = '<li style="text-align: center;">' + check + ' highlighting ' + status + 'abled</li>';
		$('#thread').prepend(message).append(message);
		if (status == 'en')
			$('.threadauthor small a:contains("' + check + '")').parent().parent().parent().parent().find('.threadpost').css('background', color);
	} else if ( typeof check == 'number')
		for ( i = 0; i < $('.threadauthor').length; i++) {
			if (parseInt($('.threadauthor').eq(i).html().split('Posts: ')[1], 10) >= check)
				$('.threadauthor').eq(i).find('small a:not(:contains("Super User"))').parent().parent().parent().find('strong:not(:contains("<img align=\'absmiddle\' src=\'/bb-templates/dropbox/images/dropbox-icon.gif\'>"))').parent().parent().parent().find('.threadpost').css('background', color);
		}
}

/*
 * Helper functions
 */

function showModal(modalType, title, content, action, actionTwo) {
	var typeMap = {
		'action': {
			'Action': 'OK',
			'CloseLink': 'Cancel'
		},
		'addok': {
			'ActionTwo': 'Add',
			'Action': 'OK'
		},
		'confirm': {
			'Action': 'Yes',
			'CloseLink': 'No'
		},
		'confirmadd': {
			'Action': 'Add'
		},
		'confirmsend': {
			'Action': 'Send'
		}
	};
	$('#gsDropboxExtenderModalTitle').html(title);
	$('#gsDropboxExtenderModalContent').html(content);
	$('#gsDropboxExtenderModalActionButtons').empty();
	for (i in typeMap[modalType]) {
		$('#gsDropboxExtenderModalActionButtons').append('<a href="javascript:void(0);" class="button gsDropboxExtenderModal' + i + '" style="margin-left:18px">' + typeMap[modalType][i] + '</a>');
	}

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

	$('#gsDropboxExtender-screen-overlay, .gsDropboxExtenderModalClose, .gsDropboxExtenderModalCloseLink, .gsDropboxExtenderModalAction').click(function(){
		$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderModal').hide();
		modalOpen = false;
	});
	$('.gsDropboxExtenderModalAction').click(action);
	if (actionTwo)
		$('.gsDropboxExtenderModalActionTwo').click(actionTwo);
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
	var url = fullUrl;
	url = url.split('?')[(url.split('?')[1] == 'new=1' ? 1 : 0)];
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

//Parameters
var TopicPageRecordLimit = 30;

/*
 * Forum post handlers
 */

//Append the posting form if necessary
if (pageUrl == 'topic.php' && $('form#postform:first').length == 0)
	$.get($('h2.post-form a:first').attr('href'), function(data) {
		$('div#main').append($(data).find('form#postform:first'));
		$('h2.post-form a:first, #post-form-title-container').remove();
		$('.freshbutton-blue, #postformsub').css('background', '#2180ce');
		addMarkupLinks();
	}, 'html');
else
	addMarkupLinks();

function addMarkupLinks() {
	$('.poststuff').append(' - <a href="javascript:void(0)" class="gsDropboxExtenderQuoteSelected">quote selected</a> - <a href="javascript:void(0)" class="gsDropboxExtenderQuotePost">quote post</a>');
	$('p.submit').append('<span style="float: left;"> - <a href="javascript:void(0)" class="gsDropboxExtenderLinkInsert">a</a> - <a href="javascript:void(0)" class="gsDropboxExtenderBlockquoteSelected">blockquote</a> - <a href="javascript:void(0)" class="gsDropboxExtenderStrongSelected">bold</a> - <a href="javascript:void(0)" class="gsDropboxExtenderEmSelected">italic</a> - <a href="javascript:void(0)" class="gsDropboxExtenderCodeSelected">code</a> - <a href="javascript:void(0)" class="gsDropboxExtenderListInsert">ordered list</a> - <a href="javascript:void(0)" class="gsDropboxExtenderListInsert">unordered list</a><span id="siglink" style="display:none"> - <a href="javascript:void(0)" class="gsDropboxExtenderSignatureInsert">custom signature</a></span></span>');
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
$('.gsDropboxExtenderBlockquoteSelected, .gsDropboxExtenderStrongSelected, .gsDropboxExtenderEmSelected, .gsDropboxExtenderCodeSelected').click(function() {
	insertAndMarkupTextAtCursorPosition($(this).attr('class').split('gsDropboxExtender')[1].split('Selected')[0].toLowerCase());
});

//Insert a list
$('.gsDropboxExtenderListInsert').click(function() {
	var listType = $(this).html().split(' ')[0];
	showModal('addok', 'Add List', '<ul id="gsDropboxExtender-listbox-unordered"></ul><ol id="gsDropboxExtender-listbox-ordered"></ol><br /></div><div><div style="clear: both; height: 20px;"><label style="float: left;">Item: </label><input id="gsDropboxExtenderListBoxTextBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" />', function() {
		var content = $('#gsDropboxExtender-listbox-' + listType).html();
		insertTextAtCursorPosition('<' + listType[0] + 'l>\n' + content + '\n</' + listType[0] + 'l>');
		$('#post_content').setCursorPosition($('#post_content')[0].selectionStart + content.length + 11);
	}, function() {
		if ($('#gsDropboxExtenderListBoxTextBox').val()) {
			$('#gsDropboxExtender-listbox-' + listType).append("<li>" + $('#gsDropboxExtenderListBoxTextBox').val() + "</li>");
			$('#gsDropboxExtenderListBoxTextBox').val('');
			$("#gsDropboxExtender-listbox-popup").height($("#gsDropboxExtender-listbox-popup").height() + 20);
		}
	});
});

//Insert a link
$('.gsDropboxExtenderLinkInsert').click(function() {
	showModal('confirmadd', 'Add Link', '<div style="clear: both; height: 20px;"><label style="float: left;">Title: </label><input id="gsDropboxExtenderAnchorTextBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div><div style="clear: both; height: 20px;"><label style="float: left;">Url: </label><input id="gsDropboxExtenderAnchorUrlBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div>', function() {
		insertTextAtCursorPosition('<a href="' + $('#gsDropboxExtenderAnchorUrlBox').val() + '">' + $('#gsDropboxExtenderAnchorTextBox').val() + '</a>');
	});
});

/*
* Generic functions
*/

//Get post author markup
function getPostAuthorDetails(postEventTarget) {
	return '<strong>' + $(postEventTarget).parent().parent().parent().find(".threadauthor").eq(0).find('strong').eq(0).clone().find('img').remove().end().html() + '</strong> scribbled:<br><br>';
}

function getUserId(postEventTarget) {
	return $(postEventTarget).parent().parent().parent().find(".threadauthor").eq(0).find('a[href^="https://forums.dropbox.com/profile.php"]').eq(0).attr('href').split('id=')[1];
}

//Insert markup at required position
function insertAndMarkupTextAtCursorPosition(wrapper) {
	var SelectedTextStart = $('#post_content')[0].selectionStart, SelectedTextEnd = $('#post_content')[0].selectionEnd, EndCursorPosition = SelectedTextStart, SelectedText = '';
	if (SelectedTextEnd - SelectedTextStart > 0)
		SelectedText = $('#post_content').val().substring(SelectedTextStart, SelectedTextEnd);
	insertTextAtCursorPosition('<' + wrapper + '>' + SelectedText + '</' + wrapper + '>');
	if (SelectedText == '')
		$('#post_content').setCursorPosition(EndCursorPosition + 2 + wrapper.length);
}

//Insert text at required position
function insertTextAtCursorPosition(TextToBeInserted) {
	var startPos = $('#post_content')[0].selectionStart;
	$('#post_content').val($('#post_content').val().substring(0, startPos) + TextToBeInserted + $('#post_content').val().substring($('#post_content')[0].selectionEnd));
	$('#post_content').setCursorPosition(startPos + TextToBeInserted.length);
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
function insertSelectedQuote(TextToQuote, PostAuthorDetails) {
	if (TextToQuote != '') {
		if (PostAuthorDetails == undefined)
			PostAuthorDetails = '';

		var SelectionStart = $('#post_content')[0].selectionStart;
		var NewlineNeeded = (SelectionStart > 0) && ($('#post_content').val().charAt(SelectionStart - 1) != "\n");
		var AppendedText = (NewlineNeeded ? "\n" : '') + "<blockquote>" + PostAuthorDetails + TextToQuote + "</blockquote>\n";

		insertTextAtCursorPosition(AppendedText);
		$('#post_content').setCursorPosition(SelectionStart + AppendedText.length);
	}
}

//Get selected test for quoting
function getSelectedText() {
	if (window.getSelection)
		return SelectedText = window.getSelection();
	else if (document.selection)
		return SelectedText = document.selection.createRange().text;
}