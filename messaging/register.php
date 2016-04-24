<?php
require_once 'header.php';

function registerPanel($userId) {
	echo '<h2>Register</h2>';
	echo '<p>In order to use the message system, you need to create an account.</p>';
	echo '<form action="" method="post">';
	echo '<input name="userid" type="hidden" value="' . $userid . '" />';
	echo '<input name="username" type="text" placeholder="Username" required /><br />';
	echo '<input name="password" type="password" placeholder="Password" required /><br />';
	echo '<input name="passwordagain" type="password" placeholder="Confirm password" required /><br />';
	echo '<button name="action" class="button blue" value="create-account">Create account</button>'
	echo '</form>';
}

if (!$_POST['action'] == 'create-account' && is_numeric($_POST['userid'])) {
	//If we're still filling out the form, let the user do so
	$userid = $_POST['userid'];
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE `userid` = '" . sqlesc($_POST['userid']) . "'");

	//Checks for account already existing with userid
	$account_exist = mysqli_fetch_row($result);

	if (!$account_exist && !$_POST['username']) {
		//If account doesn't already exist, and user didn't fill out form, show the form
		registerPanel($userid);
	} else if (!$account_exist && $_POST['username']) {
		//If account doesn't exist, but user did fill out form, check data
		$result = mysqli_query($db, "SELECT * FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");

		//Check if username is already in use
		$row = mysqli_fetch_array($result);

		if ($row) {
			//Username in use
			$usernameUsed = true;
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Username already in use!</strong></p></div></div>";
			registerPanel($userid);
		}  else if (preg_match('/[^A-Za-z0-9]/', $_POST['username']) || empty($_POST['username']) || strlen($_POST['username']) > 30) {
			//Username doesn't pass restrictions
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Please choose a different username without special characters</strong></p></div></div>";
			registerPanel($userid);
		} else {
			//Username not already used, and passes restrictions

			//Generate a token that doesn't already exist
			$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
			$exists = true;
			$token;
			while ($exists == true) {
				//Generate token
				$token = '';
				for ($i = 0; $i < 10; $i++) {
					$random .= $chars[rand(0, strlen($chars) - 1)];
				}

				//Check if it exists
				$query = "SELECT * FROM `users` WHERE `ext_token` = '$random'";
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
			echo '<h4 class="center">Account created. Click <a href="' . $returnto . '?msgtoken=' . $token . '">here</a> to finish the account creation process.</h4><p class="center">In order to finish the account creation process, we must redirect you back to the forums. However, this will only happen during registration.</p>';
		}
	}

	//If account already exists, show login form, and return token to extension
	if ($account_exist) {
		echo 'Another account is already linked to your Dropbox account. <a href="signin.php">Sign in</a>.';
	}
} else {
	//No request from extension to create the account
	echo 'In order to properly create your account, we need to link it with your Dropbox account. Please make sure you have the Forum Extender+ script installed, and come back here via the "Messages" link in the nav bar on the forums.';
}

require_once 'footer.php';
?>
