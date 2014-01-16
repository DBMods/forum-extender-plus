<?php
$result = mysql_query('INSERT INTO msglist VALUES("' . mysql_real_escape_string($_POST['msgto']) . '", "' . mysql_real_escape_string($_POST['for']) . '", "' . mysql_real_escape_string(htmlspecialchars($_POST['msgtext'])) . '", "' . date('Y-m-d') . '")');
echo '<p>Message sent.</p>';
?>