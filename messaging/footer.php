<?php
//Not logged in or bad auth
if (!$userAuthenticated && $pageName != 'report.php' && $pageName != 'fix-auth.php') {
	if ($userLogoff)
		echo "<div class='alert-center'><div id='alert-fade' class='alert alert-success'><p><strong>Successfully logged out</strong></p></div></div>";
	require_once "sign-in.php";
}
mysqli_close($db);
?>

</div>
<div id='nav'>
	<a class='button wide blue' href='compose.php'>Compose</a><br>
	<?php
	getMessages();
	echo linkActivity('<a href="index.php">Inbox' . $countBadge . '</a>') . '<br>';
	echo linkActivity('<a href="sent.php">Sent</a>') . '<br>';
	echo linkActivity('<a href="archive.php">Archive' . $archBadge . '</a>') . '<br>';
	echo linkActivity('<a href="settings.php">Settings</a>') . '<br>';
	echo linkActivity('<a href="stats.php">Stats</a>');
	if ($username == 'TechGeek01' || $username == 'nathanc') {
		echo '<br>';
		echo linkActivity('<a href="admin.php">Admin</a>');
	}
	?>
</div>
<div class='clearfix'></div>
</div>
<footer>
Proudly developed by <a href="http://techgeek01.com" target='_blank'>Andy Y.</a> and <a href="http://nathancheek.com" target='_blank'>Nathan C.</a>
<!--<form action="compose.php" method="post" class="form-link">
	<input type="hidden" name="msgto" value="TechGeek01" />
	<input type="hidden" name="subject" value="Bug report: " />
	<button type="submit" class="btn-link">Problem?</button>
</form>-->
</footer>
</div>

<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'></script>
<script>
	var pageUrl = '<?php echo $pageName; ?>';
	var archAct;

	var selectedList = [];

	if (pageUrl == 'index.php' || pageUrl == 'archive.php') {
		archAct = pageUrl == 'index.php' ? 'arch' : 'unarch';

		//initialize buttons
		$('#viewBtn, #repBtn, #fwdBtn').addClass('grayed');

		//Select message when clicking on message
		$('table tr td:not(:first-child)').on('click', function() {
			var id = $(this).parent().attr('data-id');

			//Highlight selection
			$('table tr.highlighted .check input').prop('checked', false);
			$('table tr.highlighted').removeClass('highlighted');
			$(this).parent().addClass('highlighted');
			$(this).parent().find('.check input').prop('checked', 'checked');

			selectedList = [id];

			//Add ID to forms for manipulation
			$('#viewForm input[name="msgid"], #replyForm input[name="msgid"], #archForm input[name="msgid"], #delForm input[name="msgid"]').val(selectedList);

			//Enable buttons
			$('#viewBtn, #repBtn, #fwdBtn').removeClass('grayed');
			$('#messageActionButtons').show();
		});

		//Add message to selection when clicked on checkbox
		$('table tr .check input').on('click', function() {
			var id = $(this).parent().parent().attr('data-id');

			//Highlight message appropriately, and change selection list
			if ($(this).prop('checked')) {
				$(this).parent().parent().addClass('highlighted');
				selectedList.push(id);
			} else {
				$(this).parent().parent().removeClass('highlighted');
				selectedList.splice(selectedList.indexOf(id), 1);
			}

			//Add ID to forms for manipulation
			$('#viewForm input[name="msgid"], #replyForm input[name="msgid"], #archForm input[name="msgid"], #delForm input[name="msgid"]').val(selectedList);

			//Manage meta bar buttons
			if (selectedList.length == 0) {
				$('#messageActionButtons').hide();
			} else if (selectedList.length == 1) {
				$('#viewBtn, #repBtn, #fwdBtn').removeClass('grayed');
				$('#messageActionButtons').show();
			} else if (selectedList.length > 1) {
				$('#viewBtn, #repBtn, #fwdBtn').addClass('grayed');
				$('#messageActionButtons').show();
			}
		});

	} else if (pageUrl == 'view.php') {
		archAct = '<?php echo $buttonMetaArch; ?>';
		$('#archBtn').html(archAct[0].toUpperCase() + archAct.substr(1, archAct.length) + 'ive');

		//Add ID to forms for manipulation
		$('#replyForm input[name="msgid"], #forwardForm input[name="msgid"], #archForm input[name="msgid"], #delForm input[name="msgid"]').val('<?php echo $buttonMetaId ?>');

		//Change meta forms to throw back to the inbox to avoid displaying errors to the user after message is moved or deleted
		$('#delForm, #archForm').attr('action', 'index.php');

		//Enable buttons
		$('#viewBtn').remove();
		$('#messageActionButtons').show();
	}

	//Main function buttons
	$('#cancelBtn').on('click', function() {
		$('#cancelForm').submit();
	});
	$('#sendBtn').on('click', function() {
		$('#messageform').submit();
	});
</script>

<script src='js/bootstrap.js'></script>
<script>
	window.setTimeout(function() {
		$('#alert-fade').addClass('fade');
	}, 3000);
	$('.open-alertDelete').click(function(sendID) {
		sendID.preventDefault();
		var _self = $(this);
		$('#msgid').val(_self.data('id'));
		$(_self.attr('href')).modal('show');
	});
</script>
</body>
</html>
