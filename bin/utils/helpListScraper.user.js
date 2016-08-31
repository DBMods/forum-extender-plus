// ==UserScript==
// @name Dropbox Forum Extender+ helpList.js Scraper
// @namespace DropboxMods
// @description Scrapes data for helpList.js
// @include https://www.dropboxforum.com/*
// @exclude https://www.dropboxforum.com/hc/admin/*
// @exclude https://www.dropboxforum.com/hc/user_avatars/*
// @version 1.2.0
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/bin/utils/helpListScraper.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/bin/utils/helpListScraper.user.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

/*
 * This script isn't required as part of the main script
 * However, this script is used to generate an updated copy of the Help Center
 * article list, as stored in helpList.js
 *
 * In order to run this script, you only have to install it, but for full integration
 * into the main script, it works best if you make sure it's executed after the
 * main script
 */

var fullUrl = window.location.href;
var pageUrl = fullUrl.split('https://www.dropboxforum.com/hc/')[1] || '';
var urlVars = getUrlVars();

var firstItem = true;
var missCounter = 0;
var articleNum = urlVars.start || 1;
var validEntries = 0;
var i, l;

$('#gsDropboxExtenderNav').append('<span><a href="https://www.dropboxforum.com/hc/scrapeHelpList">helpList.js Scraper</a></span>');

if (pageUrl == 'scrapeHelpList') {
  $('title').html('helpList.js Scraper');
  $('.error-page').html('<h1>helpList.js Scraper</h1>');
  $('.error-page').append('<p><span style="font-size:16px;color:#999">Checking: <span id="check" style="color:#000">*starting*</span><br>Consecutive misses: <span id="miss" style="color:#000">0</span>&emsp;&emsp;Valid articles: <span id="found" style="color:#000">0</span></span></p><textarea id="textList" style="width:100%" rows="15" placeholder="Sit tight, we\'re looking for pages"></textarea><span id="list" style="display:none"></span>');

  while (missCounter <= 5000) {
    getEntry(articleNum);

    articleNum++;
  }
}

/*
 * Functions
 */

function getEntry(num) {
  $('#check').html(num);
  GM_xmlhttpRequest({
    method: 'GET',
    synchronous: true,
    url: 'https://www.dropbox.com/help/' + num,
    onload: function(response) {
      var resp = response.responseText;
      if (resp) {
        var title = resp.split('</title>')[0].split('<title>')[1];
        if (title != 'Dropbox - 404') {
          missCounter = 0;
          var string = firstItem ? '' : ',';
          var articleTitle = title.split(' - Dropbox Help - Dropbox')[0].trim();
          string = string + '&#10;&#9;\'' + num + '\': \'' + articleTitle.replace('\'', '\\\'').replace('’', '\\\'') + '\'';
          $('#list').append(string);
          $('#textList').html('var helpList = {' + $('#list').html() + '&#10;}');
          firstItem = false;
          validEntries++;
        } else {
          missCounter++;
        }
        $('#miss').html(missCounter);
        $('#found').html(validEntries);
      }
      //$('#check').html('*idle*');
    }
  });
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
