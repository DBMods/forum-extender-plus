<?php
echo '<p><form action="messages.php" method="post"><input type="hidden" name="timeOffset" value="' . $_POST['timeOffset'] . '" /><input type="hidden" name="for" value="' . $_POST['from'] . '" /><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><button type="submit">Cancel</button></form></p>';
echo '<div class="topline">';
echo '<p>' . htmlspecialchars_decode($_POST['context']) . '</p>';
echo '<p><form action="messages.php" method="post"><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '" /><input type="hidden" name="timeOffset" value="' . $_POST['timeOffset'] . '" /><input name="action" type="hidden" value="send" /><input name="msgto" type="textbox" style="width:100%" placeholder="Recipient" value="' . $_POST['to'] . '"/><br><input name="for" type="hidden" value = "' . $_POST['from'] . '"/><textarea name="msgtext" placeholder="Message" style="width:100%"></textarea><br><button type="submit">Send</button></form></p>';
echo '</div>';
?>