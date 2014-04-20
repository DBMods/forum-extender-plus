<?php
require 'header.php';
if ($userAuthenticated) {
	$timeOffsetSeconds = $timeoffset * 60;
	if ($action == 'delete' || $action == 'arch' || $action == 'unarch')
		include 'manipulate-entry.php';
	elseif ($action == 'addressbook')
		include 'address-book.php';
	elseif ($action == 'compose' || $action == 'send')
		include 'compose-message.php';
	elseif ($action == 'forward' || $action == 'sendfwd')
		include 'forward-message.php';
	elseif ($page == 'report' || $action == 'confirmreport')
		include 'report.php';
	if ($page == 'showsent')
		include 'show-sent.php';
	elseif ($page == 'showarch')
		include 'show-archived.php';
	elseif ($page == 'stats')
		include 'stats.php';

	//Message counter navbar badges
	$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 0 ORDER BY `time` DESC");
	$count = mysqli_num_rows($result);
	if ($count > 0)
		$countBadge = ' <span class="badge">' . $count . '</span>';
	else
		$countBadge = '';
	$archCount = mysqli_num_rows(mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 1"));
	if ($archCount > 0)
		$archBadge = ' <span class="badge">' . $archCount . '</span>';
	else
		$archBadge = '';

	if ($showinbox && $page == '') {
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
		echo '<div class="modal fade in" id="alertDelete"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
		echo '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>';
		echo '<h3 class="modal-title">Are you sure?</h3>';
		echo '</div>';
		echo '<div class="modal-body"><h4>If you delete this message, it is gone forever!</h4></div>';
		echo '<div class="modal-footer">';
		echo '<button class="btn btn-default" data-dismiss="modal">Cancel</button>';
		echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" id="msgid" value="" /><button type="submit" class="btn btn-danger" name="action" value="delete">Delete</button></form>';
		echo '</div></div></div></div>';
		if ($count == 0)
			echo '<p class="topline center"><br>It doesn\'t appear that you have any messages. Check back later, or start a conversation by clicking "Compose."</p>';
	}
} else {
	if ($userLogoff)
		echo "<div class='alert-center'><div id='alert-fade' class='alert alert-success'><p><strong>Successfully logged out</strong></p></div></div>";
	include "sign-in.php";
	//Not logged in or bad auth
}
require 'footer.php';
?>