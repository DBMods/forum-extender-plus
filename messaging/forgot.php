<?php
$noRedirect = true;
require_once 'header.php';

function showForm() {
	echo '<p>To reset your password, we can send a password reset email to the email address associated with your account. Please enter your username or email below.</p>';
	echo '<form action="" method="post">';
	echo '<input name="username" type="text" placeholder="Username or email" required /><br />';
	echo '<button class="button blue" type="submit" name="action" value="resetpassword">Reset Password</button>';
	echo '</form>';
}

echo '<h1>Forgot Your Password</h1>';

$user = $_POST['username'];

if ($action === 'resetpassword' && isset($user)) {
	//Info provided, check if "username" is a username or email
	$field = preg_match('/@/', $_POST['username']) ? 'email' : 'username';
	$result = mysqli_query($db, "SELECT email, userid, username FROM `users` WHERE " . $field . " = '" . sqlesc($_POST['username']) . "'");
	$row = mysqli_fetch_assoc($result);

	if ($row) {
		//User valid, send email
		$email = $row['email'];
		$userid = $row['userid'];
		$username = $row['username'];

		$verifyCode = genAlphaNum(60);

		mysqli_query($db, "UPDATE `users` SET verify_code = '" . sqlesc($verifyCode) . "' WHERE email = '$email'");

		$verLink = $root . '/resetpassword.php?user=' . $userid . '&authcode=' . $verifyCode;

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
		$message .= "<div style='font-size:48px;border-bottom:2px solid #ccc;''>Reset password, <span style='font-size:32px;color:#aaa'>" . $username . "!</span></div>\r\n";
		$message .= "<p>A password reset for your account has been requested. If you wish to reset your password, you may do so by clicking <a href='" . $verLink . "'>here</a>. If clicking the link above doesn't work, you can copy and paste the URL below.</p>\r\n";
		$message .= "<blockquote>" . $verLink . "</blockquote>\r\n";
		$message .= "<p>If you did not request to reset your password, or do not wish to reset it at this time, you may simply ignore this email.</p>\r\n";
		$message .= "</div></div></body></html>";

		$mailed = mail($email, 'Password Reset Request', $message, $headers);

		if ($mailed == 1) {
			echo '<p>An email with a link to reset your password has been sent to the email address associated with your Dropbox account. Please check your email to reset your password.</p>';
		} else {
			echo '<p>We were unable to successfully send the verification email. There may be a problem with your Dropbox email.</p>';
		}
	}
} else {
	//Show form
	showForm();
}

require_once 'footer.php';
?>
