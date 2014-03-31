<?php
$showinbox = false;
echo '<h2>Stats</h2>';
$result = mysqli_query($db, 'SHOW TABLE STATUS LIKE "msglist"');
$row = mysqli_fetch_assoc($result);
echo '<p class="topline"><br>';
echo 'Messages sent: ' . ($row['Auto_increment'] - 1);
echo '</p>';
?>