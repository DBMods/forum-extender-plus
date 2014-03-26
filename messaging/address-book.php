<?php
$showinbox = false;
?>
<h2>Address Book</h2>
<p class='topline'>
<p>
	If you're not in this list, and consider yourself a regular, or are a Super User, message Andy (ID 1618104) to get added to the list.
</p>
<form method='post' action='messages.php' class='menu'>
	<input type='hidden' name='action' value='compose' />
	<select name='msgto' class='form-control'>
		<option value=''>Please Select a User</option>
		<optgroup label='--Mods--'>
			<option value='Andy Y.'>Andy Y.</option>
			<option value='Chris J.'>Chris J.</option>
			<option value='Mark Mc'>Mark Mc</option>
			<option value='Nathan C.'>Nathan C.</option>
			<option value='R.M.'>R.M.</option>
			<option value='thightower'>thightower</option>
		</optgroup>
		<optgroup label='--Regulars--'>
			<option value='Rich R.'>Rich R.</option>
		</optgroup>
	</select>
	<br>
	<button type='submit' class='btn btn-success'>
		Message User
	</button>
</form>
</p>
