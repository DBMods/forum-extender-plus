<?php
require_once 'header.php';

function registerPanel($userId) {
	echo '<h2>Register</h2>';
	echo '<p>In order to use the message system, you need to create an account.</p>';
	echo '<form action="" method="post">';
	echo '<input name="userid" type="hidden" value="' . $userid . '" />';
	echo '<input name="username" type="text" placeholder="Username" maxlength="60" required /><br />';
	echo '<input name="password" type="password" placeholder="Password" required /><br />';
	echo '<input name="passwordagain" type="password" placeholder="Confirm password" required /><br />';
	echo '<button class="button blue">Create account</button>';
	echo '</form>';
}

$userid = $_POST['userid'];

if (is_numeric($userid)) {
	//UID present, so check if it's associated with an account
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE `userid` = '" . sqlesc($_POST['userid']) . "'");

	if (mysqli_fetch_row($result)) {
		//Account already exists, so alert user
		echo 'An account is already associated with your user ID. Did you mean to <a href="signin.php">sign in</a>?';
	} else if ($action === 'create-account') {
		//User is coming from forums, so show plain form
		//Check after UID check, because there's no sense making user fill out form if UId exists
		registerPanel($userid);
	} else {
		//User has filled out this form, so check for completion
		if (!$_POST['username']) {
			echo '<p>Please choose a username</p>';
			registerPanel($userid);
		} else if (!$_POST['password'] || !$_POST['passwordagain']) {
			echo '<p>You need to fill out both password fields</p>';
			registerPanel($userid);
		} else {
			//User filled out form, so check criteria
			if (preg_match('/[^\w]', $_POST['username'])) {
				echo '<p>Your username must not contain special characters</p>';
				registerPanel($userid);
			} else {
				$result = mysqli_query($db, "SELECT * FROM `users` WHERE `username` = '" . sqlesc($_POST['username']) . "'");

				if (mysqli_fetch_array($result)) {
					//Username already exists
					echo '<p>That username is already in use. Please choose a different one.</p>';
					registerPanel($userid);
				} else if (strlen($_POST['password']) < 8 || strlen($_POST['passwordagain']) < 8) {
					//Password is less than 8 characters
					echo '<p>Your password must be at least 8 characters</p>';
					registerPanel($userid);
				} else if ($_POST['password'] !== $_POST['passwordagain']) {
					//Passwords are not the same
					echo '<p>Your passwords do not match</p>';
					registerPanel($userid);
				} else {
					//Everything good, so create account
					//Generate a nonexisting token
					$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
					$exists = true;
					$token;

					while ($exists === true) {
						//Generate token
						$token = '';
						for ($i = 0; $i < 20; $i++) {
							$token .= $chars[rand(0, strlen($chars) - 1)];
						}

						//Check if generated token exists
						$query = "SELECT * FROM `users` WHERE `ext_token` = '$token'";
						$result = mysqli_query($sqlconnect, $query);
						$row = mysqli_fetch_array($result);
						if ($row === NULL) {
							$exists = false;
						}
					}

					//Grab necessary data
					$username = htmlspecialchars($_POST['username']);
					$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
					$create_time = time();
					$create_ip = $_SERVER['REMOTE_ADDR'];
					$defaultUidOrigin = mySqli_fetch_assoc(mysqli_query($db, "SELECT * FROM `config` WHERE `setting` = 'default_uid_origin' LIMIT 1"));

					//Create account and alert the user
					$result = mysqli_query($db, "INSERT INTO `users` (userid, uid_origin, username, password, ext_token, create_time, create_ip) VALUES ('" . sqlesc($userid) . "', '" . $defaultUidOrigin['val'] . "', '" . sqlesc($username) . "', '" . sqlesc($password) . "', '" . sqlesc($token) . "', '" . sqlesc($create_time) . "', '" . sqlesc($create_ip) . "')");
					echo '<h4>Account created. Click <a href="' . $returnto . '?msgtoken=' . $token . '">here</a> to finish the account creation process.</h4>';
					echo '<p>In order to finish the account creation process, we must redirect you back to the forums. However, this will only happen during registration.</p>';
				}
			}
		}
	}
} else {
	//No UID, so alert the user
	echo 'Something went wrong. There doesn\'t seem to be a user ID anywhere. Head back to the forums, and use the Forum Extender+ "Messages" link in the nav bar, and we\'ll see if that sorts it out.';
}

require_once 'footer.php';
?>
