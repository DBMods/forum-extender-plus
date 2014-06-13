<?php
require 'db-login.php';
require 'functions.php';

//Set global variables
$pageName = substr($_SERVER['SCRIPT_NAME'], strrpos($_SERVER['SCRIPT_NAME'], '/') + 1);

//Sets local time display
if (is_numeric($_POST['timeOffset']))
	iCanHazCookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 * 24 * 30);

//Sets DB Forums page to return to
if ($_POST['returnto'])
	iCanHazCookie('returnto', strip_tags($_POST['returnto']));

//Delete cookies on logoff
if ($_POST['action'] == "logoff") {
	delCookie('userToken');
	delCookie('userid');
	$userLogoff = true;
}

//If userToken and userid are set, check login
if ($_COOKIE['userToken'] && $_COOKIE['userid']) {
	$userToken = htmlspecialchars($_COOKIE['userToken']);
	$userid = htmlspecialchars($_COOKIE['userid']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	//If extension is trying to get a token, redirect to login - This is how everything knows the user is authenticated
	if ($row && $_POST['action'] != "create-account") {
		$userAuthenticated = true;
	} else {
		$badCookie = true;
		$badAuth = true;
	}
}

//If userToken and userid is posted, check login
if ($_POST['userToken'] && $_POST['userid']) {
	$userToken = htmlspecialchars($_POST['userToken']);
	$userid = htmlspecialchars($_POST['userid']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	//This is how everything knows the user is authenticated
	if ($row) {
		$userAuthenticated = true;
		iCanHazCookie('userToken', $userToken, time() + 3600 * 24 * 30);
		iCanHazCookie('userid', $userid, time() + 3600 * 24 * 30);
	} else {
		$badAuth = true;
	}
}

//Check login
if ($_POST['username'] && $_POST['password'] && $_POST['action'] != "pass-token") {
	$result = mysqli_query($db, "SELECT password FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
	$passwordHash = mysqli_fetch_row($result);
	$passwordHash = $passwordHash['0'];

	//If the password is good, auth the user
	if (password_verify($_POST['password'], $passwordHash)) {
		$userAuthenticated = true;
	}

	if ($userAuthenticated) {
		$result = mysqli_query($db, "SELECT userid, ext_token FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
		$row = mysqli_fetch_assoc($result);
		$userToken = $row['ext_token'];
		iCanHazCookie('userToken', $userToken, time() + 3600 * 24 * 30);
		$userid = $row['userid'];
		iCanHazCookie('userid', $userid, time() + 3600 * 24 * 30);
	} else {
		$badAuth = true;
	}
}

//Set variables
$userid = htmlspecialchars($_COOKIE['userid']);
$userToken = htmlspecialchars($_COOKIE['userToken']);
$timeoffset = htmlspecialchars($_COOKIE['timeoffset']);
$timeOffsetSeconds = $timeoffset * 60;
$returnto = (isset($_COOKIE['returnto']) ? $_COOKIE['returnto'] : 'https://forums.dropbox.com');
$action = $_POST['action'];

//Not used yet, but may be in future
$indirectcall = true;

if ($userAuthenticated) {
	$showinbox = true;
}
?>
<html>
	<head>
		<title>Forum Extender+ Messages</title>
		<link rel='stylesheet' href='css/style.css' />
		<link rel="stylesheet" href="css/bootstrap.css" />
		<link rel="stylesheet" href="css/bootstrap-theme.css" />
	</head>
	<body>
		<div id="wrapper" class="container">
			<div class="jumbotron" id="main">
