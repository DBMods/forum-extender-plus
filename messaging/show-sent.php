<?php
require 'header.php';
if ($userAuthenticated) {
	$page = 'showsent';
	if ($action == 'addressbook')
		include 'address-book.php';
	elseif ($action == 'compose' || $action == 'send')
		include 'compose-message.php';
	echo '<h2>Sent Messages</h2>';
	navform();
	$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `from` = '" . $userid . "' ORDER BY `time` DESC");
	while ($row = mysqli_fetch_assoc($result)) {
		echo '<p class="topline"><br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>To: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['to']) . '" target="_blank">' . htmlspecialchars($row['to']) . '</a><br>Message:<br>' . nl2br(htmlspecialchars($row['msg'])) . '</p>';
	}
} else {
	//Not logged in or bad auth
	if ($userLogoff)
		echo "<div class='alert-center'><div id='alert-fade' class='alert alert-success'><p><strong>Successfully logged out</strong></p></div></div>";
	include "sign-in.php";
}
require 'footer.php';
?>