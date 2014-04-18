var client = new Dropbox.Client({
	key: 'qq5ygjct1pt4eud'
});

$('#gsDropboxExtender-nav').append('<span id="dropboxlink">Link to Dropbox</span>');

var prefTable;

$(function() {
	//Delete table
	function deleteTable(table) {
		var records = table.query();
		for (var i = 0; i < records.length; i++) {
			records[i].deleteRecord();
		}
	}

	//Start authentication process
	$('#dropboxlink').click(function(e) {
		e.preventDefault();
		client.authenticate();
	});
	//Try to finish OAuth authorization
	client.authenticate({
		interactive: false
	}, function(error) {
		if (error) {
			console.log('Auth error. Retrying');
			document.location.reload();
		}
	});
	if (client.isAuthenticated()) {
		$('#dropboxlink').hide();

		client.getDatastoreManager().openDefaultDatastore(function(error, datastore) {
			if (error) {
				console.log('Error opening default datastore. Rerying');
				document.location.reload();
			}

			//Get tables
			var prefTable = datastore.getTable('prefs'), draftTable = datastore.getTable('draft'), configTable = datastore.getTable('config');

			var theme = prefTable.query({
				preference: 'theme'
			}), collapseFooter = prefTable.query({
				preference: 'collapseFooter'
			});
			if (theme.length > 0)
				forumVersion(theme[0].get('value'));

			var userToken = configTable.query({
				name: 'userToken'
			});
			if (userToken.length > 0) {
				userToken = userToken[0].get('value');
				msgFormAction = '';
			} else {
				userToken = '';
				msgFormAction = '<input type="hidden" name="action" value="register-return" />';
			}

			//Check messages
			$('#gsDropboxExtender-nav').append('<span id="gsDropboxExtenderMessageContainer"><form style="display:none" action="http://www.techgeek01.com/dropboxextplus/messages.php" method="post"><input type="hidden" name="userToken" value="' + userToken + '" />' + msgFormAction + '<input type="hidden" name="returnto" value="' + fullUrl + '" /><input type="hidden" name="userid" value="' + $('#header .login a[href^="https://forums.dropbox.com/profile.php"]').attr('href').split('id=')[1] + '" /><input type="hidden" name="timeOffset" value="' + new Date().getTimezoneOffset() + '" /></form><a href="javascript:void(0)" id="gsDropboxExtenderMessageLink">Messages</a><span id="gsDropboxExtenderMsgCounter" /></span>');
			(function checkMessages() {
				GM_xmlhttpRequest({
					method: 'GET',
					url: ('http://www.techgeek01.com/dropboxextplus/count-messages.php?to=' + userId),
					onload: function(response) {
						var resp = response.responseText;
						$('#gsDropboxExtenderMsgCounter').html(resp == '0' ? '' : (' (' + resp + ')'));
					}
				});
				setTimeout(checkMessages, 20000);
			})();
			$('#gsDropboxExtenderMessageLink').click(function() {
				$('#gsDropboxExtenderMessageContainer form').submit();
			});

			//Collapse footer
			if (pageUrl != 'edit.php' && collapseFooter.length > 0 && collapseFooter[0].get('value')) {
				//Style footer
				$('#footer').css({
					'border': '1px solid #bbb',
					'border-bottom': 'none',
					'border-radius': '25px 25px 0 0'
				}).append($('span:contains("Protected by Arash")')).wrapInner('<div id="footercontent" />').prepend('<div id="footertoggle"><div id="footerarrowup" /><div id="footerarrowdown" style="display:none" /></div>');
				$('#footerarrowup, #footerarrowdown').css({
					'height': '0',
					'width': '0',
					'border-left': '5px solid transparent',
					'border-right': '5px solid transparent',
					'margin': '12px auto 0'
				});
				$('#footerarrowup').css('border-bottom', '10px solid #bbb');
				$('#footerarrowdown').css('border-top', '10px solid #bbb');
				$('#footercontent').toggle();
				$('#footertoggle').css('height', '25px').click(function() {
					$('#footercontent').slideToggle('slow', function() {
						$('#footerarrowup, #footerarrowdown').toggle();
					});
				});
			}

			if (pageUrl == 'topic.php') {
				var modIcon = prefTable.query({
					preference: 'modIcon'
				});
				if (modIcon.length > 0)
					$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').find('img').attr('src', modIcon[0].get('value'));
			}

			reloadPage('Front');
			reloadPage('Forum');
			reloadPage('Sticky');

			function reloadPage(pageType) {
				var reloadIndex = {
					'Sticky': pageUrl == 'topic.php' && $('#topic_labels:contains("[sticky]")').length > 0,
					'Front': pageUrl == 'forums.dropbox.com',
					'Forum': pageUrl == 'forum.php'
				};
				var reloadDelay = prefTable.query({
					preference: 'reload' + pageType
				});
				if (fullUrl != 'https://forums.dropbox.com/?new=1' && reloadIndex[pageType] && reloadDelay.length > 0 && reloadDelay[0].get('value') > 0) {
					setTimeout(function() {
						if (!modalOpen && (pageUrl == 'topic.php') ? !$('#post_content').val() : true)
							document.location.reload();
						else
							reloadPage(pageType);
					}, reloadDelay[0].get('value') * 1000);
				}
			}


			$('#deleteprefs').click(function() {
				deleteTable(prefTable);
				hoverMessage('Preferences trashed');
			});
			$('#deletedrafts').click(function() {
				deleteTable(draftTable);
				hoverMessage('Drafts trashed');
			});

			//Manage preferences
			var optionDropdown = ['theme', 'reloadSticky', 'reloadForum', 'reloadFront', 'modIcon'];
			var optionCheck = ['collapseFooter'];
			$('#gsDropboxExtenderOption-trigger').click(function() {
				modalOpen = true;
				var optionHeight = $('#gsDropboxExtenderOption-popup').height(), optionWidth = $('#gsDropboxExtenderOption-popup').width(), pref;

				$('#gsDropboxExtenderOption-popup').css({
					'top': (document.documentElement.clientHeight - optionHeight) / 2,
					'left': (document.documentElement.clientWidth - optionWidth) / 2
				});

				//Load current settings
				for (var i = 0; i < optionDropdown.length; i++) {
					pref = prefTable.query({preference: optionDropdown[i]})[0];
					if (pref)
						$('#gsDropboxExtenderOption-popup [name="' + optionDropdown[i] + '"] option[value="' + pref.get('value') + '"]').attr('selected', 'selected');
				}
				$('#gsDropboxExtendericonpreview').attr('src', $('#gsDropboxExtendericon').val());
				for (var i = 0; i < optionCheck.length; i++) {
					pref = prefTable.query({preference: optionCheck[i]})[0];
					if (pref)
						$('#gsDropboxExtenderOption-popup [name="' + optionCheck[i] + '"]').attr('checked', true);
				}

				$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderOption-popup').show();
			});
			$('#gsDropboxExtendericon').change(function() {
				$('#gsDropboxExtendericonpreview').attr('src', $('#gsDropboxExtendericon').val());
			});
			$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderOption-close, #gsDropboxExtenderOption-save').click(function() {
				$('#gsDropboxExtender-screen-overlay, #gsDropboxExtenderOption-popup, #gsDropboxExtender-listbox-popup').hide();
				modalOpen = false;
			});
			$('#gsDropboxExtenderOption-save').click(function() {
				var pref;
				for (var i = 0; i < optionDropdown.length; i++) {
					pref = prefTable.query({
						preference: optionDropdown[i]
					});
					if (pref.length > 0)
						pref[0].set('value', $('#gsDropboxExtenderOption-popup [name="' + optionDropdown[i] + '"]').val());
					else
						prefTable.insert({
							preference: optionDropdown[i],
							value: $('#gsDropboxExtenderOption-popup [name="' + optionDropdown[i] + '"]').val()
						});
				}
				for (var i = 0; i < optionCheck.length; i++) {
					pref = prefTable.query({
						preference: optionCheck[i]
					});
					if (pref.length > 0)
						pref[0].set('value', $('#gsDropboxExtenderOption-popup [name="' + optionCheck[i] + '"]').val() == 'y');
					else
						prefTable.insert({
							preference: optionCheck[i],
							value: $('#gsDropboxExtenderOption-popup [name="' + optionCheck[i] + '"]').val() == 'y'
						});
				}
				if (pageUrl == 'topic.php')
					$('.threadauthor small a:contains("Super User")').parent().parent().find('strong').find('img').attr('src', $('#gsDropboxExtendericon').val());
				hoverMessage('Your settings have been saved.\n\nMost new settings won\'t take effect until the page is reloaded.');
			});

			//Manage drafts
			if (pageUrl == 'topic.php') {
				var thread = fullUrl.split('id=')[1].split('&')[0].split('#')[0];
				$('#gsDropboxExtender-nav').append('<span id="modpostdraft">Draft Post</span><span id="modpostrestoredraft">Restore Draft</span>');
				$('#modpostdraft').click(function() {
					var draft = draftTable.query({
						pageid: thread
					});
					if ($('#post_content').val()) {
						if (draft.length > 0)
							draft[0].set('draft', $('#post_content').val());
						else
							draftTable.insert({
								pageid: thread,
								draft: $('#post_content').val()
							});
						$('#post_content').focus();
						hoverMessage('Draft saved');
					} else
						hoverMessage('Your draft has no content', 'info');
				});
				$('#modpostrestoredraft').click(function() {
					var draft = draftTable.query({pageid: thread})[0];
					if (draft) {
						$('#post_content').val(draft.get('draft'));
						$('#post_content').focus();
						draft.deleteRecord();
						hoverMessage('Draft successfully restored');
					} else
						hoverMessage('You don\'t have a draft for this thread', 'info');
				});
			}
		});
	}
}); 