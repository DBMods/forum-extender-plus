<?php
if ($action != 'send') {
	require_once 'header.php';
}

if ($userAuthenticated) {
	if ($action == 'send') {
		require_once 'send.php';
	} elseif ($action == 'addressbook') {
		require_once 'address-book.php';
	}

	if ($action != 'addressbook' && ($action != 'send' || $senderror)) {
		$showinbox = false;

		$subj = htmlspecialchars($_POST['subject']);

		$msgplaceholder = 'This is where you would write your message. You know, sort of like this. I mean, you probably wouldn\'t actually write this up to send to someone, but if you were, that would be a proper use for the message system. I mean, you don\'t have to write a novel or anything, but you don\'t have to not write a novel. Heck, feel free to pour your heart and soul out into your message. Actually, wait, don\'t. That might be kinda weird. So anyway, like I said, it doesn\'t have to be a novel, but it can be. Novels are fun! Also, the devs of this script are pretty cool to talk to, so if you want to drop by to say hi, try sending a message to either Andy Y. or Nathan C. So you can pretty much message about anything you want here. You could even talk about rainbows and unicorns! If you want to talk to the admins, this isn\'t their topic of choice, though, but, I guess if you really wanted to, you could, and they might (reluctantly, of course) reply with some other nonsense. So what are you waiting for? Type away!';
		echo $senderror;
		if ($_POST['context']) {
			//Display context
			echo '<p>' . nl2br(htmlspecialchars($_POST['context'])) . '</p>';

			//Tweak subject
			if (strpos($subj, 'Re: ') !== 0) { //If the subject doesn't already have a reply tag on it, tag it appropriately
				$subj = 'Re: ' . $subj;
			}
		}
		echo '<form id="messageform" action="./" method="post">';
		echo '<input id="msgto" name="msgto" type="textbox" style="width:100%" class="form-control" placeholder="Recipient*" value="' . htmlspecialchars($_POST['msgto']) . '" required /><br>';
		echo '<input id="subject" name="subject" type="textbox" style="width:100%" class="form-control" placeholder="Subject*" value="' . $subj . '" required /><br>';
		echo '<textarea name="msgtext" placeholder="Message" rows="9" style="width:100%" class="form-control" required>' . htmlspecialchars($_POST['msgtext']) . '</textarea><br>';
		echo '<input type="hidden" name="action" value="send" />';
		echo '</form><form id="cancelForm" style="display:none" action="./" method="post"></form>';
		echo '<p class="buttongroup"><a id="sendBtn" class="button" href="javascript:void(0)">Send</a><a id="cancelBtn" class="button danger" href="javascript:void(0)">Cancel</a></p>';
	}
}

if ($action != 'send') {
	require_once 'footer.php';
}
?>
