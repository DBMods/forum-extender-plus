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
echo 'Please sign in to continue.<br />';
echo '<form action="' . $pageName . '?dest=' . $_GET['dest'] . '" method="post">';
echo '<input name="action" type="hidden" value="login" />';
echo '<input name="username" placeholder="Username" /><br />';
echo '<input name="password" type="password" placeholder="Password" /><br />';
echo '<button class="button blue" type="submit">Sign in</button>';
echo '</form>';

require_once 'footer.php';
?>
