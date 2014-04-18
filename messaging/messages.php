<?php
//Sets authentication (only temporary)
/**if (is_numeric($_POST['for'])) {
	setcookie('forumid', htmlspecialchars($_POST['for']), time() + 3600 * 24 * 30);
	$_COOKIE['forumid'] = $_POST['for'];
}**/
if ($_POST['userToken']) {
	setcookie('userToken', htmlspecialchars($_POST['userToken']), time() + 3600 * 24 * 30);
	$_COOKIE['userToken'] = htmlspecialchars($_POST['userToken']);
	$userToken = htmlspecialchars($_POST['userToken']);
}
//Userid is sent along with userToken to authenticate
if (is_numeric($_POST['userid'])) {
	setcookie('userid', htmlspecialchars($_POST['userid']), time() + 3600 * 24 * 30);
	$_COOKIE['userid'] = htmlspecialchars($_POST['userid']);
	$userid=$_POST['userid'];
}
//Sets local time display
if (is_numeric($_POST['timeOffset'])) {
	setcookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 * 24 * 30);
	$_COOKIE['timeoffset'] = $_POST['timeOffset'];
}
//Sets DB Forums page to return to
if ($_POST['returnto']) {
	setcookie('returnto', strip_tags($_POST['returnto']));
	$_COOKIE['returnto'] = strip_tags($_POST['returnto']);
}
//Sets cookies to blank on logoff
if ($_POST['action'] == "logoff") {
	setcookie('userToken', "");
	setcookie('userid', "");
	$_COOKIE['userToken']="";
	$_COOKIE['userid']="";
	$userLogoff = true;
}
require 'db-login.php';
$userid = htmlspecialchars($_COOKIE['userid']);
$userToken = htmlspecialchars($_COOKIE['userToken']);
$timeoffset = htmlspecialchars($_COOKIE['timeoffset']);
$returnto = 'https://forums.dropbox.com';
if ($userToken) {//If userToken and userid is set or posted, check login
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE (ext_token = '" . sqlesc($userToken) . "' AND userid = '" . sqlesc($userid) . "') LIMIT 1");
	$row = mysqli_fetch_array($result);
	if ($row) {
		$userAuthenticated = true;//This is how everything knows the user is authenticated
	}
}
if ($userAuthenticated) {
$showinbox = true;
}
if (isset($_COOKIE['returnto']))
	$returnto = $_COOKIE['returnto'];
$action = $_POST['action'];
if ($userAuthenticated) {
	if ($action == '' || $action == 'showsent' || $action == 'showarch' || $action == 'stats' || $action == 'report' || $action == 'register' || $action=='sign-in' && $userid) {
		$page = $action;
		setcookie('page', $page);
		$_COOKIE['page'] = $page;
	}
}
$indirectcall = true;
if ($action == 'adminlogin')
	include 'admin-auth.php';
?>
<html>
	<head>
		<title>Forum Extender+ Messages</title>
		<link rel='stylesheet' href='css/style.css' />
		<link rel="stylesheet" href="css/bootstrap.css" />
		<link rel="stylesheet" href="css/bootstrap-theme.css" />
	</head>
	<body>
		<div id="wrapper" class="container">
			<div class="jumbotron" id="main">
				<?php
				function sqlesc($string) {
					global $db;
					return mysqli_real_escape_string($db, $string);
				}
				function navform() {
					echo '<form action="" method="post" class="menu"><button type="submit" class="btn btn-success" name="action" value="compose">Compose</button></form>';
				}
				if ($userAuthenticated) {
					$timeOffsetSeconds = $timeoffset * 60;
					if ($action == 'delete' || $action == 'arch' || $action == 'unarch')
						include 'manipulate-entry.php';
					elseif ($action == 'addressbook')
						include 'address-book.php';
					elseif ($action == 'compose' || $action == 'send')
						include 'compose-message.php';
					elseif ($action == 'forward' || $action == 'sendfwd')
						include 'forward-message.php';
					elseif ($page == 'report' || $action == 'confirmreport')
						include 'report.php';
					if ($page == 'showsent')
						include 'show-sent.php';
					elseif ($page == 'showarch')
						include 'show-archived.php';
					elseif ($page == 'stats')
						include 'stats.php';

					//Message counter navbar badges
					$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 0 ORDER BY `time` DESC");
					$count = mysqli_num_rows($result);
					if ($count > 0)
						$countBadge = ' <span class="badge">' . $count . '</span>';
					else
						$countBadge = '';
					$archCount = mysqli_num_rows(mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . sqlesc($userid) . "' AND `archived` = 1"));
					if ($archCount > 0)
						$archBadge = ' <span class="badge">' . $archCount . '</span>';
					else
						$archBadge = '';

					if ($showinbox && $page == '') {
						echo '<h2>Inbox - ' . $count . '</h2>';
						navform();
						while ($row = mysqli_fetch_assoc($result)) {
							echo '<p class="topline"><br>Time: ' . gmdate('Y-m-d g:i A', $row['time'] - $timeOffsetSeconds) . '<br>From: <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['from']) . '" target="_blank">' . htmlspecialchars($row['from']) . '</a>';
							if (htmlspecialchars($row['forward']) != 0)
								echo ' (FWD <a href="https://forums.dropbox.com/profile.php?id=' . htmlspecialchars($row['forward']) . '" target="_blank">' . htmlspecialchars($row['forward']) . '</a>)';
							echo '<br>Message:<br>' . nl2br(htmlspecialchars($row['msg'])) . '</p>';
							echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" value="' . htmlspecialchars($row['id']) . '"/><input name="msgto" type="hidden" value="' . htmlspecialchars($row['from']) . '"/><input name="context" type="hidden" value="' . htmlspecialchars($row['msg']) . '"/><button type="submit" class="btn btn-success btn-sm" name="action" value="compose">Reply</button><button type="submit" class="btn btn-warning btn-sm" name="action" value="forward">Forward</button><button type="submit" class="btn btn-primary btn-sm" name="action" value="arch">Archive</button></form>';
							echo '<a data-id="' . htmlspecialchars($row['id']) . '" class="open-alertDelete btn btn-danger btn-sm" href="#alertDelete">Delete</a>';
						}
						echo '<div class="modal fade in" id="alertDelete"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
						echo '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>';
						echo '<h3 class="modal-title">Are you sure?</h3>';
						echo '</div>';
						echo '<div class="modal-body"><h4>If you delete this message, it is gone forever!</h4></div>';
						echo '<div class="modal-footer">';
						echo '<button class="btn btn-default" data-dismiss="modal">Cancel</button>';
						echo '<form method="post" action="" class="menu"><input name="msgid" type="hidden" id="msgid" value="" /><button type="submit" class="btn btn-danger" name="action" value="delete">Delete</button></form>';
						echo '</div></div></div></div>';
						if ($count == 0)
							echo '<p class="topline center"><br>It doesn\'t appear that you have any messages. Check back later, or start a conversation by clicking "Compose."</p>';
					}
				} else {
					if ($userLogoff) {
						echo "<div class='alert-center'><div id='alert-fade' class='alert alert-success'><p><strong>Successfully logged off</strong></p></div></div>";
					}
					include "sign-in.php";//Not logged in or bad auth
				}
				mysqli_close($db);
				?>
			</div>
		</div>
		<div class="container">
			<footer>
				<hr>
				<div>
					Developed by <a href="http://techgeek01.com" target='_blank'>Andy Y.</a> and <a href="http://nathancheek.com" target='_blank'>Nathan C.</a> -
					<form action="" method="post" class="form-link">
						<button type="submit" name="action" class="btn-link" value="report">Problem?</button>
					</form>
				</div>
			</footer>
		</div>
		<div class="container navbar-fixed-top">
			<div class="header">
				<ul class="nav nav-pills pull-left">
					<?php
					echo '<li class="';
					if ($showinbox)
						echo 'active';
					echo '"><a href="">Inbox' . $countBadge . '</a></li><li class="';
					if ($page != 'showsent')
						echo 'in';
					echo 'active"><form action="" method="post" class="form-pill"><button type="submit" class="btn-pill" name="action" value="showsent">Sent</button></form></li><li class="';
					if ($page != 'showarch')
						echo 'in';
					echo 'active"><form action="" method="post" class="form-pill"><button type="submit" class="btn-pill" name="action" value="showarch">Archive' . $archBadge . '</button></form></li><li class="';
					if ($page != 'stats')
						echo 'in';
					echo 'active"><form action="" method="post" class="form-pill"><button type="submit" class="btn-pill" name="action" value="stats">Stats</button></form></li><li><a href="' . $returnto . '">Back to Forums</a></li>';
					echo '<li class="inactive"><form action="" method="post" class="form-pill"><button type="submit" class="btn-pill" name="action" value="logoff">Log out</button></form></li>';
					?>
				</ul>
				<div class="site-title">
					<h3 class="text-muted"><a href=''>Dropbox Forum Extender+ Messenger</a></h3>
				</div>
			</div>
		</div>
		<?php if($page != 'stats') {?>
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
			<script src="js/bootstrap.js"></script>
		<?php
		}
		?>
		<script>
			window.setTimeout(function() {
				$('#alert-fade').addClass('fade');
			}, 3000);
			$('.open-alertDelete').click(function(sendID) {
				sendID.preventDefault();
				var _self = $(this);
				$('#msgid').val(_self.data('id'));
				$(_self.attr('href')).modal('show');
			});
		</script>
	</body>
</html>
