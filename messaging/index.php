<?php
require_once 'header.php';

if ($userAuthenticated) {
	$result = mysqli_query($db, "SELECT m.id, fu.username as `from`, fu.name, m.subject, m.msg, m.unread, m.time FROM msglist as m"
			. " LEFT JOIN users as tu on m.to = tu.id"
			. " LEFT JOIN users as fu on m.from = fu.id"
			. " WHERE tu.username = '" . sqlesc($username) . "' AND archived = 0 ORDER BY time DESC");
	$total = mysqli_num_rows($result);
	if ($total === 0) {
		echo 'Your inbox is empty right now. Check back later, or start a conversation by clicking "Compose".';
	} else {
		echo '<table>';

		while ($row = mysqli_fetch_assoc($result)) {
			echo '<tr ' . ($row['unread'] == 1 ? 'class="unread" ' : '') . 'data-id="' . htmlspecialchars($row['id']) . '"><td class="check"><input type="checkbox" /></td><td class="name">';
			if ($row['name'] != '') {
				echo htmlspecialchars($row['name']) . ' (' . htmlspecialchars($row['from']) . ')';
			} else {
				echo htmlspecialchars($row['from']);
			}
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
