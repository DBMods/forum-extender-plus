// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2013.11.20pre2a
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @require https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/nightly.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/nightly.user.js
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
$('#footer').append('<div style="text-align: center; font-size: 11px; clear:both;">Dropbox Forum Mod Icons ' + versionSlug(GM_info.script.version) + '</div>');

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
	$('#header .breadcrumb').hide();
} else
	$('#header .breadcrumb').hide();
$('#header .home').hide();
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

	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://github.com/DBMods/forum-mod-icons/raw/master/snippets/navstyle.html',
		onload: function(response) {
			$('head').append(response.responseText);
		}
	});
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://github.com/DBMods/forum-mod-icons/raw/master/snippets/prefs.html',
		onload: function(response) {
			$('#modicon-option-popup').html(response.responseText);
		}
	});

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
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://github.com/DBMods/forum-mod-icons/raw/master/snippets/snippetlist.html',
			onload: function(response) {
				$('#modicon-nav').append(response.responseText);
			}
		});
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
 * Methods
 */