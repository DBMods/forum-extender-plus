<?php
require_once 'header.php';
if ($userAuthenticated) {
	echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>';
	echo '<link rel="stylesheet" href="css/flapper.css" />';
	echo '<script src="js/jquery.flapper.js"></script>';
	echo '<script src="js/raw/jquery.transform-0.9.3.min.js"></script>';
	echo '<script src="js/raw/jquery.numberformatter-1.2.4.jsmin.js"></script>';
	$result = mysqli_query($db, 'SHOW TABLE STATUS LIKE "msglist"');
	$row = mysqli_fetch_assoc($result);
	$msgcount = $row['Auto_increment'] - 1;
	echo '<div class="small-center"><div class="panel panel-primary"><div class="panel-heading"><h3>Messages sent</h3></div><div class="panel-body stat-panel"><div class="stat-content" id="msg-count-text"><h2>' . $msgcount . '</h2></div><input id="msg-count" style="display:none" /></div></div></div>';
	echo '<script>var msgcount=' . $msgcount . ';var options={width: msgcount.toString().length, timing: 500};document.getElementById("msg-count-text").style.display="none";$("#msg-count").flapper(options).val(msgcount).change();</script>';
}
require_once 'footer.php';
?>
