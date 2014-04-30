<?php
require 'header.php';
if ($userAuthenticated) {
	if ($action == 'send')
		include 'compose.php';
	elseif ($action == 'delete' || $action == 'arch')
		include 'manipulate-entry.php';
	elseif ($action == 'forward' || $action == 'sendfwd')
		include 'forward-message.php';

	getMessages();

	if ($showinbox) {
		echo '<h2>Inbox - ' . $count . '</h2>';
		while ($row = mysqli_fetch_assoc($result)) {
			echo '<p class="topline"><br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a>';
			if (htmlspecialchars($row['forward']) != 0)
				echo ' (FWD <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['forward']) . '" target="_blank">' . htmlspecialchars($row['forward']) . '</a>)';
			echo '<br>Message:<br>' . nl2br(htmlspecialchars($row['msg'])) . '</p>';
			msgOptions($row);
		}
		deleteConfirm();
		if ($count == 0)
			echo '<p class="topline center"><br>It doesn\'t appear that you have any messages. Check back later, or start a conversation by clicking "Compose."</p>';
	}
}
require 'footer.php';
?>
