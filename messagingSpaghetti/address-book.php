<form method='post' action='' class='menu'>
	<input type='hidden' name='action' value='compose' />
	<select name='msgto' class='form-control'>
	<?php
	$showinbox = false;
	$result = mysqli_query($db, 'SELECT * FROM `users` ORDER BY `username` ASC');
	while($row = mysqli_fetch_assoc($result)) {
		$uname = $row['username'];
		echo '<option value="' . $uname . '">' . $uname . '</option>';
	}
	?>
	</select>
	<br>
	<button type='submit' class='button blue'>
		Message User
	</button>
</form>
