<?php
$dest = $_POST['msgto'];
if ($dest == "Andy Y.") {
	$dest = '1618104';
} elseif ($dest == "Chris J.") {
	$dest = '175532';
} elseif ($dest == "Mark Mc") {
	$dest = '30385';
} elseif ($dest == "Nathan C.") {
	$dest = '857279';
} elseif ($dest == "R.M.") {
	$dest = '643099';
} elseif ($dest == "thightower" || $dest == "T. Hightower") {
	$dest = '222573';
}
if (preg_replace('/[\D]/', '', $dest) == $dest && $dest != '') {
	$result = mysql_query('INSERT INTO msglist VALUES("' . mysql_real_escape_string($dest) . '", "' . mysql_real_escape_string($_POST['for']) . '", "' . mysql_real_escape_string($_POST['msgtext']) . '", "' . time() . '")');
	//$dest = $_POST['msgto'];
	if ($msgto_error !== 1) {
		$result = mysql_query('INSERT INTO msglist VALUES("' . mysql_real_escape_string($msgto) . '", "' . mysql_real_escape_string($_POST['for']) . '", "' . mysql_real_escape_string($_POST['msgtext']) . '", "' . time() . '")');
		echo '<p>Message sent.</p>';
	} else
		echo '<p>Sorry, invalid destination.<br><form class="menu" action="messages.php" method="post"><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input type="hidden" name="timeOffset" value="' . $_POST['timeOffset'] . '" /><input name="action" type="hidden" value="compose" /><input name="to" type="hidden" value="' . $dest . '"/><br><input name="from" type="hidden" value = "' . $_POST['for'] . '"/><input type="hidden" name="msgtext" value="' . $_POST['msgtext'] . '" /><br><button type="submit">Go Back</button></form></p>';
}
?>
