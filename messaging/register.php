<?php
function registerPanel($userid) {
	echo '<div class="small-center">';
	echo '<div class="panel panel-primary">';
	echo '<div class="panel-heading"><h3>Register</h3></div>';
	echo '<div class="panel-body">';
	echo '<form method="post" action="">';
	echo '<fieldset>';
	echo '<div class="form-group"><input id="username" name="username" type="text" placeholder="Username" class="form-control input-md" required="" /></div>';
	echo '<div class="form-group"><input id="password" name="password" type="password" placeholder="Password" class="form-control input-md" required="" /></div>';
	echo '<div class="form-group"><input name="userid" type="hidden" value="' . $userid . '" /><button name="action" class="btn btn-success" value="create-account">Create account</button></div>';
	echo '</fieldset>';
	echo '</form>';
	echo '</div>';
	echo '</div>';
	echo '</div>';
}

//Request to create account from extension
if ($_POST['action'] == "create-account" && is_numeric($_POST['userid'])) {
	$userid = $_POST['userid'];
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE `userid` = '" . sqlesc($_POST['userid']) . "'");

	//Checks for account already existing with userid
	$account_exist = mysqli_fetch_row($result);

	if (!$account_exist && !$_POST['username'])
		//If account does not already exist and user did not fill out register form
		registerPanel($userid);
	elseif (!$account_exist && $_POST['username']) {
		//If account does not already exist and user did fill out register form
		$result = mysqli_query($db, "SELECT * FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");

		//Check if username is already in use
		$row = mysqli_fetch_array($result);

		if ($row) {
			//Username is already in use
			$usernameUsed = true;
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Username already in use!</strong></p></div></div>";
			registerPanel($userid);
		} elseif (preg_match('/[^A-Za-z0-9]/', $_POST['username']) || empty($_POST['username']) || strlen($_POST['username']) > 30) {
			//Username doesn't pass restrictions
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Please choose a different username without special characters</strong></p></div></div>";
			registerPanel($userid);
		} else {
			//Username is not already in use and passes restrictions
			$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
			for ($i = 0; $i < 10; $i++) {
				$random .= $chars[rand(0, strlen($chars) - 1)];
			}

			//Check if token already exists and if so gen another one
			$exists = true;
			while ($exists == true) {
				$query = "SELECT * FROM `users` WHERE `ext_token` = '$random'";
				$result = mysqli_query($sqlconnect, $query);
				$row = mysqli_fetch_array($result);
				if ($row !== NULL) {//Is !== an error?
					$random = "";
					for ($i = 0; $i < 10; $i++) {
						$random .= $chars[rand(0, strlen($chars) - 1)];
					}
				} else
					$exists = false;
			}
			$token = $random;
			$username = htmlspecialchars($_POST['username']);
			$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
			$create_time = time();
			$create_ip = $_SERVER['REMOTE_ADDR'];
			$defaultUidOrigin = mySqli_fetch_assoc(mysqli_query($db, "SELECT * FROM `config` WHERE `setting` = 'default_uid_origin' LIMIT 1"));
			$result = mysqli_query($db, "INSERT INTO `users` (userid, uid_origin, username, password, ext_token, create_time, create_ip) VALUES ('" . sqlesc($userid) . "', '" . $defaultUidOrigin['val'] . "', '" . sqlesc($username) . "', '" . sqlesc($password) . "', '" . sqlesc($token) . "', '" . sqlesc($create_time) . "', '" . sqlesc($create_ip) . "')");
			echo '<h4 class="center">Account created. Click <a href="' . $returnto . '?msgtoken=' . $token . '">here</a> to finish the account creation process.</h4><p class="center">In order to finish the account creation process, we must redirect you back to the forums. However, this will only happen during registration.</p>';
		}
	}

	//If account already exists, show login form, and return token to extension
	if ($account_exist)
		signinPanel("showTokenRedir", "pass-token");
	//If login for pass-token is sent
} elseif ($_POST['action'] == "pass-token" && $_POST['username'] && $_POST['password']) {
	$result = mysqli_query($db, "SELECT password FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
	$passwordHash = mysqli_fetch_row($result);
	$passwordHash = $passwordHash['0'];
	if (password_verify($_POST['password'], $passwordHash))
		$userAuthenticated = true;
	if ($userAuthenticated) {
		//Authentication successful
		$result = mysqli_query($db, "SELECT ext_token FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
		$token = mysqli_fetch_row($result);
		$token = $token['0'];
		echo '<h4 class="center">Successfully signed in. Click <a href="' . $returnto . '?msgtoken=' . $token . '">here</a> to finish the sign in process.</h4><p class="center">In order to finish the sign in process, we must redirect you back to the forums. However, this will only happen once.</p>';
	} else {
		//Authentication unsuccessful
		badAuth();
		signinPanel("showTokenRedir", "pass-token");
	}
} else {
	//No request from extension to create the account
	echo '<div class="small-center">';
	echo '<div class="panel panel-primary">';
	echo '<div class="panel-heading"><h3>Sign up</h3></div>';
	echo '<div class="panel-body"><p>The Dropbox Forum Extender+ extension is required to use this site.  Please install from <a href="https://github.com/dbmods/forum-extender-plus">Github</a></div>';
	echo '</div></div>';
}
?>
