<?php
require_once 'header.php';

if ($userAuthenticated) {
	if ($action === 'changePass') {
		//User wants to change password
		$result = mysqli_query($db, "SELECT password FROM `users` WHERE username = '" . sqlesc($username) . "'");
		$passwordHash = mysqli_fetch_row($result);
		$passwordHash = $passwordHash['0'];

		if (password_verify($_POST['curPass'], $passwordHash)) {
			//Password matches, so check for matching new password
			if ($_POST['newPass'] === $_POST['newPassAgain']) {
				//Passwords match, check length
				if (strlen($_POST['newPass']) >= 7) {
					//Password is sufficient, so save it
					$newPass = sqlesc(password_hash($_POST['newPass'], PASSWORD_BCRYPT));

					mysqli_query($db, "UPDATE `users` SET password = '$newPass' WHERE username = '" . sqlesc($username) . "'");
					echo '<div class="toast success">Your password has been changed</div>';
				} else {
					//Password too short
					echo '<div class="toast error">Your password must be at least 7 characters</div>';
				}
			} else {
				//Passwords don't match
				echo '<div class="toast error">The new passwords do not match</div>';
			}
		} else {
			//Incorrect initial password
			echo '<div class="toast error">The password provided is incorrect</div>';
		}
	}

	echo '<div class="floatbox">';
	echo '<div class="small">';
	echo '<h1>Settings</h1>';
	echo '<p>';
	echo '<form action="" method="post">';
	echo '<strong>Username:</strong> ' . $username . '<br />';
	echo '<input type="text" name="dispName" placeholder="Display Name" readonly /><br />';
	echo '<input type="text" name="email" placeholder="Email" readonly required /><br />';
	echo '<button class="button blue" type="submit" name="action" value="changesettings">Submit</button>';
	echo '</form>';
	echo '</p>';
	echo '</div><div class="large">';
	echo '<h1>Change Password</h1>';
	echo '<p>';
	echo '<form action="" method="post">';
	echo '<input type="password" name="curPass" placeholder="Current Password" required /><br />';
	echo '<input type="password" name="newPass" placeholder="New Password" required /><br />';
	echo '<input type="password" name="newPassAgain" placeholder="New Password Again" required /><br />';
	echo '<button class="button blue" type="submit" name="action" value="changePass">Change password</button>';
	echo '</form>';
	echo '</p>';
	echo '</div>';
	echo '</div>';
}

require_once 'footer.php';
?>
