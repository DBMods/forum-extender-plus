<?php
$showinbox = false;
echo '<h2>Stats</h2>';
$result = mysqli_query($db, 'SHOW TABLE STATUS LIKE "msglist"');
$row = mysqli_fetch_assoc($result);
echo '<p class="topline"><br>';
echo '<div class="small-center"><div class="panel panel-primary"><div class="panel-heading"><h3>Messages sent</h3></div><div class="panel-body"><h2>' . ($row['Auto_increment'] - 1) . '</h2></div></div></div>';
echo '</p>';
?>
