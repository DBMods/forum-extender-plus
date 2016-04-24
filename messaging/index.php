<?php
require_once 'header.php';

if ($userAuthenticated) {
	$result = mysqli_query($db, "SELECT * from `msglist` WHERE `to` = '" . sqlesc($username) . "' AND `archived` = 0 ORDER BY `time` DESC");
	$total = mysqli_num_rows($result);
	if ($total === 0) {
		echo 'Your inbox is empty right now. Check back later, or start a conversation by clicking "Compose".';
	} else {
		echo '<table>';

		while ($row = mysqli_fetch_assoc($result)) {
			echo '<tr ' . ($row['unread'] == 1 ? 'class="unread" ' : '') . 'data-id="' . htmlspecialchars($row['id']) . '"><td class="check"><input type="checkbox" /></td><td class="name">';
			echo $row['from'];
			echo '</td><td class="subject"><span class="subject">';
			echo htmlspecialchars($row['subject']);
			echo '</span><span class="contentPreview"> - ';
			echo str_replace('\n', ' ', htmlspecialchars($row['msg']));
			echo '</span></td><td class="date">';
			echo parseDate($row['time'] - $timeOffsetSeconds);
			echo '</td></tr>';
		}

		echo '</table>';
	}
}

require_once 'footer.php';
?>
