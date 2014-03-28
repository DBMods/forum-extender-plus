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
	echo '<a data-id="' . htmlspecialchars($row['id']) . '" class="open-alertDelete btn btn-danger btn-sm" href="#alertDelete">Delete</a>';
	echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/><button type="submit" class="btn btn-success btn-sm" name="action" value="compose">Reply</button><button type="submit" class="btn btn-primary btn-sm" name="action" value="unarch">Unarchive</button></form>';
}
	echo '<div class="modal fade in" id="alertDelete">';
	echo '<div class="modal-dialog">';
	echo '<div class="modal-content">';
	echo '<div class="modal-header">';
	echo '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>';
	echo '<h3 class="modal-title">Are you sure?</h3>';
	echo '</div>';
	echo '<div class="modal-body">';
	echo '<h4>If you delete this message, it is gone forever!</h4>';
	echo '</div>';
	echo '<div class="modal-footer">';
	echo '<button class="btn btn-default" data-dismiss="modal">Cancel</button>';
	echo '<form method="post" action="messages.php" class="menu"><input name="msgid" type="hidden" id="msgid" value="" /><button type="submit" class="btn btn-danger" name="action" value="delete">Delete</button></form>';
	echo '</div>';
	echo '</div>';
	echo '</div>';
	echo '</div>';
if ($count == 0)
	echo '<p class="topline center"><br>It doesn\'t appear that you have any archived messages.</p>';
?>