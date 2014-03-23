<?php
require 'db-login.php';
if (is_numeric($_POST['msgto'])) {
	$result = mysqli_query($db, 'INSERT INTO msglist VALUES("' . sqlesc($_POST['msgto']) . '", "' . sqlesc($_POST['msgfrom']) . '", "' . sqlesc($_POST['msgtext']) . '", "' . time() . '")');
	mysqli_close($db);
}
header('Location: ' . $_POST['returnto']);
?>