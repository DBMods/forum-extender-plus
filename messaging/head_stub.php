<?php
if (count(get_included_files()) == 1) {
	die('Insufficient permissions');
}

require_once 'db-login.php';

//Shorthand for mysqli_real_escape_string
function sqlesc($string) {
	global $db;
	return mysqli_real_escape_string($db, $string);
}

//Create and set a cookie
function makeCookie($name, $val, $exp = 0) {
	setcookie($name, $val, $exp);
	$_COOKIE[$name] = $val;
}

//Fully delete cookie
function delCookie($cookie) {
	if (isset($_COOKIE[$cookie])) {
		unset($_COOKIE[$cookie]);
		setcookie($cookie, '', time() - 3600);
	}
}

//Get formatted date string XXX Cleanup
function parseDate($time) {
	global $timeOffsetSeconds;

	if (daysInPast($time) == 0) {
		return 'Today, ' . gmdate('g:i A', $time);
	} else if (daysInPast($time) == 1) {
		return 'Yesterday, ' . gmdate('g:i A', $time);
	} else if (gmdate('Y', $time) == gmdate('Y', time() - $timeOffsetSeconds)) {
		return gmdate('M j, g:i A', $time);
	} else {
		return gmdate('M j, Y, g:i A', $time);
	}
}

//Calculate days in past for a given timestamp
function daysInPast($time) {
	global $timeOffsetSeconds;
	return unixtojd(time() - $timeOffsetSeconds) - unixtojd($time + $timeOffsetSeconds); //Adding the time offset negates subtraction in $time
}

//Show a sign in panel
/*function signinPanel($showOption, $addAction) {
	//$showOption can show the Register form or a login form to redirect back to the forums with msgtoken
	echo '<div class="small-center">';
	echo '<div class="panel panel-primary">';
	echo '<div class="panel-heading"><h3>Sign in</h3></div>';
	echo '<div class="panel-body">';
	echo '<form method="post" action="">';
	echo '<fieldset>';
	echo '<div class="form-group"><input id="username" name="username" type="text" placeholder="Username" class="form-control input-md" required="" /></div>';
	echo '<div class="form-group"><input id="password" name="password" type="password" placeholder="Password" class="form-control input-md" required="" /></div>';
	echo '<div class="form-group">';
	echo $addAction ? ("<button name=\"action\" value=\"" . $addAction . "\" class=\"button blue\">Sign in</button>") : ("<button class=\"button blue\">Sign in</button>");
	echo '</div>';
	echo '</fieldset>';
	echo '</form>';
	if ($showOption == "showRegister")
		echo "<p>Not registered? <form method='post' action=''><button name='action' class='button' value='register'>Sign up!</button></form></p>";
	if ($showOption == "showTokenRedir")
		echo "<p>Sign in to allow the extension to access your messaging account</p>";
	echo '</div>';
	echo '</div>';
	echo '</div>';
}
function badAuth() {
	echo "<div class='alert-center'><div id='alert-fade' class='alert alert-danger'><p><strong>Wrong username or password</strong></p></div></div>";
}*/

//Append a link to the navbar
function linkActivity($page, $singlePage, $text, $altCheck = false) {
	global $pageName, $userAuthenticated, $showinbox;

	//Check URL of page to go to, and an optional alternate URL
	if ($singlePage) {
		//If page is a single page, check if the name matches exactly
		$endCondition = $pageName == $page || ($altCheck && $pageName == $altCheck);
	} else {
		//If page is not a single page (a directory), check if page name matches or starts with the check
		$endCondition = strpos($pageName, $page) !== false || ($altCheck && strpos($pageName, $altCheck) === 0);
	}

	return '<a' . (($endCondition && $userAuthenticated) ? ' class="active"' : '') . ' href="' . $root . $page . '">' . $text . '</a>';
}

//Gather messages in inbox
function getMessages() {
	global $db, $username, $count, $countBadge, $archCount, $archBadge;

	//Count messages in inbox and archive
	$count = mysqli_num_rows(mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($username) . "' AND `archived` = 0 AND `unread` = 1 ORDER BY `time` DESC"));
	$archCount = mysqli_num_rows(mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($username) . "' AND `archived` = 1 AND `unread` = 1 ORDER BY `time` DESC"));

	//Message counter navbar badges
	$countBadge = $count > 0 ? (' (' . $count . ')') : '';
	$archBadge = $archCount > 0 ? (' (' . $archCount . ')') : '';
}

//Set global variables
$pageName = substr($_SERVER['PHP_SELF'], strpos($_SERVER['PHP_SELF'], 'dropboxextplus/new/') + 19);

//Sets local time display
if (is_numeric($_POST['timeOffset'])) {
	makeCookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 * 24 * 30);
}

//Sets DB Forums page to return to
if ($_POST['returnto']) {
	makeCookie('returnto', strip_tags($_POST['returnto']));
}

//Delete cookies on logoff
if ($_POST['action'] == 'logoff') {
	delCookie('userToken');
	delCookie('userid');
}

$userIsAdmin = false;

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
		$userIsAdmin = $row['admin'] == 1;
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
		$userIsAdmin = $row['admin'] == 1;

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
		$userIsAdmin = $row['admin'] == 1;
	} else {
		$badAuth = true;
	}
}

//Set variables
$root = 'https://www.techgeek01.com/dropboxextplus/new';
//$userid = htmlspecialchars($_COOKIE['userid']);
//$userToken = htmlspecialchars($_COOKIE['userToken']);
$timeoffset = htmlspecialchars($_COOKIE['timeoffset']);
$timeOffsetSeconds = $timeoffset * 60;
$returnto = (isset($_COOKIE['returnto']) ? $_COOKIE['returnto'] : 'https://www.dropboxforum.com');
//$action = $_POST['action'];
//$total;
//$archTotal;
?>
