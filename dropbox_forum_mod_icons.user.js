// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace DropboxMods
// @description Gives Dropbox Forum Super Users icons, and adds a bit more style and functionality to the forums
// @include https://forums.dropbox.com/*
// @exclude https://forums.dropbox.com/bb-admin/*
// @version 2013.9.2
// @downloadURL https://github.com/DBMods/forum-mod-icons/raw/master/dropbox_forum_mod_icons.user.js
// @updateURL https://github.com/DBMods/forum-mod-icons/raw/master/dropbox_forum_mod_icons.user.js
// @grant none
// ==/UserScript==

//Set internal version
var internalVersion = "2013.9.2";

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

/*
 * Reskin the forums
 * Comment out this line if you want to keep the current layout
 *
 * "8.8.2012" ................ The original of the 3 revamps
 * "original" ................ The original layout
 *     This version currently causes automatic reload to fail, so you'll have to refresh manually
 */
forumVersion("8.8.2012");

/*
 * Reload pages
 *
 * reloadPage(reloadDelay)
 * reloadDelay .......... The number of seconds between refreshes (0 to disable)
 */
reloadFront(120);
reloadStickies(120);

/*
* Run indev stuff
* Everything here is currently in development, so uncomment this line at your own risk
*/
//inDev();

/*
* Everything below this line is crucial to the operation of this script
* Do not modify anything below this line unless you know what you're doing
*/

//Handle indev stuff
function inDev() {
	/*
	 * This function contains all of the things currently either in development or being debugged
	 * Everything's designed to catch errors, so no rendering issues should arise
	 * Feel free to modify these functions
	 */
	addSlideOut();

	//Add slideout panel
	function addSlideOut() {
		try {
			//Add panel
			document.getElementsByTagName("body")[0].innerHTML = "<div id='hidden-info-container' style='display:none;'></div><div id='moderator-slideout-panel'><div id='slideout-panel-content'><h1 id='slideout-panel-header'>Recent Moderator (+ Ryan) Activity</h1><p id='slideout-panel-info'></p></div></div>" + document.getElementsByTagName("body")[0].innerHTML;

			//Grab and parse information
			var nameList = ["Andy Y.", "Chen S.", "Chris J.", "KC", "Nathan C.", "N.N.", "Mark Mc", "R.M.", "René S.", "Ryan M.", "Sebastian H.", "T. Hightower", "Trevor B."];
			var userList = ["1618104", "11096", "175532", "561902", "857279", "67305", "30385", "643099", "182504", "1510497", "32911", "222573", "1588860"];
			var activityList = ["Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information", "Unable to retrieve information"];
			for (i in activityList) {
				document.getElementById("hidden-info-container").innerHTML = "<iframe src='https://forums.dropbox.com/profile.php?id=" + userList[i] + "' id='user-profile-page'></iframe>";
				var userProfileIframe = document.getElementById("user-profile-page");
				var iframeContent = userProfileIframe.contentDocument || userProfileIframe.contentWindow;
				var userActivityList = iframeContent.document.getElementById("user-replies");
				//.getElementsByTagName("ol")[0].getElementsByTagName("li")[0].innerHTML;
				var userRecentActivity = userActivityList.substring(userActivityList.indexOf(" last replied: ") + 15, userActivityList.indexOf(" ago</a> |") + 10);
				activityList[i] = userRecentActivity.substring(userRecentActivity.indexOf('">') + 2, userRecentActivity.indexOf(" ago</a> |") + 10);
			}

			//Add information
			for (i in nameList) {
				document.getElementById("slideout-panel-info").innerHTML = document.getElementById("slideout-panel-info").innerHTML + "<li><strong>" + nameList[i] + "</strong> - " + activityList[i] + "</li>";
			}
			document.getElementById("slideout-panel-info").innerHTML = "<ul>" + document.getElementById("slideout-panel-info").innerHTML + "</ul>";

			//Style panel
			var panelStyling = "background: #ffffff; position: fixed; bottom: 0; left: 0; border-top: 8px solid #bbeeff; border-right: 8px solid #bbeeff; border-top-right-radius: 35px; z-index: 10";
			document.getElementById("moderator-slideout-panel").setAttribute("style", "height: 75px; width: 75px;" + panelStyling);
			document.getElementById("slideout-panel-content").setAttribute("style", "display: none;");

			//Set up hover animation
			document.getElementById("moderator-slideout-panel").onmouseover = function() {
				document.getElementById("moderator-slideout-panel").setAttribute("style", "height: 500px; width: 800px;" + panelStyling);
				document.getElementById("slideout-panel-content").setAttribute("style", "width: 600px; margin: 50px auto; text-align: center;");
			};
			document.getElementById("moderator-slideout-panel").onmouseout = function() {
				document.getElementById("moderator-slideout-panel").setAttribute("style", "height: 75px; width: 75px;" + panelStyling);
				document.getElementById("slideout-panel-content").setAttribute("style", "display: none;");
			};
		} catch(e) {
			alert(e);
		}
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
		var rolePostCount = 0, totalPostCount = 0;

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
		document.getElementById("thread").innerHTML = "<li style='text-align: center;'>Highlighting " + highlightStatus + " for all " + highlightRole + "s</li>" + document.getElementById("thread").innerHTML + "<li style='text-align: center;'>Highlighting " + highlightStatus + " for all " + highlightRole + "s</li>";

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

	if (["https://forums.dropbox.com/topic.php", "https://forums.dropbox.com/profile.php", "https://forums.dropbox.com"].indexOf(pageUrl) > -1) {
		if (versionDate == "8.8.2012") {
			//Hide logo
			header.innerHTML = header.innerHTML.substring(header.innerHTML.indexOf('<p class="login">'), header.innerHTML.length);

			//Reformat header
			header.setAttribute("style", "width: 990px; height: 174px; padding: 0; background: url(https://dropboxwiki-dropboxwiki.netdna-ssl.com/static/forumsheader.jpg);");
			for (i in elems) {
				if ((" " + elems[i].className + " ").indexOf(" login ") > -1)
					elems[i].setAttribute("style", "float: left; clear: none; margin-top: 5px; position: static; font-size: 12px; font-weight: normal;");
				if ((" " + elems[i].className + " ").indexOf(" search ") > -1)
					elems[i].setAttribute("style", "float: right; clear: none; margin: 5px 5px 0 0; position: static;");
			}
		}
	}
	if (pageUrl == "https://forums.dropbox.com") {
		var latestTr = document.getElementById("latest").getElementsByTagName("tr");
		var forumList = document.getElementById("forumlist");
		var forumListTr = forumList.getElementsByTagName("tr");
		if (versionDate == "original") {
			//Original theme

			//Add tag list and reorder elements
			var tagList = '<div id="hottags"><h2>Hot Tags</h2><p id="frontpageheatmap" class="frontpageheatmap"><a href="#" style="font-size: 8.72300469484pt;">all</a> <a href="#" style="font-size: 8.74491392801pt;">of</a> <a href="#" style="font-size: 18.2535211268pt;">the</a> <a href="#" style="font-size: 12.2942097027pt;">Dropbox</a> <a href="#" style="font-size: 14.234741784pt;">moderators</a> <a href="#" style="font-size: 13.2801251956pt;">are</a> <a href="#" style="font-size: 9.77464788732pt;">awesome</a> <a href="#" style="font-size: 14.1126760563pt;">R.M.</a> <a href="#" style="font-size: 8.8544600939pt;">is</a> <a href="#" style="font-size: 10.3004694836pt;">king</a> <a href="#" style="font-size: 15.0109546166pt;">Andy</a> <a href="#" style="font-size: 9.55555555556pt;">is</a> <a href="#" style="font-size: 8.48200312989pt;">the</a> <a href="#" style="font-size: 10.4538341158pt;">man</a> <a href="#" style="font-size: 8.08763693271pt;">thightower</a> <a href="#" style="font-size: 9.11737089202pt;">is</a> <a href="#" style="font-size: 10.4976525822pt;">awesome</a> <a href="#" style="font-size: 9.1392801252pt;">yay</a> <a href="#" style="font-size: 16.5007824726pt;">I</a> <a href="#" style="font-size: 18.1001564945pt;">added</a> <a href="#" style="font-size: 8.89827856025pt;">a</a> <a href="#" style="font-size: 8.72300469484pt;">tag</a> <a href="#" style="font-size: 8.37245696401pt;">too!</a> <a href="#" style="font-size: 8.41627543036pt;">love</a> <a href="#" style="font-size: 8.9420970266pt;">sponge</a> <a href="#" style="font-size: 8.35054773083pt;">dropbox</a> <a href="#" style="font-size: 10.3881064163pt;">is</a> <a href="#" style="font-size: 8.10954616588pt;">the</a> <a href="#" style="font-size: 10.7605633803pt;">best</a> <a href="#" style="font-size: 10.9577464789pt;">Nathan</a> <a href="#" style="font-size: 8.92018779343pt;">Chris</a> <a href="#" style="font-size: 8.35054773083pt;">Tommy</a> <a href="#" style="font-size: 12.8638497653pt;">Chen</a> <a href="#" style="font-size: 8pt;">Mark</a> <a href="#" style="font-size: 8.39436619718pt;">and</a> <a href="#" style="font-size: 8.2848200313pt;">Ren&#233;</a> <a href="#" style="font-size: 8.48200312989pt;">are</a> <a href="#" style="font-size: 22pt;">awesome</a> <a href="#" style="font-size: 9.62128325509pt;">as</a> <a href="#" style="font-size: 11.8779342723pt;">well</a> <a href="#" style="font-size: 8.87636932707pt;">Ryan\'s</a> <a href="#" style="font-size: 13.3020344288pt;">the</a> <a href="#" style="font-size: 8.63536776213pt;">most</a> <a href="#" style="font-size: 8.39436619718pt;">awesome</a> <a href="#" style="font-size: 11.5492957746pt;">Dropboxer</a></p></div>';
			document.getElementById("main").innerHTML = tagList + document.getElementById("main").innerHTML;
			var forumListContent = forumList.innerHTML;
			document.getElementById("forumlist").parentNode.removeChild(document.getElementById("forumlist"));
			document.getElementById("discussions").innerHTML = '<h2>Forums</h2><table id="forumlist"><tr><th align="left">Category</th><th>Topics</th><th>Posts</th></tr><tr class="bb-precedes-sibling bb-root"><td><a href="forum.php?id=2">Bugs &amp; Troubleshooting</a><small> &#8211; Tell us what\'s wrong</small></td><td class="num"></td><td class="num"></td></tr><tr class="bb-precedes-sibling bb-follows-sibling bb-root alt"><td><a href="forum.php?id=4">Mobile Apps</a><small> &#8211; Questions and suggestions for our mobile apps</small></td><td class="num"></td><td class="num"></td></tr><tr class="bb-precedes-sibling bb-follows-sibling bb-root"><td><a href="forum.php?id=3">Feature Requests</a><small> &#8211; What should be improved?</small></td><td class="num"></td><td class="num"></td></tr><tr class="bb-precedes-sibling bb-follows-sibling bb-root alt"><td><a href="forum.php?id=5">API Development</a><small> &#8211; Questions relating to our API</small></td><td class="num"></td><td class="num"></td></tr><tr class="bb-last-child bb-follows-sibling bb-root"><td><a href="forum.php?id=1">Everything Else</a><small> &#8211; For stuff that doesn\'t fit elsewhere</small></td><td class="num"></td><td class="num"></td></tr></table><h2>Latest Discussions</h2>' + document.getElementById("discussions").innerHTML;

			//Style elements
			document.getElementById("discussions").setAttribute("style", "width: 680px; margin-right: 170px; margin-left: 0;");
			document.getElementById("hottags").setAttribute("style", "position: absolute; right: 0px; left: auto;");
			document.getElementById("main").setAttribute("style", "width: 866px;");
			header.setAttribute("style", "width: 866px;");
			header.getElementsByTagName("a")[0].getElementsByTagName("img")[0].setAttribute("src", "http://web.archive.org/web/20100305012731im_/http://wiki.dropbox.com/wiki/dropbox/img/new_logo.png");
			elems = document.getElementsByTagName('*'), i;
			for (i in latestTr) {
				if (i > 0)
					latestTr[i].setAttribute("style", "background: #f7f7f7");
			}
			for (i in elems) {
				if ((" " + elems[i].className + " ").indexOf(" bb-root ") > -1)
					elems[i].setAttribute("style", "background: #f7f7f7;");
				if ((" " + elems[i].className + " ").indexOf(" alt ") > -1)
					elems[i].setAttribute("style", "background: #ffffff;");
				if ((" " + elems[i].className + " ").indexOf(" super-sticky ") > -1)
					elems[i].setAttribute("style", "background: #deeefc;");
			}
			document.getElementById("latest").setAttribute("style", "background: #ffffff; border-top: 1px dotted #cccccc;");
			forumList.setAttribute("style", "background: #ffffff; border-top: 1px dotted #cccccc;");
			document.getElementById("frontpageheatmap").setAttribute("style", "border-top: 1px dotted #cccccc;");
			var pageHeadings = document.getElementsByTagName("h2");
			for (i in pageHeadings) {
				pageHeadings[i].setAttribute("style", "color: #000000; margin-bottom: 0;");
			}
		}
		if (versionDate == "8.8.2012") {
			//8-8-2012 original image revamp

			//Set variables
			var grayBar = "background: #666666; color: #ffffff!important;";
			var forumListHeader = forumListTr[0].getElementsByTagName("th");
			var latestTd = latestTr[1].getElementsByTagName("td");
			var latestHeader = latestTr[0].getElementsByTagName("th");
			var newThreadLink = latestHeader[0].getElementsByTagName("a");

			//Style table headers
			forumListHeader[0].setAttribute("style", grayBar);
			forumListTr[0].setAttribute("style", "height: 25px; padding: none;");
			forumListTr[1].setAttribute("style", "font-weight: bold;");
			forumListTr[2].setAttribute("style", "font-weight: bold;");
			forumListTr[3].setAttribute("style", "font-weight: bold;");
			forumListTr[4].setAttribute("style", "font-weight: bold;");
			forumListTr[5].setAttribute("style", "font-weight: bold;");
			latestHeader[0].setAttribute("style", grayBar);
			latestHeader[1].setAttribute("style", grayBar);
			latestHeader[2].setAttribute("style", grayBar);
			latestHeader[3].setAttribute("style", grayBar);
			newThreadLink[0].setAttribute("style", "color:#aaaaaa;");
			//latestHeader widths: 545, 46, 90, 69px

			//Style stickies
			for (i in elems) {
				if ((" " + elems[i].className + " ").indexOf(" super-sticky ") > -1)
					elems[i].setAttribute("style", "background: #f4faff;");
			}

			//Add and style headings
			var forumHeadingStyle = "border-bottom: 1px solid #dddddd; padding-bottom: 6px;";
			with (document) {
				getElementById("discussions").innerHTML = "<h2 class='forumheading'>Latest Discussions</h2>" + getElementById("discussions").innerHTML;
				getElementById("forumlist-container").innerHTML = "<h2 class='forumheading'>Forums</h2>" + getElementById("forumlist-container").innerHTML;
				getElementById("discussions").getElementsByTagName("h2")[0].setAttribute("style", forumHeadingStyle);
				getElementById("forumlist-container").getElementsByTagName("h2")[0].setAttribute("style", forumHeadingStyle);
			}

			//Final touches
			forumListHeader[0].innerHTML = "Name";
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
	var footer = document.getElementById("footer");
	footer.innerHTML = footer.innerHTML + "<div style='text-align: right; color: rgb(102, 102, 102); font-size: 11px; clear:both;'>Dropbox Forum Mod Icons Version " + internalVersion + "</div>";
}