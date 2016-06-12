<?php
$noRedirect = true;
require_once 'head_stub.php';

if ($userAuthenticated) {
	//If user authenticated, redirect back to the destination
	header('Location: ' . $root . '/' . $_GET['dest']);
}

require_once 'header.php';

echo '<h2>Sign In</h2>';
echo '<p>Please sign in to continue.</p>';
echo '<form action="' . $pageName . '?dest=' . $_GET['dest'] . '" method="post">';
echo '<input name="username" placeholder="Username or Email" /><br />';
echo '<input name="password" type="password" placeholder="Password" />';
echo '<p style="font-size:12px;margin:5px 0 10px"><a href="forgot.php">Forgot your password?</a></p>';
echo '<div class="buttongroup"><a class="button" href="register.php">Sign up</a><button name="action" class="button blue last" value="login">Sign in</button></div>';
echo '</form>';

require_once 'footer.php';
?>
