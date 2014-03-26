<?php
$result = mysqli_query($db, "DELETE FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `from` = '" . sqlesc($_POST['from']) . "' AND `time` = '" . sqlesc($_POST['time']) . "' AND `msg` = '" . sqlesc($_POST['msg']) . "'");
echo '<div class="alert-center"><div id="alert-fade" class="alert alert-warning"><p><strong>Message deleted.</strong></p></div></div>';
if ($_COOKIE['fromarch'])
	$action = 'showarch';
?>