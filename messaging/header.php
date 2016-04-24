<?php
if (count(get_included_files()) == 1) {
	die('Insufficient permissions');
}

require_once 'head_stub.php';

//If the user isn't authed, redirect to signin
if (!$userAuthenticated && $pageName !== 'signin.php') {
	header('Location: https://www.techgeek01.com/dropboxextplus/new/signin.php?dest=' . $pageName);
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Forum Extender+ Messenger</title>
		<link rel='stylesheet' href='https://www.techgeek01.com/dropboxextplus/css/style.css' />
	</head>
	<body>
		<div id='toastArea'></div>
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
						<form class='inline' action='' method='post'>
							<button type='submit' class='button last' name='action' value='logoff'>Log out</button>
						</form>
						<?php } ?>
					</div>
				</div>
			</header>
			<header id='context'>
				<div class='title'>
					<a href='https://www.techgeek01.com/dropboxextplus'>Messenger</a>
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

						<form id='replyForm' class='inline' method='post' action='compose.php'>
							<input type='hidden' name='action' value='compose' />
							<input type='hidden' name='msgid' value='' />
							<input type='hidden' name='msgto' value='' />
							<input type='hidden' name='subject' value='' />
							<input type='hidden' name='context' value='' />
							<button id='repBtn' class='button<?php echo $pageName != 'view.php' ? '' : ' first'; ?>' type='submit'>Reply</button>
						</form>
						<form id='forwardForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='forward' />
							<input type='hidden' name='msgid' value='' />
							<input type='hidden' name='msgto' value='' />
							<input type='hidden' name='subject' value='' />
							<input type='hidden' name='context' value='' />
							<button id='fwdBtn' class='button' type='submit'>Forward</button>
						</form>
						<form id='archForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='' />
							<input type='hidden' name='msgid' value='' />
							<button id='archBtn' class='button' type='submit'><?php echo ($pageName == 'index.php' ? 'A' : 'Una') . 'rchive'; ?></button>
						</form>
						<form id='readForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='markRead' />
							<input type='hidden' name='msgid' value='' />
							<button id='delBtn' class='button' type='submit'>Mark Read</button>
						</form>
						<form id='unreadForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='markUnread' />
							<input type='hidden' name='msgid' value='' />
							<button id='delBtn' class='button' type='submit'>Mark Unread</button>
						</form>
						<form id='delForm' class='inline' method='post' action=''>
							<input type='hidden' name='action' value='delete' />
							<input type='hidden' name='msgid' value='' />
							<button id='delBtn' class='button danger last' type='submit'>Delete</button>
						</form>
					</div>
					<?php } else if (strpos($pageName, 'admin/') === 0) { ?>
					<div id='adminbar' class='buttongroup'>
						<a href='https://www.techgeek01.com/dropboxextplus/admin' class='button'>Dashboard</a>
						<a href='userdata.php' class='button'>User Database</a>
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
				<div id='content'>
