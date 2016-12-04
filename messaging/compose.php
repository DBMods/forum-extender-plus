<?php
require_once 'head_stub.php';

if ($userAuthenticated && $userVerified) {
	$dest = $_POST['recipient'];
	$subj = $_POST['subject'];
	$msg = $_POST['message'];

	if ($action === 'send') {
		//User is trying to send message
		//Check for valid recipient so we don't get unresolved messages stuck in the database
		$result = mysqli_query($db, "SELECT id FROM users WHERE username = '" . sqlesc($dest) . "' LIMIT 1");
		$row = mysqli_fetch_assoc($result);

		if ($row) {
			//Destination valid, so we can send the message
			$vals = "'" . $row['id'] . "', '" . sqlesc($username) . "', '" . sqlesc($subj) . "', '" . sqlesc($msg) . "', '" . time() . "'";
			mysqli_query($db, "INSERT INTO msglist (`to`, `from`, subject, msg, time) VALUES(" . $vals . ")");

			//Redirect to inbox after message sent
			header('Location: ' . $root);
		}
	}
}

require_once 'header.php';

if ($userAuthenticated) {
	if ($userVerified) {
		if ($action === 'send') {
			//If user is sending message, and we haven't been redirected by now, it failed
			echo '<div class="toast error">Invalid recipient</div>';
		}

		$result = mysqli_query($db, "SELECT * FROM msglist WHERE id = '" . sqlesc($_POST['msgid']) . "'");
		$row = mysqli_fetch_assoc($result);

		if ($row) {
			//If we're forwarding or replying to a message, change the default values accordingly
			switch ($action) {
				case 'reply':
					$dest = $row['from'];
					$subj = (strpos($row['subject'], 'Re: ') !== 0 ? 'Re: ' : '') . $row['subject'];
					$msg = '';
					break;

				case 'forward':
					$dest = '';
					$subj = (strpos($row['subject'], 'Fwd: ') !== 0 ? 'Fwd: ' : '') . $row['subject'];
					$msg = $row['msg'];
					break;
			}
		}

		echo '<form action="" method="post">';
		echo '<input type="hidden" name="from" value="' . $username . '" />';
		echo '<input name="recipient" placeholder="To" value="' . $dest . '" style="width:752px" required /><br />';
		echo '<input name="subject" placeholder="Subject" value="' . $subj . '" style="width:752px" /><br />';
		echo '<textarea name="message" placeholder="Message" rows="8" style="width:752px" required />' . $msg . '</textarea><br />';
		echo '<button name="action" value="send" class="button blue">Send</button>';
		echo '</form>';
	} else {
		//User not verified, so don't allow sending
		echo '<h1>Compose</h1>';
		echo '<p>In order to send and receive messages, you need to verify your email.</p>';
	}
}

require_once 'footer.php';
?>
