<?php
require 'db-login.php';
?>
<html>
	<head>
		<title>Forum Extender+ Messages</title>
		<link rel='stylesheet' href='style.css' />
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" />
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css" />
	</head>
	<body>
		<div id="wrapper" class="container">
			<div class="jumbotron" id="main">
				<?php
				if (is_numeric($_POST['for'])) {
					setcookie('forumid', htmlspecialchars($_POST['for']), time() + 3600 * 24 * 30);
					$_COOKIE['forumid'] = $_POST['for'];
				}
				if (is_numeric($_POST['timeOffset'])) {
					setcookie('timeoffset', htmlspecialchars($_POST['timeOffset']), time() + 3600 * 24 * 30);
					$_COOKIE['timeoffset'] = $_POST['timeOffset'];
				}
				if ($_POST['returnto']) {
					setcookie('returnto', strip_tags($_POST['returnto']));
					$_COOKIE['returnto'] = strip_tags($_POST['returnto']);
				}
				$action = $_POST['action'];
				$adminauthfail = false;
				if ($action == 'login') {
					$row = mysqli_fetch_assoc(mysqli_query($db, 'SELECT * FROM adminauth LIMIT 1'));
					if ($_POST['adminpassphrase'] === $row['pass'] && $_POST['authasuser'] != '')
						echo '<form action="messages.php" method="post"><input type="hidden" name="for" value="' . $_POST['authasuser'] . '" /><button class="btn btn-success">Login</button></form>';
					else {
						if ($_POST['adminpassphrase'] !== $row['pass'])
							$failure = 'Wrong passphrase.';
						elseif ($_POST['authasuser'] == '')
							$failure = 'Must select user to auth as.';
						$adminauthfail = true;
					}
				}
				if ($action == '' || $adminauthfail) {
					$showinbox = false;
					echo '<h2>Admin Auth</h2>';
					if ($adminauthfail)
						echo '<div class="alert-center"><div id="alert-fade" class="alert alert-danger"><p><strong>' . $failure . '</strong></p></div></div>';
					echo '<p class="topline">Login as admin with a passphrase<br><form method="post" action="" class="menu"><select name="authasuser" class="form-control"><option value="">Please Select a User</option><option value="1618104">Andy Y.</option><option value="857279">Nathan C.</option></select><br><input name="adminpassphrase" /><br><button type="submit" class="btn btn-success" name="action" value="login">Login</button></form></p>';
				}
				?>
			</div>
		</div>
		<div class="container">
			<footer>
				<hr>
				<p>
					Developed by <a href="http://techgeek01.com" target='_blank'>Andy Y.</a> and <a href="http://nathancheek.com" target='_blank'>Nathan C.</a>
				</p>
			</footer>
		</div>
		<div class="container navbar-fixed-top">
			<div class="header">
				<ul class="nav nav-pills pull-left">
					Navbar unavailable while logging in as admin.
				</ul>
				<div class="site-title">
					<h3 class="text-muted"><a href=''>Dropbox Forum Extender+ Messenger</a></h3>
				</div>
			</div>
		</div>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		<script>
			window.setTimeout(function() {
				$('#alert-fade').addClass('fade');
			}, 3000);
		</script>
	</body>
</html>