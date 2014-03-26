<?php
$showinbox = false;
$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . $userid . "' AND `archived` = 1 ORDER BY `time` DESC");
$count = mysqli_num_rows($result);
echo '<h2>Archived Messages - ' . $count . '</h2>';
navform();
while ($row = mysqli_fetch_assoc($result)) {
	echo '<p class="topline">';
	echo '<br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>To: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['to']) . '" target="_blank">' . htmlspecialchars($row['to']) . '</a><br>Message:<br>' . nl2br(htmlspecialchars($row['msg']));
	echo '</p>';
	echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="action" value="delete" /><input name="time" type="hidden" value="' . htmlspecialchars($row['time']) . '" /><input name="for" type="hidden" value="' . $userid . '" /><input type="hidden" name="from" value="' . htmlspecialchars($row['from']) . '" /><input type="hidden" name="msg" value="' . htmlspecialchars($row['msg']) . '" /><button type="submit" class="btn btn-danger btn-sm">Delete</button></form>';
	echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="action" value="compose" /><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><input name="to" type="hidden" value="' . htmlspecialchars($row['from']) . '" /><button type="submit" class="btn btn-success btn-sm">Reply</button></form>';
	echo '<form method="post" action="messages.php" class="menu"><input type="hidden" name="action" value="unarch" /><input name="time" type="hidden" value="' . htmlspecialchars($row['time']) . '" /><input name="for" type="hidden" value="' . $userid . '" /><input type="hidden" name="from" value="' . htmlspecialchars($row['from']) . '" /><input type="hidden" name="msg" value="' . htmlspecialchars($row['msg']) . '" /><button type="submit" class="btn btn-primary btn-sm">Unarchive</button></form>';
}
if ($count == 0)
	echo '<p class="topline center"><br>It doesn\'t appear that you have any archived messages.</p>';
?>