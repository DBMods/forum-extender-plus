<?php
require 'header.php';
if ($userAuthenticated) {
	if ($action == 'addressbook')
		include 'address-book.php';
	elseif ($action == 'compose' || $action == 'send')
		include 'compose-message.php';
	elseif ($action == 'forward' || $action == 'sendfwd')
		include 'forward-message.php';

	if ($showinbox) {
		$page = 'inbox';
		echo '<h2>Inbox - ' . $count . '</h2>';
		navform();
		while ($row = mysqli_fetch_assoc($result)) {
			echo '<p class="topline"><br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a>';
			if (htmlspecialchars($row['forward']) != 0)
				echo ' (FWD <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['forward']) . '" target="_blank">' . htmlspecialchars($row['forward']) . '</a>)';
			echo '<br>Message:<br>' . nl2br(htmlspecialchars($row['msg'])) . '</p>';
			echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/><input name="msgto" type="hidden" value="' . htmlspecialchars($row['from']) . '"/><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><button type="submit" class="btn btn-success btn-sm" name="action" value="compose">Reply</button><button type="submit" class="btn btn-warning btn-sm" name="action" value="forward">Forward</button><button type="submit" class="btn btn-primary btn-sm" name="action" value="arch">Archive</button></form>';
			echo '<a data-id="' . htmlspecialchars($row['id']) . '" class="open-alertDelete btn btn-danger btn-sm" href="#alertDelete">Delete</a>';
		}
		deleteConfirm();
		if ($count == 0)
			echo '<p class="topline center"><br>It doesn\'t appear that you have any messages. Check back later, or start a conversation by clicking "Compose."</p>';
	}
}
require 'footer.php';
?>