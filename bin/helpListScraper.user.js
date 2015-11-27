// ==UserScript==
// @name Dropbox Forum Extender+ helpList.js Scraper
// @namespace DropboxMods
// @description Scrapes data for helpList.js
// @include https://www.dropboxforum.com/hc/scrapeHelpList/*
// @include https://www.dropboxforum.com/hc/scrapeHelpList
// @version 1.0.3
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://github.com/DBMods/forum-extender-plus/raw/master/bin/helpListScraper.user.js
// @updateUrl https://github.com/DBMods/forum-extender-plus/raw/master/bin/helpListScraper.user.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

/*
 * This script isn't required as part of the main script
 * However, this script is used to generate an updated copy of the Help Center
 * article list, as stored in helpList.js
 */

var firstItem = true;
var missCounter = 0;
var articleNum = 1;
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
          string = '<span class="validEntry">' + string + '<br>\'' + num + '\': \'' + title.split(' (Dropbox Help Center)')[0].trim() + '\'</span>';
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
