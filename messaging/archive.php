<?php
require 'header.php';
if ($userAuthenticated) {
	if ($action == 'delete' || $action == 'unarch')
		include 'manipulate-entry.php';
	elseif ($action == 'forward' || $action == 'sendfwd')
		include 'forward-message.php';

	getMessages();

	if ($showinbox) {
		echo '<h2>Archived Messages - ' . $archCount . '</h2>';
		while ($row = mysqli_fetch_assoc($archive)) {
			echo '<p class="topline">';
			echo '<br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a><br>Message:<br>' . nl2br(htmlspecialchars($row['msg']));
			echo '</p>';
			msgOptions($row, "unarch");
		}
		deleteConfirm();
		if ($archCount == 0)
			echo '<p class="topline center"><br>It doesn\'t appear that you have any archived messages.</p>';
	}
}
require 'footer.php';
?>
