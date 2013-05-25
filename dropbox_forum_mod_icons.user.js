// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace IdeativeSoftware.Dropbox
// @description Gives Dropbox Forum Super Users icons
// @include https://forums.dropbox.com/*
// @grant none
// ==/UserScript==

var internalVersion = 2013.5;

//Add footer
addFooter();

//Run necessary checks and changes
checkPage("threadauthor");

//Check page for posts by Super Users
function checkPage(matchClass){
  var elems = document.getElementsByTagName('*'),i;
  for (i in elems){
    if ((" " + elems[i].className + " ").indexOf(" " + matchClass + " ") > -1 && elems[i].innerHTML.indexOf("</a></small>") - 10 == elems[i].innerHTML.indexOf("Super User")){
      elems[i].innerHTML = "<p><strong><img src='http://www.techgeek01.com/just-for-fun/nyancatright.gif' height='16px' width='40px' >&nbsp;" + elems[i].innerHTML.substring(26,elems[i].innerHTML.length);
    }
  }
}

//Append footer
function addFooter(){
  document.getElementById("footer").innerHTML = document.getElementById("footer").innerHTML + "<div style='text-align: right; color: rgb(102, 102, 102); font-size: 11px; clear:both;'>Dropbox Forum Mod Icons Version " + internalVersion + "</div>";
}