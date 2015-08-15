<?php
require_once 'header.php';
if ($userAuthenticated) {
	if ($action == 'send') {
		require_once 'compose.php';
	} elseif ($action == 'delete' || $action == 'arch') {
		require_once 'manipulate-entry.php';
	} elseif ($action == 'forward' || $action == 'sendfwd') {
		require_once 'forward-message.php';
	} elseif ($action == 'report') {
		require_once 'report.php';
	}

	getMessages();

	if ($showinbox) {
		echo '<h2>Inbox - ' . $count . '</h2>';
		while ($row = mysqli_fetch_assoc($result)) {
			echo '<p class="topline"><br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: ' . ($row['from']); //PHP 5.4 bug with htmlspecialchars()
			if ($row['forward'] !== '0') { //PHP 5.4 bug with htmlspecialchars()
				echo ' (FWD ' . $row['forward'] . ')'; //PHP 5.4 bug with htmlspecialchars()
			}
			echo '<br>Subject: ' . htmlspecialchars($row['subject']);
			echo '<br>Message:<br>' . nl2br(htmlspecialchars($row['msg'])) . '</p>';
			msgOptions($row);
		}
		deleteConfirm();
		if ($count == 0)
			echo '<p class="topline center"><br>It doesn\'t appear that you have any messages. Check back later, or start a conversation by clicking "Compose."</p>';
	}
}
require_once 'footer.php';
?>
