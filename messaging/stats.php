<?php
$showinbox = false;
echo '<h2>Stats</h2>';
$result = mysqli_query($db, "SELECT * FROM msglist WHERE id = (SELECT MAX(id) FROM msglist)");
$row = mysqli_fetch_assoc($result);
echo '<p class="topline center"><br>';
echo 'Messages sent: ' . $row['id'];
echo '</p>';
?>