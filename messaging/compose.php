<?php
require 'header.php';

if ($action == 'send')
	require 'send.php';
elseif ($action == 'addressbook')
	require 'address-book.php';

if (!$action || $senderror) {
	$showinbox = false;
	$msgplaceholder = 'This is where you would write your message. You know, sort of like this. I mean, you probably wouldn\'t actually write this up to send to someone, but if you were, that would be a proper use for the message system. I mean, you don\'t have to write a novel or anything, but you don\'t have to not write a novel. Heck, feel free to pour your heart and soul out into your message. Actually, wait, don\'t. That might be kinda weird. So anyway, like I said, it doesn\'t have to be a novel, but it can be. Novels are fun! Also, the devs of this script are pretty cool to talk to, so if you want to drop by to say hi, try sending a message to either Andy Y. or Nathan C. So you can pretty much message about anything you want here. You could even talk about rainbows and unicorns! If you want to talk to the admins, this isn\' their topic of choice, though, but, I guess if you really wanted to, you could, and they might (reluctantly, of course) reply with some other nonsense. You might even get your novel about the evil Dropbox Clan that\s out to try and steal all of the precious space treasures (okay, probably not, but someone might get a good laugh out of it)! So what are you waiting for? Type away!';
	echo $senderror;
	echo '<h2>Compose</h2>';
	echo '<div class="topline">';
	echo '<br><form action="" method="post"><button type="submit" class="btn btn-primary" name="action" value="addressbook">View Address Book</button></form>';
	if ($_POST['context'])
		echo '<p>' . nl2br(htmlspecialchars($_POST['context'])) . '</p>';
	echo '<form id="messageform" action="" method="post"><input id="msgto" name="msgto" type="textbox" style="width:100%" class="form-control" placeholder="Recipient*" value="' . htmlspecialchars($_POST['msgto']) . '" required=""/><br><textarea name="msgtext" placeholder="' . $msgplaceholder . '" rows="9" style="width:100%" class="form-control" required="">' . htmlspecialchars($_POST['msgtext']) . '</textarea><br><div style="height:30px;margin-top:-20px;"><button type="submit" class="btn btn-success btn-left" name="action" value="send">Send</button></form>';
	echo '<form action="" method="post"><button type="submit" class="btn btn-danger btn-right" style="margin-right:0px">Cancel</button></form></div></div>';
}

require 'footer.php';
?>