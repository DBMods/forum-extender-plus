<?php
require_once 'header.php';
if ($userAuthenticated) {
	if ($action == 'delete' || $action == 'unarch')
		include 'manipulate-entry.php';
	elseif ($action == 'forward' || $action == 'sendfwd')
		include 'forward-message.php';

	if ($showinbox) {
		getMessages();
		if ($archCount == 0) {
			echo 'It doesn\'t appear that you have any archived messages.';
		} else {
			echo '<table>';

			while ($row = mysqli_fetch_assoc($archive)) {
				echo '<tr data-id="' . htmlspecialchars($row['id']) . '"><td class=\'check\'><input type=\'checkbox\' /></td><td class=\'name\'>';
				echo $row['from'];
				echo '</td><td class=\'subject\'><span class=\'subject\'>';
				echo htmlspecialchars($row['subject']);
				echo '</span><span class=\'contentPreview\'> - ';
				echo nl2br(htmlspecialchars($row['msg']));
				echo '</span></td><td class=\'date\'>';
				echo parseDate( $row['time'] - $timeOffsetSeconds);
				echo '</td></tr>';
			}

			echo '</table>';
		}
	}
}
require_once 'footer.php';
?>
