<?php
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

//Get formatted date string
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
function signinPanel($showOption, $addAction) {
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
}

//Append a link to the navbar
function linkActivity($string) {
	global $pageName, $userAuthenticated, $showinbox;
	echo ((strpos($string, 'href=\'' . $pageName . '\'>') !== false || strpos($string, 'href="' . $pageName . '">') !== false) && $userAuthenticated && $showinbox) ? ('<a class=\'active\' ' . substr($string, 3)) : $string;
}

//Show delete confirmation modal
function deleteConfirm() {
	return;
	echo '<div class="modal fade in" id="alertDelete"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
	echo '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>';
	echo '<h3 class="modal-title">Are you sure?</h3>';
	echo '</div>';
	echo '<div class="modal-body">';
	echo '<h4>If you delete this message, it is gone forever!</h4>';
	echo '</div>';
	echo '<div class="modal-footer">';
	echo '<button class="button" data-dismiss="modal">Cancel</button>';
	echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" id="msgid" value="" /><button type="submit" class="button blue" name="action" value="delete">Delete</button></form>';
	echo '</div></div></div></div>';
}

//Gather messages in inbox
function getMessages() {
	global $db, $username, $result, $archive, $count, $countBadge, $archCount, $archBadge;

	//Get count lists
	$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($username) . "' AND `archived` = 0 AND `unread` = 1 ORDER BY `time` DESC");
	$archive = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($username) . "' AND `archived` = 1 AND `unread` = 1 ORDER BY `time` DESC");

	//Message counter navbar badges
	$count = mysqli_num_rows($result);
	//$countBadge = $count > 0 ? (' <span class="badge">' . $count . '</span>') : '';
	$countBadge = $count > 0 ? (' (' . $count . ')') : '';
	$archCount = mysqli_num_rows($archive);
	//$archBadge = $archCount > 0 ? (' <span class="badge">' . $archCount . '</span>') : '';
	$archBadge = $archCount > 0 ? (' (' . $archCount . ')') : '';
}
?>
