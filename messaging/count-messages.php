<?php
require 'db-login.php';
$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . $_GET['to'] . "'");
echo mysqli_num_rows($result);
mysqli_close($db);
?>