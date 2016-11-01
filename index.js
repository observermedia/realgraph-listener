var express = require('express');
var app = express();

var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

// this should just return a status true or something
app.get('/', function(request, response) {
  response.json({status: true, code: 'realgraph-listen'});
});

app.get('/realgraph/listen', function(request, response) {
	//request.query.url
	//request.url
	var queryString = "INSERT INTO realgraph_pings(url, hash) VALUES ($1, md5($2))";
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(queryString, [request.query.url, request.query.url], function(err, result) {
			done();
			if (err)
				{
					console.error(err);
					response.send("Error " + err);
					response.json({status: false});
				}
			else
				{
					response.json({status: true});
				}
		});
	});
});

app.use(express.static(__dirname + '/beacon'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


