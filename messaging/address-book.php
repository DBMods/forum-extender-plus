<p class='topline'>
	<form method='post' action='messages.php' class='menu'>
		<input type='hidden' name='action' value='compose'/>
		<?php echo '<input type="hidden" name="timeOffset" value="' . $_POST['timeOffset'] . '"/><input type="hidden" name="returnto" value="' . $_POST['returnto'] . '"/><input type="hidden" name="from" value="' . $_POST['from'] . '"/>'; ?>
		<select name='to'>
			<option value=''>Please Select a User</option>
			<optgroup label='--Mods--'>
				<option value='1618104'>Andy Y.</option>
				<option value='11096'>Chen S.</option>
				<option value='175532'>Chris J.</option>
				<option value='30385'>Mark Mc</option>
				<option value='67305'>N.N.</option>
				<option value='857279'>Nathan C.</option>
				<option value='643099'>R.M.</option>
				<option value='182504'>Rene S.</option>
				<option value='32911'>Sebastian H.</option>
				<option value='222573'>thightower</option>
			</optgroup>
			<optgroup label='--Regulars--'>
				<option value='434127'>Rich R.</option>
			</optgroup>
		</select>
		<br>
		<button type='submit'>
			Message User
		</button>
	</form>
</p>