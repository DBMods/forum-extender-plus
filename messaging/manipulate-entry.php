<?php
if ($action == 'delete') {
	$result = mysqli_query($db, "DELETE FROM `msglist` WHERE `id` = '" . sqlesc($_POST['msgid']) . "' AND `to` = '" . sqlesc($userid) . "'");
	if ($result) {
		echo '<div class="alert-center"><div id="alert-fade" class="alert alert-warning"><p><strong>Message deleted.</strong></p></div></div>';
	}
	else {
		echo '<div class="alert-center"><div class="alert alert-danger"><p><strong>Error: Message does not exist or you do not have permission</strong></p></div></div>';
	}
} elseif ($action == 'arch') {
	$result = mysqli_query($db, "UPDATE `msglist` SET `archived` = 1 WHERE `id` = '" . sqlesc($_POST['msgid']) . "' AND `to` = '" . sqlesc($userid) . "' AND `archived` = 0");
	echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message archived.</strong></p></div></div>';
} elseif ($action == 'unarch') {
	$result = mysqli_query($db, "UPDATE `msglist` SET `archived` = 0 WHERE `id` = '" . sqlesc($_POST['msgid']) . "' AND `to` = '" . sqlesc($userid) . "' AND `archived` = 1");
	echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message unarchived.</strong></p></div></div>';
}
?>