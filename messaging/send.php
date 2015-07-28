<?php
if ($userAuthenticated){
	$senderror = '';
	$dest = $_POST['msgto'];
	if (!is_numeric($dest)) {
		//If destination is not a numerical ID, check if the user exists
		$result = mysqli_query($db, 'SELECT * FROM `users` WHERE `username` = "' . $dest . '"');
		$row = mysqli_fetch_assoc($result);
		if ($row) {
			//We're sending to a valid user
			mysqli_query($db, 'INSERT INTO msglist (`to`, `from`, `msg`, `time`) VALUES("' . sqlesc($dest) . '", "' . sqlesc($username) . '", "' . sqlesc($_POST['msgtext']) . '", "' . time() . '")');
			echo '<div class="alert-center"><div id="alert-fade" class="alert alert-success"><p><strong>Message sent.</strong></p></div></div>';
		} else {
			//User doesn't exist
			$senderror = '<div class="alert-center"><div id="alert-fade" class="alert alert-danger"><p><strong>Invalid destination.</strong></p></div></div>';
		}
	} else {
		//Destination is a numerical ID
		$senderror = '<div class="alert-center"><div id="alert-fade" class="alert alert-danger"><p><strong>Invalid destination.</strong></p></div></div>';
	}
}
?>
