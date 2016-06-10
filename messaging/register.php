<?php
require_once 'header.php';

function registerPanel($userId, $email, $username) {
	echo '<h1>Register Your Account</h1>';
	echo '<p>Please fill out the registration form below to complete registration.</p>';
	echo '<form action="" method="post">';
	echo '<input type="hidden" name="userid" value="' . $userId . '" />';
	echo '<input type="text" placeholder="Dropbox Email" value="' . $email . '" readonly required /><br />';
	echo '<input name="username" type="text" placeholder="Username" maxlength="60" value="' . $username . '" required /><br />';
	echo '<input name="password" type="password" placeholder="Password" required /><br />';
	echo '<input name="passwordagain" type="password" placeholder="Confirm password" required /><br />';
	echo '<button class="button blue">Create account</button>';
	echo '</form>';
}

function collectData() {
	echo '<h1 data-status="loading">Loading User Data</h1>';
	echo '<p>There doesn\'t seem to be a user ID or email here, so we\'re attempting to load data from the userscript. This shouldn\'t take more than a few seconds. If it takes longer than usual, make sure you have the latest version of the userscript installed, and <a href="register.php">try again</a>. If the error persists, please try again later.';
}

function genAlphaNum($len, $uniqueField) {
	global $db;
	$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	$genStr = '';

	if (isset($uniqueField)) {
		//If we need a unique string, recreate one until it's unique
		$exists = true;

		while ($exists === true) {
			//Generate token
			$genStr = '';
			for ($i = 0; $i < $len; $i++) {
				$genStr .= $chars[rand(0, strlen($chars) - 1)];
			}

			//Check if generated token exists
			$result = mysqli_query($db, "SELECT * FROM `users` WHERE `$uniqueField` = '$genStr'");
			if (mysqli_fetch_array($result) === NULL) {
				$exists = false;
			}
		}
	} else {
		//Generate a random string that does not have to be unique
		for ($i = 0; $i < $len; $i++) {
			$genStr .= $chars[rand(0, strlen($chars) - 1)];
		}
	}

	return $genStr;
}

if (!$userAuthenticated) {
	$userid = $_POST['userid'];
	$email = $_POST['email'];

	if (isset($userid) && is_numeric($userid) && isset($email)) {
		//TODO Check if account doesn't exist for UID or email
		$idResult = mysqli_query($db, "SELECT * FROM `users` WHERE `userid` = '" . sqlesc($userid) . "'");
		$emailResult = mysqli_query($db, "SELECT * FROM `users` WHERE `email` = '" . sqlesc(htmlspecialchars($email)) . "'");

		if (mysqli_fetch_row($idResult)) {
			//Account with UID exists, so alert user
			echo '<h1>Register Your Account</h1>';
			echo '<p>An account with this user ID already exists. Please try registering with a different Dropbox account.';
		} else if (mysqli_fetch_row($emailResult)) {
			//Account with UID exists, so alert user
			echo '<h1>Register Your Account</h1>';
			echo '<p>An account with this email already exists. Please try registering with a different Dropbox account.';
		} else {
			//Account does not yet exist, so check for errors
			$result = mysqli_query($db, "SELECT * FROM `users` WHERE `username` = '" . sqlesc(htmlspecialchars($_POST['username'])) . "'");

			if (!preg_match('/[A-Za-z\d]{' . strlen($_POST['username']) . '}/', $_POST['username'])) {
				//Username has special characters
				echo '<div class="toast error">Your username may only contain alphanumeric characters</div>';
				registerPanel($userid, $email, '');
			} else if (mysqli_fetch_row($result)) {
				//Username taken
				echo '<div class="toast error">That username is already taken.</div>';
				registerPanel($userid, $email, '');
			} else if ($_POST['password'] !== $_POST['passwordagain']) {
				//Passwords do not match
				echo '<div class="toast error">The passwords do not match</div>';
				registerPanel($userid, $email, $_POST['username']);
			} else if (strlen($_POST['password']) < 7) {
				//Password too short
				echo '<div class="toast error">Your password must be at least 7 characters</div>';
				registerPanel($userid, $email, $_POST['username']);
			} else {
				//Generate email verification code
				$verifyCode = genAlphaNum(60);

				//Generate unique token for auto login
				$userToken = genAlphaNum(10, 'ext_token');

				//Process remaining info
				$rawId = $userid;
				$userid = sqlesc($userid);
				$username = htmlspecialchars($_POST['username']);
				$password = sqlesc(password_hash($_POST['password'], PASSWORD_BCRYPT));
				$userToken = sqlesc($userToken);
				$email = htmlspecialchars($email);
				$create_time = sqlesc(time());
				$create_ip = sqlesc($_SERVER['REMOTE_ADDR']);
				$defaultUidOrigin = mysqli_fetch_assoc(mysqli_query($db, "SELECT * FROM `config` WHERE `setting` = 'default_uid_origin' LIMIT 1"))['val'];

				//Submit data to database
				mysqli_query($db, "INSERT INTO `users` (userid, uid_origin, username, password, email, verify_code, ext_token, create_time, create_ip) VALUES ('$userid', '$defaultUidOrigin', '" . sqlesc($username) . "', '$password', '" . sqlesc($email) . "', '" . sqlesc($verifyCode) . "', '$userToken', '$create_time', '$create_ip')");

				//Send verification email to user
				$verLink = $root . '/verify.php?user=' . $userid . '&authcode=' . $verifyCode . '&action=register';
				$cancelLink = $root . '/verify.php?user=' . $userid . '&authcode=' . $verifyCode . '&action=decline';

				$headers = "From: Forum Extender+ Messenger <noreply@techgeek01.com>\r\n";
				$headers .= "Reply-To: noreply@techgeek01.com\r\n";
				$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
				$headers .= "MIME-Version: 1.0\r\n";
				$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

				$message = "<html><head>\r\n";
				$message .= "<style>a,a:hover{color:#007ee5;text-decoration:none;font-weight:bold}\r\n";
				$message .= "blockquote{color:#aaa;border:1px solid #ddd;\r\n";
				$message .= "border-left:3px solid #007ee5;border-radius:1px 6px 6px 1px;\r\n";
				$message .= "margin:15px 50px;padding:15px 20px;font-size:12px}</style></head>\r\n";
				$message .= "<body style='background:#007ee5;margin:0;font-family:Arial,sans-serif;color:#444'>\r\n";
				$message .= "<div style='max-width:980px;margin:auto;padding:50px 30px'>\r\n";
				$message .= "<div style='background:#fff;border:1px solid #aaa;padding:30px 40px;box-shadow:0px 0px 10px 0px rgba(0,0,0,0.6);border-radius:5px'>\r\n";
				$message .= "<div style='font-size:48px;border-bottom:2px solid #ccc;''>Welcome, <span style='font-size:32px;color:#aaa'>" . $username . "!</span></div>\r\n";
				$message .= "<p>Thank you for registering for the Dropbox Forum Extender+ message system. In order to start using the system, you first need to verify your email. You may do so by clicking <a href='" . $verLink . "'>here</a>. If clicking the link above doesn't work, you can copy and paste the URL below.</p>\r\n";
				$message .= "<blockquote>" . $verLink . "</blockquote>\r\n";
				$message .= "<p>If you think you have received this message in error, you may click <a href='" . $cancelLink . "'>here</a> to cancel the registration. If the link doesn't work, you can copy and paste the link below.</p>\r\n";
				$message .= "<blockquote>" . $cancelLink . "</blockquote>\r\n";
				$message .= "</div></div></body></html>";

				$mailed = mail($email, 'New User Registration', $message, $headers);

				//Alert user of message
				echo '<h1>Register Your Account</h1>';

				if ($mailed == 1) {
					echo '<p>Your account has been created, and a verification email has been sent to the email associated with your Dropbox account. Please check your email and verify your account.</p>';
				} else {
					echo '<p>Your account has been created, But we were unable to successfully send the verification email. There may be a problem with your Dropbox email.</p>';
				}
			}
		}
	} else {
		//UID and/or email missing, so recollect data
		collectData();
	}
} else {
	//User is already logged in
	loggedInNotify();
}

require_once 'footer.php';
?>
