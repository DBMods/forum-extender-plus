<?php
$msgIdList = explode(',', $_POST['msgid']);
if ($action == 'delete') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "DELETE FROM `msglist` WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "'");
	}
	echo $result ? '<span class="toast warning">Message(s) deleted</span>' : '<span class="toast danger">Message does not exist or you do not have permission</span>';
} elseif ($action == 'arch') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "UPDATE `msglist` SET `archived` = 1 WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "' AND `archived` = 0");
	}
	echo '<span class="toast success">Message(s) archived</span>';
} elseif ($action == 'unarch') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "UPDATE `msglist` SET `archived` = 0 WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "' AND `archived` = 1");
	}
	echo '<span class="toast success">Message(s) unarchived</span>';
} elseif ($action == 'markRead') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "UPDATE `msglist` SET `unread` = 0 WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "' AND `unreda` = 1");
	}
	echo '<span class="toast success">Message(s) marked as read</span>';
} elseif ($action == 'markUnread') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "UPDATE `msglist` SET `unread` = 1 WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "' AND `unread` = 0");
	}
	echo '<span class="toast success">Message(s) marked as unread</span>';
}
?>
