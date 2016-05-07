<?php
require_once '../head_stub.php';

//If the user isn't an admin, throw them to the inbox, and make this page completely invisible to them
if (!$userIsAdmin) {
	header('Location: ' . $root);
}

require_once '../header.php';

if ($userAuthenticated && $userIsAdmin) {
	$result = mysqli_query($db, "SELECT * FROM `users`");

	//List users in database
	echo '<table><tr><th>UID</th><th>Username</th><th>Create Date</th><th>Create IP</th><th>Token</th><th>New Password</th></tr>';
	while ($row = mysqli_fetch_assoc($result)) {
		echo '<tr>';
		echo '<td>' . htmlspecialchars($row['userid']) . '</td>';
		echo '<td>' . htmlspecialchars($row['username']) . '</td>';
		echo '<td>' . gmdate('Y-m-d g:i A', $row['create_time']) . '</td>';
		echo '<td>' . htmlspecialchars($row['create_ip']) . '</td>';
		echo '<td>' . htmlspecialchars($row['ext_token']) . '</t>';
		echo '<td><form onsubmit="return false;" method="post" action="" style="margin:0px"><input name="dashmodpassword" class="dashmodpassword" type="password" /><input name="dashuserid" class="dashuserid" type="hidden" value="' . $row['userid'] . '"/> <input type="hidden" name="dashmodapply" class="dashmodapply" value="change" /></form><a href="javascript:void(0)" class="button danger changepass">Change</a></td>';
		echo '</tr>';
	}
	echo '</table>';
}

require_once '../footer.php';
?>
