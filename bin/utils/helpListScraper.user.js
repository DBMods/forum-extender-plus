// ==UserScript==
// @name Dropbox Forum Extender+ helpList.js Scraper
// @namespace DropboxMods
// @description Scrapes data for helpList.js
// @include https://www.dropboxforum.com/hc/scrapeHelpList/*
// @include https://www.dropboxforum.com/hc/scrapeHelpList
// @version 1.1.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/bin/utils/helpListScraper.user.js
// @updateURL https://github.com/DBMods/forum-extender-plus/raw/master/bin/utils/helpListScraper.user.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

/*
 * This script isn't required as part of the main script
 * However, this script is used to generate an updated copy of the Help Center
 * article list, as stored in helpList.js
 */

var fullUrl = window.location.href;
var urlVars = getUrlVars();

var firstItem = true;
var missCounter = 0;
var articleNum = urlVars.start || 1;
var i, l;

window.onload = function() {
  $('title').html('helpList.js Scraper');
  $('body').html('Checking: <span id="check">*starting*</span><br>Consecutive misses: <span id="miss">0</span><br>Valid articles: <span id="found">0</span><br><br>var helpList = {<span id="list"></span><br>};');

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
          string = '<span class="validEntry">' + string + '<br>\'' + num + '\': \'' + articleTitle.replace('\'', '\\\'').replace('’', '\\\'') + '\'</span>';
          $('#list').append(string);
          firstItem = false;
        } else {
          missCounter++;
        }
        $('#miss').html(missCounter);
        $('#found').html($('.validEntry').length);
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
