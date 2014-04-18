<?php
if($action=="register" || $action=="create-account" || $action=="register-return") {//clicked register button
	include "register.php";
}
if(!$userAuthenticated && $action!="register" && $action!="create-account" && $action!="register-return"){//If authentication unsuccessful or not tried
	if($badAuth) {
		echo "<div class='alert-center'><div id='alert-fade' class='alert alert-danger'><p><strong>Wrong username or password</strong></p></div></div>";
	}
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
						<button class="btn btn-success">Sign in</button>
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