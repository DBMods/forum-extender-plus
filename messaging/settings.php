<?php
require_once 'header.php';
function settingsView($viewOption) {
	global $username;
	?>
		<div class="settings-form">
			<fieldset class='form-horizontal'>
				<h4 class="center">Username</h4>
				<div class="form-group">
					<label class="col-md-4 control-label">Username (cannot be changed)</label>
					<div class="col-md-4">
						<input type="text" value="<?php echo $username; ?>" disabled class="form-control input-md">
					</div>
				</div>
			</fieldset>
			<br>
			<form method="post" action="" class="form-horizontal">
				<fieldset>
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
							<button id="modapply" name="modapply" type="submit" class="button blue">Apply</button>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	<?php
}

$curpassword = $_POST['curpassword'];
$modpassword = $_POST['modpassword'];
$modverifypassword = $_POST['modverifypassword'];
if ($userAuthenticated) {
	//If user is logged in
	if (isset($_POST['modapply'])) {
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
				http://youtu.be/IfllOzPCkn8
			}
		}

		if ($passwordFail) {
			//If current password is incorrect
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Wrong password</strong></p></div></div>";
			settingsView('changeFailPassword');
		} elseif ($modpassword != $modverifypassword) {
			//If new passwords don't match
			echo "<div class='alert-center'><div id='alert-fade' class='alert alert-warning'><p><strong>Passwords not the same</strong></p></div></div>";
			settingsView('changeFailPassword');
		} elseif (isset($passwordMod)) {
			//No issues with changing settings AND something was modified
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
			settingsView("changeSuccess");
		} else {
			//No settings changed
			settingsView("view");
		}
	} else {
		//Loading the normal page (settings aren't being changed yet)
		settingsView("view");
	}

}
require_once 'footer.php';
?>
