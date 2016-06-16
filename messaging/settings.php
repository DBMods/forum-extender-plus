<?php
require_once 'header.php';

if ($userAuthenticated) {
	//Grab user email for displaying form data
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE username = '" . sqlesc($username) . "'");
	$row = mysqli_fetch_array($result);

	$userEmail = $row['email'];
	$dispName = $row['name'];
	$newEmail = $row['newEmail'];

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
	} else if ($action === 'changesettings') {
		$dispName = sqlesc($_POST['dispName']);
		$email = htmlspecialchars($_POST['email']);

		if ($userVerified && sqlesc($email) !== $userEmail) {
			//User has changed email, so we need to confirm it
			mysqli_query($db, "UPDATE `users` SET newEmail = '$email' WHERE username = '" . sqlesc($username) . "'");

			$verifyCode = genAlphaNum(60);

			$confirmLink = $root . '/changeemail.php?user=' . $userid . '&authcode=' . $verifyCode . '&action=confirm';
			$denyLink = $root . '/changeemail.php?user=' . $userid . '&authcode=' . $verifyCode . '&action=decline';

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
			$message .= "<div style='font-size:48px;border-bottom:2px solid #ccc;''>Confirm email, <span style='font-size:32px;color:#aaa'>" . $username . "!</span></div>\r\n";
			$message .= "<p>Your email address has been updated, but needs to be confirmed. If this is your desired email account, you may confirm the change by clicking <a href='" . $confirmLink . "'>here</a>. If clicking the link above doesn't work, you can copy and paste the URL below.</p>\r\n";
			$message .= "<blockquote>" . $confirmLink . "</blockquote>\r\n";
			$message .= "<p>If you did not request to change your email, or do not wish to change it at this time, you may deny the request by clicking <a href='" . $denyLink . "'>here</a>. If clicking the link above doesn't work, you can copy and paste the URL below.</p>\r\n";
			$message .= "<blockquote>" . $denyLink . "</blockquote>\r\n";
			$message .= "</div></div></body></html>";

			$mailed = mail($email, 'Confirm Email Change', $message, $headers);

			//Alert user
			if ($mailed) {
				echo '<div class="toast warning">Your email address has been changed, but needs to be confirmed first. Check your email for further intructions.</div>';
			} else {
				echo '<div class="toast error">We were unable to send a verification email to your desired email address</div>';
			}
		}

		//Update settings and alert user
		mysqli_query($db, "UPDATE `users` SET name = '$dispName' WHERE username = '" . sqlesc($username) . "'");
		echo '<div class="toast success">Your settings have been saved</div>';
	}

	//Add email verification notice
	//Variable set before email changed in database, so notice only shows on next page load
	if ($newEmail != '') {
		echo '<div class="toast info">Your new email has not yet been confirmed. Check the status of verification <a href="confirmemail.php?action=status">here</a>.</div>';
	}

	echo '<div class="floatbox">';
	echo '<div class="small">';
	echo '<h1>Settings</h1>';
	echo '<form action="" method="post">';
	echo '<strong>Username:</strong> ' . $username . '<br />';
	echo '<input type="text" name="dispName" placeholder="Display Name" value="' . $dispName . '" /><br />';
	echo '<input type="text" name="email" placeholder="Email" value="' . $userEmail . '" ' . ($userVerified ? '' : 'readonly ') . 'required /><br />';
	echo '<button class="button blue" type="submit" name="action" value="changesettings">Submit</button>';
	echo '</form>';
	echo '</div><div class="large">';
	echo '<h1>Change Password</h1>';
	echo '<form action="" method="post">';
	echo '<input type="password" name="curPass" placeholder="Current Password" required /><br />';
	echo '<input type="password" name="newPass" placeholder="New Password" required /><br />';
	echo '<input type="password" name="newPassAgain" placeholder="New Password Again" required /><br />';
	echo '<button class="button blue" type="submit" name="action" value="changePass">Change password</button>';
	echo '</form>';
	echo '</div>';
	echo '</div>';
}

require_once 'footer.php';
?>
