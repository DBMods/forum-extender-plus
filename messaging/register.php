<?php
function registerPanel($userid){
?>
<div class="small-center">
	<div class="panel panel-primary">
		<div class="panel-heading">
			<h3>Register</h3>
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
						<input name="userid" type="hidden" value="<?php echo $userid?>" /><button name="action" class="btn btn-success" value="create-account">Create account</button>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</div>
<?php
}
if($_POST['action']=="create-account" && is_numeric($_POST['userid'])){//Request to create an account from extension
	$userid=$_POST['userid'];
	$result = mysqli_query($db, "SELECT * FROM `users` WHERE `userid` = '" . sqlesc($_POST['userid']) ."'");//checks for account already existing with userid
	$account_exist = mysqli_fetch_row($result);
	if(!$account_exist && !$_POST['username']){//If account does not already exist and user did not fill out register form
		registerPanel($userid);
	}elseif(!$account_exist && $_POST['username']){//If account does not already exist and user did fill out register form
		$result = mysqli_query($db, "SELECT * FROM `users` WHERE username = '" . sqlesc($_POST['username']) . "'");//Check if username is already in use
		$row=mysqli_fetch_array($result);
		if ($row) {//Username is already in use
			$usernameUsed = true;
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Username already in use!</strong></p></div></div>";
			registerPanel($userid);
		}else{//Username is not already in use
			$chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
			for($i=0;$i<10;$i++) {
				$random .=$chars[rand(0,strlen($chars)-1)];
			}
			//check if token already exists and if so gen another one
			$exists=true;
			while($exists==true) {
				$query="SELECT * FROM `users` WHERE `ext_token` = '$random'";
				$result=mysqli_query($sqlconnect,$query);
				$row=mysqli_fetch_array($result);
				if($row !== NULL) {
					$random="";
					for($i=0;$i<10;$i++) {
						$random .=$chars[rand(0,strlen($chars)-1)];
					}
				} else {
					$exists=false;
				}
			}
			$token = $random;
			$username = htmlspecialchars($_POST['username']);
			$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
			$create_time = time();
			$create_ip = $_SERVER['REMOTE_ADDR'];
			$result = mysqli_query($db, "INSERT INTO `users` (userid, username, password, ext_token, create_time, create_ip) VALUES ('" . sqlesc($userid) ."', '" . sqlesc($username) . "', '" . sqlesc($password) . "', '" . sqlesc($token) . "', '" . sqlesc($create_time) . "', '" . sqlesc($create_ip) . "')");
			echo '<h4 class="center">Account created. Click <a href="https://forums.dropbox.com/?msgtoken=' . $token . '">here</a> to finish the account creation process.</h4><p class="center">In order to finish the account creation process, we must redirect you back to the forums. However, this will only happen during registration.</p>';
		}
	}
	if($account_exist){//account already exists login form + return token to extension
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
						<input id="userid" name="userid" type="text" placeholder="User ID" class="form-control input-md" required="" />
					</div>
					<div class="form-group">
						<input id="password" name="password" type="password" placeholder="Password" class="form-control input-md" required="" />
					</div>
					<div class="form-group">
						<button name="action" class="btn btn-success" value="sign-in">Sign in</button>
					</div>
				</fieldset>
			</form>
			<p>Not registered? <form method="post" action=""><button name="action" class="btn btn-success" value="register-return">Sign up!</button></form></p>
		</div>
	</div>
</div>
<?php
	}
}else{//No request from extension to create the account
?>
<div class="small-center">
	<div class="panel panel-primary">
		<div class="panel-heading">
			<h3>Sign up</h3>
		</div>
		<div class="panel-body">
			<p>The Dropbox Forum Extender+ extension is required to use this site.  Please install from <a href="https://github.com/dbmods/forum-extender-plus">Github</a>
		</div>
	</div>
</div>
<?php
}
?>