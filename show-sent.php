<?php
echo '<p><form action="messages.php" method="post"><input type="hidden" name="timeOffset" value="' . $_POST['timeOffset'] . '" /><input type="hidden" name="for" value="' . $_POST['from'] . '" /><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><button type="submit">Back to inbox</button></form></p>';
$result = mysql_query("SELECT * FROM `msglist` WHERE `from` = '" . $_POST['from'] . "' ORDER BY `time` DESC");
while ($row = mysql_fetch_assoc($result)) {
	echo '<p class="topline">';
	echo '<br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>To: <a href="https://forums.dropbox.com/profile.php?id=' . $row['to'] . '" target="_blank">' . $row['to'] . '</a><br>Message:<br>' . htmlspecialchars_decode(stripslashes($row['msg']));
	echo '</p>';
}
?>