// Handle to wait for db connection
var mongo = require('mongodb');


//- Utility functions

// Init database
exports.waitConnection = function(settings, callback) {
	var waitTime = settings.database.waitdb;
	if (waitTime) {
		var timer = setInterval(function() {

			var client = createConnection(settings);

			// Open the db
			client.connect(function(err, client) {
				if (!err) {
					clearInterval(timer);
					callback(client);
				} else {
					console.log("Waiting for DB... ("+err.name+")");
				}
			});
		}, waitTime*1000);
	} else {
		var client = createConnection(settings);

		// Open the db
		client.connect(function(err, client) {
			if (!err) {
				callback(client);
			} else {
				callback();
			}
		});
	}
};

function createConnection(settings) {
	return new mongo.MongoClient(
		(process.env.MONGO_URL || 'mongodb://'+settings.database.server+':'+settings.database.port)+'/'+settings.database.name,
		{auto_reconnect: false, w:1, useNewUrlParser: true, useUnifiedTopology: true });
}
