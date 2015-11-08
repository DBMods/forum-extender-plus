<?php
$msgIdList = explode(',', $_POST['msgid']);
if ($action == 'delete') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "DELETE FROM `msglist` WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "'");
	}
	echo '<div class="alert-center">' . ($result ? '<div id="alert-fade" class="alert alert-warning"><p><strong>Message(s) deleted.</strong></p></div>' : '<div class="alert alert-danger"><p><strong>Error: Message does not exist or you do not have permission</strong></p></div>') . '</div>';
} elseif ($action == 'arch') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "UPDATE `msglist` SET `archived` = 1 WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "' AND `archived` = 0");
	}
	$result = mysqli_query($db, "UPDATE `msglist` SET `archived` = 1 WHERE `id` = '" . sqlesc($_POST['msgid']) . "' AND `to` = '" . sqlesc($username) . "' AND `archived` = 0");
	echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message(s) archived.</strong></p></div></div>';
} elseif ($action == 'unarch') {
	for ($i = 0; $i < sizeof($msgIdList); $i++) {
		$result = mysqli_query($db, "UPDATE `msglist` SET `archived` = 0 WHERE `id` = '" . sqlesc($msgIdList[$i]) . "' AND `to` = '" . sqlesc($username) . "' AND `archived` = 1");
	}
	echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message(s) unarchived.</strong></p></div></div>';
}
?>
