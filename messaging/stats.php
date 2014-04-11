<?php
$showinbox = false;
echo '<h2>Stats</h2>';
$result = mysqli_query($db, 'SHOW TABLE STATUS LIKE "msglist"');
$row = mysqli_fetch_assoc($result);
$msgcount = $row['Auto_increment'] - 1;
echo '<p class="topline"><br>';
echo '<div class="small-center"><div class="panel panel-primary"><div class="panel-heading"><h3>Messages sent</h3></div><div class="panel-body stat-panel"><div class="stat-content" id="msg-count-text"><h2>' . $msgcount . '</h2></div><input id="msg-count" style="display:none" /></div></div></div>';
echo '</p>';
?>
