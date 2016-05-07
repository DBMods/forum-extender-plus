<?php
require_once '../head_stub.php';

//If the user isn't an admin, throw them to the inbox, and make this page completely invisible to them
if (!$userIsAdmin) {
	header('Location: ' . $root);
}

require_once '../header.php';

if ($userAuthenticated && $userIsAdmin) {
	//Update database if necessary
	if ($action === 'updateadminconfig') {
		mysqli_query($db, "UPDATE `config` SET `value` = '" . $_POST['default_uid_origin'] . "' WHERE `setting` = 'default_uid_origin'");
	}

	$result = mysqli_query($db, "SELECT * FROM `config` WHERE `setting` = 'default_uid_origin' LIMIT 1");
	$row = mysqli_fetch_assoc($result);

	//Display settings
	echo '<form onsubmit="returnfalse" id="adminsettingsform" action="" method="post">';
	echo '<input type="hidden" name="action" value="updateadminconfig" />';
	echo '<strong>default_uid_origin</strong>:<br />';
	echo '<input type="text" name="default_uid_origin" value="' . $row['val'] . '" style="width:100%" />';
	echo '</form>';
	echo '<br /><a href="javascript:void(0)" id="adminsettings" class="button danger">Update</a>';
}

require_once '../footer.php';
?>
