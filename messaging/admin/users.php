<?php
require_once '../head_stub.php';

//If the user isn't an admin, throw them to the inbox, and make this page completely invisible to them
if (!$userIsAdmin) {
	header('Location: ' . $root);
}

require_once '../header.php';

if ($userAuthenticated && $userIsAdmin) {
	$result = mysqli_query($db, "SELECT * FROM `users` ORDER BY `id` ASC");

	//List users in database
	echo '<table><tr><th>ID</th><th>Dropbox UID</th><th>Username</th><th>Email</th><th>Verified</th></tr>';
	while ($row = mysqli_fetch_assoc($result)) {
		echo '<tr>';
		echo '<td>' . htmlspecialchars($row['id']) . '</td>';
		echo '<td>' . htmlspecialchars($row['userid']) . '</td>';
		echo '<td><a href="viewuser.php?id=' . htmlspecialchars($row['id']) . '">' . htmlspecialchars($row['username']) . '</a></td>';
		echo '<td>' . htmlspecialchars($row['email']) . '</td>';
		echo '<td>' . ($row['verified'] == '1' ? 'Yes' : '<span style="font-weight:bold;color:#b00">No</span>') . '</td>';
		echo '</tr>';
	}
	echo '</table>';
}

require_once '../footer.php';
?>
