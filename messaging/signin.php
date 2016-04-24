<?php
require_once 'head_stub.php';

if ($userAuthenticated) {
	//If user authenticated, redirect back to the destination
	header('Location: https://www.techgeek01.com/dropboxextplus/new/' . $_GET['dest']);
} else if (!$userAuthenticated && $action === 'login') {
	echo '<'
}

require_once 'header.php';

echo '<h2>Sign In</h2>';
echo '<p>Please sign in to continue.</p>';
echo '<form action="' . $pageName . '?dest=' . $_GET['dest'] . '" method="post">';
echo '<input name="username" placeholder="Username" /><br />';
echo '<input name="password" type="password" placeholder="Password" />';
echo '<p>Don\'t have an account yet? <a href="register.php">Sign up</a>!</p>';
echo '<button name="action" class="button blue" value="login">Sign in</button>';
echo '</form>';

require_once 'footer.php';
?>
