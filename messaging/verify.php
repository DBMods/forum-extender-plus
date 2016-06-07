<?php
require_once 'header.php';

$user = $_GET['user'];
$authcode = $_GET['authcode'];
$action = $_GET['action'];

echo '<h1>Account Verification</h1>';

if (isset($user) && isset($authcode) && isset($action) && $user && strlen($authcode) === 60 && preg_match('/[A-Za-z\d]{60}/', $authcode) && ($action === 'register' || $action === 'decline')) {
	//Variables all exist, and match criteria
	$result = $result = mysqli_query($db, "SELECT * FROM `users` WHERE `userid` = '" . sqlesc($user) . "' AND `verify_code` = '" . sqlesc($authcode) . "' LIMIT 1");
	$row = mysqli_fetch_assoc($result);

	if ($row) {
		//TODO If user matches UID and authcode, check if verified
		if ($row['verified'] == 0) {
			//User not verified, so verify them and alert user
			mysqli_query($db, "UPDATE `users` SET verified = 1 WHERE userid = '" . sqlesc($user) . "' AND `verify_code` = '" . sqlesc($authcode) . "'");

			echo '<p>You\'re all set! Your email has been successfully verified, and you may now log in and use the system as normal';
		} else {
			//User already verified
			echo '<p>You\'re all set! Seems like you\'ve already been verified. You may now log in and use the system as normal.</p>';
		}
			//TODO If not verified, verify user
				//TODO Alert user
			//TODO Else user already verified
	} else {
		//Invalid verification
		echo '<p>The verification link provided does not correspond with any existing users. Please double check the URL for accuracy.</p>';
	}

		//TODO Else Invalid verification URL
} else {
	//URL has bad formatting
	echo '<p>The verification link is formatted incorrectly. Please double check the URL for accuracy.</p>';
}

require_once 'footer.php';
?>
