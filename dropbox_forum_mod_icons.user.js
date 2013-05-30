// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace IdeativeSoftware.Dropbox
// @description Gives Dropbox Forum Super Users icons
// @version 2013.8
// @include https://forums.dropbox.com/*
// @grant none
// ==/UserScript==

//Set internal version
var internalVersion = 2013.8;

//Set all required variables
var elems = document.getElementsByTagName("*"), i;

//Add footer
addFooter();

//Run necessary checks and changes
addIcon("role", "Super User", getIcon("mod"));
postHighlight("Super User", "#fff19d");
changeRoleName("1618104", "Master of Super Users");

//Modify the homepage to look like the original revamp
//Comment out this line if you want to keep the original
revertHome();

//Add icons to users
function addIcon(checkFor, checkForSubClass, icon) {
	//Process call and pass in appropriate variables
	if(checkFor == "role") {
		var referenceIndex = "</a></small>";
	} else if(checkFor == "id") {
		var referenceIndex = checkForSubClass;
		var checkForSubclass = '<small><a href="https://forums.dropbox.com/profile.php?id=';
	}
	processedIconRequest(checkForSubClass, referenceIndex, icon);

	//Execute the processed request
	function processedIconRequest(indexA, indexB, selectedIcon) {
		for(i in elems) {
			if((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1 && elems[i].innerHTML.indexOf(indexA) > -1) {
				elems[i].innerHTML = "<p><strong>" + selectedIcon + elems[i].innerHTML.substring(26, elems[i].innerHTML.length);
			}
		}
	}

}

//Change role name
function changeRoleName(checkFor, newRole) {
	for(i in elems) {
		if((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1 && elems[i].innerHTML.indexOf(checkFor) > -1) {
			var authorPar = elems[i].getElementsByTagName("p");
			var authorSmall = authorPar[0].getElementsByTagName("small");
			var authorProfile = authorSmall[0].getElementsByTagName("a");
			authorProfile[0].innerHTML = newRole;
		}
	}
}

//Highlight posts
function postHighlight(highlightRole, highlightColor) {
	//Reset count variables
	var rolePostCount = 0;
	var totalPostCount = 0;

	//Count total posts and posts by certain users
	for(i in elems) {
		if((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1) {
			totalPostCount = totalPostCount + 1;
			if(elems[i].innerHTML.indexOf(highlightRole) > -1) {
				rolePostCount = rolePostCount + 1;
			}
		}
	}

	//Default status
	var highlightStatus = "enabled";

	//Turn of highlighting under correct conditions
	if(totalPostCount > 5 && rolePostCount / totalPostCount > 0.2) {
		highlightStatus = "disabled";
	} else if(totalPostCount == 5 && rolePostCount > 2) {
		highlightStatus = "disabled";
	} else if(totalPostCount < 5 && rolePostCount > 1) {
		highlightStatus = "disabled";
	}

	var navFound = false;

	//Display message above top nav element
	for(i in elems) {
		if((" " + elems[i].className + " ").indexOf(" nav ") > -1 && navFound === false) {
			elems[i].innerHTML = "<div>Highlighting " + highlightStatus + " for all " + highlightRole + "s</div><br>" + elems[i].innerHTML;
			navFound = true;
		}
	}

	//Highlight posts if enabled
	for(i in elems) {
		if((" " + elems[i].className + " ").indexOf(" threadauthor ") > -1 && highlightStatus == "enabled" && elems[i].innerHTML.indexOf(highlightRole) > -1) {
			var authorPostContainer = elems[i].parentNode;
			var authorPostDiv = authorPostContainer.getElementsByTagName("div");
			authorPostDiv[1].style.cssText = "background: " + highlightColor + ";";
		}
	}
}

//Process icon requests
function getIcon(role) {
	if(role == "mod") {
		return "<img src='http://www.techgeek01.com/just-for-fun/nyancatright.gif' height='16px' width='40px'>&nbsp;";
	} else if(role == "pro") {
		return "<img align='top' src='https://forums.dropbox.com/bb-templates/dropbox/images/star.gif'>&nbsp;";
	} else if(role == "emp") {
		return "<img align='absmiddle' src='https://forums.dropbox.com/bb-templates/dropbox/images/dropbox-icon.gif'>&nbsp;";
	} else {
		return null;
	}
}

//Revert homepage to original revamp
function revertHome() {
	//Set variables
	var header = document.getElementById("header");
	var forumList = document.getElementById("forumlist");
	var latest = document.getElementById("latest");
	var grayBar = "background: #666666; color: #ffffff!important;";
	var forumListTr = forumList.getElementsByTagName("tr");
	var forumListHeader = forumListTr[0].getElementsByTagName("th");
	var latestTr = latest.getElementsByTagName("tr");
	var latestHeader = latestTr[0].getElementsByTagName("th");
	var newThreadLink = latestHeader[0].getElementsByTagName("a");

	//Hide logo
	header.innerHTML = header.innerHTML.substring(header.innerHTML.indexOf('<p class="login">'), header.innerHTML.length);
	//var headerLogo = header.getElementsByTagName("a");
	//headerLogo[0].setAttribute("style", "display: none;");

	//Reformat header
	header.setAttribute("style", "width: 990px; height: 174px; padding: 0; background: url(http://www.techgeek01.com/just-for-fun/forumsheader.jpg);");
	for(i in elems) {
		if((" " + elems[i].className + " ").indexOf(" login ") > -1) {
			elems[i].setAttribute("style", "float: left; clear: none; margin-top: 5px; position: static; font-size: 12px; font-weight: normal;");
		}
		if((" " + elems[i].className + " ").indexOf(" search ") > -1) {
			elems[i].setAttribute("style", "float: right; clear: none; margin: 5px 5px 0 0; position: static;");
		}
	}

	//Recolor table headers
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
	var latestTd = latestTr[1].getElementsByTagName("td");
	latestTd[0].width = "545px";
	latestTd[1].width = "46px";
	latestTd[2].width = "90px";
	latestTd[3].width = "69px";

	//Recolor stickies
	for(i in elems) {
		if((" " + elems[i].className + " ").indexOf(" super-sticky ") > -1) {
			elems[i].setAttribute("style", "background: #f4faff");
		}
	}

	//Add and style headings
	document.getElementById("discussions").innerHTML = "<h2 class='forumheading'>Latest Discussions</h2>" + document.getElementById("discussions").innerHTML;
	document.getElementById("forumlist-container").innerHTML = "<h2 class='forumheading'>Forums</h2>" + document.getElementById("forumlist-container").innerHTML;
	var discussionHeadings = document.getElementById("discussions").getElementsByTagName("h2");
	var forumListHeadings = document.getElementById("forumlist-container").getElementsByTagName("h2");
	discussionHeadings[0].setAttribute("style", "border-bottom: 1px solid #dddddd; padding-bottom: 6px;");
	forumListHeadings[0].setAttribute("style", "border-bottom: 1px solid #dddddd; padding-bottom: 6px;");

	//Final touches
	forumListHeader[0].innerHTML = "Name";
}

//Append footer
function addFooter() {
	document.getElementById("footer").innerHTML = document.getElementById("footer").innerHTML + "<div style='text-align: right; color: rgb(102, 102, 102); font-size: 11px; clear:both;'>Dropbox Forum Mod Icons Version " + internalVersion + "</div>";
}