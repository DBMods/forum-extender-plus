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
	$result = mysqli_query($db, 'INSERT INTO msglist VALUES("' . mysqli_real_escape_string($db, $dest) . '", "' . mysqli_real_escape_string($db, $userid) . '", "' . mysqli_real_escape_string($db, $_POST['msgtext']) . '", "' . time() . '")');
	echo '<p>Message sent.</p>';
} else
	echo '<p>Sorry, invalid destination.<br><form class="menu" action="messages.php" method="post"><input name="action" type="hidden" value="compose" /><input name="to" type="hidden" value="' . $dest . '"/><br><input type="hidden" name="msgtext" value="' . htmlspecialchars($_POST['msgtext']) . '" /><br><button type="submit">Go Back</button></form></p>';
?>