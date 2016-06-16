<?php
$noRedirect = true;
require_once 'header.php';

$user = $_GET['user'];
$authcode = $_GET['authcode'];
$action = $_GET['action'];

echo '<h1>Account Verification</h1>';

if (isset($action)) {
	//Check action
	if ($userAuthenticated && ($action === 'status' || $action === 'resend')) {
		if ($userVerified) {
			//User already verified
			echo '<p>Your account is already verified, so you\'re good to go!</p>';
		} else {
			if ($action === 'resend') {
				//User is resending email
				$result = mysqli_query($db, "SELECT email, userid, verify_code FROM `users` WHERE username = '" . sqlesc($username) . "'");
				$row = mysqli_fetch_assoc($result);

				if ($row) {
					//Send verification email to user
					$verLink = $root . '/verify.php?user=' . $row['userid'] . '&authcode=' . $row['verify_code'] . '&action=register';
					$cancelLink = $root . '/verify.php?user=' . $row['userid'] . '&authcode=' . $row['verify_code'] . '&action=decline';

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

					if ($mailed) {
						echo '<p>We\'ve sent a verification email to the address provided. Please check your email and click the link provided to verify your account.</p>';
					} else {
						echo '<p>We were unable to successfully resend the verification email to the address provided.</p>';
					}
				}
			} else {
				//Alert user of previous email
				echo '<p>We\'ve sent a verification email to the address provided. Please check your email and click the link provided to verify your account.</p>';
			}

			//If user is resending or just checking status, let them know we resent the email
			echo '<p><a class="button blue" href="' . $pageName . '?action=resend">Resend verification email</a></p>';
		}
	} else if (isset($user) && isset($authcode) && $user && strlen($authcode) === 60 && preg_match('/[A-Za-z\d]{60}/', $authcode) && ($action === 'register' || $action === 'decline')) {
		if ($action === 'register') {
			//Variables all exist, and match criteria
			$result = $result = mysqli_query($db, "SELECT verified FROM `users` WHERE `userid` = '" . sqlesc($user) . "' AND `verify_code` = '" . sqlesc($authcode) . "' LIMIT 1");
			$row = mysqli_fetch_assoc($result);

			if ($row) {
				//If user matches UID and authcode, check if verified
				if ($row['verified'] == 0) {
					//User not verified, so verify them and alert user
					mysqli_query($db, "UPDATE `users` SET verified = 1 WHERE userid = '" . sqlesc($user) . "' AND `verify_code` = '" . sqlesc($authcode) . "'");

					$userVerified = true;
					echo '<p>You\'re all set! Your email has been successfully verified, and you may now log in and use the system as normal';
				} else {
					//User already verified
					echo '<p>Seems like you\'ve already been verified. You may now log in and use the system as normal.</p>';
				}
			} else {
				//Invalid verification
				echo '<p>The verification link provided does not correspond with any existing users. Please double check the URL for accuracy.</p>';
			}
		}
	} else {
		//URL has bad formatting
		echo '<p>The verification link is formatted incorrectly. Please double check the URL for accuracy.</p>';
	}
} else {
	//URL has bad formatting
	echo '<p>The verification link is formatted incorrectly. Please double check the URL for accuracy.</p>';
}

require_once 'footer.php';
?>
