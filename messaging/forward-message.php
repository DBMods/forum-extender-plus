<?php
$senderror = '';
if ($action == 'sendfwd') {
	$dest = $_POST['fwdto'];
	if (!is_numeric($dest)) {
		//If destination is not a numerical ID, check if the user exists
		$result = mysqli_query($db, 'SELECT * FROM `users` WHERE `username` = "' . $dest . '"');
		$row = mysqli_fetch_assoc($result);
		if ($row) {
			mysqli_query($db, 'INSERT INTO msglist (`to`, `from`, `subject`, `msg`, `forward`, `time`) VALUES("' . sqlesc($dest) . '", "' . sqlesc($username) . '", "' . sqlesc($_POST['subject']) . '", "' . sqlesc($_POST['context']) . '", "' . sqlesc($_POST['fwdfrom']) . '", "' . time() . '")');
			echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message sent.</strong></p></div></div>';
		}
	} else {
		//Destination is a numeric ID
		$senderror = '<div class="alert-center"><div id="alert-fade" class="alert alert-danger"><p><strong>Invalid destination.</strong></p></div></div>';
	}
}
if ($action == 'forward' || $senderror) {
	$showinbox = false;
	echo $senderror;
	echo '<h2>Forward</h2>';
	echo '<div class="topline">';
	if ($_POST['context'])
		echo '<p>' . nl2br(htmlspecialchars($_POST['context'])) . '</p>';
	$fwdfrom = $_POST['msgto'] ? $_POST['msgto'] : $_POST['fwdfrom'];
	echo '<form id="messageform" action="" method="post">';
	echo '<input type="hidden" name="context" value="' . $_POST['context'] . '" />';
	echo '<input type="hidden" name="fwdfrom" value="' . $fwdfrom . '" />';
	echo '<input type="hidden" name="subject" value="' . $_POST['subject'] . '" />';
	echo '<input id="fwdto" name="fwdto" type="textbox" style="width:100%" class="form-control" placeholder="Recipient*" value="' . htmlspecialchars($_POST['fwdto']) . '" required=""/><br>';
	echo '<div style="height:30px;margin-top:-20px;"><button type="submit" class="btn btn-success btn-left" name="action" value="sendfwd">Forward</button></form>';
	echo '<form action="" method="post"><button type="submit" class="btn btn-danger btn-right" style="margin-right:0px">Cancel</button></form></div>';
	echo '</div>';
}
?>
