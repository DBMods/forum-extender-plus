<?php
$noRedirect = true;
require_once 'header.php';

$user = $_GET['user'];
$authcode = $_GET['authcode'];
$action = $_GET['action'];

echo '<h1>Verify New Email</h1>';

if (isset($action)) {
	//Check action
	if ($userAuthenticated && ($action === 'status' || $action === 'resend')) {
		if ($userVerified) {
			//User already verified
			echo '<p>Your account is already verified, so you\'re good to go!</p>';
		} else {
			if ($action === 'resend') {
				//User is resending email
				$result = mysqli_query($db, "SELECT email, userid, verify_code FROM users WHERE username = '" . sqlesc($username) . "'");
				$row = mysqli_fetch_assoc($result);

				if ($row) {
					//Send verification email to user
					$verLink = $root . '/confirmemail.php?user=' . $row['userid'] . '&authcode=' . $row['verify_code'] . '&action=confirm';
					$cancelLink = $root . '/confirmemail.php?user=' . $row['userid'] . '&authcode=' . $row['verify_code'] . '&action=decline';

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

					if ($mailed) {
						echo '<p>We\'ve sent a verification email to the address provided. Please check your email and click the link provided to verify your new email.</p>';
					} else {
						echo '<p>We were unable to successfully resend the email to the address provided.</p>';
					}
				}
			} else {
				//Alert user of previous email
				echo '<p>We\'ve sent a verification email to the address provided. Please check your email and click the link provided to verify your new email.</p>';
			}

			//If user is resending or just checking status, let them know we resent the email
			echo '<p><a class="button blue" href="' . $pageName . '?action=resend">Resend verification email</a></p>';
		}
	} else if (isset($user) && isset($authcode) && $user && strlen($authcode) === 60 && preg_match('/[A-Za-z\d]{60}/', $authcode) && ($action === 'confirm' || $action === 'decline')) {
		if ($action === 'confirm') {
			//Variables all exist, and match criteria
			$result = mysqli_query($db, "SELECT newEmail FROM users WHERE userid = '" . sqlesc($user) . "' AND verify_code = '" . sqlesc($authcode) . "' LIMIT 1");
			$row = mysqli_fetch_assoc($result);

			if ($row) {
				mysqli_query($db, "UPDATE users SET email = '" . sqlesc($row['newEmail']) . "' WHERE userid = '" . sqlesc($user) . "' AND verify_code = '" . sqlesc($authcode) . "'");
			} else {
				//Invalid verification
				echo '<p>The verification link provided does not correspond with any existing users. Please double check the URL for accuracy.</p>';
			}
		} else if ($action === 'decline') {
			//Variables all exist, and match criteria
			$result = mysqli_query($db, "SELECT * FROM users WHERE userid = '" . sqlesc($user) . "' AND verify_code = '" . sqlesc($authcode) . "' LIMIT 1");
			$row = mysqli_fetch_assoc($result);

			if ($row) {
				mysqli_query($db, "UPDATE users SET newEmail = '' WHERE userid = '" . sqlesc($user) . "' AND verify_code = '" . sqlesc($authcode) . "'");
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
