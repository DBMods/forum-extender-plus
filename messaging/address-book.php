<h2>Address Book</h2>
<p class='topline'>
<p>
	If you're not in this list, and consider yourself a regular, or are a Super User, message Andy (ID 1618104) to get added to the list.
</p>
<form method='post' action='messages.php' class='menu'>
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
	<button type='submit' class='btn btn-success'>
		Message User
	</button>
</form>
</p>
