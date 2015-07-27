<?php
//Shorthand for mysqli_real_escape_string
function sqlesc($string) {
	global $db;
	return mysqli_real_escape_string($db, $string);
}

//Create and set a cookie
function iCanHazCookie($name, $val, $exp = 0) {
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
	global $db, $userid, $result, $archive, $count, $countBadge, $archCount, $archBadge;

	//Get lists
	$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 0 ORDER BY `time` DESC");
	$archive = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 1 ORDER BY `time` DESC");

	//Message counter navbar badges
	$count = mysqli_num_rows($result);
	$countBadge = $count > 0 ? (' <span class="badge">' . $count . '</span>') : '';
	$archCount = mysqli_num_rows($archive);
	$archBadge = $archCount > 0 ? (' <span class="badge">' . $archCount . '</span>') : '';
}

//Turn UID into username
function idToName($usernum) {
	global $db;
	$result = mysqli_query($db, "SELECT username FROM `users` WHERE `userid` = '" . sqlesc($usernum) . "' LIMIT 1");
	$row = mysqli_fetch_array($result);
	return $row[0];
}

function getUsername() {
	global $db, $userid;
	return idToName($userid);
}

//Append message options
function msgOptions($row, $option = 'arch') {
	echo '<form method="post" action="compose.php" class="menu"><input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/><input name="msgto" type="hidden" value="' . idToName(htmlspecialchars($row['from'])) . '"/><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><button type="submit" class="btn btn-success btn-sm" name="action" value="compose">Reply</button></form>';
	echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/><input name="msgto" type="hidden" value="' . idToName(htmlspecialchars($row['from'])) . '"/><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><button type="submit" class="btn btn-warning btn-sm" name="action" value="forward">Forward</button><button type="submit" class="btn btn-primary btn-sm" name="action" value="' . $option . '">' . ucfirst($option) . 'ive</button></form>';
	echo '<a data-id="' . htmlspecialchars($row['id']) . '" class="open-alertDelete btn btn-danger btn-sm" href="#alertDelete">Delete</a>';
}
?>