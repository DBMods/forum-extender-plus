<?php
if (is_numeric($_POST['for']))
	setcookie('forumid', htmlspecialchars($_POST['for']), time() + 3600 * 24 * 30);
	$_COOKIE['forumid']=$_POST['for'];
if (is_numeric($_POST['timeOffset']))
	setcookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 ^ 24 * 30);
	$_COOKIE['timeoffset']=$_POST['timeOffset'];
?>
<html>
	<head>
		<title>Forum Extender+ Messages</title>
		<style>
			body {
				background: #ddd;
				margin: 0;
				padding: 0
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
	</head>
	<body>
		<div id='wrapper'>
			<?php
			$userid = htmlspecialchars($_COOKIE['forumid']);
			$timeoffset = htmlspecialchars($_COOKIE['timeoffset']);
			require 'db-login.php';
			if ($userid) {
				echo '<p><a href="' . $_POST['returnto'] . '">Back to forums</a></p>';
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
					echo '<p class="topline"><form action="messages.php" method="post" class="menu"><input type="hidden" name="action" value="compose" /><input type="hidden" name="returnto" value="' . htmlspecialchars($_POST['returnto']) . '" /><button type="submit">Compose</button></form><form action="messages.php" method="post" class="menu"><input type="hidden" name="action" value="showsent" /><input type="hidden" name="returnto" value="' . strip_tags($_POST['returnto']) . '" /><input type="hidden" name="from" value="' . $userid . '" /><button type="submit">Show Sent Messages</button></form></p>';
					$result = mysql_query("SELECT * FROM `msglist` WHERE `to` = '" . mysql_real_escape_string($userid) . "' ORDER BY `time` DESC");
					while ($row = mysql_fetch_assoc($result)) {
						echo '<p class="topline">';
						echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="action" value="delete" /><input type="hidden" name="returnto" value="' . strip_tags($_POST['returnto']) . '" /><input name="time" type="hidden" value="' . htmlspecialchars($row['time']) . '" /><input name="for" type="hidden" value="' . $userid . '" /><input type="hidden" name="from" value="' . htmlspecialchars($row['from']) . '" /><input type="hidden" name="msg" value="' . htmlspecialchars($row['msg']) . '" /><button type="submit">Delete</button></form>';
						echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="action" value="compose" /><input type="hidden" name="returnto" value="' . strip_tags($_POST['returnto']) . '" /><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><input name="to" type="hidden" value="' . htmlspecialchars($row['from']) . '" /><button type="submit">Reply</button></form>';
						echo '<br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a><br>Message:<br>' . (htmlspecialchars($row['msg'])); //n12br
						echo '</p>';
					}
				}
			} else
				echo '<p>You do not have sufficient permission to access this page. Please authenticate through the <a href="https://forums.dropbox.com">Dropbox Forums</a>.</p>';
			mysql_close($db);
			?>
		</div>
	</body>
</html>
