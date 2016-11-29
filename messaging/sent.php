<?php
require_once 'header.php';

if ($userAuthenticated) {
	$result = mysqli_query($db, "SELECT m.id, tu.username as `to`, tu.name, m.subject, m.msg, m.unread, m.time FROM msglist as m"
			. " LEFT JOIN users as tu on m.to = tu.id"
			. " LEFT JOIN users as fu on m.from = fu.id"
			. " WHERE fu.username = '" . sqlesc($username) . "' ORDER BY time DESC");
	$total = mysqli_num_rows($result);
	if ($total === 0) {
		echo 'It doesn\'t appear that you have any sent messages';
	} else {
		echo '<table>';

		while ($row = mysqli_fetch_assoc($result)) {
			echo '<tr ' . 'data-id="' . htmlspecialchars($row['id']) . '"><td class="check"><input type="checkbox" /></td><td class="name">';
			if ($row['name'] != '') {
				echo htmlspecialchars($row['name']) . ' (' . htmlspecialchars($row['to']) . ')';
			} else {
				echo htmlspecialchars($row['to']);
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
