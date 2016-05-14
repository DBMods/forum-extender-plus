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

	//Display message
	echo '<strong>From:</strong> ' . htmlspecialchars($row['from']) . '<br>';
	echo '<strong>To:</strong> ' . htmlspecialchars($row['to']) . '<br>';
	echo '<strong>Subject:</strong> ' . htmlspecialchars($row['subject']) . '<br>';
	echo '<p>' . $row['msg'] . '</p>';

	//Set meta stuff for navbar buttons
	$buttonMetaId = $_POST['msgid'];
	$buttonMetaArch = $row['archived'] == 0 ? 'arch' : 'unarch';
}

require_once 'footer.php';
?>
