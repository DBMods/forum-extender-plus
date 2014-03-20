<?php
require 'db-login.php';
$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . $_GET['to'] . "'");
$count = 0;
while ($row = mysqli_fetch_assoc($result)) {
	$count = $count + 1;
}
echo $count;
mysqli_close($db);
?>