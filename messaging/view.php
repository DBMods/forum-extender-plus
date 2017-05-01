<?php
require_once 'header.php';

if ($userAuthenticated) {
	$mid = $_POST['msgid'];
	$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE id = '" . sqlesc($mid) . "'");
	$row = mysqli_fetch_assoc($result);

	//Mark message as read
	if ($row['unread'] == 1) {
		mysqli_query($db, "UPDATE `msglist` SET unread = 0 WHERE id = '" . sqlesc($mid) . "'");
	}

	$userFromInfo = mysqli_query($db, "SELECT * FROM `users` WHERE id = '" . sqlesc($row['from']) . "'");
	$userFrom = mysqli_fetch_assoc($userFromInfo);
	$userToInfo = mysqli_query($db, "SELECT * FROM `users` WHERE id = '" . sqlesc($row['to']) . "'");
	$userTo = mysqli_fetch_assoc($userToInfo);

	//Display message
	echo '<strong>From:</strong> ';
	if ($userFrom['name'] != '') {
		echo htmlspecialchars($userFrom['name']) . ' (' . htmlspecialchars($userFrom['username']) . ')';
	} else {
		echo htmlspecialchars($userFrom['username']);
	}
	echo '<br><strong>To:</strong> ';
	if ($userTo['name'] != '') {
		echo htmlspecialchars($userTo['name']) . ' (' . htmlspecialchars($userTo['username']) . ')';
	} else {
		echo htmlspecialchars($userFrom['username']);
	}
	echo '<br>';
	echo '<strong>Subject:</strong> ' . htmlspecialchars($row['subject']) . '<br>';
	echo '<p>' . $row['msg'] . '</p>';

	//Set meta stuff for navbar buttons
	$buttonMetaId = $_POST['msgid'];
	$buttonMetaArch = $row['archived'] == 0 ? 'arch' : 'unarch';
}

require_once 'footer.php';
?>
