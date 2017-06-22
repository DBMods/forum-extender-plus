// ==UserScript==
// @name Dropbox Forum Extender+ helpList.js Scraper
// @namespace DropboxMods
// @description Scrapes data for helpList.js
// @include https://www.dropboxforum.com/*
// @version 1.3.2
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
var strippedUrl = fullUrl.split('#')[0].split('?')[0],
	slug = strippedUrl.split('https://www.dropboxforum.com/t5/')[1] || '',
	urlVars = getUrlVars(fullUrl);

function getUrlVars(url) {
	if (typeof url === 'string') {
		var vars = [], hash;
		var hashes = fullUrl.split('#')[0].slice(fullUrl.indexOf('?') + 1).split('&');

		for (i = 0, l = hashes.length; i < l; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}

		return vars;
	} else {
		return url;
	}
}

var firstItem = true;
var missCounter = 0;
var articleNum = urlVars.start || 1;
var validEntries = 0;
var i, l;

$('#gsDropboxExtenderNav').append('<span><a href="' + new Url('scrapeHelpList').value + '">helpList.js Scraper</a></span>');

if (slug === 'scrapeHelpList') {
	var $cont = $('.error-page');

	//Remove junk
	$cont.siblings().remove();
	$cont.find('.error-page__image').remove();
	$cont.find('h2').remove();
	$cont.find('p').remove();

	//Add page title
	$cont.find('h1').html('helpList.js Scraper').css({'border-bottom': '2px solid #007ee5', 'padding': '0 8px 4px'});
	$('head title').html('helpList.js Scraper - Dropbox Forums');
	$('li.lia-breadcrumb-node.crumb.final-crumb span').html('helpList.js Scraper');
	$cont.append('<div><div style="display:flex;font-size:16px;font-weight:300;color:#999;padding-bottom:6px"><div style="flex-grow:1">Checking<div id="check" style="color:#000;font-size:42px;line-height:42px">0</div></div><div style="flex-grow:1">Consecutive misses<div id="miss" style="color:#000;font-size:42px;line-height:42px">0</div></div><div style="flex-grow:1">Valid articles<div id="found" style="color:#000;font-size:42px;line-height:42px">0</div></div><div style="flex-grow:1">Current/avg pages/min<div style="color:#000;font-size:42px;line-height:42px"><span id="curRate">0</span><span style="color:#ddd;font-weight:100"> / </span><span id="avgRate">0</span></div></div></div><textarea id="textList" style="width:100%" rows="15" placeholder="Sit tight, we\'re looking for pages"></textarea><span id="masterList" style="display:none"></span></div>');

	//Left-align paragraphs
	$cont.find('p').css('text-align', 'left');


	var $cRate = $('#curRate'),
		$aRate = $('#avgRate'),
		checkpoints = [];
		startTime = new Date().getTime();

	(function getRates() {
		//Add page count checkpoint
		if (checkpoints.length === 13) {
			checkpoints.shift();
		}
		checkpoints.push(articleNum - 1);

		//Calculate rates
		var curRate = 0;
		if (checkpoints.length > 1) {
			curRate = (checkpoints[checkpoints.length - 1] - checkpoints[0]) / (checkpoints.length - 1) * 12;
		}
		var avgRate = (articleNum - 1) / ((new Date().getTime() - startTime) / 60000);

		//Update rate display
		$cRate.html(Math.floor(curRate * 100) / 100);
		$aRate.html(Math.floor(avgRate * 100) / 100);

		setTimeout(getRates, 5000);
	})();

	while (missCounter <= 5000) {
    getEntry(articleNum);

    articleNum++;
  }
}

/*
 * Methods and prototyping
 */

 function Url() {
 	var args = arguments;
 	var val = args[0];
 	var capParam = args[1] || false;

 	//Sanity check
 	if (typeof val === 'string') {
 		this.value = 'https://www.dropboxforum.com/t5';

 		if (val) {
 			this.value += '/' + val;
			this.value = this.value.split('#')[0].split('?')[0];

			this.active = this.value === strippedUrl;
 		}
 	}
 }

/*
 * Helper functions
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
        if (title != 'Help center – Dropbox') {
          missCounter = 0;
          var string = firstItem ? '' : ',';
          var articleTitle = title.split(' – Dropbox')[0].trim();
          string = string + '\n&#9;\'' + num + '\': \'' + articleTitle.replace('\'', '\\\'').replace('’', '\\\'') + '\'';
          $('#masterList').append(string);
          $('#textList').val('var helpList = {' + $('#masterList').html() + '\n};');
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
