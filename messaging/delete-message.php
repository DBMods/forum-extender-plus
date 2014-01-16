<?php
$result = mysql_query("DELETE FROM `msglist` WHERE `to` = '" . mysql_real_escape_string($_POST['for']) . "' AND `from` = '" . mysql_real_escape_string($_POST['from']) . "' AND `msg` = '" . mysql_real_escape_string(htmlspecialchars($_POST['msg'])) . "'");
echo '<p>Message deleted.</p>';
?>