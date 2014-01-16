<?php
require 'db-login.php';
$result = mysql_query('INSERT INTO msglist VALUES("' . mysql_real_escape_string($_POST['msgto']) . '", "' . mysql_real_escape_string($_POST['msgfrom']) . '", "' . mysql_real_escape_string(htmlspecialchars($_POST['msgtext'])) . '", "' . date('Y-m-d') . '")');
mysql_close($db);
header('Location: ' . $_POST['returnto']);
?>