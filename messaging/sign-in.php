<?php
function signinPanel($showOption, $addAction) {
	//$showOption can show the Register form or a login form to redirect back to the forums with msgtoken
	echo '<div class="small-center">';
	echo '<div class="panel panel-primary">';
	echo '<div class="panel-heading"><h3>Sign in</h3></div>';
	echo '<div class="panel-body">';
	echo '<form method="post" action="">';
	echo '<fieldset>';
	echo '<div class="form-group"><input id="username" name="username" type="text" placeholder="Username" class="form-control input-md" required="" /></div>';
	echo '<div class="form-group"><input id="password" name="password" type="password" placeholder="Password" class="form-control input-md" required="" /></div>';
	echo '<div class="form-group">';
	echo $addAction ? ("<button name=\"action\" value=\"" . $addAction . "\" class=\"btn btn-success\">Sign in</button>") : ("<button class=\"btn btn-success\">Sign in</button>");
	echo '</div>';
	echo '</fieldset>';
	echo '</form>';
	if ($showOption == "showRegister")
		echo "<p>Not registered? <form method='post' action=''><button name='action' class='btn btn-success' value='register'>Sign up!</button></form></p>";
	if ($showOption == "showTokenRedir")
		echo "<p>Sign in to allow the extension to access your messaging account</p>";
	echo '</div>';
	echo '</div>';
	echo '</div>';
}
function badAuth() {
	echo "<div class='alert-center'><div id='alert-fade' class='alert alert-danger'><p><strong>Wrong username or password</strong></p></div></div>";
}
if ($action == "register" || $action == "create-account" || $action == "pass-token") //clicked register button
	include "register.php";
if (!$userAuthenticated && $action != "register" && $action != "create-account" && $action != "pass-token") { //If authentication unsuccessful or not tried
	if ($badCookie) {
		//When user changes password (and therefore token) the token cookie will be outdated
		//TODO if token cookie is replaced with a session cookie, then we won't need this
		signinPanel();
	}elseif ($badAuth) {
		badAuth();
		signinPanel("showRegister");
	}else {
	signinPanel("showRegister");
	}
}
?>
