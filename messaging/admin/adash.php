<?php
require_once '../head_stub.php';

//If the user isn't an admin, throw them to the inbox, and make this page completely invisible to them
if (!$userIsAdmin) {
	header('Location: ' . $root);
}

require_once '../header.php';

if ($userAuthenticated) {
	if ($userIsAdmin) {
		//Update database if necessary
		if ($action === 'updateadminconfig') {
			mysqli_query($db, "UPDATE `config` SET `value` = '" . $_POST['default_uid_origin'] . "' WHERE `setting` = 'default_uid_origin'");
		}

		$result = mysqli_query($db, "SELECT * FROM `config` WHERE `setting` = 'default_uid_origin' LIMIT 1");
		$row = mysqli_fetch_assoc($result);

		//Display settings
		echo '<form onsubmit="return false;" id="adminsettingsform" action="" method="post">';
		echo '<input type="hidden" name="action" value="updateadminconfig" />';
		echo '<h2>Default UID Origin</h2>';
		echo '<p style="color:#444">The <code style="color:#000;font-weight:bold">default_uid_origin</code> property sets a default value for a user\'s <code style="color:#000;font-weight:bold">uid_origin</code> property on registration. It is changed whenever the user\'s UID must be changed due to the existing UID not working (for example, changing the forum software when the UID was bound to, say, a user\'s forum profile) This gives the ability for users to be alerted when the UID needs to be changed, and provides an automatic way for their accounts to be verified and updated to reflect the change.</p>';
		echo '<div style="margin-bottom:16px;text-align:center;color:#b00;font-weight:bold;font-size:16px;">Updating this value will force <span style="font-size:20px;font-weight:900">all</span> users to go through the repair process!</div>';
		echo '<div style="display:flex"><strong style="line-height:36px">default_uid_origin</strong><input type="text" name="default_uid_origin" value="' . $row['val'] . '" style="flex:2;margin-left:8px" /></div>';
		echo '</form>';
		echo '<br /><a href="javascript:void(0)" id="adminsettings" class="button danger">Update</a>';
	} else {
		echo '<h1>Insufficient permissions</h1>';
		echo '<p>You do not have the permissions required to access this page</p>';
	}
}

require_once '../footer.php';
?>
