<?php
require 'header.php';
if ($userAuthenticated) {
	$page = 'settings';
	getMessages();
	
	echo '<h2>Settings</h2>';
	echo '<p class="topline"></p>';
}
require 'footer.php';
?>