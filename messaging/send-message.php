<?php
$dest = $_POST['msgto'];
if ($dest == "Andy Y.")
	$dest = '1618104';
elseif ($dest == "Chris J.")
	$dest = '175532';
elseif ($dest == "Mark Mc")
	$dest = '30385';
elseif ($dest == "Nathan C.")
	$dest = '857279';
elseif ($dest == "R.M.")
	$dest = '643099';
elseif ($dest == "thightower" || $dest == "T. Hightower")
	$dest = '222573';
if (is_numeric($dest) && $dest != 0) {
	$result = mysqli_query($db, 'INSERT INTO msglist VALUES("' . sqlesc($dest) . '", "' . sqlesc($userid) . '", "' . sqlesc($_POST['msgtext']) . '", "' . time() . '")');
	echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message sent.</strong></p></div></div>';
} else
	echo '<div class="alert-center"><div class="alert alert-danger"><p><strong>Sorry, invalid destination.</strong><form action="messages.php" method="post"><input name="action" type="hidden" value="compose" /><input name="to" type="hidden" value="' . $dest . '"/><input type="hidden" name="msgtext" value="' . htmlspecialchars($_POST['msgtext']) . '" /><button type="submit" class="btn btn-primary">Go Back</button></form></p></div></div>';
?>