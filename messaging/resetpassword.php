<?php
$noRedirect = true;
require_once 'head_stub.php';

if ($userAuthenticated) {
	//If user authenticated, redirect back to the destination
	header('Location: ' . $root);
}

require_once 'header.php';

function showForm() {
	echo '<h1>Reset Your Password</h1>';
	echo '<form action="" method="post">';
	echo '<input type="password" name="newPass" placeholder="New Password" required /><br />';
	echo '<input type="password" name="newPassAgain" placeholder="New Password Again" required /><br />';
	echo '<button class="button blue" type="submit" name="action" value="confirmresetpass">Reset Password</button>';
	echo '</form>';
}

$user = $_GET['user'];
$user = isset($user) ? $user : $_POST['user'];
$authcode = $_GET['authcode'];
$authcode = isset($authcode) ? $authcode : $_POST['authcode'];

if ($action === 'confirmresetpass') {
	//Form submitted, so check for errors
	$pass = $_POST['newPass'];
	$passAgain = $_POST['newPassAgain'];

	if (!isset($pass) || !isset($passAgain)) {
		//Form not filled out
		echo '<div class="toast error">Please fill out the form</div>';
		showForm();
	} else if ($pass !== $passAgain) {
		//Passwords do not match
		echo '<div class="toast error">The two passwords do not match</div>';
		showForm();
	} else if (strlen($pass) < 7) {
		//Password too short
		echo '<div class="toast error">Your password must be at least 7 characters</div>';
		showForm();
	} else {
		//Everything's good, so set the password
		$password = sqlesc(password_hash($pass, PASSWORD_BCRYPT));
		$result = mysqli_query($db, "UPDATE `users` SET password = '$password' WHERE userid = '" . sqlesc($user) . "'");

		echo '<h1>Reset Your Password</h1>';
		echo '<p>Your password has been successfully changed. You may now log in.</p>';
	}
} else if (isset($user) && isset($authcode) && $user && strlen($authcode) === 60 && preg_match('/[A-Za-z\d]{60}/', $authcode)) {
	//Variables all exist, and match criteria
	$result = $result = mysqli_query($db, "SELECT * FROM `users` WHERE `userid` = '" . sqlesc($user) . "' AND `verify_code` = '" . sqlesc($authcode) . "' LIMIT 1");
	$row = mysqli_fetch_assoc($result);

	if ($row) {
		//TODO If user verified, show form
		showForm();
	} else {
		//Invalid verification
		echo '<p>The password reset link is formatted incorrectly. Please double check the URL for accuracy.</p>';
	}
} else {
	//URL has bad formatting
	echo '<p>The password reset link is formatted incorrectly. Please double check the URL for accuracy.</p>';
}

require_once 'footer.php';
?>
