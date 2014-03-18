<?php
$result = mysql_query("DELETE FROM `msglist` WHERE `to` = '" . mysql_real_escape_string($userid) . "' AND `from` = '" . mysql_real_escape_string($_POST['from']) . "' AND `time` = '" . mysql_real_escape_string($_POST['time']) . "' AND `msg` = '" . mysql_real_escape_string($_POST['msg']) . "'");
echo '<p>Message deleted.</p>';
?>