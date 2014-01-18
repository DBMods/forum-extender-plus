<html>
	<head>
		<title>Forum Extender+ Messages</title>
		<style>
			body {
				background: #ddd;
				margin: 0;
				padding: 0;
			}
			.topline {
				border-top: 1px solid #bbb;
			}
			#wrapper {
				width: 900px;
				background: #fff;
				margin: auto;
				padding: 30px 50px;
			}
		</style>
	</head>
	<body>
		<div id='wrapper'>
			<?php
			require 'db-login.php';
			$action = $_POST['action'];
			if ($action == 'delete')
				include 'delete-message.php';
			else if ($action == 'compose')
				include 'compose-message.php';
			else if ($action == 'send')
				include 'send-message.php';
			$timeOffsetSeconds = $_POST['timeOffset'] * 60;
			if (substr($_POST['timeOffset'], -2) == ".5")
				$timeOffsetSpecial = ":30";
			else if (substr($_POST['timeOffset'], -2) == 75)
				$timeOffsetSpecial = ":45";
			else
				$timeOffsetSpecial = ":00";
			if ($_POST['timeOffset'] > 0)
				$timeOffsetHours = "+ " . $_POST['timeOffset'];
			else if ($_POST['timeOffset'] < 0)
				$timeOffsetHours = "- " . $_POST['timeOffset'] * -1;
			else if ($_POST['timeOffset'] == 0)
				$timeOffsetHours = "&plusmn; 0";
			echo '<p><a href="' . $_POST['returnto'] . '">Back to forums</a></p>';
			if ($_POST['for']) {
				$result = mysql_query("SELECT * FROM `msglist` WHERE `to` = '" . $_POST['for'] . "' ORDER BY `time` DESC");
				while ($row = mysql_fetch_assoc($result)) {
					echo '<p class="topline"><form method="post" action="messages.php"><input type="hidden" name="action" value="delete" /><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input name="time" type="hidden" value="' . $row['time'] . '" /><input name="for" type="hidden" value="' . $_POST['for'] . '" /><input type="hidden" name="from" value="' . $row['from'] . '" /><input type="hidden" name="msg" value="' . stripslashes($row['msg']) . '" /><button type="submit">Delete</button></form>';
					echo '<form method="post" action="messages.php"><input type="hidden" name="action" value="compose" /><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input name="context" type="hidden" value="' . stripslashes($row['msg']) . '"/><input name="to" type="hidden" value="' . $row['from'] . '" /><input type="hidden" name="from" value="' . $_POST['for'] . '" /><button type="submit">Reply</button></form>';
					echo 'Time: ' . gmdate('Y-m-d g:i:s A T', $row['time'] - $timeOffsetSeconds) . ' GMT ' . $timeOffsetHours . $timeOffsetSpecial . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . $row['from'] . '" target="_blank">' . $row['from'] . '</a><br>Message:<br>' . htmlspecialchars_decode(stripslashes($row['msg'])) . '</p>';
				}
			}
			mysql_close($db);
			?>
		</div>
	</body>
</html>