<?php
require_once '../header.php';
if ($userAuthenticated) {
	getMessages();
  if ($username == 'TechGeek01' || $username == 'nathanc') {
		if ($action == 'updateadmin') {
			//Code
		}
?>
<!--<table>
  <tr>
    <th>UID</th>
    <th>Username</th>
    <th>Create Date</th>
    <th>Create IP</th>
    <th>Token</th>
    <th>New Password</th>
  </tr>-->
<?php
    //Get list of users
    /*$result = mysqli_query($db, "SELECT * FROM `users`");
    //List users in rows
    while ($row = mysqli_fetch_assoc($result)) {
      echo '<tr>';
      echo '<td>' . htmlspecialchars($row['userid']) . '</td>';
      echo '<td>' . htmlspecialchars($row['username']) . '</td>';
      echo '<td>' . gmdate('Y-m-d g:i A', $row['create_time']) . '</td>';
      echo '<td>' . htmlspecialchars($row['create_ip']) . '</td>';
      echo '<td>' . htmlspecialchars($row['ext_token']) . '</t>';
      echo '<td><form method="post" action="" style="margin:0px"><input name="dashmodpassword" id="dashmodpassword" type="password"><input name="dashuserid" id="dashuserid" type="hidden" value="' . $row['userid'] . '"> <button name="dashmodapply" id="dashmodapply" type="submit" class="button blue" value="change">Change</button></form></td>';
      echo '</tr>';
    }*/
?>
<!--</table>-->
<form action='' method='post'>
	<button type='submit' class='button danger' name='action' value='updateadmin'>Update Settings</button>
</form>
<?php
  }else {
    echo '<h2>Error</h2>';
		echo '<p>You are not authorized to access this page.</p>';
  }
}
require_once '../footer.php';
?>
