<?php
$result = mysql_query('INSERT INTO msglist VALUES("' . mysql_real_escape_string($_POST['msgto']) . '", "' . mysql_real_escape_string($_POST['for']) . '", "' . mysql_real_escape_string(htmlspecialchars($_POST['msgtext'])) . '")');
echo '<p>Message sent.<br><form method="post" action="messages.php"><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input type="hidden" name="for" value="' . $_POST['msgfrom'] . '" /><button type="submit">Back to messages</button></form></p>"';
?>