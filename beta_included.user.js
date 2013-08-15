// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 1.1.0
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/dropbox_forum_mod_icons.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/dropbox_forum_mod_icons.user.js
// @grant none
// ==/UserScript==

//Set internal version
var internalVersion = "1.1.0";

//Set global variables
var elems = document.getElementsByTagName("*"), i;
var pageUrl = getPageUrl();

/*
* Everything above this line is crucial to the operation of this program
* Do not modify anything above this line unless you know what you're doing
*/

//Add footer
addFooter();

//Modify Super User posts
addIcon("role", "Super User", getIcon("mod"));
postHighlight("Super User", "#fff19d");
changeRoleName("1618104", "Master of Super Users");

//Highlight posts by forum regulars green
idHighlight("6845", "#b5ff90");
idHighlight("3581696", "#b5ff90");
idHighlight("816535", "#b5ff90");
idHighlight("2122867", "#b5ff90");
idHighlight("434127", "#b5ff90");

/*
 * Reskin the forums
 * Comment out this line if you want to keep the current layout
 *
 * "8.8.2012" ................ The original of the 3 revamps
 * "original" ................ The original layout
 *     This version currently causes automatic reload to fail, so you'll have to refresh manually
 */
forumVersion("original");

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

//Add slideout panel
function addSlideOut() {
	try {
		var nameList = ["Andy Y.", "Chen S.", "Chris J.", "KC", "Nathan C.", "N.N.", "Mark Mc", "R.M.", "René S.", "Ryan M.", "Sebastian H.", "T. Hightower", "Trevor B."];
		var userList = ["1618104", "11096", "175532", "561902", "857279", "67305", "30385", "643099", "182504", "1510497", "32911", "222573", "1588860"];
		var activityList = ["Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information"];
	} catch(e) {
		alert(e);
	}
}

//Reload stickies
function reloadStickies(reloadDelay) {
	if (reloadDelay > 0 && pageUrl == "https://forums.dropbox.com/topic.php" && document.getElementById("topic_labels").innerHTML.indexOf("[sticky]") > -1)
		setTimeout(function() {
			if (!document.getElementById("topic").value && !document.getElementById("post_content").value)
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
function addIcon(checkFor, checkForSubClass, icon) {
	if (pageUrl == "https://forums.dropbox.com/topic.php") {
		//Process call and pass in appropriate variables
		if (checkFor == "role")
			processedIconRequest(checkForSubClass, "</a></small>", icon);
		else if (checkFor == "id")
			processedIconRequest('<small><a href="https://forums.dropbox.com/profile.php?id=', checkForSubClass, icon);
	}

	//Execute the processed request
	function processedIconRequest(indexA, indexB, selectedIcon) {
		for (i in elems) {
			if ((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1 && elems[i].innerHTML.indexOf(indexA) > -1)
				elems[i].innerHTML = "<p><strong>" + selectedIcon + elems[i].innerHTML.substring(26, elems[i].innerHTML.length);
		}
	}

}

//Change role name
function changeRoleName(checkFor, newRole) {
	if (pageUrl == "https://forums.dropbox.com/topic.php") {
		for (i in elems) {
			if ((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1 && elems[i].innerHTML.indexOf(checkFor) > -1)
				elems[i].getElementsByTagName("p")[0].getElementsByTagName("small")[0].getElementsByTagName("a")[0].innerHTML = newRole;
		}
	}
}

//Highlight posts
function postHighlight(highlightRole, highlightColor) {
	if (pageUrl == "https://forums.dropbox.com/topic.php") {
		//Reset count variables
		var rolePostCount = totalPostCount = 0;

		//Count total posts and posts by certain users
		for (i in elems) {
			if ((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1) {
				totalPostCount++;
				if (elems[i].innerHTML.indexOf(highlightRole) > -1)
					rolePostCount++;
			}
		}

		//Set highlighting status
		var highlightStatus = ((totalPostCount > 5 && rolePostCount / totalPostCount > 0.2) || (totalPostCount == 5 && rolePostCount > 2) || (totalPostCount < 5 && rolePostCount > 1)) ? "disabled" : "enabled";

		//Display message above and below message thread
		var statusMessage = '<li style="text-align: center;">Highlighting ' + highlightStatus + ' for all ' + highlightRole + 's</li>';
		$('#thread').prepend(statusMessage);
		$('#thread').append(statusMessage);

		//Highlight posts if enabled
		for (i in elems) {
			if ((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1 && highlightStatus == "enabled" && elems[i].innerHTML.indexOf(highlightRole) > -1)
				elems[i].parentNode.getElementsByTagName("div")[1].style.cssText = "background: " + highlightColor + ";";
		}
	}
}

//Highlight posts by a certain user
function idHighlight(highlightId, highlightColor) {
	if (pageUrl == "https://forums.dropbox.com/topic.php") {
		//Highlight posts if enabled
		for (i in elems) {
			if ((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1) {
				var authorLinks = elems[i].getElementsByTagName("p")[0].getElementsByTagName("a");
				var authorProfileLink = authorLinks[authorLinks.length - 1].href;
				if (highlightId == authorProfileLink.substring(42, authorProfileLink.length))
					elems[i].parentNode.getElementsByTagName("div")[1].style.cssText = "background: " + highlightColor + ";";
			}
		}
	}
}

//Revert homepage
function forumVersion(versionDate) {
	var header = document.getElementById("header");

	if (["https://forums.dropbox.com/topic.php", "https://forums.dropbox.com/profile.php", "https://forums.dropbox.com", "https://forums.dropbox.com/search.php", "https://forums.dropbox.com/forum.php"].indexOf(pageUrl) > -1) {
		if (versionDate == "8.8.2012" || versionDate == "dropbox") {
			//Hide logo
			header.innerHTML = header.innerHTML.substring(header.innerHTML.indexOf('<p class="login">'), header.innerHTML.length);

			//Reformat header
			$('#header').css({
				'width' : '990px',
				'height' : '174px',
				'padding' : '0',
				'background' : 'url(https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forumsheader.jpg)'
			});
			$('.login').css({
				'float' : 'left',
				'clear' : 'none',
				'margin-top' : '5px',
				'position' : 'static',
				'font-size' : '12px',
				'font-weight' : 'normal'
			});
			$('.search').css({
				'float' : 'right',
				'clear' : 'none',
				'margin' : '5px 5px 0 0',
				'position' : 'static'
			});
		}
		if (versionDate == "dropbox") {
			$('#footer').css({
				'border-top' : '1px solid #bbb',
				'border-left' : '1px solid #bbb',
				'border-right' : '1px solid #bbb',
				'border-top-left-radius' : '25px',
				'border-top-right-radius' : '25px'
			});
			var hiddenFooter = $('span:last').clone();
			$('#footer').append($(hiddenFooter));
			$('span:last').remove();
			$('#footer').wrapInner('<div id="footercontent"></div>');
			$('#footer').prepend('<div id="footertoggle"><div id="footertogglearrow"></div></div>');
			$('#footertoggle').css({
				'height' : '25px',
				'width' : '25px',
				'margin-left' : 'auto',
				'margin-right' : 'auto'
			});
			$('#footertogglearrow').css({
				'height' : '0',
				'width' : '0',
				'border-left' : '5px solid transparent',
				'border-right' : '5px solid transparent',
				'border-bottom' : '10px solid #bbb',
				'margin' : '12px auto 0 auto'
			});
			$('#footercontent').toggle();
			var footerHidden = true;
			$('#footertoggle').click(function() {
				$('#footercontent').slideToggle('slow', function() {
					footerHidden = footerHidden ? false : true;
					var toggleBottom = footerHidden ? '10px solid #bbb' : 'none';
					var toggleTop = footerHidden ? 'none' : '10px solid #bbb';
					$('#footertogglearrow').css({
						'border-top' : toggleTop,
						'border-bottom' : toggleBottom
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
			//Original theme

			//Add tag list and reorder elements
			var tagList = ['R.M. is king', 'Andy is the man', 'thightower is awesome', 'yay I added a tag too!', 'love', 'sponge', 'one million TB free space', 'love', 'U U D D L R L R B A START', 'Parker is cool too', 'Marcus your also cool', 'Dropbox is the best'];
			
			//Tag index for future addition of dynamic tag selection
			var tagIndex = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
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
				'width' : '680px',
				'margin-right' : '170px',
				'margin-left' : '0'
			});
			$('#hottags').css({
				'position' : 'absolute',
				'right' : '0',
				'left' : 'auto'
			});
			$('#main').css('width', '866ps');
			$('#header').css('width', '866px');
			$('#header').find('a').eq(0).find('img').eq(0).attr('src', 'http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png');
			$(latestTr).not(':first').css('background', '#f7f7f7');
			$('.bb-root').css('background', '#f7f7f7');
			$('.alt').css('background', '#fff');
			$('.super-sticky').css('background', '#deeefc');
			$('#latest').css({
				'background' : '#fff',
				'border-top' : '1px dotted #ccc'
			});
			$('#forumList').css({
				'background' : '#fff',
				'border-top' : '1px dotted #ccc'
			});
			$('frontpageheatmap').css('border-top', '1px dotted #ccc');
			$('h2').css({
				'color' : '#000',
				'margin-bottom' : '0'
			});
		}
		if (versionDate == "8.8.2012" || versionDate == "dropbox") {
			//8-8-2012 original image revamp

			//Set variables
			var latestHeader = $(latestTr).eq(0).find('th');

			//Style table headers
			$(forumListTr).eq(0).find('th').eq(0).css({
				'background' : '#666',
				'color' : '#fff'
			});
			$(forumListTr).eq(0).css({
				'height' : '25px',
				'padding' : 'none'
			});
			$(latestHeader).css({
				'background' : '#666',
				'color' : '#fff'
			});
			$(latestHeader).eq(0).find('a').eq(0).css('color', '#aaa');
			//latestHeader widths: 545, 46, 90, 69px

			//Style stickies
			$('.super-sticky').css('background', '#f4faff');

			//Add and style headings
			$('#discussions').prepend('<h2 class="forumheading">Latest Discussions</h2>');
			$('#forumlist-container').prepend('<h2 class="forumheading">Forums</h2>');
			$('.forumheading').css({
				'border-bottom' : '1px solid #ddd',
				'padding-bottom' : '6px'
			});
			$('#forumlist').find('tr').eq(0).find('th').eq(0).html('Name');
		}
	}
}

//Process icon requests
function getIcon(role) {
	if (role == "mod")
		return "<img src='https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/nyancatright.gif' height='16px' width='40px'>&nbsp;";
	else if (role == "pro")
		return "<img align='top' src='https://forums.dropbox.com/bb-templates/dropbox/images/star.gif'>&nbsp;";
	else if (role == "emp")
		return "<img align='absmiddle' src='https://forums.dropbox.com/bb-templates/dropbox/images/dropbox-icon.gif'>&nbsp;";
}

function importInformation(link, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", link, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4)
			callback(xhr.responseText);
	};
	xhr.send(null);
}

//Get URL of current page
function getPageUrl() {
	var currentPage = window.location.href;
	if (currentPage.indexOf("?") > -1)
		currentPage = currentPage.substring(0, currentPage.indexOf("?"));
	if (currentPage[currentPage.length - 1] == "/")
		currentPage = currentPage.substring(0, currentPage.length - 1);
	return currentPage;
}

//Append footer
function addFooter() {
	$('#footer').append('<div style="text-align: right; color: rgb(102, 102, 102); font-size: 11px; clear:both;">Dropbox Forum Mod Icons Version ' + internalVersion + '</div>');
}