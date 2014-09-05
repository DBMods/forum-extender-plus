// ==UserScript==
// @name Dropbox Forum Extender+
// @namespace DropboxMods
// @description Beefs up the forums and adds way more functionality
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2.3.0.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/forum-extender-plus.user.js
// @resource customStyle http://techgeek01.com/dropboxextplus/css/style.css
// @resource bootstrap http://techgeek01.com/dropboxextplus/css/bootstrap.css
// @resource bootstrap-theme http://techgeek01.com/dropboxextplus/css/bootstrap-theme.css
// @grant GM_xmlhttpRequest
// @grant GM_getResourceText
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

//Set global variables
var fullUrl = window.location.href, pageUrl = getPageUrl(), urlVars = getUrlVars(), modalOpen = false, userId = '';
var color = {
	green: '#beff9e',//'#b5ff90',
	lightGreen: '#daffc7',
	gold: '#fff19d',
	lightGold: '#fff8ce',
	lightRed: '#ffe9e9'
};

if ($('#header .login').length) {
	userId = $('#header .login a[href^="https://forums.dropbox.com/profile.php"]').attr('href').split('id=')[1];
}

//Define empty variables
var temp, i, l;

//Set up nav bar, hover messages, and modal
$('body').append('<div id="gsDropboxExtenderScreenOverlay" style="display:none;position:fixed;bottom:0;right:0;top:0;left:0;background:#000;border:1px solid #cecece;z-index:50;opacity:0.7;" /><div id="gsDropboxExtenderModal"><a class="gsDropboxExtenderModalClose">x</a><h1 id="gsDropboxExtenderModalTitle"></h1><br /><br /><div id="gsDropboxExtenderModalContent" /><div id="gsDropboxExtenderModalActionButtons" style="text-align:right" /></div><div id="gsDropboxExtenderNav"><a href="http://forums.dropbox.com/preferences"' + (pageUrl != 'forums.dropbox.com' ? ' target="blank"' : '') + '><img src="https://raw.githubusercontent.com/DBMods/forum-extender-plus/master/resources/images/plus-sync-logo.png" style="height:150px;width:150px;position:fixed;bottom:-25px;left:-35px;z-index:11" /></a><span><a href="https://forums.dropbox.com">Take me home!</a></span><span><a href="https://forums.dropbox.com/topic.php?id=109057">Official thread</a></span></div>').css('padding-bottom', '31px');
$('head').append('<style>#gsDropboxExtenderModal{display:none;position:fixed;height:200px;width:408px;background:#fff;border:2px solid #cecece;z-index:50;padding:12px;font-size:13px;}#gsDropboxExtenderModal h1{text-align:left;color:#6FA5FD;font-size:22px;font-weight:700;border-bottom:1px dotted #D3D3D3;padding-bottom:2px;margin-bottom:20px;}.gsDropboxExtenderModalClose:hover{cursor:pointer;}.gsDropboxExtenderModalClose{font-size:14px;line-height:14px;right:6px;top:4px;position:absolute;color:#6fa5fd;font-weight:700;display:block;}.alert-center{width: 500px;position: absolute;left: 50%;margin-left: -250px;z-index: 1;}.alert-warning{background-color: rgba(252,248,227,0.8);background-image: linear-gradient(to bottom,rgba(252,248,227,0.8) 0%,rgba(248,239,192,0.8) 100%);border-color: #f5e79e;color: rgba(138,109,59,0.8);background-image: -webkit-linear-gradient(top,#fcf8e3 0,#f8efc0 100%);background-repeat: repeat-x;}.alert-danger{background-color: rgba(242,222,222,0.8);background-image: linear-gradient(to bottom,rgba(242,222,222,0.8) 0%,rgba(231,195,195,0.8) 100%);border-color: #dca7a7;color: rgba(169,68,66,0.8);background-image: -webkit-linear-gradient(top,#f2dede 0,#e7c3c3 100%);background-repeat: repeat-x;}.alert-success{background-color: rgba(223,240,216,0.8);background-image: linear-gradient(to bottom,rgba(223,240,216,0.8) 0%,rgba(200,229,188,0.8) 100%);border-color: #b2dba1;color: rgba(60,118,61,0.8);background-image: -webkit-linear-gradient(top,#dff0d8 0,#c8e5bc 100%);background-repeat: repeat-x;}.alert-info{background-color: rgba(217,237,247,0.8);background-image: linear-gradient(to bottom,rgba(217,237,247,0.8) 0%,rgba(185,222,240,0.8) 100%);border-color: #9acfea;color: rgba(49,112,143,0.8);background-image: -webkit-linear-gradient(top,#d9edf7 0,#b9def0 100%);background-repeat: repeat-x;}.alert{max-width: 500px;margin-left: auto;margin-right: auto;text-align: center;padding: 15px;margin-bottom: 20px;border: 1px solid transparent;border-radius: 4px;text-shadow: 0 1px 0 rgba(255,255,255,.2);-webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 1px 2px rgba(0,0,0,.05);box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 1px 2px rgba(0,0,0,.05)}.alert > p{margin-bottom: 0}#gsDropboxExtenderNav>span{margin-left:20px;}#gsDropboxExtenderNav{position:fixed;bottom:0;height:30px;border-top:1px solid #bbb;width:100%;line-height:30px;background:#fff;z-index:10;padding:0 0 0 105px;}</style>');

//Element caching
var $body = $('body'), $head = $('head');
var $postField = $('#post_content'), $postForm = $('#postform'), $postFormCleardiv = $postForm.find('div.clear');
var $threadAuthor = $('.threadauthor'), $userRole = $threadAuthor.find('small a');
var $latest = $('#latest');
var $forumList = $('#forumlist'), $forumListRows = $forumList.find('tr'), $forumListContainer = $('#forumlist-container');
var $modal = $('#gsDropboxExtenderModal'), $screenOverlay = $('#gsDropboxExtenderScreenOverlay');

//Add footer
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Extender+ v' + GM_info.script.version + '</div>');

highlightPost('Super User', color.gold);
highlightPost(500, color.green, 'Forum regular');
highlightPost(100, color.lightGreen, 'New forum regular');

function highlightPost(check, color, label) {
	var selectors = {
		'string': $userRole.filter(':contains("' + check + '")'),
		'number': $userRole.filter(function() {
			return parseInt($(this).parent().parent().html().split('Posts: ')[1], 10) >= check;
		})
	}, postList = $(selectors[typeof check]).filter(':not(.checkedHighlight)');
	label = label || check;
	if ($(postList).length) {
		$(postList).addClass('checkedHighlight');
		var totalPosts = $threadAuthor.length, rolePosts = postList.length, status = ((totalPosts > 2 && rolePosts / totalPosts > 0.6) || (totalPosts == 2 && rolePosts == 2)) ? 'dis' : 'en', message = '<li style="text-align: center;">' + label + ' highlighting ' + status + 'abled</li>';
		$('#thread').prepend(message).append(message);
		if (status == 'en') {
			$(postList).parent().parent().parent().parent().find('.threadpost').css('background', color);
		}
	}
}

highlightThread(1, color.lightGreen);
highlightThread(2, color.lightGold);
highlightThread(3, color.lightRed);

function highlightThread() {
	var args = arguments, $threadList = $latest.find('tr:not(.sticky, .super-sticky) td:nth-child(2)'), content;
	for (i = 0, l = $threadList.length; i < l; i++) {
		content = parseInt($threadList.eq(i).html(), 10);
		if ((args.length == 2 && content == args[0]) || (content >= args[0] && content <= args[1])) {
			$threadList.eq(i).parent().addClass('nochange').css('background', args[args.length - 1]);
		}
	}
}

//Emphasize new replies to threads you've interacted with
if (pageUrl == 'topic.php') {
	$postForm.on('submit', function() {
		var d = new Date(), today = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
		if (GM_getValue('date', 0) < today) {
			//If we're starting a new day, flush all old threads, and start over
			GM_setValue('date', today);
			GM_setValue('todayThreads', urlVars.id);
		} else if (GM_getValue('date') == today) {
			//Otherwise, add the current thread ID to the list
			var todayThreads = GM_getValue('todayThreads', '').split(',');
			if (todayThreads.indexOf(urlVars.id) == -1) {
				todayThreads.push(urlVars.id);
				GM_setValue('todayThreads', todayThreads.toString());
			}
		}
	});
}
if (pageUrl == 'forums.dropbox.com' || pageUrl == 'forum.php') {
	var todayThreads = GM_getValue('todayThreads', '').split(','), $threadPageList = $latest.find('tr:not(.sticky, .super-sticky) td:nth-child(1) a');
	for (i = 0, l = todayThreads.length; i < l; i++) {
		$threadPageList.filter('[href$="?id=' + todayThreads[i] + '"]').parent().parent().css('font-weight', 'bold');
	}
}

//Modify posts
$userRole.filter(':contains("Super User")').parent().parent().find('strong').prepend('<img />');
$userRole.filter('[href$="=1618104"]').html('Master of Super Users');

$latest.find('tr.closed span.label.closed').show();

//Remove unnecessary stuff
if (pageUrl == 'topic.php') {
	$('#post-form-title-container').remove();
}

//Detect and manage unstickied threads
if ($('#topic-info .topictitle:contains(") - "):contains(" Build - ")').length) {
	var stickyList = GM_getValue('stickies', '').split(',');
	if ($('#topic_labels .sticky').length) {
		if (stickyList.indexOf(urlVars.id) == -1) {
			//If this thread is currently sticky, and I have not accessed it before, watch it
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
				url: 'https://forums.dropbox.com',
				onload: function(response) {
					var newSticky = $(response.responseText).find('td:contains("' + threadType + '") big a');
					if (newSticky.length) {
						window.location.href = newSticky.eq(0).attr('href');
					}
				}
			});
		});
	}
}

/*
* Forum post handlers
*/

//Append the posting form if necessary
if (pageUrl == 'topic.php' && !$postForm.length) {
	$.get($('h2.post-form a').attr('href'), function(data) {
		$('#main').append($(data).find('#postform'));
		$('#post-form-title-container').remove();
		$('h2.post-form').html('Reply');
		$('.freshbutton-blue, #postformsub').css('background', '#2180ce');
		addMarkupLinks();
	}, 'html');
} else {
	addMarkupLinks();
}

function addMarkupLinks() {
	$('.poststuff').append(' - <a href="javascript:void(0)" class="gsDropboxExtenderQuoteSelected">quote selected</a> - <a href="javascript:void(0)" class="gsDropboxExtenderQuotePost">quote post</a>');
	$('p.submit').append('<span style="float: left;">&nbsp;- <a href="javascript:void(0)" class="gsDropboxExtenderLinkInsert">a</a> - <a href="javascript:void(0)" class="gsDropboxExtenderBlockquoteSelected">blockquote</a> - <a href="javascript:void(0)" class="gsDropboxExtenderStrongSelected">bold</a> - <a href="javascript:void(0)" class="gsDropboxExtenderEmSelected">italic</a> - <a href="javascript:void(0)" class="gsDropboxExtenderCodeSelected">code</a> (<a href="javascript:void(0)" class="gsDropboxExtenderQuoteCodeSelected">quoted</a>) - <a href="javascript:void(0)" class="gsDropboxExtenderListInsert">ordered list</a> - <a href="javascript:void(0)" class="gsDropboxExtenderListInsert">unordered list</a><span id="siglink" style="display:none"> - <a href="javascript:void(0)" class="gsDropboxExtenderSignatureInsert">custom signature</a></span></span>');

	//Quoting
	$('.gsDropboxExtenderQuotePost').on('click', function(evt) {
		var SelectedText = $(evt.target).parent().parent().find('.post').eq(0).text().replace('\n', '\n\n');
		insertSelectedQuote(SelectedText.substring(0, SelectedText.length - 1), getPostAuthorDetails(evt.target));
	});
	$('.gsDropboxExtenderQuoteSelected').on('click', function(evt) {
		insertSelectedQuote(getSelectedText(), getPostAuthorDetails(evt.target));
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
		showModal(['Add', 'OK'], 'Add List', '<' + listType[0] + 'l id="gsDropboxExtenderListbox" style="padding-left:16px"></' + listType[0] + 'l><br /></div><div><div style="clear:both;height:20px;"><label style="float:left;">Item: </label><input id="gsDropboxExtenderListBoxTextBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" />', function() {
			var content = $('#gsDropboxExtenderListbox').html();
			insertTextAtCursorPosition('<' + listType[0] + 'l>\n' + content + '\n</' + listType[0] + 'l>');
			$postField.setCursorPosition($postField[0].selectionStart + content.length + 11);
		}, function() {
			if ($('#gsDropboxExtenderListBoxTextBox').val()) {
				$('#gsDropboxExtenderListbox').append("<li>" + $('#gsDropboxExtenderListBoxTextBox').val() + "</li>");
				$('#gsDropboxExtenderListBoxTextBox').val('');
				var heightModifier = $('#gsDropboxExtenderListbox li:last').height();
				$modal.css({
					'top': (parseInt($modal.css('top'), 10) - (heightModifier / 2)),
					'height': $modal.height() + heightModifier
				});
			}
		});
	});

	//Insert a link
	$('.gsDropboxExtenderLinkInsert').on('click', function() {
		showModal(['Add'], 'Add Link', '<div style="clear: both; height: 20px;"><label style="float: left;">Title: </label><input id="gsDropboxExtenderAnchorTextBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div><div style="clear: both; height: 20px;"><label style="float: left;">Url: </label><input id="gsDropboxExtenderAnchorUrlBox" class="textinput" type="text" maxlength="500" size="100" style="height: 16px; float: right; width: 300px;" /></div>', function() {
			insertTextAtCursorPosition('<a href="' + $('#gsDropboxExtenderAnchorUrlBox').val() + '">' + $('#gsDropboxExtenderAnchorTextBox').val() + '</a>');
		});
	});
}

//Init pages
makePage('preferences', 'Preferences', 'Please wait while we load your preferences. This should only take a few seconds.');
makePage('snippets', 'Snippets', 'Please wait while we load the snippet manager. This should only take a few seconds.');

function makePage(slug, title, content) {
	if (pageUrl == slug) {
		$head.append('<link rel="shortcut icon" href="//www.dropbox.com/static/images/favicon.ico" /><style>' + GM_getResourceText('customStyle') + GM_getResourceText('bootstrap') + GM_getResourceText('bootstrap-theme') + '</style>').find('title').html('Forum Extender+ ' + title);
		$body.html('<div id="wrapper" class="container"><div class="jumbotron" id="main"><h2>' + title + '</h2><p class="topline">' + content + '</p></div></div><div class="container"><footer><hr><div>Developed by <a href="http://techgeek01.com" target="_blank">Andy Y.</a> and <a href="http://nathancheek.com" target="_blank">Nathan C.</a></div></footer></div><div class="container navbar-fixed-top"><div class="header"><ul class="nav nav-pills pull-left"><li class="inactive"><a href="https://forums.dropbox.com">Back to Forums</a></li></ul><div class="site-title"><h3 class="text-muted">Dropbox Forum Extender+</h3></div></div></div><script src="http://techgeek01.com/dropboxextplus/js/bootstrap.js"></script>');
	}
}

/*
* Work with the Dropbox datastore
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
	client.getDatastoreManager().openDefaultDatastore(function(error, datastore) {
		if (error) {
			console.log('Error opening default datastore. Retrying');
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

		var snippetList = [];
		for (var i = 0, l = snippets.length; i < l; i++) {
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
			forumVersion(theme[0].get('value'));
		}

		//Custom signature
		var sig = prefTable.query({name: 'signature'});
		$('#siglink').show();
		$('.gsDropboxExtenderSignatureInsert').on('click', function() {
			$postField.setCursorPosition($postField.val().length);
			insertTextAtCursorPosition("\n\n--\n" + (sig.length ? sig[0].get('value') : 'You haven\'t set your signature yet. Head over to the preferences menu to do that.'));
		});

		reloadPage('Front');
		reloadPage('Forum');
		reloadPage('Sticky');

		function reloadPage(pageType) {
			var reloadIndex = {
				'Sticky': pageUrl == 'topic.php' && $('#topic_labels .sticky').length,
				'Front': pageUrl == 'forums.dropbox.com',
				'Forum': pageUrl == 'forum.php'
			};
			var reloadDelay = prefTable.query({preference: 'reload' + pageType});
			if (reloadIndex[pageType] && reloadDelay.length && reloadDelay[0].get('value')) {
				setTimeout(function() {
					if (!modalOpen && !$postField.val()) {
						document.location.reload();
					} else {
						reloadPage(pageType);
					}
				}, reloadDelay[0].get('value') * 1000);
			}
		}

		//Add post snippets
		if (pageUrl == 'topic.php' || pageUrl == 'edit.php') {
			$postFormCleardiv.append('<p id="gsDropboxExtenderPostExtras" style="float:left;margin-right:20px"><select id="snippets"><option name="default" value="">' + (snippetList.length ? 'Select a snippet' : 'You don\'t have any snippets') + '</option><optgroup label="--Snippets--" /></select></p>');

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
		}

		//Manage drafts
		if (pageUrl == 'topic.php') {
			var thread = urlVars.id;
			$('#gsDropboxExtenderPostExtras').append('<br><a href="javascript:void(0)" id="modpostdraft">Draft Post</a> - <a href="javascript:void(0)" id="modpostrestoredraft">Restore Draft</a>');
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

		$postFormCleardiv.append($('#post-form-allowed-container'));
		$('#post-form-allowed-container').css('float', 'left');

		//Pages
		if (pageUrl == 'preferences') {
			var reloadTimeList, reloadTimes = [0, 30, 60, 120, 300, 600, 900, 1200, 1800, 2700, 3600];
			for (i = 0, l = reloadTimes.length; i < l; i++) {
				reloadTimeList += '<option value="' + reloadTimes[i] + '">' + (reloadTimes[i] ? (reloadTimes[i] < 60 ? (reloadTimes[i] + ' seconds') : ((reloadTimes[i] / 60) + ' minute' + (reloadTimes[i] > 60 ? 's' : ''))) : 'Never') + '</option>';
			}
			$('#main .topline').html('<a href="https://forums.dropbox.com/snippets">Manage your snippets here!</a><br><br><textarea name="signature" placeholder="Signature" rows="5" style="width:100%"></textarea><br><br><select name="theme"><option value="original">Original</option><option value="8.8.2012">8.8.2012</option><option value="" selected="selected">Current Theme (No Change)</option></select><br><input type="checkbox" id="collapseFooter" name="collapseFooter" /> <label for="collapseFooter" style="font-weight:normal">Automatically collapse footer</label><br><br>Reload front page every <select name="reloadFront">' + reloadTimeList + '</select><br>Reload forum pages every <select name="reloadForum">' + reloadTimeList + '</select><br>Reload stickies every <select name="reloadSticky">' + reloadTimeList + '</select><br><br><select id="modIcon" name="modIcon"><option value="https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/nyancatright.gif" selected="selected">Nyan Cat (Default)</option></select>&nbsp;<img id="modIconPreview"/><br><br><button class="btn btn-success" id="save">Save</button><button class="btn btn-warning btn-right" id="deleteprefs">Trash Preferences</button><button class="btn btn-warning btn-right" id="deletedrafts">Trash Drafts</button>');

			var modIconList = ['Dropbox Flat', 'Dropbox Flat Green', 'Dropbox Flat Lime', 'Dropbox Flat Gold', 'Dropbox Flat Orange', 'Dropbox Flat Red', 'Dropbox Flat Pink', 'Dropbox Flat Purple', 'Dropbox', 'Dropbox Green', 'Dropbox Lime', 'Dropbox Gold', 'Dropbox Orange', 'Dropbox Red', 'Dropbox Pink', 'Dropbox Purple', 'Gold Star'];
			temp = '';
			for (i = 0, l = modIconList.length; i < l; i++) {
				temp += '<option value="https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/' + modIconList[i].toLowerCase().replace(' ', '') + '.png">' + modIconList[i] + '</option>';
			}
			$('#modIcon').append(temp);

			//Load current settings
			var pref, $elemList = $('#main select, #main textarea, #main input[type="checkbox"]'), $elem;
			for (i = 0, l = $elemList.length; i < l; i++) {
				$elem = $elemList.eq(i);
				pref = prefTable.query({preferences: $elem.attr('name')})[0];
				if(pref) {
					if ($elem.is('select')) {
						$elem.find('option[value="' + pref[0].get('value') + '"]').attr('selected', 'selected');
					} else if ($elem.is('texarea')) {
						$elem.val(pref[0].get('value'));
					} else if ($elem.is('input[type="checkbox"]')) {
						$elem.prop('checked', pref[0].get('value'));
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
				if($('#friendlyname').val() !== '' && $('#snippetfull').val() !== '') {
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
						for (var i = 0, l = snippetList.length; i < l; i++) {
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

		//Detect if message system is returning a token, log it, and then reload the page
		if (urlVars.msgtoken) {
			var tokenval = urlVars.msgtoken;
			var redirUrl = fullUrl.indexOf('?msgtoken=') > -1 ? fullUrl.split('?msgtoken=')[0] : fullUrl.split('&msgtoken=')[0];
			if (userToken.length === 0) {
				configTable.insert({
					name: 'userToken',
					value: tokenval
				});
			} else {
				userToken[0].set('value', tokenval);
			}
			datastore.syncStatusChanged.addListener(function() {
				if (!datastore.getSyncStatus().uploading) {
					window.location.href = redirUrl;
				}
			});
		}
		var token = userToken[0].get('value') || '';
		var msgFormAction = userToken.length ? '' : '<input type="hidden" name="action" value="create-account" />';

		//Handle messages
		$('.poststuff').append(' - <a href="javascript:void(0)" class="gsDropboxExtenderMessageUser">message user</a>');
		$('.gsDropboxExtenderMessageUser').on('click', function(evt) {
			showModal(['Send'], 'Message User', '<form id="gsDropboxExtenderMessageForm" action="http://www.techgeek01.com/dropboxextplus/process-message.php" method="post"><input type="hidden" name="userToken" value="' + token + '" />' + msgFormAction + '<input name="msgto" id="gsDropboxExtenderMsgTo" type="textbox" style="width:100%" placeholder="Recipient" value="' + getUserId(evt.target) + '"/><br><input name="msgfrom" id="gsDropboxExtenderMsgFrom" type="hidden" value = "' + userId + '"/><textarea name="msgtext" id="gsDropboxExtenderMsgText" style="width:100%" placeholder="Message"></textarea><input type="hidden" name="returnto" id="gsDropboxExtenderMsgReturnLocation" value="' + fullUrl + '" /></form>', function() {
				$('#gsDropboxExtenderModalContent form').submit();
			});
		});

		$('#gsDropboxExtenderNav').append('<span id="gsDropboxExtenderMessageContainer"><form style="display:none" action="http://www.techgeek01.com/dropboxextplus/index.php" method="post"><input type="hidden" name="userToken" value="' + token + '" />' + msgFormAction + '<input type="hidden" name="returnto" value="' + fullUrl + '" /><input type="hidden" name="userid" value="' + userId + '" /><input type="hidden" name="timeOffset" value="' + new Date().getTimezoneOffset() + '" /></form><a href="javascript:void(0)" id="gsDropboxExtenderMessageLink">Messages</a><span id="gsDropboxExtenderMsgCounter" /></span>');

		if (token) {
			(function checkMessages() {
				GM_xmlhttpRequest({
					method: 'GET',
					url: ('http://www.techgeek01.com/dropboxextplus/count-messages.php?to=' + userId + '&token=' + token),
					onload: function(response) {
						var resp = response.responseText;
						if (resp != 'Incorrect token') {
							$('#gsDropboxExtenderMsgCounter').html(resp == '0' ? '' : (' (' + resp + ')'));
						} else {
							if($('#gsDropboxExtenderMessageContainer form input[value="create-account"]').length === 0) {
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

		/*
		* Aesthetics
		*/

		//Collapse footer
		if ($(window).height() + $('#footer').height() < $(document).height() && collapseFooter.length && collapseFooter[0].get('value')) {
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
		}

		//Super User icons
		var modIcon = prefTable.query({preference: 'modIcon'});
		$userRole.filter(':contains("Super User")').parent().parent().find('strong').find('img').attr('src', modIcon.length ? modIcon[0].get('value') : 'https://forum-extender-plus.s3-us-west-2.amazonaws.com/icons/nyancatright.gif');
	});
} else {
	$('#gsDropboxExtenderNav').append('<span id="dropboxlink">' + ((pageUrl == 'forums.dropbox.com' || pageUrl == 'forum.php') ? 'Link to Dropbox' : 'You\'re not linked to Dropbox yet, but you can do so from the <a href="https://forums.dropbox.com">front page</a>') + '</span>');

	//Start authentication process
	$('#dropboxlink').on('click', function(e) {
		e.preventDefault();
		client.authenticate();
	});
}

/*
* Graphics handling
*/

//Fix UI for new semi-broken theme 10-8-2013
$('#topic-info').prepend('<br>').prepend($('#header .breadcrumb').clone()).prepend('<a href="https://forums.dropbox.com">Forums</a> ');
$forumList.find('th').wrapInner('<a href="https://forums.dropbox.com" />');
$('#header').css('margin-top', '0').append($('.search'));
$('#header .breadcrumb, #header .home').remove();
$forumListContainer.css('top', '0');
$('.login, #sign-in-link').css({
	'float': 'left',
	'clear': 'none',
	'margin-top': '5px',
	'position': 'static',
	'font-size': '12px',
	'font-weight': 'normal'
});
$('.search').css({
	'float': 'right',
	'clear': 'right',
	'margin': '5px',
	'position': 'static'
});
$('#main').css('clear', 'both');
var $blueButtons = $('.freshbutton-blue, #topic-search-form-submit');
$blueButtons.css({
	'text-shadow': '#355782 0 1px 2px',
	'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.3),inset 0px 1px 0px #83C5F1',
	'padding': '5px 16px',
	'background-color': '#2180ce',
	'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#3baaf4", endColorstr="#2389dc")',
	'background-image': '-webkit-gradient(linear, left top, left bottom, from(#33a0e8), to(#2180ce))',
	'background-image': '-moz-linear-gradient(top, #33a0e8, #2180ce)'
});
$blueButtons.on('mouseover', function() {
	$(this).css({
		'background-color': '#2389dc',
		'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#3baaf4", endColorstr="#2389dc")',
		'background-image': '-webkit-gradient(linear, left top, left bottom, from(#3baaf4), to(#2389dc))',
		'background-image': '-moz-linear-gradient(top, #3baaf4, #2389dc)'
	});
});
$blueButtons.on('mouseout', function() {
	$(this).css({
		'background-color': '#2180ce',
		'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#3baaf4", endColorstr="#2389dc")',
		'background-image': '-webkit-gradient(linear, left top, left bottom, from(#33a0e8), to(#2180ce))',
		'background-image': '-moz-linear-gradient(top, #33a0e8, #2180ce)'
	});
});

//Skin forums
function forumVersion(versionDate) {
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
		$latest.find('th a').css('color', '#aaa');
		//TODO: latestHeader widths: 545, 46, 90, 69px
		$('.sticky, .super-sticky').css('background', '#f4faff');

		//Style table headers
		$forumList.add($latest).find('th').css({
			'background': '#666',
			'color': '#fff'
		});
		$forumListRows.eq(0).css({
			'height': '25px',
			'padding': 'none'
		});

		//Add and style headings
		$('#discussions').prepend('<h2 class="forumheading">Latest Discussions</h2>');
		$forumListContainer.prepend('<h2 class="forumheading">' + $forumList.find('th').html() + '</h2>');
		$('.forumheading').css({
			'border-bottom': '1px solid #ddd',
			'padding-bottom': '6px'
		});

		$forumList.find('th').html('Name');
	} else if (versionDate == 'original') {
		$('#main, #header').css('width', '866px');
		$('#header a:first img').attr('src', 'http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png');
		$('#discussions').css('margin-left', '0');
		$latest.find('tr:not(:first, .nochange)').add('.bb-root').css('background', '#f7f7f7');
		$latest.css({
			'width': '680px',
			'border-top': '1px dotted #ccc'
		}).add('.alt').css('background', '#fff');
		$('.sticky, .super-sticky').css('background', '#deeefc');

		//Add tag list and reorder elements
		if (['forums.dropbox.com', 'forum.php'].indexOf(pageUrl) > -1) {
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];
			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap" /></div>');
			temp = '';
			for (i = 0, l = tagList.length; i < l; i++) {
				temp += '<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a> ';
			}
			$('#frontpageheatmap').append(temp.substring(0, temp.length - 1));
			var select;
			temp = '';
			for (i = 1; i < $forumListRows.length; i++) {
				select = $forumListRows.eq(i).find('td').html().split('<br>');
				temp += '<tr class="bb-precedes-sibling bb-root"><td>' + select[0] + select[1] + '</td><td class="num">' + select[2].split(' topics')[0] + '</td><td class="num">' + select[2].split(' topics')[0] + '+</td></tr>';
			}
			$forumListContainer.remove();
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist"><tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr>' + temp + '</table><h2>Latest Discussions</h2>');
			$forumList.html(temp);
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
		$forumList.css({
			'background': '#fff',
			'border-top': '1px dotted #ccc'
		});
		$('h2').css({
			'color': '#000',
			'margin-bottom': '0'
		});
	}
}

/*
* Helper functions
*/

//Get post author markup
function getPostAuthorDetails(postEventTarget) {
	var stuff = $(postEventTarget).parent().parent().parent().find(".threadauthor").eq(0).find('strong').eq(0).clone().find('img').remove().end();
	return '<a href="' + fullUrl.split('#')[0] + $(postEventTarget).parent().find('a[href^="#"]').attr('href') + '"><strong>' + ($(stuff).find('a').html() || $(stuff).html()) + '</strong> scribbled:</a>\n';
}

function getUserId(postEventTarget) {
	return $(postEventTarget).parent().parent().parent().find(".threadauthor").eq(0).find('a[href^="https://forums.dropbox.com/profile.php"]').eq(0).attr('href').split('id=')[1];
}

//Insert markup at required position
function insertAndMarkupTextAtCursorPosition() {
	var args = arguments;
	var SelectedTextStart = $postField[0].selectionStart, SelectedTextEnd = $postField[0].selectionEnd, EndCursorPosition = SelectedTextStart, SelectedText = '';
	if (SelectedTextEnd - SelectedTextStart) {
		SelectedText = $postField.val().substring(SelectedTextStart, SelectedTextEnd);
	}
	var offset = 0, i = args.length, temp = SelectedText;
	while (i--) {
		temp = '<' + args[i] + '>' + temp + '</' + args[i] + '>',	offset += 2 + args[i].length;
	}
	insertTextAtCursorPosition(temp);
	if (!SelectedText) {
		$postField.setCursorPosition(EndCursorPosition + offset);
	}
}

//Insert text at required position
function insertTextAtCursorPosition(TextToBeInserted) {
	var startPos = $postField[0].selectionStart;
	$postField.val($postField.val().substring(0, startPos) + TextToBeInserted + $postField.val().substring($postField[0].selectionEnd));
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
		var NewlineNeeded = (SelectionStart) && ($postField.val().charAt(SelectionStart - 1) != "\n");
		var AppendedText = (NewlineNeeded ? "\n" : '') + "<blockquote>" + postAuthorDetails + quote + "</blockquote>\n";

		insertTextAtCursorPosition(AppendedText);
		$postField.setCursorPosition(SelectionStart + AppendedText.length);
	}
}

//Get selected test for quoting
function getSelectedText() {
	if (window.getSelection) {
		return window.getSelection();
	} else if (document.selection) {
		return document.selection.createRange().text;
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

function getPageUrl() {
	var url = fullUrl.split('?')[(fullUrl == 'https://forums.dropbox.com/?new=1' ? 1 : 0)];
	return url.split('/')[url.split('/').length - ((url[url.length - 1] == '/') ? 2 : 1)];
}

function getRandomNumber() {
	return 4;
	//Chosen by fair dice roll. Guaranteed to be random.
}
