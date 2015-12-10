<?php
require_once 'db-login.php';
require_once 'functions.php';

//Set global variables
$pageName = substr($_SERVER['PHP_SELF'], strpos($_SERVER['PHP_SELF'], 'dropboxextplus/') + 15);

//Sets local time display
if (is_numeric($_POST['timeOffset']))
	makeCookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 * 24 * 30);

//Sets DB Forums page to return to
if ($_POST['returnto'])
	makeCookie('returnto', strip_tags($_POST['returnto']));

//Delete cookies on logoff
if ($_POST['action'] == "logoff") {
	delCookie('userToken');
	delCookie('userid');
	$userLogoff = true;
}

//If userToken and userid are set from previous login, check auth
if ($_COOKIE['userToken'] && $_COOKIE['userid']) {
	$userToken = htmlspecialchars($_COOKIE['userToken']);
	$userid = htmlspecialchars($_COOKIE['userid']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	//If extension is trying to get a token, redirect to login - This is how everything knows the user is authenticated
	if ($row && $_POST['action'] != "create-account" && $_POST['action'] != "pass-token") {
		$userAuthenticated = true;
		$username = htmlspecialchars($row['username']);
	} else {
		$badCookie = true;
		$badAuth = true;
	}
}

//If userToken and userid are posted, check login - Used for auth from userscsript
if ($_POST['userToken'] && $_POST['userid']) {
	$userToken = htmlspecialchars($_POST['userToken']);
	$userid = htmlspecialchars($_POST['userid']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	//This is how everything knows the user is authenticated
	if ($row) {
		$userAuthenticated = true;

		$username = htmlspecialchars($row['username']);

		makeCookie('userToken', $userToken, time() + 3600 * 24 * 30);
		makeCookie('userid', $userid, time() + 3600 * 24 * 30);
	} else {
		$badAuth = true;
	}
}

//If login form submitted, check auth
if ($_POST['username'] && $_POST['password'] && $_POST['action'] != "pass-token") {
	//Query database for hash
	$result = mysqli_query($db, "SELECT password FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
	$passwordHash = mysqli_fetch_row($result);
	$passwordHash = $passwordHash['0'];

	//If the password is good, auth the user
	if (password_verify($_POST['password'], $passwordHash)) {
		$userAuthenticated = true;

		//Get token and UID
		$result = mysqli_query($db, "SELECT userid, ext_token FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
		$row = mysqli_fetch_assoc($result);

		makeCookie('userToken', $row['ext_token'], time() + 3600 * 24 * 30);
		makeCookie('userid', $row['userid'], time() + 3600 * 24 * 30);

		$username = htmlspecialchars($_POST['username']);
	} else {
		$badAuth = true;
	}
}

//Set variables
$userid = htmlspecialchars($_COOKIE['userid']);
$userToken = htmlspecialchars($_COOKIE['userToken']);
$timeoffset = htmlspecialchars($_COOKIE['timeoffset']);
$timeOffsetSeconds = $timeoffset * 60;
$returnto = (isset($_COOKIE['returnto']) ? $_COOKIE['returnto'] : 'https://www.dropboxforum.com');
$action = $_POST['action'];
$total;
$archTotal;

//Not used yet, but may be in future
$indirectcall = true;

if ($userAuthenticated) {
	$showinbox = true;
}
?>

<html>
	<head>
		<title>Forum Extender+ Messenger</title>
		<link rel='stylesheet' href='https://www.techgeek01.com/dropboxextplus/css/style.css' />
	</head>
	<body>
		<div id='toastArea'></div>
		<div id='wrapper'>
			<header id='head'>
				Dropbox Forum Extender+
				<div id='meta'>
					<div class='buttongroup'>
						<?php
						echo '<a class=\'button blue\' href=\'' . $returnto . '\'>Return to Forums</a>';

						if ($userAuthenticated) {
						?>
						<form class='inline' action='' method='post'>
							<button type='submit' class='button last' name='action' value='logoff'>Log out</button>
						</form>
						<?php } ?>
					</div>
				</div>
			</header>
			<header id='context'>
				<div class='title'>
					<a href='https://www.techgeek01.com/dropboxextplus'>Messenger</a>
				</div>
				<div class='tools'>
					<?php	if ($pageName == 'index.php' || $pageName == 'archive.php' || $pageName == 'sent.php') { ?>
					<a class='button padded grayed' href='javascript:void(0)'>Refresh</a>
					<?php
					}
					if ($pageName == 'index.php' || $pageName == 'archive.php' || $pageName == 'view.php') {
					?>
					<div id='messageActionButtons' class='buttongroup padded' <?php echo $pageName != 'view.php' ? 'style="display:none"' : ''; ?>>
						<?php if ($pageName != 'view.php') { ?>
						<form id='viewForm' class='inline' method='post' action='view.php'>
							<input type='hidden' name='msgid' value='' />
							<button id='viewBtn' class='button first' type='submit'>View</button>
						</form>
						<?php } ?>

						<form id='replyForm' class='inline' method='post' action='compose.php'>
							<input type='hidden' name='action' value='compose' />
							<input type='hidden' name='msgid' value='' />
							<input type='hidden' name='msgto' value='' />
							<input type='hidden' name='subject' value='' />
							<input type='hidden' name='context' value='' />
							<button id='repBtn' class='button<?php echo $pageName != 'view.php' ? '' : ' first'; ?>' type='submit'>Reply</button>
						</form>
						<form id='forwardForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='forward' />
							<input type='hidden' name='msgid' value='' />
							<input type='hidden' name='msgto' value='' />
							<input type='hidden' name='subject' value='' />
							<input type='hidden' name='context' value='' />
							<button id='fwdBtn' class='button' type='submit'>Forward</button>
						</form>
						<form id='archForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='' />
							<input type='hidden' name='msgid' value='' />
							<input type='hidden' name='msgto' value='' />
							<input type='hidden' name='subject' value='' />
							<input type='hidden' name='context' value='' />
							<button id='archBtn' class='button' type='submit'><?php echo ($pageName == 'index.php' ? 'A' : 'Una') . 'rchive'; ?></button>
						</form>
						<form id='readForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='markRead' />
							<input type='hidden' name='msgid' value='' />
							<button id='delBtn' class='button' type='submit'>Mark Read</button>
						</form>
						<form id='unreadForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='markUnread' />
							<input type='hidden' name='msgid' value='' />
							<button id='delBtn' class='button' type='submit'>Mark Unread</button>
						</form>
						<form id='delForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='delete' />
							<input type='hidden' name='msgid' value='' />
							<button id='delBtn' class='button danger last' type='submit'>Delete</button>
						</form>
					</div>
					<?php
					}
					if ($pageName == 'compose.php') {
					?>
					<form class='inline' action='compose.php' method='post'>
						<button type='submit' class='button' name='action' value='addressbook'>Address Book</button>
					</form>
					<?php } ?>
				</div>
				<div class='clearfix'></div>
			</header>
			<div id='container'>
				<div id='content'>
