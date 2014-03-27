<?php
$showinbox = false;
echo '<h2>Stats</h2>';
$result = mysqli_query($db, "SELECT * FROM msglist WHERE id = (SELECT MAX(id) FROM msglist)");
$row = mysqli_fetch_assoc($result);
echo '<div class="topline center">';
echo '<p>Messages sent: ' . $row['id'] . '</p>';
echo '</div>';
?>