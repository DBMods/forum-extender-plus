<?php
$senderror = '';
if ($action == 'send') {
	$dest = $_POST['msgto'];
	if ($dest == 'Andy Y.' || $dest == 'Andy Y')
		$dest = '1618104';
	elseif ($dest == 'Chris J.' || $dest == 'Chris J')
		$dest = '175532';
	elseif ($dest == 'Mark Mc')
		$dest = '30385';
	elseif ($dest == 'Nathan C.' || $dest == 'Nathan C')
		$dest = '857279';
	elseif ($dest == 'R.M.' || $dest == 'RM' || $dest == 'R.M')
		$dest = '643099';
	elseif ($dest == 'thightower' || $dest == 'T. Hightower' || $dest == 'T Hightower')
		$dest = '222573';
	if (is_numeric($dest) && $dest != 0) {
		mysqli_query($db, 'INSERT INTO msglist (`to`, `from`, `msg`, `time`) VALUES("' . sqlesc($dest) . '", "' . sqlesc($userid) . '", "' . sqlesc($_POST['msgtext']) . '", "' . time() . '")');
		echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message sent.</strong></p></div></div>';
	} else
		$senderror = '<div class="alert-center"><div id="alert-fade" class="alert alert-danger"><p><strong>Invalid destination.</strong></p></div></div>';
}
if ($action == 'compose' || $senderror) {
	$showinbox = false;
	echo $senderror;
	echo '<h2>Compose</h2>';
	echo '<div class="topline">';
	echo '<br><form action="" method="post"><button type="submit" class="btn btn-primary" name="action" value="addressbook">View Address Book</button></form>';
	if ($_POST['context'])
		echo '<p>' . nl2br(htmlspecialchars($_POST['context'])) . '</p>';
	echo '<form id="messageform" action="" method="post"><input id="msgto" name="msgto" type="textbox" style="width:100%" class="form-control" placeholder="Recipient*" value="' . htmlspecialchars($_POST['msgto']) . '" required=""/><br><textarea name="msgtext" placeholder="Message*" rows="9" style="width:100%" class="form-control" required="">' . htmlspecialchars($_POST['msgtext']) . '</textarea><br><div style="height:30px;margin-top:-20px;"><button type="submit" class="btn btn-success btn-left" name="action" value="send">Send</button></form>';
	echo '<form action="" method="post"><button type="submit" class="btn btn-danger btn-right" style="margin-right:0px">Cancel</button></form></div>';
	echo '</div>';
}
?>