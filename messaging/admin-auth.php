<?php
if ($action == 'adminlogin') {
	$row = mysqli_fetch_assoc(mysqli_query($db, 'SELECT * FROM adminauth LIMIT 1'));
	if ($_POST['adminpassphrase'] === $row['pass'] && $_POST['authasuser'] != '' && is_numeric($_POST['authasuser'])) {
		setcookie('forumid', htmlspecialchars($_POST['authasuser']), time() + 3600 * 24 * 30);
		$_COOKIE['forumid'] = $_POST['authasuser'];
		$userid = $_COOKIE['forumid'];
	} else {
		if ($_POST['adminpassphrase'] !== $row['pass'])
			$failure = 'Wrong passphrase.';
		elseif ($_POST['authasuser'] == '')
			$failure = 'Must select user to auth as.';
		elseif (!is_numeric($_POST['authasuser']))
			$failure = 'Invalid user to auth as.';
	}
}
if (!$indirectcall)
	echo '<html><head><title>Forum Extender+ Messages</title><link rel="stylesheet" href="style.css"/><link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/><link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css"/></head><body><div id="wrapper" class="container"><div class="jumbotron" id="main">';
if (!$indirectcall || $failure) {
	$showinbox = false;
	echo '<h2>Admin Auth</h2>';
	if ($adminauthfail)
		echo '<div class="alert-center"><div id="alert-fade" class="alert alert-danger"><p><strong>' . $failure . '</strong></p></div></div>';
	echo '<p class="topline">Login as admin with a passphrase<br><form method="post" action="messages.php" class="menu"><select name="authasuser" class="form-control"><option value="">Please Select a User</option><option value="1618104">Andy Y.</option><option value="857279">Nathan C.</option></select><br><input name="adminpassphrase" /><br><button type="submit" class="btn btn-success" name="action" value="adminlogin">Login</button></form></p>';
}
if (!$indirectcall)
	echo '</div></div><div class="container"><footer><hr><p>Developed by <a href="http://techgeek01.com" target="_blank">Andy Y.</a> and <a href="http://nathancheek.com" target="_blank">Nathan C.</a></p></footer></div><div class="container navbar-fixed-top"><div class="header"><ul class="nav nav-pills pull-left">Navbar unavailable while logging in as admin.</ul><div class="site-title"><h3 class="text-muted"><a href="">Dropbox Forum Extender+ Messenger</a></h3></div></div></div><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script><script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script><script>window.setTimeout(function(){$("#alert-fade").addClass("fade");}, 3000);</script></body></html>';
?>