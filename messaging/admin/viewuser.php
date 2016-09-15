<?php
require_once '../head_stub.php';

//If the user isn't an admin, throw them to the inbox, and make this page completely invisible to them
if (!$userIsAdmin) {
	header('Location: ' . $root);
}

require_once '../header.php';

if ($userAuthenticated) {
	if ($userIsAdmin) {
		$user = $_GET['id'];
		if (isset($user) && $id !== '') {
			$result = mysqli_query($db, "SELECT * FROM `users` WHERE id = '" . sqlesc($user) . "'");
			$row = mysqli_fetch_assoc($result);
			echo '<h1>User ID ' . $user .  ' - ' . $row['username'] . '</h1>';
			echo '<strong>Display Name:</strong> ' . $row['name'] . '<br />';
			echo '<strong>Admin:</strong> ' . ($row['admin'] == '1' ? '<span style="font-weight:bold;color:#090">Yes</span>' : '<span style="color:#b00">No</span>') . '<br />';
			echo '<strong>Dropbox UID:</strong> ' . $row['userid'] . '<br />';
			echo '<strong>UID Origin:</strong> ' . $row['uid_origin'] . '<br />';
			echo '<strong>Token:</strong> ' . $row['ext_token'];
			echo '<h2>Email Verification Status - ' . ($row['verified'] == '1' ? '<span style="color:#090">Verified</span>' : '<span style="font-weight:bold;color:#b00">Unverified</span>') . '</h2>';
			echo '<div style="width:100%;display:flex"><input type="email" value="' . $row['email'] . '" style="flex:2;margin-right:8px" readonly />' . ($row['verified'] == '1' ? '<button class="button danger">Remove Verification</button>' : '<button class="button blue">Verify User</button>') . '</div>';
			if ($row['verified'] == '1') {
				echo '<strong>Verify Code:</strong> ' . $row['verify_code'] . '<br />';
			}
			echo '<div style="text-align:center;color:#999"><p>Created at ' . gmdate('Y-m-d g:i A', $row['create_time']) . ' from IP address ' . $row['create_ip'] . '</p></div>';
		} else {
			echo '<h1>User Information Unavailable</h1>';
			echo '<p>Please pass in UID to the id parameter</p>';
		}
	} else {
		echo '<h1>Insufficient permissions</h1>';
		echo '<p>You do not have the permissions required to access this page</p>';
	}
}

require_once '../footer.php';
?>
