<?php
require 'header.php';
if ($userAuthenticated) {
	getMessages();

	if ($showinbox) {
		echo '<h2>Sent Messages</h2>';
		$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `from` = '" . $username . "' ORDER BY `time` DESC");
		while ($row = mysqli_fetch_assoc($result)) {
			echo '<p class="topline"><br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds);
			echo '<br>To: ' . htmlspecialchars($row['to']);
			echo '<br>Subject: ' . htmlspecialchars($row['subject']);
			echo '<br>Message:<br>' . nl2br(htmlspecialchars($row['msg'])) . '</p>';
		}
	}
}
require 'footer.php';
?>
