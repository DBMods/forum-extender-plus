<?php
require 'db-login.php';
$msgto = $_POST['msgto'];
if ($msgto == "Andy Y.")
	$msgto = 1618104;
elseif ($msgto == "Chris J.")
	$msgto = 175532;
elseif ($msgto == "Mark Mc")
	$msgto = 30385;
elseif ($msgto == "Nathan C.")
	$msgto = 857279;
elseif ($msgto == "R.M.")
	$msgto = 643099;
elseif ($msgto == "thightower" || $msgto == "T. Hightower")
	$msgto = 222573;
if (is_numeric($msgto)) {
	$result = mysql_query('INSERT INTO msglist VALUES("' . mysql_real_escape_string($msgto) . '", "' . mysql_real_escape_string($_POST['msgfrom']) . '", "' . mysql_real_escape_string($_POST['msgtext']) . '", "' . time() . '")');
	mysql_close($db);
} else
	$msgto_error = 1;
header('Location: ' . $_POST['returnto']);
?>
