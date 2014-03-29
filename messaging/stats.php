<?php
$showinbox = false;
echo '<h2>Stats</h2>';
$result = mysqli_query($db, 'SELECT * FROM msgcount WHERE count = (SELECT MAX(count) FROM msgcount)');
$row = mysqli_fetch_assoc($result);
echo '<p class="topline"><br>';
echo 'Messages sent: ' . $row['count'];
echo '</p>';
?>