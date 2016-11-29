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

function loggedInNotify() {
	global $username;
	echo '<h1>Already logged in</h1>';
	echo '<p>You\'re already logged in as <strong>' . $username . '</strong>. If this isn\'t you, please log in with a different account.</p>';
}

//Generate a random alphanumeric string of specified length, either unique or not
function genAlphaNum($len, $uniqueField) {
	global $db;
	$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	$genStr = '';

	if (isset($uniqueField)) {
		//If we need a unique string, recreate one until it's unique
		$exists = true;

		while ($exists === true) {
			//Generate token
			$genStr = '';
			for ($i = 0; $i < $len; $i++) {
				$genStr .= $chars[rand(0, strlen($chars) - 1)];
			}

			//Check if generated token exists
			$result = mysqli_query($db, "SELECT * FROM `users` WHERE `$uniqueField` = '$genStr'");
			if (mysqli_fetch_array($result) === NULL) {
				$exists = false;
			}
		}
	} else {
		//Generate a random string that does not have to be unique
		for ($i = 0; $i < $len; $i++) {
			$genStr .= $chars[rand(0, strlen($chars) - 1)];
		}
	}

	return $genStr;
}

//Append a link to the navbar
function linkActivity($page, $singlePage, $text, $altCheck = false) {
	global $pageName, $userAuthenticated, $root;

	//Check URL of page to go to, and an optional alternate URL
	if ($singlePage) {
		//If page is a single page, check if the name matches exactly
		$endCondition = $pageName == $page || ($altCheck && $pageName == $altCheck);
	} else {
		//If page is not a single page (a directory), check if page name matches or starts with the check
		$endCondition = strpos($pageName, $page) !== false || ($altCheck && strpos($pageName, $altCheck) === 0);
	}

	return '<a' . (($endCondition && $userAuthenticated) ? ' class="active"' : '') . ' href="' . $root . '/' . $page . '">' . $text . '</a>';
}

//Gather messages in inbox
function getMessages() {
	global $db, $username, $count, $countBadge, $archCount, $archBadge;

	//Count messages in inbox and archive
	$count = mysqli_num_rows(mysqli_query($db, "SELECT * FROM msglist as m"
			. " LEFT JOIN users as tu on m.to = tu.id"
			. " WHERE tu.username = '" . sqlesc($username) . "' AND archived = 0 AND unread = 1"));
	$archCount = mysqli_num_rows(mysqli_query($db, "SELECT * FROM msglist as m"
			. " LEFT JOIN users as tu on m.to = tu.id"
			. " WHERE tu.username = '" . sqlesc($username) . "' AND archived = 1 AND unread = 1"));

	//Message counter navbar badges
	$countBadge = $count > 0 ? (' (' . $count . ')') : '';
	$archBadge = $archCount > 0 ? (' (' . $archCount . ')') : '';
}

//Set page variables
$root = null;
$pageName = null;

$domain = $_SERVER['SERVER_NAME'];
if (strpos($domain, 'techgeek01.com') !== false) {
	//Live domain, so check whether stable or beta
	if (strpos($_SERVER['PHP_SELF'], '/dropboxextplus/beta/') === false) {
		//Stable
		$root = 'https://www.techgeek01.com/dropboxextplus';
		$pageName = substr($_SERVER['PHP_SELF'], strpos($_SERVER['PHP_SELF'], '/dropboxextplus/') + 16);
	} else {
		//Beta
		$root = 'https://www.techgeek01.com/dropboxextplus/beta';
		$pageName = substr($_SERVER['PHP_SELF'], strpos($_SERVER['PHP_SELF'], '/dropboxextplus/beta/') + 21);
	}
} else if ($domain === 'localhost') {
	//Localhost testing
	$root = 'http://localhost/dropboxextplus';
	$pageName = substr($_SERVER['PHP_SELF'], strpos($_SERVER['PHP_SELF'], '/dropboxextplus/') + 16);
}

//Sets local time display
if (is_numeric($_POST['timeOffset'])) {
	makeCookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 * 24 * 30);
}

//Sets DB Forums page to return to
if ($_POST['returnto']) {
	makeCookie('returnto', strip_tags($_POST['returnto']));
}

//Delete cookies on logoff
if ($_POST['action'] === 'logoff') {
	delCookie('userToken');
	delCookie('userid');
	$toast = '<div class="toast success">Successfully logged out</div>';
}

$userIsAdmin = false;

//If userToken and userid are set from previous login, check auth
if ($_COOKIE['userToken'] && $_COOKIE['userid']) {
	$userToken = htmlspecialchars($_COOKIE['userToken']);
	$userId = htmlspecialchars($_COOKIE['userid']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userId) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	//If extension is trying to get a token, redirect to login - This is how everything knows the user is authenticated
	if ($row && $_POST['action'] != "create-account" && $_POST['action'] != "pass-token") {
		$userAuthenticated = true;
		$username = htmlspecialchars($row['username']);
		$userIsAdmin = $row['admin'] == 1;
	} else {
		//$badAuth used to detect proper auth when sign in has to be forced, since the user may already be logged in
		//In which case, $userAuthenticated will not work
		$badAuth = true;
	}
}

//If userToken and userid are posted, check login - Used for auth from userscsript
if ($_POST['userToken'] && $_POST['userid']) {
	$userToken = htmlspecialchars($_POST['userToken']);
	$userId = htmlspecialchars($_POST['userid']);
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userId) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	//This is how everything knows the user is authenticated
	if ($row) {
		$userAuthenticated = true;

		$username = htmlspecialchars($row['username']);
		$userIsAdmin = $row['admin'] == 1;

		makeCookie('userToken', $userToken, time() + 3600 * 24 * 30);
		makeCookie('userid', $userId, time() + 3600 * 24 * 30);
	} else {
		//$badAuth used to detect proper auth when sign in has to be forced, since the user may already be logged in
		//In which case, $userAuthenticated will not work
		$badAuth = true;
	}
}

//If login form submitted, check auth
if ($_POST['username'] && $_POST['password'] && $_POST['action'] != "pass-token") {
	//Check if "username" is a username or email
	$field = preg_match('/@/', $_POST['username']) ? 'email' : 'username';

	//Query database for hash
	$result = mysqli_query($db, "SELECT password FROM `users` WHERE " . $field . " = '" . sqlesc($_POST['username']) . "'");
	$passwordHash = mysqli_fetch_row($result);
	$passwordHash = $passwordHash['0'];

	//If the password is good, auth the user
	if (password_verify($_POST['password'], $passwordHash)) {
		$userAuthenticated = true;

		//Get token and UID
		$result = mysqli_query($db, "SELECT * FROM `users` WHERE " . $field . " = '" . sqlesc($_POST['username']) . "'");
		$row = mysqli_fetch_assoc($result);

		makeCookie('userToken', $row['ext_token'], time() + 3600 * 24 * 30);
		makeCookie('userid', $row['userid'], time() + 3600 * 24 * 30);

		$username = htmlspecialchars($row['username']);
		$userIsAdmin = $row['admin'] == 1;
	} else {
		//$badAuth used to detect proper auth when sign in has to be forced, since the user may already be logged in
		//In which case, $userAuthenticated will not work
		$badAuth = true;
	}
}

//Default $noRedirect if not set
//$noRedirect is used before the require to specify a disallow of a signin form redirect
$noRedirect = isset($noRedirect) ? $noRedirect : false;

//Set variables
$userVerified = mysqli_fetch_row(mysqli_query($db, "SELECT verified FROM `users` WHERE userid = '" . sqlesc($_COOKIE['userid']) . "'"))['0'] == 1;
$timeoffset = htmlspecialchars($_COOKIE['timeoffset']);
$timeOffsetSeconds = $timeoffset * 60;
$returnto = (isset($_COOKIE['returnto']) ? $_COOKIE['returnto'] : 'https://www.dropboxforum.com/hc/en-us');
$action = $_POST['action'];
?>
