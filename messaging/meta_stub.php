<?php
require_once 'head_stub.php';

if ($userAuthenticated) {
	//Get message ID
	$msgIdList = explode(',', $_POST['msgid']);

	if ($action === 'delete') {
		//If we're deleting messages, do that
		for ($i = 0; $i < sizeof($msgIdList); $i++) {
			$result = mysqli_query($db, "DELETE FROM `msglist` WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "'");
		}
	} else if ($action === 'arch' || $action === 'unarch' || $action === 'markRead' || $action === 'markUnread') {
		//Otherwise, modify the database accordingly
		$dbField = '';
		$setVal = '';
		$checkVal = '';

		//Set database fields to modify
		switch ($action) {
			case 'arch':
			case 'unarch':
				$dbField = 'archived';
				$setVal = $action == 'arch' ? '1' : '0';
				$checkVal = $action == 'unarch' ? '1' : '0';
				break;
			case 'markRead':
			case 'markUnread':
				$dbField = 'unread';
				$setVal = $action == 'markUnread' ? '1' : '0';
				$checkVal = $action == 'markRead' ? '1' : '0';
				break;
		}

		//Run query
		for ($i = 0; $i < sizeof($msgIdList); $i++) {
			$result = mysqli_query($db, "UPDATE `msglist` SET `" . $dbField . "` = " . $setVal . " WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "' AND `" . $dbField . "` = " . $checkVal);
		}
	}

	//Return user to inbox TODO return to page we came from
	header('Location: ' . $root);
}
?>
