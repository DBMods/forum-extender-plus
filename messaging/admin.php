<?php
require_once 'header.php';
if ($userAuthenticated) {
	getMessages();
  if ($username == 'TechGeek01' || $username == 'nathanc') {
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
    echo '<h2>Admin Dashboard</h2>';
?>
<div class="table-responsive">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Userid</th>
        <th>Username</th>
        <th>Create Date</th>
        <th>Create IP</th>
        <th>Token</th>
        <th>New Password</th>
      </tr>
    </thead>
    <tbody>
<?php
    //Get list of users
    $result = mysqli_query($db, "SELECT * FROM `users`");
    //List users in rows
    while ($row = mysqli_fetch_assoc($result)) {
      echo '<tr>';
      echo '<th>' . htmlspecialchars($row['userid']) . '</th>';
      echo '<th>' . htmlspecialchars($row['username']) . '</th>';
      echo '<th>' . gmdate('Y-m-d g:i A', $row['create_time']) . '</th>';
      echo '<th>' . htmlspecialchars($row['create_ip']) . '</th>';
      echo '<th>' . htmlspecialchars($row['ext_token']) . '</th>';
      echo '<th><form method="post" action=""><div class="admin-input pull-left"><input name="dashmodpassword" id="dashmodpassword" class="form-control input-sm" type="password"><input name="dashuserid" id="dashuserid" type="hidden" value="' . $row['userid'] . '"></div><div class="pull-left"><button name="dashmodapply" id="dashmodapply" type="submit" class="btn btn-success" value="change">Change</button></div></form></th>';
      echo '</tr>';
    }
?>
    </tbody>
  </table>
</div>
<?php
  }else {
    echo "<div class='alert-center'><div id='alert-fade' class='alert alert-danger'><p><strong>Not permitted</strong></p></div></div>";
  }
}
require_once 'footer.php';
?>
