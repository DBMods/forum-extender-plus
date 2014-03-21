<?php
echo '<h2>Compose</h2>';
echo '<div class="topline">';
echo '<form action="messages.php" method="post"><input name="action" type="hidden" value="addressbook" /><br><button type="submit" class="btn btn-primary">View Address Book</button></form>';
if ($_POST['context'])
	echo '<p>' . htmlspecialchars($_POST['context']) . '</p>';
echo '<form action="messages.php" method="post"><input name="action" type="hidden" value="send"/><input name="msgto" type="textbox" style="width:100%" class="form-control" placeholder="Recipient*" value="' . htmlspecialchars($_POST['to']) . '" required=""/><br><textarea name="msgtext" placeholder="Message*" rows="9" style="width:100%" class="form-control" required="">' . htmlspecialchars($_POST['msgtext']) . '</textarea><br><div style="height:30px;margin-top:-20px;"><button type="submit" class="btn btn-success btn-left">Send</button></form>';
echo '<form action="messages.php" method="post"><button type="submit" class="btn btn-danger btn-right" style="margin-right:0px">Cancel</button></form></div>';
echo '</div>';
?>
