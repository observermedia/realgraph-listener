var express = require('express');
var app = express();

var ALLOWED_ADDRESSES = ['https://commercialobserver.com', 'http://staging.commercialobserver.com/'];

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

function getPathFromUrl(url) {
  return url.split(/[?#]/)[0];
}

function isAllowedAddress(addr) {
  for (var i=0 ; i<ALLOWED_ADDRESSES.length ; i++){
    if (addr.startsWith(ALLOWED_ADDRESSES[i])){
      return true
    }
  }
  return false
}

app.use(allowCrossDomain);

var pg = require('pg');
var aws = require('aws-sdk');

app.set('port', (process.env.PORT || 5000));

// this should just return a status true or something
app.get('/', function(request, response) {
  response.json({status: true, code: 'realgraph-listen'});
});

app.get('/realgraph/listen', function(request, response) {
  if (!isAllowedAddress(request.query.url)) {
    response.json({status: false, message: 'Address not allowed'});
    return;
  }

  var urlPath = getPathFromUrl(request.query.url);
	var queryString = "INSERT INTO realgraph_pings(url, hash) VALUES ($1, md5($2))";
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(queryString, [urlPath, urlPath], function(err, result) {
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
  var urlPath = getPathFromUrl(request.query.url);

  var query_params = {
    TableName: "EntityContent",
    KeyConditionExpression: "#url = :current_url",
    ExpressionAttributeNames: {
      "#url": "article_url"
    },
    ExpressionAttributeValues: {
      ":current_url": urlPath
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
        response.json({
          // status: false,
          // description: 'This URL does not exist in Entity Content Database'}
            status: true,
            organizations: [{
                name: "Rabsky Group",
                types: "Owner",
                url : "https://realgraph.co/organizations/rabsky-group"}],
            buildings: [],
            activities: [],
            people: []
            }
          )
      }
    }
  })

});

app.use(express.static(__dirname + '/beacon'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


