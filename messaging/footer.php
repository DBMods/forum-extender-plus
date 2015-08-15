<?php
//Not logged in or bad auth
if (!$userAuthenticated && $pageName != 'report.php' && $pageName != 'fix-auth.php') {
	if ($userLogoff)
		echo "<div class='alert-center'><div id='alert-fade' class='alert alert-success'><p><strong>Successfully logged out</strong></p></div></div>";
	require_once "sign-in.php";
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
			<!--<form action="compose.php" method="post" class="form-link">
				<input type="hidden" name="msgto" value="TechGeek01" />
				<input type="hidden" name="subject" value="Bug report: " />
				<button type="submit" class="btn-link">Problem?</button>
			</form>-->
			<form action="report.php" method="post" class="form-link">
				<button type="submit" name="action" class="btn-link" value="report">Problem?</button>
			</form>
		</div>
	</footer>
</div>
<noscript><div class="js-error">Please enable JavaScript for full site functionality</div></noscript>
<div class="container navbar-fixed-top">
	<div class="header">
		<ul class="nav nav-pills pull-left">
			<?php
			linkActivity('<a href="index.php">Inbox' . $countBadge . '</a>');
			linkActivity('<a href="compose.php">Compose</a>');
			linkActivity('<a href="sent.php">Sent</a>');
			linkActivity('<a href="archive.php">Archive' . $archBadge . '</a>');
			linkActivity('<a href="settings.php">Settings</a>');
			linkActivity('<a href="stats.php">Stats</a>');
			if ($username == 'TechGeek01' || $username == 'nathanc') {
				linkActivity('<a href="admin.php">Admin</a>');
			}
			linkActivity('<a href="' . $returnto . '">Back to Forums</a>');
			if($userAuthenticated)
				linkActivity('<form action="" method="post" class="form-pill"><button type="submit" class="btn-pill" name="action" value="logoff">Log out</button></form>');
			?>
		</ul>
		<div class="site-title">
			<h3 class="text-muted"><a href=''>Forum Extender+ Messenger</a></h3>
		</div>
	</div>
</div>
<?php
if ($pageName != 'stats.php')
	echo "<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'></script>";
?>
<script src='js/bootstrap.js'></script>
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
