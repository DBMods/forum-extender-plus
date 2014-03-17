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
			require 'db-login.php';
			echo '<p><a href="' . $_POST['returnto'] . '">Back to forums</a></p>';
			$action = $_POST['action'];
			$timeOffsetSeconds = $_POST['timeOffset'] * 60;
			if ($action == 'delete')
				include 'delete-message.php';
			else if ($action == 'addressbook')
				include 'address-book.php';
			else if ($action == 'compose')
				include 'compose-message.php';
			else if ($action == 'send')
				include 'send-message.php';
			else if ($action == 'showsent')
				include 'show-sent.php';
			if ($_POST['for']) {
				echo '<p class="topline"><form action="messages.php" method="post" class="menu"><input type="hidden" name="timeOffset" value="' . htmlspecialchars($_POST['timeOffset']) . '" /><input type="hidden" name="action" value="compose" /><input type="hidden" name="returnto" value="' . htmlspecialchars($_POST['returnto']) . '" /><input type="hidden" name="from" value="' . htmlspecialchars($_POST['for']) . '" /><button type="submit">Compose</button></form><form action="messages.php" method="post" class="menu"><input type="hidden" name="timeOffset" value="' . htmlspecialchars($_POST['timeOffset']) . '" /><input type="hidden" name="action" value="showsent" /><input type="hidden" name="returnto" value="' . htmlspecialchars($_POST['returnto']) . '" /><input type="hidden" name="from" value="' . htmlspecialchars($_POST['for']) . '" /><button type="submit">Show Sent Messages</button></form></p>';
				$result = mysql_query("SELECT * FROM `msglist` WHERE `to` = '" . htmlspecialchars($_POST['for']) . "' ORDER BY `time` DESC");
				while ($row = mysql_fetch_assoc($result)) {
					echo '<p class="topline">';
					echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="action" value="delete" /><input type="hidden" name="timeOffset" value="' . htmlspecialchars($_POST['timeOffset']) . '" /><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input name="time" type="hidden" value="' . htmlspecialchars($row['time']) . '" /><input name="for" type="hidden" value="' . htmlspecialchars($_POST['for']) . '" /><input type="hidden" name="from" value="' . htmlspecialchars($row['from']) . '" /><input type="hidden" name="msg" value="' . htmlspecialchars(stripslashes($row['msg'])) . '" /><button type="submit">Delete</button></form>';
					echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="timeOffset" value="' . htmlspecialchars($_POST['timeOffset']) . '" /><input type="hidden" name="action" value="compose" /><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input name="context" type="hidden" value="' . htmlspecialchars(stripslashes($row['msg'])) . '"/><input name="to" type="hidden" value="' . htmlspecialchars($row['from']) . '" /><input type="hidden" name="from" value="' . htmlspecialchars($_POST['for']) . '" /><button type="submit">Reply</button></form>';
					echo '<br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a><br>Message:<br>' . nl2br(htmlspecialchars(stripslashes($row['msg'])));
					echo '</p>';
				}
			}
			mysql_close($db);
			?>
		</div>
	</body>
</html>