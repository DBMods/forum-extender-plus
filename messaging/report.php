<?php
require 'header.php';
if ($userAuthenticated) {
	echo '<h2>Report a Problem</h2>';
	echo '<p class="topline"><br>';
	if ($action == 'report') {
		echo 'Having a problem with the system? Report a problem to the developers!<form action="" method="post">';
		$showtablequery = mysqli_query($db, 'SHOW TABLES;');
		$tables = '';
		while ($showtable = mysqli_fetch_array($showtablequery)) {
			$tables = $tables . $showtable[0] . ', ';
		}
		$report = 'Database tables: ' . rtrim($tables, ', ');
		echo '<input type="hidden" name="report" value="' . $report . '" /><textarea name="comments" placeholder="Additional comments?" class="form-control" rows="9" style="width:100%"></textarea><br><br><button class="btn btn-success" name="action" value="confirmreport">Send</button></form>';
	} elseif ($action == 'confirmreport') {
		if ($_POST['comments'])
			echo '<p>' . nl2br(htmlspecialchars($_POST['comments'])) . '</p>';
		echo '<p>Are you sure you want to submit this report?<br><br><form action="index.php" method="post"><input type="hidden" name="msgto" value="Andy Y" /><input type="hidden" name="msgtext" value="' . $_POST['report'] . '&#10;&#10;Comment:&#10;' . $_POST['comments'] . '" /><button name="action" value="send" class="btn btn-success">Yes, report this</button><button name="action" value="report" class="btn btn-danger">No, start over</button></form></p>';
	}
	echo '</p>';
}
require 'footer.php';
?>
