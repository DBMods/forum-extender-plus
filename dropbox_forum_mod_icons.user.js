// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace IdeativeSoftware.Dropbox
// @description Gives Dropbox Forum Super Users icons
// @version 1.0.1
// @include https://forums.dropbox.com/*
// @grant none
// ==/UserScript==

//Set internal version
var internalVersion = 2013.7;

//Set all required variables
var elems = document.getElementsByTagName("*"), i;

//Add footer
addFooter();

//Run necessary checks and changes
addIcon("role", "Super User", getIcon("mod"));
postHighlight("Super User", "#fff19d");
changeRoleName("1618104", "Master of Super Users");

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
return "<img src='https://dl.dropboxusercontent.com/u/9979966/forums/nyancatright.gif' height='16px' width='40px'>&nbsp;";
} else if(role == "pro") {
return "<img align='top' src='https://forums.dropbox.com/bb-templates/dropbox/images/star.gif'>&nbsp;";
} else if(role == "emp") {
return "<img align='absmiddle' src='https://forums.dropbox.com/bb-templates/dropbox/images/dropbox-icon.gif'>&nbsp;";
} else {
return null;
}
}

//Append footer
function addFooter() {
document.getElementById("footer").innerHTML = document.getElementById("footer").innerHTML + "<div style='text-align: right; color: rgb(102, 102, 102); font-size: 11px; clear:both;'>Dropbox Forum Mod Icons Version " + internalVersion + "</div>";
}