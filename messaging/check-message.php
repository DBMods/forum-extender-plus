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
			if ($_POST['action'] && $_POST['action'] == 'delete') {
				$result = mysql_query("DELETE FROM `msglist` WHERE `to` = '" . mysql_real_escape_string($_POST['to']) . "' AND `from` = '" . mysql_real_escape_string($_POST['from']) . "' AND `msg` = '" . mysql_real_escape_string(htmlspecialchars($_POST['msg'])) . "'");
				echo '<p>Message deleted.</p>';
			}
			$result = mysql_query("SELECT * FROM `msglist` WHERE `to` = '" . $_POST['to'] . "'");
			echo '<p><a href="' . $_POST['returnto'] . '">Back to forums</a></p>';
			while ($row = mysql_fetch_assoc($result)) {
				echo '<p class="topline"><form method="post" action="check-message.php"><input type="hidden" name="action" value="delete" /><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input name="to" type="hidden" value="' . $_POST['to'] . '" /><input type="hidden" name="from" value="' . $row['from'] . '" /><input type="hidden" name="msg" value="' . stripslashes($row['msg']) . '" /><button type="submit">Delete</button></form>';
				echo '<form method="post" action="compose-message.php"><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input name="to" type="hidden" value="' . $row['from'] . '" /><input type="hidden" name="from" value="' . $_POST['to'] . '" /><button type="submit">Reply</button></form>';
				echo 'From: <a href="https://forums.dropbox.com/profile.php?id=' . $row['from'] . '" target="_blank">' . $row['from'] . '</a><br>Message:<br>' . htmlspecialchars_decode(stripslashes($row['msg'])) . '</p>';
			}
			mysql_close($db);
			?>
		</div>
	</body>
</html>