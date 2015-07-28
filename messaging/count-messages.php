<?php
require 'db-login.php';
require 'functions.php';

//If userToken and userid is posted, check login
if ($_GET['to'] && $_GET['token']) {
	$userToken = htmlspecialchars($_GET['token']);
	$userid = htmlspecialchars($_GET['to']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	if ($row) {
		$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($row['username']) . "' AND `archived` = 0");
		$msgcount = mysqli_num_rows($result);
		echo $msgcount;
	} else {
		echo "Incorrect token";
	}
}
mysqli_close($db);
?>
