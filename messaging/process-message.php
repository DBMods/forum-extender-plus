<?php
require 'db-login.php';
require 'functions.php';

$dest = $_POST['msgto'];
if ($_POST['userToken'] && $_POST['msgfrom']) {
	$userToken = htmlspecialchars($_POST['userToken']);
	$userid = htmlspecialchars($_POST['msgfrom']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	//This is how everything knows the user is authenticated
	if ($row){
		$userAuthenticated = true;
		iCanHazCookie('userToken', $userToken, time() + 3600 * 24 * 30);
		iCanHazCookie('userid', $userid, time() + 3600 * 24 * 30);
	}else{
		$badAuth = true;
	}
}
if ($userAuthenticated && is_numeric($dest) && $dest != 0) {
	mysqli_query($db, 'INSERT INTO msglist (`to`, `from`, `msg`, `time`) VALUES("' . sqlesc($dest) . '", "' . sqlesc($userid) . '", "' . sqlesc($_POST['msgtext']) . '", "' . time() . '")');
	mysqli_close($db);
}
header('Location: ' . $_POST['returnto']);
?>
