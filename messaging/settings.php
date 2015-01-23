<?php
require 'header.php';
//Gets username of authenticated user
$username = getUsername();
function settingsView($viewOption) {
	global $username, $modusername;
	if ($viewOption=="changeFailPassword") {
		//If username is fine but there is a password issue
		//Don't need htmlspecialchars() here because this gets called after $modusername is checked
		$fillusername = $modusername;
	}else {
		$fillusername = $username;
	}
	?>
		<div class="settings-form">
			<form method="post" action="" class="form-horizontal">
				<fieldset>
					<h4 class="center">Change username</h4>
					<div class="form-group">
						<label class="col-md-4 control-label">Username</label>
						<div class="col-md-4">
							<input id="modusername" name="modusername" type="text" value="<?php echo $fillusername; ?>" class="form-control input-md">
						</div>
					</div>
					<br>
					<h4 class="center">Change password*</h4>
					<div class="form-group">
						<label class="col-md-4 control-label">Current password</label>
						<div class="col-md-4">
							<input id="curpassword" name="curpassword" type="password" class="form-control input-md">
						</div>
					</div>
					<div class="form-group">
						<label class="col-md-4 control-label">New password</label>
						<div class="col-md-4">
							<input id="modpassword" name="modpassword" type="password" class="form-control input-md">
						</div>
					</div>
					<div class="form-group">
						<label class="col-md-4 control-label">Verify password</label>
						<div class="col-md-4">
							<input id="modverifypassword" name="modverifypassword" type="password" class="form-control input-md">
						</div>
					</div>
					<h5 class="center">*You must sign in after changing your password</h5>
					<br>
					<div class="form-group">
						<div class="col-md-4">
						</div>
						<div class="col-md-4">
							<button id="modapply" name="modapply" type="submit" class="btn btn-success">Apply</button>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	<?php
}
//Writes the "Settings" header after error message
function writeSettingsHeader() {
	echo '<h2>Settings</h2>';
	echo '<p class="topline"></p>';
}
$modusername = $_POST['modusername'];
$curpassword = $_POST['curpassword'];
$modpassword = $_POST['modpassword'];
$modverifypassword = $_POST['modverifypassword'];
if ($userAuthenticated) {
	//If user is logged in
	//getMessages() gets the navbar badge numbers
	getMessages();
	if (isset($_POST['modapply'])) {
		//If user submitted settings form
		//Check if username is already in use
		$result = mysqli_query($db, "SELECT * FROM `users` WHERE username = '" . sqlesc($modusername) . "'");
		$usernameResult = mysqli_fetch_array($result);

		if (!empty($curpassword) && !empty($modpassword) && !empty($modverifypassword)){
			//If password requested to be changed
			$result = mysqli_query($db, "SELECT password FROM `users` WHERE username = '" . sqlesc($username) . "'");
			$passwordHash = mysqli_fetch_row($result);
			$passwordHash = $passwordHash['0'];

			//Check if the password is good
			if (password_verify($curpassword, $passwordHash)){
				$passwordFail = false;
				$passwordMod = true;
			}else {
				$passwordFail = true;
				$passwordMod = false;
			}
		}

		if ($usernameResult && $modusername != $username) {
			//If requested username already exists
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Username already in use!</strong></p></div></div>";
			writeSettingsHeader();
			settingsView('changeFailUser');
		}elseif (preg_match('[\W]', $modusername) || is_numeric($modusername) || empty($modusername) || strlen($modusername) > 15) {
			//If requested username has bad characters
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Please choose a different username without special characters</strong></p></div></div>";
			writeSettingsHeader();
			settingsView('changeFailUser');
		}elseif ($passwordFail) {
			//If current password is incorrect
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Wrong password</strong></p></div></div>";
			writeSettingsHeader();
			settingsView('changeFailPassword');
		}elseif ($modpassword != $modverifypassword) {
			//If new passwords don't match
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Passwords not the same</strong></p></div></div>";
			writeSettingsHeader();
			settingsView('changeFailPassword');
		}elseif ( ( $modusername==$username && isset($passwordMod) ) || ( $modusername != $username && !isset($passwordMod) ) || ( $modusername != $username && isset($passwordMod) ) ) {
			//No issues with changing settings AND something was modified
			if (isset($modusername) && $username != $modusername) {
				//Username is being changed
				mysqli_query($db, "UPDATE users SET username='" . sqlesc($modusername) . "' WHERE userid='" . sqlesc($userid) . "' LIMIT 1");
			}
			if ($passwordMod) {
				//If password is being changed
				$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
				for ($i = 0; $i < 10; $i++) {
					$random .= $chars[rand(0, strlen($chars) - 1)];
				}

				//Check if token already exists and if so gen another one
				$exists = true;
				while ($exists == true) {
					$query = "SELECT * FROM `users` WHERE `ext_token` = '$random'";
					$result = mysqli_query($sqlconnect, $query);
					$row = mysqli_fetch_array($result);
					if ($row !== NULL) {
						$random = "";
						for ($i = 0; $i < 10; $i++) {
							$random .= $chars[rand(0, strlen($chars) - 1)];
						}
					} else
						$exists = false;
				}
				$token = $random;
				$modpasswordhash = password_hash($modpassword, PASSWORD_BCRYPT);
				$result = mysqli_query($db, "UPDATE users set password='" . sqlesc($modpasswordhash) . "', ext_token='" . sqlesc($token) . "' WHERE userid='" . sqlesc($userid) . "' LIMIT 1");
			}
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-success'><p><strong>Settings saved</strong></p></div></div>";
			$username = $modusername;
			writeSettingsHeader();
			settingsView("changeSuccess");
		}else{
			//No settings changed
			writeSettingsHeader();
			settingsView("view");
		}
	}else{
		//Loading the normal page (settings aren't being changed yet)
		writeSettingsHeader();
		settingsView("view");
	}

}
require 'footer.php';
?>
