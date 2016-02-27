<?php
//Grab message list
$msgIdList = explode(',', $_POST['msgid']);

//If we're deleting, do that
if ($action == 'delete') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "DELETE FROM `msglist` WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "'");
	}
	echo $result ? '<span class="toast warning">Message(s) deleted</span>' : '<span class="toast danger">Message does not exist or you do not have permission</span>';
} elseif ($action == 'arch' || $action == 'unarch' || $action == 'markRead' || $action == 'markUnread') {
	//Else modify database accordingly
	$toastMsg = '';
	$dbField = '';
	$setVal = '';
	$checkVal = '';

	//Set toast message and database fields to modify
	if ($action == 'arch' || $action == 'unarch') {
		$dbField = 'archived';
		$setVal = $action == 'arch' ? '1' : '0';
		$checkVal = $action == 'unarch' ? '1' : '0';
		$toastMsg = $action . 'ived';
	} else if ($action == 'markRead' || $action == 'markUnread') {
		$dbField = 'unread';
		$setVal = $action == 'markUnread' ? '1' : '0';
		$checkVal = $action == 'markRead' ? '1' : '0';
		$toastMsg = 'marked as ' . ($action == 'markUnread' ? 'un' : '') . 'read';
	}

	//Run query
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "UPDATE `msglist` SET `" . $dbField . "` = " . $setVal . " WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "' AND `" . $dbField . "` = " . $checkVal);
	}

	//Display toast
	echo '<span class="toast success">Message(s) ' . $toastMsg . '</span>';
}
?>
