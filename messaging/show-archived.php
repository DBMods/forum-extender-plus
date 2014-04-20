<?php
require 'header.php';
if ($userAuthenticated) {
	if ($action == 'delete' || $action == 'arch' || $action == 'unarch')
		include 'manipulate-entry.php';
	elseif ($action == 'addressbook')
		include 'address-book.php';
	elseif ($action == 'compose' || $action == 'send')
		include 'compose-message.php';
	elseif ($action == 'forward' || $action == 'sendfwd')
		include 'forward-message.php';

	if ($showinbox) {
		$page = 'showarch';
		echo '<h2>Archived Messages - ' . $archCount . '</h2>';
		navform();
		while ($row = mysqli_fetch_assoc($archive)) {
			echo '<p class="topline">';
			echo '<br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a><br>Message:<br>' . nl2br(htmlspecialchars($row['msg']));
			echo '</p>';
			echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/><input name="msgto" type="hidden" value="' . htmlspecialchars($row['from']) . '"/><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><button type="submit" class="btn btn-success btn-sm" name="action" value="compose">Reply</button><button type="submit" class="btn btn-warning btn-sm" name="action" value="forward">Forward</button><button type="submit" class="btn btn-primary btn-sm" name="action" value="unarch">Unarchive</button></form>';
			echo '<a data-id="' . htmlspecialchars($row['id']) . '" class="open-alertDelete btn btn-danger btn-sm" href="#alertDelete">Delete</a>';
		}
		deleteConfirm();
		if ($archCount == 0)
			echo '<p class="topline center"><br>It doesn\'t appear that you have any archived messages.</p>';
	}
}
require 'footer.php';
?>