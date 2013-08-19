// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2013.8.18.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/nightlies/2013.8.18.1.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/nightlies/2013.8.18.1.user.js
// @grant none
// ==/UserScript==

//Set internal version
var internalVersion = 'Nightly Build';

//Set global variables
var pageUrl = getPageUrl();
var iconIndex = {
	'Super User': '<img src="https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif" height="16px" width="40px"> ',
	'Pro User': '<img align="top" src="https://forums.dropbox.com/bb-templates/dropbox/images/star.gif"> ',
	'Dropboxer': '<img align="absmiddle" src="https://forums.dropbox.com/bb-templates/dropbox/images/dropbox-icon.gif"> ',
	'default': ''
};

/*
* Everything above this line is crucial to the operation of this program
* Do not modify anything above this line unless you know what you're doing
*/

//Add footer
addFooter();

//Modify Super User posts
//addIcon('Super User');
postHighlight('Super User', '#fff19d');
changeRole(1618104, 'Master of Super Users');
//changeRoleName("1618104", "Master of Super Users");

//Highlight posts by forum regulars green
postHighlight(6845, '#b5ff90');
postHighlight(3581696, '#b5ff90');
postHighlight(816535, '#b5ff90');
postHighlight(2122867, '#b5ff90');
postHighlight(434127, '#b5ff90');

/*
 * Reskin the forums
 * Comment out this line if you want to keep the current layout
 *
 * "8.8.2012" ................ The original of the 3 revamps
 * "original" ................ The original layout
 * "beta" .................... A beta skin currently in development
 */
forumVersion('beta');

/*
 * Reload pages
 *
 * reloadPage(reloadDelay)
 * reloadDelay .......... The number of seconds between refreshes (0 to disable)
 */
reloadFront(120);
reloadStickies(120);

/*
* Everything below this line is crucial to the operation of this script
* Do not modify anything below this line unless you know what you're doing
*/

//TODO Add slideout panel
function addSlideOut() {
	try {
		var nameList = ["Andy Y.", "Chen S.", "Chris J.", "KC", "Nathan C.", "N.N.", "Mark Mc", "R.M.", "René S.", "Ryan M.", "Sebastian H.", "T. Hightower", "Trevor B."];
		var userList = ["1618104", "11096", "175532", "561902", "857279", "67305", "30385", "643099", "182504", "1510497", "32911", "222573", "1588860"];
		var activityList = ["Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information"];
	} catch(e) {
		alert(e);
	}
}

//Reload stickies TODO minify this
function reloadStickies(reloadDelay) {
	if (pageUrl == 'https://forums.dropbox.com/topic.php' && reloadDelay > 0 && $('#topic_labels:contains("[sticky]")').length > 0)
		setTimeout(function() {
			if (!$('#topic').val() && !$('#post_content').val())
				document.location.reload();
		}, reloadDelay * 1000);
}

//Reload the front page
function reloadFront(reloadDelay) {
	if (reloadDelay > 0 && pageUrl == "https://forums.dropbox.com")
		setTimeout(function() {
			document.location.reload();
		}, reloadDelay * 1000);
}

//Add icons to users
function addIcon(addTo) {
	if (pageUrl == 'https://forums.dropbox.com/topic.php') {
		if ( typeof addTo == 'string')
			$('.threadauthor small a:contains("' + addTo + '")').parent().parent().find('strong').prepend(iconIndex[addTo]);
		else if ( typeof addTo == 'number')
			$('.threadauthor small a[href$="=' + addTo + '"]').parent().parent().find('strong').prepend(iconIndex['default']);
	}
}

//Change role name
function changeRole(changeFor, newRole) {
	if (pageUrl == 'https://forums.dropbox.com/topic.php') {
		if ( typeof changeFor == 'string')
			$('.threadauthor small a:contains("' + changeFor + '")').html(newRole);
		else if ( typeof changeFor == 'number')
			$('.threadauthor small a[href$="=' + changeFor + '"]').html(newRole);
	}
}

//Highlight posts
function postHighlight(highlightFor, color) {
	if (pageUrl == 'https://forums.dropbox.com/topic.php') {
		if ( typeof highlightFor == 'string') {
			//Count posts
			var rolePosts = $('.threadauthor p small a:contains("' + highlightFor + '")').length;
			var totalPosts = $('.threadauthor').length;

			//Set highlighting status
			var highlightStatus = ((totalPosts > 5 && rolePosts / totalPosts > 0.2) || (totalPosts == 5 && rolePosts > 2) || (totalPosts < 5 && rolePosts > 1)) ? "disabled" : "enabled";

			//Display message above and below message thread
			var statusMessage = '<li style="text-align: center;">Highlighting ' + highlightStatus + ' for all ' + highlightFor + 's</li>';
			$('#thread').prepend(statusMessage);
			$('#thread').append(statusMessage);

			//Highlight posts if enabled
			if (highlightStatus == 'enabled')
				$('.threadauthor p small a:contains("' + highlightFor + '")').parent().parent().parent().parent().find('.threadpost').css('background', color);
		} else if ( typeof highlightFor == 'number')
			$('.threadauthor small a[href$="=' + highlightFor + '"]').parent().parent().parent().parent().find('.threadpost').css('background', color);
	}
}

//Revert homepage
function forumVersion(versionDate) {
	if (["https://forums.dropbox.com/topic.php", "https://forums.dropbox.com/profile.php", "https://forums.dropbox.com", "https://forums.dropbox.com/search.php", "https://forums.dropbox.com/forum.php"].indexOf(pageUrl) > -1) {
		if (versionDate == "8.8.2012" || versionDate == "beta") {
			//Hide logo
			$('#header').find('a').eq(0).remove();

			//Reformat header
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
				'margin': '5px 5px 0 0',
				'position': 'static'
			});
		}
		if (versionDate == "beta") {
			//Style footer
			$('#footer').css({
				'border-top': '1px solid #bbb',
				'border-left': '1px solid #bbb',
				'border-right': '1px solid #bbb',
				'border-top-left-radius': '25px',
				'border-top-right-radius': '25px'
			});

			//Clone hidden text for later use
			var hiddenFooter = $('span:last').clone();

			//Bring text into the footer div
			$('#footer').append($(hiddenFooter));
			$('span:last').remove();
			$('#footer').wrapInner('<div id="footercontent"></div>');
			$('#footer').prepend('<div id="footertoggle"><div id="footertogglearrow"></div></div>');

			//Add and style toggle animations
			$('#footertoggle').css({
				'height': '25px',
				'width': '25px',
				'margin': '0 auto'
			});
			$('#footertogglearrow').css({
				'height': '0',
				'width': '0',
				'border-left': '5px solid transparent',
				'border-right': '5px solid transparent',
				'border-bottom': '10px solid #bbb',
				'margin': '12px auto 0 auto'
			});
			$('#footercontent').toggle();
			var footerHidden = true;
			$('#footertoggle').click(function() {
				$('#footercontent').slideToggle('slow', function() {
					footerHidden = footerHidden ? false : true;
					var toggleBottom = footerHidden ? '10px solid #bbb' : 'none';
					var toggleTop = footerHidden ? 'none' : '10px solid #bbb';
					$('#footertogglearrow').css({
						'border-top': toggleTop,
						'border-bottom': toggleBottom
					});
				});
			});
		}
	}
	if (pageUrl == "https://forums.dropbox.com") {
		var latestTr = $('#latest').find('tr');
		var forumList = $('#forumlist');
		var forumListTr = $(forumList).find('tr');
		if (versionDate == "original") {
			//Add tag list and reorder elements
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'love', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];

			$('#main').prepend('<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap"></p></div>');
			for (i in tagList) {
				$('#frontpageheatmap').append('<a href="#" style="font-size: ' + ((Math.random() * 17) + 8) + 'px">' + tagList[i] + '</a>');
				if (i < tagList.length)
					$('#frontpageheatmap').append(' ');
			}
			$('#forumlist').attr('id', 'forumlist-temp');
			var topicDesc = [$('#forumlist-temp').find('tr').eq(1).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(1).find('td').html().split('<br>')[1], $('#forumlist-temp').find('tr').eq(2).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(2).find('td').html().split('<br>')[1], $('#forumlist-temp').find('tr').eq(3).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(3).find('td').html().split('<br>')[1], $('#forumlist-temp').find('tr').eq(4).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(4).find('td').html().split('<br>')[1], $('#forumlist-temp').find('tr').eq(5).find('td').html().split('<br>')[0] + $('#forumlist-temp').find('tr').eq(5).find('td').html().split('<br>')[1]];
			var topicPosts = [$('#forumlist-temp').find('tr').eq(1).find('td').html().split('<br>')[2].split(' topics')[0], $('#forumlist-temp').find('tr').eq(2).find('td').html().split('<br>')[2].split(' topics')[0], $('#forumlist-temp').find('tr').eq(3).find('td').html().split('<br>')[2].split(' topics')[0], $('#forumlist-temp').find('tr').eq(4).find('td').html().split('<br>')[2].split(' topics')[0], $('#forumlist-temp').find('tr').eq(5).find('td').html().split('<br>')[2].split(' topics')[0]];

			$('#forumlist-temp').remove();
			$('#discussions').prepend('<h2>Forums</h2><table id="forumlist"></table><h2>Latest Discussions</h2>');
			$('#forumlist').html('<tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr>');
			for (i in topicPosts) {
				$('#forumlist').append('<tr class="bb-precedes-sibling bb-root"><td>' + topicDesc[i] + '</td><td class="num">' + topicPosts[i] + '</td><td class="num">' + topicPosts[i] + '+</td></tr>');
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
			$('#main').css('width', '866ps');
			$('#header').css('width', '866px');
			$('#header').find('a').eq(0).find('img').eq(0).attr('src', 'http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png');
			$(latestTr).not(':first').css('background', '#f7f7f7');
			$('.bb-root').css('background', '#f7f7f7');
			$('.alt').css('background', '#fff');
			$('.super-sticky').css('background', '#deeefc');
			$('#forumlist, #latest').css({
				'background': '#fff',
				'border-top': '1px dotted #ccc'
			});
			$('frontpageheatmap').css('border-top', '1px dotted #ccc');
			$('h2').css({
				'color': '#000',
				'margin-bottom': '0'
			});
		}
		if (versionDate == "8.8.2012" || versionDate == "beta") {
			//Set variables
			var latestHeader = $(latestTr).eq(0).find('th');

			//Style table headers
			$(forumListTr).eq(0).find('th').eq(0).css({
				'background': '#666',
				'color': '#fff'
			});
			$(forumListTr).eq(0).css({
				'height': '25px',
				'padding': 'none'
			});
			$(latestHeader).css({
				'background': '#666',
				'color': '#fff'
			});
			$(latestHeader).eq(0).find('a').eq(0).css('color', '#aaa');
			//latestHeader widths: 545, 46, 90, 69px

			//Style stickies
			$('.super-sticky').css('background', '#f4faff');

			//Add and style headings
			$('#discussions').prepend('<h2 class="forumheading">Latest Discussions</h2>');
			$('#forumlist-container').prepend('<h2 class="forumheading">Forums</h2>');
			$('.forumheading').css({
				'border-bottom': '1px solid #ddd',
				'padding-bottom': '6px'
			});
			$('#forumlist').find('tr').eq(0).find('th').html('Name');
		}
	}
}

//Get URL of current page
function getPageUrl() {
	var url = window.location.href;
	if (url.indexOf("?") > -1)
		url = url.substring(0, url.indexOf('?'));
	if (url[url.length - 1] == "/")
		url = url.substring(0, url.length - 1);
	return url;
}

//Append footer
function addFooter() {
	$('#footer').append('<div style="text-align: right; font-size: 11px; clear:both;">Dropbox Forum Mod Icons Version ' + internalVersion + '</div>');
}