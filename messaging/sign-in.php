<?php
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
