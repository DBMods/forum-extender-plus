<?php
if (count(get_included_files()) == 1) {
	die('Insufficient permissions');
}

require_once 'head_stub.php';

//If the user isn't authed, and is trying to access a system page, redirect to signin
if (!$userAuthenticated &&!$noRedirect) {
	header('Location: ' . $root . '/signin.php?dest=' . $pageName);
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Forum Extender+ Messenger</title>
		<link rel='stylesheet' href='<?php echo $root; ?>/css/style.css' />
		<script src='https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js'></script>
	</head>
	<body>
		<!--<div id='toastArea'></div>-->
		<div id='modalShade'></div>
		<div id='modal'>
			<div class='modalHeader'>
				<span class='modalTitle'></span>
				<span class='modalClose'>X</span>
				<div class='clearfix'></div>
			</div>
			<div class='modalContent'>
				<span class='message'></span> Type <span class='modalConfirmText'></span> to confirm.
				<form class='modalConfirmForm' onsubmit='return false;'>
					<input type='hidden' name='action' value='checkform' />
					<input id='modalConfirmBox' class='fancy' style='position:relative;top:2px;' />
					<button type='button' id='modalConfirmButton' class='button danger' href='javascript:void(0)'></button>
				</form>
			</div>
		</div>
		<div id='wrapper'>
			<header id='head'>
				Dropbox Forum Extender+
				<div id='meta'>
					<div class='buttongroup'>
						<?php
						echo '<a class=\'button blue\' href=\'' . $returnto . '\'>Return to Forums</a>';

						if ($userAuthenticated) {
						?>
						<form class='inline' action='signin.php?dest=<?php echo $pageName; ?>' method='post'>
							<button type='submit' class='button last' name='action' value='logoff'>Log out</button>
						</form>
						<?php } ?>
					</div>
				</div>
			</header>
			<header id='context'>
				<div class='title'>
					<a href='<?php echo $root; ?>'>Messenger</a>
				</div>
				<div class='tools'>
					<?php	if ($pageName == 'index.php' || $pageName == 'archive.php' || $pageName == 'sent.php') { ?>
					<a class='button padded grayed' href='javascript:void(0)'>Refresh</a>
					<?php
					}
					if ($pageName == 'index.php' || $pageName == 'archive.php' || $pageName == 'view.php') {
					?>
					<div id='messageActionButtons' class='buttongroup padded' <?php echo $pageName != 'view.php' ? 'style="display:none"' : ''; ?>>
						<?php if ($pageName != 'view.php') { ?>
						<form id='viewForm' class='inline' method='post' action='view.php'>
							<input type='hidden' name='msgid' value='' />
							<button id='viewBtn' class='button first' type='submit'>View</button>
						</form>
						<?php } ?>

						<form id='msgForm' class='inline' method='post' action='compose.php'>
							<input type='hidden' name='msgid' value='' />
							<button id='repBtn' class='button<?php echo $pageName != 'view.php' ? '' : ' first'; ?>' type='submit' name='action' value='reply'>Reply</button>
							<button id='fwdBtn' class='button' type='submit' name='action' value='forward'>Forward</button>
						</form>
						<form id='metaForm' class='inline' method='post' action='meta_stub.php'>
							<input type='hidden' name='msgid' value='' />
							<button id='archBtn' class='button' type='submit' name='action' value=''><?php echo ($pageName == 'index.php' ? 'A' : 'Una') . 'rchive'; ?></button>
							<button class='button' type='submit' name='action' value='markRead'>Mark Read</button>
							<button class='button' type='submit' name='action' value='markUnread'>Mark Unread</button>
							<button id="delBtn" class='button danger last' type='submit' name='action' value='delete'>Delete</button>
						</form>
					</div>
					<?php } else if (strpos($pageName, 'admin/') === 0) { ?>
					<div id='adminbar' class='buttongroup'>
						<a href='<?php echo $root; ?>/admin' class='button'>Dashboard</a>
						<a href='users.php' class='button'>User Database</a>
					</div>
					<?php
					}
					if ($pageName == 'compose.php') {
					?>
					<form class='inline' action='compose.php' method='post'>
						<button type='submit' class='button' name='action' value='addressbook'>Address Book</button>
					</form>
					<?php } ?>
				</div>
				<div class='clearfix'></div>
			</header>
			<div id='container'>
				<?php if ($userAuthenticated && !$userVerified && $pageName !== 'verify.php') {
					echo '<div class="toast info">Your email address has not yet been verified, and some features have been disabled. <a href="' . $root . '/verify.php?action=status">Verify your account</a></div>';
				}
				?>
				<div id='content'>
					<?php
					if (isset($toast)) {
						echo $toast;
					}
					?>
