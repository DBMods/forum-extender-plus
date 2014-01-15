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
			echo '<p><form action="check-message.php" method="post"><input type="hidden" name="to" value="' . $_POST['from'] . '" /><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><button type="submit">Cancel</button></form></p>';
			echo '<div class="topline">';
			echo '<p></p>';
			echo '<p><form action="process-message.php" method="post"><input name="referrer" type="hidden" value="compose" /><input name="msgto" type="textbox" placeholder="Recipient" value="' . $_POST['to'] . '"/><input name="msgfrom" type="hidden" value = "' . $_POST['from'] . '"/><textarea name="msgtext" placeholder="Message"></textarea><button type="submit">Send</button></form></p>';
			echo '</div>';
			mysql_close($db);
			?>
		</div>
	</body>
</html>