<?php
require 'header.php';

//This page will get passed the returnto, as well as the user ID.

//Put a sign in form here, and have the user try to log in. If you can, make it so they can only log in to the account corresponding to their user ID. When they do log in,
//fetch their token from the database, and redirect them. When you redirect, take the URL passed in as returnto (it'll set a cookie for that just like usual), and append either ?msgtoken=token
// or &msgtoken-token to it depending on whether it already has other values appended to the URL.

//Basically leave the return to forums button as the value they passed, but when you redirect after a successful login, append the token to it

//Don't do anything with displaying the messages or anything, just redirect them when they log in successfully.

require 'footer.php';
?>