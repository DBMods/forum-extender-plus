// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace IdeativeSoftware.Dropbox
// @description Gives Dropbox Forum Super Users icons
// @include https://forums.dropbox.com/*
// @require none
// @grant none
// ==/UserScript==

var internalVersion = 2013.1;

//Run necessary functions and checks
checkPage("threadauthor");

//Check page for posts by Super Users
function checkPage(matchClass){
  var elems = document.getElementById("*"),i;
  for (i in elems){
    if ((" " + elems[i].className + " ").indexOf(" " + matchClass + " ") > -1){
      elems[i].innerHTML = "Test Text";
    }
  }
};
