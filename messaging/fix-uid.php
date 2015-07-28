<?php
require 'header.php';

//Pass in new UID, token, username

$uid = $_POST['uid'];
$username = $_POST['username'];
$returnto = $_POST['returnto'];

$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND username = '" . sqlesc($username) . "') LIMIT 1");
$row = mysqli_fetch_array($result);

echo '<h2>User ID Update</h2>';
echo '<p class="topline">';

if ($row) {
	//If we've successfully authenticated the user, update the token
	$cfg = mysqli_fetch_array(mysqli_query($db, "SELECT * FROM `config` WHERE setting = 'default_uid_origin' LIMIT 1"));
	mysqli_query($db, "UPDATE users SET userid='" . sqlesc($uid) . "', uid_origin='" . $cfg['val'] . "' WHERE (ext_token = '" . sqlesc($userToken) . "' AND username = '" . sqlesc($username) . "') LIMIT 1");

	echo 'Success! Your user ID was updated successfully. You may now click <a href="' + $returnto + '">here</a> to return to the forums.';
} else {
	//Updating the UId failed, so alert the user
	echo 'We had some trouble updating your user ID. Sorry about that. Click <a href="' + $returnto + '">here</a> to return to the forums, and try again later. If the problem persists, click the link in the footer to report a problem.';
}

echo '</p>';

require 'footer.php';
?>
