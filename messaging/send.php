<?php
require 'db-login.php';
require 'functions.php';

$senderror = '';
$dest = $_POST['msgto'];
if ($dest == 'Chris J.' || $dest == 'Chris J')
	$dest = '175532';
elseif ($dest == 'Mark Mc')
	$dest = '30385';
elseif ($dest == 'thightower' || $dest == 'T. Hightower' || $dest == 'T Hightower')
	$dest = '222573';
if (!is_numeric($dest)) {
	$result = mysqli_query($db, 'SELECT * FROM `users` WHERE `username` = "' . $dest . '"');
	$row = mysqli_fetch_assoc($result);
	$dest = $row['userid'];
}
if (is_numeric($dest) && $dest != 0) {
	mysqli_query($db, 'INSERT INTO msglist (`to`, `from`, `msg`, `time`) VALUES("' . sqlesc($dest) . '", "' . sqlesc($userid) . '", "' . sqlesc($_POST['msgtext']) . '", "' . time() . '")');
	echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message sent.</strong></p></div></div>';
} else
	$senderror = '<div class="alert-center"><div id="alert-fade" class="alert alert-danger"><p><strong>Invalid destination.</strong></p></div></div>';
?>