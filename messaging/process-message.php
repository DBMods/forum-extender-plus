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
	$result = mysqli_query($db, 'INSERT INTO msglist VALUES("' . mysqli_real_escape_string($db, $msgto) . '", "' . mysqli_real_escape_string($db, $_POST['msgfrom']) . '", "' . mysqli_real_escape_string($db, $_POST['msgtext']) . '", "' . time() . '")');
	mysqli_close($db);
}
header('Location: ' . $_POST['returnto']);
?>