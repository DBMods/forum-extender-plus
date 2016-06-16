<?php
require_once 'head_stub.php';

//If UID and token posted, check login
if ($_GET['to'] && $_GET['token']) {
	$userToken = htmlspecialchars($_GET['token']);
	$uid = htmlspecialchars($_GET['to']);

	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($uid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);

	//If user authed, check UID origin
	if ($row) {
		$cfg = mysqli_fetch_array(mysqli_query($db, "SELECT * FROM `config` WHERE setting = 'default_uid_origin' LIMIT 1"));

		if ($row['uid_origin'] == $cfg['val']) {
			//Return message count if origin correct
			$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($row['username']) . "' AND `archived` = 0 AND `unread` = 1");
			echo mysqli_num_rows($result);
		} else {
			//Bad UID origin
			echo 'Bad UID';
		}
	} else {
		//Bad auth, so either token or UID bad
		echo 'Bad auth';
	}
} else {
	//Not enough/incorrect info provided
	echo 'Bad auth';
}
mysqli_close($db);
?>
