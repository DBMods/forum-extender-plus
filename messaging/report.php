<?php
require 'header.php';
//if ($userAuthenticated) {
	echo '<h2>Report a Problem</h2>';
	echo '<p class="topline">';
	if ($action == 'report') {
		$showtablequery = mysqli_query($db, 'SHOW TABLES;');
		$tables = '';
		while ($showtable = mysqli_fetch_array($showtablequery)) {
			$tables = $tables . $showtable[0] . ', ';
		}
		$report = 'Database tables: ' . rtrim($tables, ', ');

		echo 'Having a problem with the system? Report a problem to the developers!';
		echo '<form action="" method="post">';
		echo '<input type="hidden" name="report" value="' . $report . '" />';
		echo '<input id="summary" name="summary" type="textbox" style="width:100%" class="form-control" placeholder="Summary" required /><br>';
		echo '<textarea name="comments" placeholder="Additional comments?" class="form-control" rows="9" style="width:100%"></textarea><br><br>';
		echo '<button class="btn btn-success" name="action" value="confirmreport">Send</button>';
		echo '</form>';
	} elseif ($action == 'confirmreport') {
		echo '<p>' . htmlspecialchars($_POST['summary']);
		if ($_POST['comments']) {
			echo '<p>' . nl2br(htmlspecialchars($_POST['comments'])) . '</p>';
		}
		echo '<p>Are you sure you want to submit this report?<br><br>';
		echo '<form action="./" method="post">';
		echo '<input type="hidden" name="msgto" value="TechGeek01" />';
		echo '<input type="hidden" name="subject" value="' . $_POST['summary'] . '" />';
		echo '<input type="hidden" name="msgtext" value="' . $_POST['report'] . '&#10;&#10;Comment:&#10;' . $_POST['comments'] . '" />';
		echo '<button name="action" value="send" class="btn btn-success">Yes, report this</button>';
		echo '<button name="action" value="report" class="btn btn-danger">No, start over</button>';
		echo '</form></p>';
	}
	echo '</p>';
//}
require 'footer.php';
?>
