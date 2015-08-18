<?php
require_once 'db-login.php';
require_once 'functions.php';

if ($_GET['uid']) {
	$userid = htmlspecialchars($_GET['uid']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE `userid` = '" . sqlesc($userid) . "' LIMIT 1");
	$row = mysqli_fetch_array($result);

	if ($row) { //Alert to the script if user is registered or not
		echo 'Pass';
	} else {
		echo 'Fail';
	}
}
mysqli_close($db);
?>
