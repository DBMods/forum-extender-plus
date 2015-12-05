<?php
require_once 'header.php';

if ($userAuthenticated) {
	if ($action == 'send') {
		require_once 'send.php';
	} elseif ($action == 'addressbook') {
		require_once 'address-book.php';
	}

	$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE id = '" . sqlesc($_POST['msgid']) . "'");
	$row = mysqli_fetch_assoc($result);

	//Mark as read if needed
	if ($row['unread'] == 1) {
		mysqli_query($db, "UPDATE `msglist` SET unread = 0 WHERE id = '" . sqlesc($_POST['msgid']) . "'");
	}

	$typestring;
	if (htmlspecialchars($row['to']) == $username) {
		$typestring = '<strong>From:</strong> ' . htmlspecialchars($row['from']);
	} else if (htmlspecialchars($row['from']) == $username) {
		$typestring = '<strong>To:</strong> ' . htmlspecialchars($row['to']);
	}

	echo '<p>';

	if ($typestring) {
		echo $typestring . '<br>';
		echo '<strong>Subject:</strong> ' . htmlspecialchars($row['subject']) . '<br>';
		echo '<p>' . $row['msg'] . '</p>';

		$buttonMetaId = $_POST['msgid'];
		$buttonMetaArch = $row['archive'] == 0 ? 'arch' : 'unarch';
	} else {
		echo 'Something went wrong. Please try again later.';
	}

	echo '</p>';
}

require_once 'footer.php';
?>
