<?php
require 'db-login.php';
$result = mysqli_query($db, "SELECT * FROM `msglist` WHERE `to` = '" . $_GET['to'] . "' AND `archived` = 0");
echo mysqli_num_rows($result);
mysqli_close($db);

//Make this require a token, which will be passed in as $_GET['token'], and if it's wrong, instead of appending a message count to the page like it does now with mysqli_num_rows($result),
//append "Incorrect token" (without quotes, of course), and only that. Make sure it's exactly that if the token's wrong. Nothing more, nothing less. Then, the userscript will be able to respond, and head over to
//gettoken.php to retrieve the token from the database.
?>