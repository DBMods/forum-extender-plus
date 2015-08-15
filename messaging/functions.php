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
	echo $addAction ? ("<button name=\"action\" value=\"" . $addAction . "\" class=\"btn btn-success\">Sign in</button>") : ("<button class=\"btn btn-success\">Sign in</button>");
	echo '</div>';
	echo '</fieldset>';
	echo '</form>';
	if ($showOption == "showRegister")
		echo "<p>Not registered? <form method='post' action=''><button name='action' class='btn btn-success' value='register'>Sign up!</button></form></p>";
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
	echo '<li class="' . ((strpos($string, $pageName) !== false && $userAuthenticated && $showinbox) ? '' : 'in') . 'active">' . $string . '</li>';
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
	global $db, $username, $result, $archive, $count, $countBadge, $archCount, $archBadge;

	//Get lists
	$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($username) . "' AND `archived` = 0 ORDER BY `time` DESC");
	$archive = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($username) . "' AND `archived` = 1 ORDER BY `time` DESC");

	//Message counter navbar badges
	$count = mysqli_num_rows($result);
	$countBadge = $count > 0 ? (' <span class="badge">' . $count . '</span>') : '';
	$archCount = mysqli_num_rows($archive);
	$archBadge = $archCount > 0 ? (' <span class="badge">' . $archCount . '</span>') : '';
}

//Append message options
function msgOptions($row, $option = 'arch') {
	//Reply
	echo '<form method="post" action="compose.php" class="menu">';
	echo '<input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/>';
	echo '<input name="msgto" type="hidden" value="' . htmlspecialchars($row['from']) . '"/>';
	echo '<input name="subject" type="hidden" value="' . htmlspecialchars($row['subject']) . '"/>';
	echo '<input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/>';
	echo '<button type="submit" class="btn btn-success btn-sm" name="action" value="compose">Reply</button>';
	echo '</form>';

	//Forward and archive
	echo '<form method="post" action="" class="menu">';
	echo '<input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/>';
	echo '<input name="msgto" type="hidden" value="' . htmlspecialchars($row['from']) . '"/>';
	echo '<input name="subject" type="hidden" value="' . htmlspecialchars($row['subject']) . '"/>';
	echo '<input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/>';
	echo '<button type="submit" class="btn btn-warning btn-sm" name="action" value="forward">Forward</button>';
	echo '<button type="submit" class="btn btn-primary btn-sm" name="action" value="' . $option . '">' . ucfirst($option) . 'ive</button>';
	echo '</form>';

	//Delete
	echo '<a data-id="' . htmlspecialchars($row['id']) . '" class="open-alertDelete btn btn-danger btn-sm" href="#alertDelete">Delete</a>';
}
?>
