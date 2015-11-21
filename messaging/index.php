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

	if ($showinbox) {
		getMessages();
		if ($count == 0) {
			echo 'It doesn\'t appear that you have any messages. Check back later, or start a conversation by clicking "Compose."';
		} else {
			echo '<table>';

			while ($row = mysqli_fetch_assoc($result)) {
				echo '<tr data-id="' . htmlspecialchars($row['id']) . '"><td class=\'check\'><input type=\'checkbox\' /></td><td class=\'name\'>';
				echo $row['from'];
				echo '</td><td class=\'subject\'><span class=\'subject\'>';
				echo htmlspecialchars($row['subject']);
				echo '</span><span class=\'contentPreview\'> - ';
				echo str_replace('\n', ' ', htmlspecialchars($row['msg']));
				echo '</span></td><td class=\'date\'>';
				echo parseDate($row['time'] - $timeOffsetSeconds);
				echo '</td></tr>';
			}

			echo '</table>';
		}
	}
}
require_once 'footer.php';
?>
