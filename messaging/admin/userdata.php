<?php
require_once '../header.php';
if ($userAuthenticated) {
	getMessages();
  if ($userIsAdmin) {
    if ($_POST['dashmodapply']) {
      //If password is being changed
      $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      for ($i = 0; $i < 10; $i++) {
        $random .= $chars[rand(0, strlen($chars) - 1)];
      }

      //Check if token already exists and if so gen another one
      $exists = true;
      while ($exists == true) {
        $query = "SELECT * FROM `users` WHERE `ext_token` = '$random'";
        $result = mysqli_query($sqlconnect, $query);
        $row = mysqli_fetch_array($result);
        if ($row !== NULL) {
          $random = "";
          for ($i = 0; $i < 10; $i++) {
            $random .= $chars[rand(0, strlen($chars) - 1)];
          }
        } else
          $exists = false;
      }
      $token = $random;
      $modpasswordhash = password_hash($_POST['dashmodpassword'], PASSWORD_BCRYPT);
      $result = mysqli_query($db, "UPDATE users set password='" . sqlesc($modpasswordhash) . "', ext_token='" . sqlesc($token) . "' WHERE userid='" . sqlesc($_POST['dashuserid']) . "' LIMIT 1");
      echo "<div class='alert-center'><div id='alert-fade' class='alert alert-success'><p><strong>Password changed</strong></p></div></div>";
    }
?>
<table>
  <tr>
    <th>UID</th>
    <th>Username</th>
    <th>Create Date</th>
    <th>Create IP</th>
    <th>Token</th>
    <th>New Password</th>
  </tr>
<?php
    //Get list of users
    $result = mysqli_query($db, "SELECT * FROM `users`");
    //List users in rows
    while ($row = mysqli_fetch_assoc($result)) {
      echo '<tr>';
      echo '<td>' . htmlspecialchars($row['userid']) . '</td>';
      echo '<td>' . htmlspecialchars($row['username']) . '</td>';
      echo '<td>' . gmdate('Y-m-d g:i A', $row['create_time']) . '</td>';
      echo '<td>' . htmlspecialchars($row['create_ip']) . '</td>';
      echo '<td>' . htmlspecialchars($row['ext_token']) . '</t>';
      echo '<td><form method="post" action="" style="margin:0px"><input name="dashmodpassword" class="dashmodpassword" type="password" /><input name="dashuserid" class="dashuserid" type="hidden" value="' . $row['userid'] . '"/> <input type="hidden" name="dashmodapply" class="dashmodapply" value="change" /></form><a href="javascript:void(0)" class="button danger changepass">Change</a></td>';
      echo '</tr>';
    }
?>
</table>
<?php
  }else {
    echo '<h2.>Error</h2>';
		echo '<p>You are not authorized to access this page.</p>';
  }
}
require_once '../footer.php';
?>