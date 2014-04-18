var client = new Dropbox.Client({
	key: datastoreKey
});

//Delete table
function deleteTable(table) {
	var records = table.query();
	for (var i = 0; i < records.length; i++) {
		records[i].deleteRecord();
	}
}

//Start authentication process
client.authenticate();

//Try to finish OAuth authorization
client.authenticate({
	interactive: false
}, function(error) {
	if (error) {
		console.log('Auth error. Retrying');
		document.location.reload();
	}
});
if (client.isAuthenticated()) {
	client.getDatastoreManager().openDefaultDatastore(function(error, datastore) {
		if (error) {
			console.log('Error opening default datastore. Rerying');
			document.location.reload();
		}

		//Get table
		var configTable = datastore.getTable('config');

		token = configTable.query({
			name: 'userToken'
		});
		if (token.length > 0)
			token[0].set('value', messageToken);
		else
			prefTable.insert({
				name: 'userToken',
				value: messageToken
			});
	});
}
