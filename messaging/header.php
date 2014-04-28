<?php
require 'db-login.php';

//Include functions
require 'functions.php';

//Set global variables
$pageName = substr($_SERVER['SCRIPT_NAME'], strrpos($_SERVER['SCRIPT_NAME'], '/') + 1);

//Sets local time display
if (is_numeric($_POST['timeOffset'])) {
	setcookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 * 24 * 30);
	$_COOKIE['timeoffset'] = $_POST['timeOffset'];
}

//Sets DB Forums page to return to
if ($_POST['returnto']) {
	setcookie('returnto', strip_tags($_POST['returnto']));
	$_COOKIE['returnto'] = strip_tags($_POST['returnto']);
}

//Sets cookies to blank on logoff
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
	if ($row && $_POST['action'] != "create-account")
		$userAuthenticated = true;
	else
		$badAuth = true;
}

//If userToken and userid is posted, check login
if ($_POST['userToken'] && $_POST['userid']) {
	$userToken = htmlspecialchars($_POST['userToken']);
	$userid = htmlspecialchars($_POST['userid']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);
	setcookie('userToken', $userToken, time() + 3600 * 24 * 30);
	$_COOKIE['userToken'] = $userToken;
	setcookie('userid', $userid, time() + 3600 * 24 * 30);
	$_COOKIE['userid'] = $userid;

	//This is how everything knows the user is authenticated
	if ($row)
		$userAuthenticated = true;
	else
		$badAuth = true;
}

//Check login
if ($_POST['username'] && $_POST['password'] && $_POST['action'] != "pass-token") {
	$result = mysqli_query($db, "SELECT password FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
	$passwordHash = mysqli_fetch_row($result);
	$passwordHash = $passwordHash['0'];

	//If the password is good, auth the user
	if (password_verify($_POST['password'], $passwordHash))
		$userAuthenticated = true;

	if ($userAuthenticated) {
		$result = mysqli_query($db, "SELECT ext_token FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
		$userToken = mysqli_fetch_row($result);
		$userToken = $userToken['0'];
		setcookie('userToken', $userToken, time() + 3600 * 24 * 30);
		$_COOKIE['userToken'] = $userToken;
		$result = mysqli_query($db, "SELECT userid FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
		$userid = mysqli_fetch_row($result);
		$userid = $userid['0'];
		setcookie('userid', $userid, time() + 3600 * 24 * 30);
		$_COOKIE['userid'] = $userid;
	} else
		$badAuth = true;
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