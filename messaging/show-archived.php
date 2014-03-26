<?php
$showinbox = false;
$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . $userid . "' AND `archived` = 1 ORDER BY `time` DESC");
$count = mysqli_num_rows($result);
echo '<h2>Archived Messages - ' . $count . '</h2>';
navform();
while ($row = mysqli_fetch_assoc($result)) {
	echo '<p class="topline">';
	echo '<br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a><br>Message:<br>' . nl2br(htmlspecialchars($row['msg']));
	echo '</p>';
	echo '<form method="post" action="" class="menu"><input name="time" type="hidden" value="' . htmlspecialchars($row['time']) . '" /><input type="hidden" name="from" value="' . htmlspecialchars($row['from']) . '" /><input type="hidden" name="msg" value="' . htmlspecialchars($row['msg']) . '" /><button type="submit" class="btn btn-danger btn-sm" name="action" value="delete">Delete</button></form>';
	echo '<form method="post" action="" class="menu"><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><input name="msgto" type="hidden" value="' . htmlspecialchars($row['from']) . '" /><button type="submit" class="btn btn-success btn-sm" name="action" value="compose">Reply</button></form>';
	echo '<form method="post" action="" class="menu"><input name="time" type="hidden" value="' . htmlspecialchars($row['time']) . '" /><input type="hidden" name="from" value="' . htmlspecialchars($row['from']) . '" /><input type="hidden" name="msg" value="' . htmlspecialchars($row['msg']) . '" /><button type="submit" class="btn btn-primary btn-sm" name="action" value="unarch">Unarchive</button></form>';
}
if ($count == 0)
	echo '<p class="topline center"><br>It doesn\'t appear that you have any archived messages.</p>';
?>