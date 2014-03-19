<?php
echo '<p><form action="messages.php" method="post"><input type="hidden" name="returnto" value="' . strip_tags($_POST['returnto']) . '" /><button type="submit">Cancel</button></form></p>';
echo '<div class="topline">';
echo '<form action="messages.php" method="post"><input type="hidden" name="returnto" value="' . strip_tags($_POST['returnto']) . '" /><input name="action" type="hidden" value="addressbook" /><br><button type="submit">View Address Book</button></form>';
if ($_POST['context'])
	echo '<p>' . htmlspecialchars($_POST['context']) . '</p>';
echo '<p><form action="messages.php" method="post"><input type="hidden" name="returnto" value="' . strip_tags($_POST['returnto']) . '" /><input name="action" type="hidden" value="send" /><input name="msgto" type="textbox" style="width:100%" placeholder="Recipient" value="' . htmlspecialchars($_POST['to']) . '"/><br><textarea name="msgtext" placeholder="Message" rows="9" style="width:100%">' . htmlspecialchars($_POST['msgtext']) . '</textarea><br><button type="submit">Send</button></form></p>';
echo '</div>';
?>
