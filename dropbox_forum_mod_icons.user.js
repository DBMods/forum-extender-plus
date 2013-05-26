// ==UserScript==
// @name Dropbox Forum Mod Icons
// @namespace IdeativeSoftware.Dropbox
// @description Gives Dropbox Forum Super Users icons
// @include https://forums.dropbox.com/*
// @grant none
// ==/UserScript==

//Set internal version
var internalVersion = 2013.6;

//Set all required variables
var elems = document.getElementsByTagName("*"), i;

//Add footer
addFooter();

//Run necessary checks and changes
changePage("author", "role", "Super User", "<img src='http://www.techgeek01.com/just-for-fun/nyancatright.gif' height='16px' width='40px' >&nbsp;");

//Manipulate page
function changePage(checkPart, checkFor, checkForSubClass, metaData){
  //Process and direct page check
  if (checkPart == "author"){
    if (checkFor == "role"){
      var authorIndex = "</a></small>";
    } else if (checkFor == "id"){
      var authorIndex = checkForSubClass;
      var checkForSubclass = '<small><a href="https://forums.dropbox.com/profile.php?id=';
    }
    checkAuthor("threadauthor", checkForSubClass, authorIndex, metaData);
  }

  //Check author information
  function checkAuthor(matchClass, indexA, indexB, contentAddition){
    for (i in elems){
      if ((" " + elems[i].className + " ").indexOf(" " + matchClass + " ") > -1 && elems[i].innerHTML.indexOf(indexB) - indexA.length == elems[i].innerHTML.indexOf(indexA)){
        elems[i].innerHTML = "<p><strong>" + contentAddition + elems[i].innerHTML.substring(26, elems[i].innerHTML.length);
        var authorPar = elems[i].getElementsByTagName("p");
        var authorStrong = authorPar[0].getElementsByTagName("strong");
        var authorName = authorStrong[0].innerHTML;
        if (authorName.indexOf("<a href") > -1){
          authorName = authorStrong[0].getElementsByTagName("a");
          authorName = authorName[0].innerHTML;
        }
        var authorSmall = authorPar[0].getElementsByTagName("small");
        var authorProfile = authorSmall[0].getElementsByTagName("a");
        var authorRole = authorProfile[0].innerHTML;
        if (authorRole == "Super User" && authorName == "Andy Y."){
          authorProfile[0].innerHTML = "Supreme ruler and guardian of all that he sees and everything he touches turns to gold if he so pleases! Master of Chuck Norris and awesomist of awesome. Also king. All hail the king!";
        }
      }
    }
  }
}

//Append footer
function addFooter(){
  document.getElementById("footer").innerHTML = document.getElementById("footer").innerHTML + "<div style='text-align: right; color: rgb(102, 102, 102); font-size: 11px; clear:both;'>Dropbox Forum Mod Icons Version " + internalVersion + "</div>";
}
