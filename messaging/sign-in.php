<?php
if($action=="register" || $action=="create-account" || $action=="register-return") {//clicked register button
	include "register.php";
}elseif($action=="sign-in") {
	//Run code to check signin
	$result = mysqli_query($db, "SELECT password FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
	$passwordHash = mysqli_fetch_row($result)['0'];
	if(password_verify($_POST['password'], $passwordHash)) {
		$userAuthenticated=true;
	}
	if($userAuthenticated) {//authentication successful
		$result = mysqli_query($db, "SELECT ext_token FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
		$userToken = mysqli_fetch_row($result)['0'];
		$result = mysqli_query($db, "SELECT userid FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");
		$userid = mysqli_fetch_row($result)['0'];
		echo "<script>$.post( '', { userToken: '" . $userToken . "'} );</script>";
		echo "<h4 style='text-align:center'>Signing in... If nothing happens <form method='post' action=''><input name='userid' value='" . $userid . "' type='hidden' /><button class='btn btn-default' name='userToken' value='" . $userToken . "'>click here</button></form></h4>";
	}else{//authentication unsuccessful
		echo "<div class='alert-center'><div id='alert-fade' class='alert alert-danger'><p><strong>Wrong User ID or password</strong></p></div></div>";
	}
}
if(!$authenticated && $action!="register" && $action!="create-account" && $action!="register-return"){//If authentication unsuccessful or not tried
?>
<div class="small-center">
	<div class="panel panel-primary">
		<div class="panel-heading">
			<h3>Sign in</h3>
		</div>
		<div class="panel-body">
			<form method="post" action="">
				<fieldset>
					<div class="form-group">
						<input id="username" name="username" type="text" placeholder="Username" class="form-control input-md" required="" />
					</div>
					<div class="form-group">
						<input id="password" name="password" type="password" placeholder="Password" class="form-control input-md" required="" />
					</div>
					<div class="form-group">
						<button name="action" class="btn btn-success" value="sign-in">Sign in</button>
					</div>
				</fieldset>
			</form>
			<p>Not registered? <form method="post" action=""><button name="action" class="btn btn-success" value="register">Sign up!</button></form></p>
		</div>
	</div>
</div>
<?php
}
?>