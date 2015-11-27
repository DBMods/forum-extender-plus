// ==UserScript==
// @name Dropbox Forum Extender+ helpList.js Scraper
// @namespace DropboxMods
// @description Scrapes data for helpList.js
// @include https://www.dropboxforum.com/hc/scrapeHelpList/*
// @include https://www.dropboxforum.com/hc/scrapeHelpList
// @version 1.0.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

/*
 * This script isn't required as part of the main script
 * However, this script is used to generate an updated copy of the Help Center
 * article list, as stored in helpList.js
 */

window.onload = function() {
  $('body').html('Checking <span id="check">*starting*</span><br><br>var helpList = {<span id="list"></span><br>};');

  var i, l;

  for (i = 0, l = 12000; i < l; i++) {
    getEntry(i + 1);
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
      $('#check').html(num);
      var resp = response.responseText;
      if (resp) {
        var title = resp.split('</title>')[0].split('<title>')[1];
        if (title != 'Dropbox - 404') {
          $('#list').append('<br>\'' + num + '\': \'' + title.split(' (Dropbox Help Center)')[0] + '\',');
        }
      }
      //$('#check').html('*idle*');
    }
  });
}
