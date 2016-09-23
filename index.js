var express = require('express');
var app = express();

var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

// this can be removed
app.use(express.static(__dirname + '/public'));

// this can be removed
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// this should just return a status true or something
app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/realgraph/listen', function(request, response) {
	request.query.url
	var queryString = "INSERT INTO realgraph_pings(url, hash) VALUES (" + request.query.url + ", md5(" + request.query.url +"))";
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(queryString, function(err, result) {
			done();
			if (err)
				{ console.error(err); response.send("Error " + err); }
			else
				{ response.json({status: true}); }
		});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


