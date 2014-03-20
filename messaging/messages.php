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
	setcookie('returnto', strip_tags($_POST['returnto']), time() + 3600 * 24 * 30);
	$_COOKIE['returnto'] = strip_tags($_POST['returnto']);
}
?>
<html>
	<head>
		<title>Forum Extender+ Messages</title>
		<style>
			body {
				background: #fff;
				margin: 0;
				padding-top: 70px;
				padding-bottom: 30px;
			}
			.jumbotron h2 {
				font-size: 50px;
			}
			.alert {
				width: 500px;
				margin-left: auto;
				margin-right: auto;
			}
			.btn {
				margin-right: 10px;
			}
			.topline {
				border-top: 1px solid #bbb
			}
			#wrapper {
				width: 900px;
				background: #fff;
				margin: auto;
				padding: 30px 50px
			}
			form.menu {
				display: inline-block
			}
		</style>
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">
	</head>
	<body>
		<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="messages.php">Dropbox Forum Extender+ Messenger</a>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="jumbotron">
				<?php
				$userid = htmlspecialchars($_COOKIE['forumid']);
				$timeoffset = htmlspecialchars($_COOKIE['timeoffset']);
				$returnto = $_COOKIE['returnto'];
				require 'db-login.php';
				if ($userid) {
					echo '<h4><a href="' . $returnto . '">Back to forums</a></h4>';
					$action = $_POST['action'];
					$timeOffsetSeconds = $timeoffset * 60;
					if ($action == 'delete')
						include 'delete-message.php';
					elseif ($action == 'addressbook')
						include 'address-book.php';
					elseif ($action == 'compose')
						include 'compose-message.php';
					elseif ($action == 'send')
						include 'send-message.php';
					elseif ($action == 'showsent')
						include 'show-sent.php';
					if ($action != 'addressbook' && $action != 'compose' && $action != 'showsent') {
						echo '<h2>Inbox</h2>';
						echo '<form action="messages.php" method="post" class="menu"><input type="hidden" name="action" value="compose" /><button type="submit" class="btn btn-success">Compose</button></form><form action="messages.php" method="post" class="menu"><input type="hidden" name="action" value="showsent" /><input type="hidden" name="returnto" value="' . strip_tags($_POST['returnto']) . '" /><input type="hidden" name="from" value="' . $userid . '" /><button type="submit" class="btn btn-primary">Show Sent Messages</button></form>';
						$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . mysqli_real_escape_string($db, $userid) . "' ORDER BY `time` DESC");
						while ($row = mysqli_fetch_assoc($result)) {
							echo '<p class="topline">';
							echo '<br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a><br>Message:<br>' . nl2br(htmlspecialchars($row['msg']));
							echo '</p>';
							echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="action" value="delete" /><input name="time" type="hidden" value="' . htmlspecialchars($row['time']) . '" /><input name="for" type="hidden" value="' . $userid . '" /><input type="hidden" name="from" value="' . htmlspecialchars($row['from']) . '" /><input type="hidden" name="msg" value="' . htmlspecialchars($row['msg']) . '" /><button type="submit" class="btn btn-danger btn-sm">Delete</button></form>';
							echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="action" value="compose" /><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><input name="to" type="hidden" value="' . htmlspecialchars($row['from']) . '" /><button type="submit" class="btn btn-success btn-sm">Reply</button></form>';
						}
					}
				} else
					echo '<div class="alert alert-danger"><p>You do not have sufficient permission to access this page. Please authenticate through the <a href="https://forums.dropbox.com">Dropbox Forums</a>.</p></div>';
				mysqli_close($db);
				?>
			</div>
		</div>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
	</body>
</html>
