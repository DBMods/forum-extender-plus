<?php
require_once '../head_stub.php';

//If the user isn't an admin, throw them to the inbox, and make this page completely invisible to them
if (!$userIsAdmin) {
	header('Location: ' . $root);
}

require_once '../header.php';

if ($userAuthenticated) {
	if ($userIsAdmin) {
		$q = $_GET['q'];
		$sqlStub = '';

		if ($q) {
			if(preg_match('/^\d+$/', $q)) {
				//Query is number, which can match username or ID
				$sqlStub = " WHERE username LIKE '%" . $q . "%' OR  id LIKE '%" . $q . "%'";
			} else if (preg_match('/^[A-Za-z\d]+$/', $q)) {
				//Query is alphanumeric, which can be username
				$sqlStub = " WHERE username LIKE '%" . $q . "%'";
			}
		}

		$result = mysqli_query($db, "SELECT * FROM users" . $sqlStub . " ORDER BY `id` ASC");

		//Add in search box
		echo '<form action="" method="get"><input type="text" name="q" placeholder="Search by ID or username" value="' . $q . '" autocomplete="off" style="box-sizing:border-box;width:100%;margin-bottom:8px" /></form>';

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
	} else {
		echo '<h1>Insufficient permissions</h1>';
		echo '<p>You do not have the permissions required to access this page</p>';
	}
}

require_once '../footer.php';
?>
