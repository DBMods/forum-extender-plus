<?php
$result = mysqli_query($db, "UPDATE `msglist` SET `archived` = 1 WHERE `to` = '" . sqlesc($userid) . "' AND `from` = '" . sqlesc($_POST['from']) . "' AND `time` = '" . sqlesc($_POST['time']) . "' AND `msg` = '" . sqlesc($_POST['msg']) . "' AND `archived` = 0");
echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message archived.</strong></p></div></div>';
?>