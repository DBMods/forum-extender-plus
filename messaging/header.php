<?php
require 'db-login.php';

//Shorthand for mysqli_real_escape_string
function sqlesc($string) {
	global $db;
	return mysqli_real_escape_string($db, $string);
}

//Append secondary nav form to page
function navform() {
	echo '<form action="" method="post" class="menu"><button type="submit" class="btn btn-success" name="action" value="compose">Compose</button></form>';
}

//Fully delete cookie
function delCookie($cookie) {
	if (isset($_COOKIE[$cookie])) {
		unset($_COOKIE[$cookie]);
		setcookie($cookie, '', time() - 3600);
	}
}

//Show delete confirmation modal
function deleteConfirm() {
	echo '<div class="modal fade in" id="alertDelete"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
	echo '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>';
	echo '<h3 class="modal-title">Are you sure?</h3>';
	echo '</div>';
	echo '<div class="modal-body">';
	echo '<h4>If you delete this message, it is gone forever!</h4>';
	echo '</div>';
	echo '<div class="modal-footer">';
	echo '<button class="btn btn-default" data-dismiss="modal">Cancel</button>';
	echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" id="msgid" value="" /><button type="submit" class="btn btn-danger" name="action" value="delete">Delete</button></form>';
	echo '</div></div></div></div>';
}

//Gather messages in inbox
function getMessages() {
	global $db, $userid, $result, $archive, $count, $countBadge, $archCount, $archBadge;

	//Get lists
	$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 0 ORDER BY `time` DESC");
	$archive = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 1 ORDER BY `time` DESC");

	//Message counter navbar badges
	$count = mysqli_num_rows($result);
	$countBadge = ($count > 0 ? (' <span class="badge">' . $count . '</span>') : '');
	$archCount = mysqli_num_rows($archive);
	$archBadge = ($archCount > 0 ? (' <span class="badge">' . $archCount . '</span>') : '');
}

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
	setcookie('userToken', "");
	setcookie('userid', "");
	$_COOKIE['userToken'] = "";
	$_COOKIE['userid'] = "";
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
$indirectcall = true;

if ($userAuthenticated) {
	$showinbox = true;
	if ($action == 'register' || $action == 'sign-in' && $userid) {
		$page = $action;
		setcookie('page', $page);
		$_COOKIE['page'] = $page;
	}
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
