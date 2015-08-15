<?php
require_once 'header.php';

//Grab UID if posted
$uid = $_POST['uid'];
$uToken = $_POST['uToken'];

function authSigninPanel() {
	global $uid, $uToken;
	echo '<div class="small-center">';
	echo '<div class="panel panel-primary">';
	echo '<div class="panel-heading"><h3>Sign in</h3></div>';
	echo '<div class="panel-body">';
	echo '<form method="post" action="">';
	echo '<fieldset>';
	echo '<div class="form-group"><input id="username" name="username" type="text" placeholder="Username" class="form-control input-md" required="" /></div>';
	echo '<div class="form-group"><input id="password" name="password" type="password" placeholder="Password" class="form-control input-md" required="" /></div>';
	if ($uid) {
    echo '<input type="hidden" name="uid" value="' . $uid . '" />';
  }
	if ($uToken) {
    echo '<input type="hidden" name="uToken" value="' . $uToken . '" />';
  }
	echo '<div class="form-group">';
	echo '<button name="action" value="fixAuth" class="btn btn-success">Sign in</button>';
	echo '</div>';
	echo '</fieldset>';
	echo '</form>';
	echo "<p>Sign in to allow the extension to access your messaging account</p>";
	echo '</div>';
	echo '</div>';
	echo '</div>';
}

echo '<h2>Manual User Information Update</h2>';

//Grab correct token
if ($action != 'fixAuth') {
  //If page is first loaded, force sign in
  authSigninPanel();
} else {
  //Check for proper sign in
  if ($badAuth === true) {
    //Bad auth, so show error and form again
    badAuth();
    authSigninPanel();
  } else { //Proper sign in - No need to verify auth, since it's done in the header already
    //If We've passed a UID through, grab default UID origin, then update database
    if ($uid) {
      $cfg = mysqli_fetch_array(mysqli_query($db, "SELECT * FROM `config` WHERE setting = 'default_uid_origin' LIMIT 1"));
      $result = mysqli_query($db, "UPDATE users SET userid='" . sqlesc($uid) . "', uid_origin='" . $cfg['val'] . "' WHERE (ext_token = '" . sqlesc($userToken) . "' AND username = '" . sqlesc($username) . "') LIMIT 1");
    }
    //Alert the user of a successful update, and provide token update link
		if ($userToken == $uToken) {
			$url = $returnto;
		} else {
			$url = $returnto . (strpos($returnto, '?') === false ? '?' : '&') . 'msgtoken=' . $userToken;
		}
    echo '<p class="topline">Success! Your information was updated successfully. You may now click <a href="' . $url . '">here</a> to return to the forums' . ($userToken != $uToken ? ' and update your token' : '') . '.</p>';
  }
}

require_once 'footer.php';
?>
