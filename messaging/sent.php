<?php
require_once 'header.php';
if ($userAuthenticated) {
	getMessages();

	if ($showinbox) {
		$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `from` = '" . $username . "' ORDER BY `time` DESC");
		if (mysqli_num_rows($result) == 0) {
			echo 'It doesn\'t appear that there are any messages in the system.';
		} else {
			echo '<table>';

			while ($row = mysqli_fetch_assoc($result)) {
				echo '<tr><td class=\'check\'><input type=\'checkbox\' /></td><td class=\'name\'>';
				echo $row['to'];
				echo '</td><td class=\'subject\'><span class=\'subject\'>';
				echo htmlspecialchars($row['subject']);
				echo '</span><span class=\'contentPreview\'> - ';
				echo nl2br(htmlspecialchars($row['msg']));
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
