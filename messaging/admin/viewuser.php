<?php
require_once '../head_stub.php';

//If the user isn't an admin, throw them to the inbox, and make this page completely invisible to them
if (!$userIsAdmin) {
	header('Location: ' . $root);
}

require_once '../header.php';

if ($userAuthenticated && $userIsAdmin) {
	$user = $_GET['id'];
	if (isset($user) && $id !== '') {
		$result = mysqli_query($db, "SELECT * FROM `users` WHERE id = '" . sqlesc($user) . "'");
		$row = mysqli_fetch_assoc($result);
		echo '<h1>User ID ' . $user .  '</h1>';
		echo '<strong>Username:</strong> ' . $row['username'] . '<br />';
		echo '<strong>Display Name:</strong> ' . $row['name'] . '<br />';
		echo '<strong>Admin:</strong> ' . ($row['admin'] == '1' ? '<span style="font-weight:bold;color:#090">Yes</span>' : '<span style="color:#b00">No</span>') . '<br />';
		echo '<strong>Dropbox UID:</strong> ' . $row['userid'] . '<br />';
		echo '<strong>UID Origin:</strong> ' . $row['uid_origin'] . '<br />';
		echo '<strong>Email:</strong> ' . $row['email'] . '<br />';
		echo '<strong>Verified:</strong> ' . ($row['verified'] == '1' ? '<span style="color:#090">Yes</span>' : '<span style="font-weight:bold;color:#b00">No</span>') . '<br />';
		echo '<strong>Verify Code:</strong> ' . $row['verify_code'] . '<br />';
		echo '<strong>Token:</strong> ' . $row['ext_token'] . '<br />';
		echo '<p>Created at ' . gmdate('Y-m-d g:i A', $row['create_time']) . ' from IP address ' . $row['create_ip'] . '</p>';
	} else {
		echo '<h1>User Information Unavailable</h1>';
		echo '<p>Please pass in UID to the id parameter</p>';
	}


}

require_once '../footer.php';
?>
