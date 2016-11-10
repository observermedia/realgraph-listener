var express = require('express');
var app = express();
app.use(allowCrossDomain);

var pg = require('pg');
var aws = require('aws-sdk');

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

app.get('/realgraph/entities_data', function (request, response) {
  var aws_config = {
    region: process.env.DYNAMO_REGION_NAME
  };

  aws.config.update(aws_config);
  var DynamoClient = new aws.DynamoDB.DocumentClient();

  var query_params = {
    TableName: "EntityContent",
    KeyConditionExpression: "#url = :current_url",
    ExpressionAttributeNames: {
      "#url": "article_url"
    },
    ExpressionAttributeValues: {
      ":current_url": request.query.url
    }
  };

  DynamoClient.query(query_params, function(err, data) {
    if (err) {
      console.error(err);
      response.send("Error" + err);
      response.json({status: false});
    } else {
      if (data.Count > 0) {
        var item = data.Items[0];
        var result = {
          buildings: item.buildings.length > 0 ? item.buildings : [],
          activities: item.activities.length > 0 ? item.activities : [],
          organizations: item.organizations.length > 0 ? item.organizations : [],
          people: item.people.length > 0 ? item.people : [],
          status: true
        };
        response.json(result);
      } else {
        response.json({status: false})
      }
    }
  })

});

app.use(express.static(__dirname + '/beacon'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


