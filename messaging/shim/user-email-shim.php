<?php
function genAlphaNum($len) {
	$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	$genStr = '';

	//Generate a random string that does not have to be unique
	for ($i = 0; $i < $len; $i++) {
		$genStr .= $chars[rand(0, strlen($chars) - 1)];
	}

	return $genStr;
}

echo '<strong>verify_string:</strong> <input style="width:500px" value="' . genAlphaNum(60) . '" />';
?>
