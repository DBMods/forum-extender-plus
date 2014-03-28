<?php
if (is_numeric($_POST['for'])) {
	setcookie('forumid', htmlspecialchars($_POST['for']), time() + 3600 * 24 * 30);
	$_COOKIE['forumid'] = $_POST['for'];
}
if (is_numeric($_POST['timeOffset'])) {
	setcookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 * 24 * 30);
	$_COOKIE['timeoffset'] = $_POST['timeOffset'];
}
if ($_POST['returnto']) {
	setcookie('returnto', strip_tags($_POST['returnto']));
	$_COOKIE['returnto'] = strip_tags($_POST['returnto']);
}
$showinbox = true;
$userid = htmlspecialchars($_COOKIE['forumid']);
$timeoffset = htmlspecialchars($_COOKIE['timeoffset']);
$returnto = 'https://forums.dropbox.com';
if (isset($_COOKIE['returnto']))
	$returnto = $_COOKIE['returnto'];
require 'db-login.php';
?>
<html>
	<head>
		<title>Forum Extender+ Messages</title>
		<link rel='stylesheet' href='style.css' />
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" />
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css" />
	</head>
	<body>
		<div id="wrapper" class="container">
			<div class="jumbotron" id="main">
				<?php
				function sqlesc($string) {
					global $db;
					return mysqli_real_escape_string($db, $string);
				}
				function navform() {
					echo '<form action="" method="post" class="menu"><button type="submit" class="btn btn-success" name="action" value="compose">Compose</button></form>';
				}
				if ($userid) {
					$action = $_POST['action'];
					$timeOffsetSeconds = $timeoffset * 60;
					if ($action == 'addressbook')
						include 'address-book.php';
					elseif ($action == 'compose' || $action == 'send')
						include 'compose-message.php';
					elseif ($action == 'showsent')
						include 'show-sent.php';
					elseif ($action == 'showarch')
						include 'show-archived.php';
					elseif ($action == 'delete' || $action == 'arch' || $action == 'unarch')
						include 'manipulate-entry.php';
					elseif ($action == 'stats')
						include 'stats.php';
					//Run query here so Inbox badge will show number of messages no matter what page its on
					$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 0 ORDER BY `time` DESC");
					$count = mysqli_num_rows($result);
					if ($count > 0) {
						$countBadge = $count;
					} else {
						$countBadge = "";
					}
					if ($showinbox) {
						echo '<h2>Inbox - ' . $count . '</h2>';
						navform();
						while ($row = mysqli_fetch_assoc($result)) {
							echo '<p class="topline"><br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a><br>Message:<br>' . nl2br(htmlspecialchars($row['msg'])) . '</p>';
							echo '<a data-id="' . htmlspecialchars($row['id']) . '" class="open-alertDelete btn btn-danger btn-sm" href="#alertDelete">Delete</a>';
							echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/><input name="msgto" type="hidden" value="' . htmlspecialchars($row['from']) . '"/><button type="submit" class="btn btn-success btn-sm" name="action" value="compose">Reply</button></form>';
							echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '" /><button type="submit" class="btn btn-primary btn-sm" name="action" value="arch">Archive</button></form>';
						}
							echo '<div class="modal fade in" id="alertDelete">';
							echo '<div class="modal-dialog">';
							echo '<div class="modal-content">';
							echo '<div class="modal-header">';
							echo '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>';
							echo '<h3 class="modal-title">Are you sure?</h3>';
							echo '</div>';
							echo '<div class="modal-body">';
							echo '<h4>If you delete this message, it is gone forever!</h4>';
							echo '</div>';
							echo '<div class="modal-footer">';
							echo '<button class="btn btn-default" data-dismiss="modal">Cancel</button>';
							echo '<form method="post" action="messages.php" class="menu"><input name="msgid" type="hidden" id="msgid" value="" /><button type="submit" class="btn btn-danger" name="action" value="delete">Delete</button></form>';
							echo '</div>';
							echo '</div>';
							echo '</div>';
							echo '</div>';
						if ($count == 0)
							echo '
						<p class="topline center">
							<br>
							It doesn\'t appear that you have any messages. Check back later, or start a conversation by clicking "Compose."
						</p>';
					}
				} else
					echo '
						<div class="alert alert-danger">
							<p>
								You do not have sufficient permission to access this page. Please authenticate through the <a href="https://forums.dropbox.com">Dropbox Forums</a>.
							</p>
						</div>';
				mysqli_close($db);
				?>
			</div>
		</div>
		<div class="container">
			<footer>
				<hr>
				<p>
					Developed by <a href="http://techgeek01.com" target='_blank'>Andy Y.</a> and <a href="http://nathancheek.com" target='_blank'>Nathan C.</a>
				</p>
			</footer>
		</div>
		<div class="container navbar-fixed-top">
			<div class="header">
				<ul class="nav nav-pills pull-left">
					<li class="<?php if ($_POST['action']=='') echo 'active'?>"><a href=''><span class='badge pull-right'><?php echo $countBadge ?></span>Inbox</a></li>
					<li class="<?php if ($_POST['action']!='showsent') echo 'in'; echo 'active'?>"><form action='' method='post' class='form-pill'><button type='submit' class='btn-pill' name='action' value='showsent'>Sent</button></form></li>
					<li class="<?php if ($_POST['action']!='showarch') echo 'in'; echo 'active'?>"><form action='' method='post' class='form-pill'><button type='submit' class='btn-pill' name='action' value='showarch'>Archive</button></form></li>
					<li class="<?php if ($_POST['action']!='stats') echo 'in'; echo 'active'?>"><form action='' method='post' class='form-pill'><button type='submit' class='btn-pill' name='action' value='stats'>Stats</button></form></li>
					<li><a href='<?php echo $returnto ?>'>Back to Forums</a></li>
				</ul>
				<div class="site-title">
					<h3 class="text-muted"><a href=''>Dropbox Forum Extender+ Messenger</a></h3>
				</div>
			</div>
		</div>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		<script>
			window.setTimeout(function() {
				$('#alert-fade').addClass('fade');
			}, 3000);
		</script>
		<script>
			$(document).on("click", ".open-alertDelete", function (sendID) {
			sendID.preventDefault();
			var _self = $(this);
			var msgID = _self.data('id');
			$("#msgid").val(msgID);
			$(_self.attr('href')).modal('show');
			});
		</script>
	</body>
</html>
