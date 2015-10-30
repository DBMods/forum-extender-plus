<?php
require_once 'db-login.php';
require_once 'functions.php';

//Set global variables
$pageName = substr($_SERVER['SCRIPT_NAME'], strrpos($_SERVER['SCRIPT_NAME'], '/') + 1);

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

//Not used yet, but may be in future
$indirectcall = true;

if ($userAuthenticated) {
	$showinbox = true;
}
?>

<html>
	<head>
		<title>Forum Extender+ Messenger</title>
		<link rel='stylesheet' href='css/style.css' />
	</head>
	<body>
		<div id='wrapper'>
			<header id='head'>
				Dropbox Forum Extender+
				<div id='meta'>
					<div class='buttongroup'>
						<?php
						echo '<a class=\'button blue\' href=\'' . $returnto . '\'>Return to Forums</a>';
						?>

						<a class='button' href='javascript:void(0)'>Log Out</a>
					</div>

					<?php
					if($userAuthenticated && false) {
						echo '<form style="display:inline" action="" method="post"><button type="submit" class="button" name="action" value="logoff">Log out Old</button></form>';
					}
					?>
				</div>
			</header>
			<header id='context'>
				<div class='title'>
					<a href='index.php'>Messenger</a>
				</div>
				<div class='tools'>
					<a class='button padded' href='javascript:void(0)'>Refresh</a>
					<?php	if ($pageName == 'index.php' || $pageName == 'archive.php') { ?>
					<div id='messageActionButtons' class='buttongroup padded' style='display:none'>
						<a id='repBtn' href='javascript:void(0)' class='button'>Reply</a>
						<a id='fwdBtn' href='javascript:void(0)' class='button'>Forward</a>
						<a id='archBtn' href='javascript:void(0)' class='button'><?php echo ($pageName == 'index.php' ? 'A' : 'Una') . 'rchive'; ?></a>
						<a id='delBtn' href='javascript:void(0)' class='button danger'>Delete</a>
					</div>
					<?php } ?>
					<div id='metaForms' style='display:none'>
						<form id='replyForm' method='post' action'compose.php'>
							<input name='action' value='compose' />
							<input name='msgid' value='' />
							<input name='msgto' value='' />
							<input name='subject' value='' />
							<input name='context' value='' />
						</form>
						<form id='archForm' method='post' action''>
							<input name='action' value='' />
							<input name='msgid' value='' />
							<input name='msgto' value='' />
							<input name='subject' value='' />
							<input name='context' value='' />
						</form>
						<form id='delForm' method='post' action''>
							<input name='action' value='delete' />
							<input name='msgid' value='' />
						</form>
					</div>
				</div>
				<div class='clearfix'></div>
			</header>
			<div id='container'>
				<div id='nav'>
					<a class='button wide blue' href='compose.php'>Compose</a><br>
					<?php
					getMessages();
					echo linkActivity('<a href="index.php">Inbox' . $countBadge . '</a>') . '<br>';
					echo linkActivity('<a href="sent.php">Sent</a>') . '<br>';
					echo linkActivity('<a href="archive.php">Archive' . $archBadge . '</a>') . '<br>';
					echo linkActivity('<a href="settings.php">Settings</a>') . '<br>';
					echo linkActivity('<a href="stats.php">Stats</a>');
					if ($username == 'TechGeek01' || $username == 'nathanc') {
						echo '<br>';
						echo linkActivity('<a href="admin.php">Admin</a>');
					}
					?>
				</div>
				<div id='content'>
