# realgraph-listener

Realgraph Listener listens for the Realgraph beacon installed on webpages.  It is a barebones Node.js app using [Express 4](http://expressjs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:observermedia/realgraph-listener.git 
$ cd realgraph-listener
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
## Documentation

Realgraph Listener

1. Listens for 'pings' to /realgraph/listen
2. Writes { timestamp, url, hash(url) } to a PostgreSQL database
3. Responds with a status code or with valid JSON that may be rendered by a client

## Realgraph Beacon

Insert the following script onto any page you'd like to track using the Realgraph </body>.

```
<script type='text/javascript' async="async" src='http://realgraph-listener.herokuapp.com/beacon.js'></script>
```

In order to display information about entities mentioned in the article, put the following div elements on your page:

```
<div id="realgraph-buildings-data"></div>
<div id="realgraph-organizations-data"></div>
<div id="realgraph-people-data"></div>
<div id="realgraph-activities-data"></div>
```
Entities data will be inserted into those divs.

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)


```
$ heroku pg:psql

> create table realgraph_pings (
	created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp, 
	url VARCHAR(500), 
	hash TEXT
);

> insert into realgraph_pings (url, hash) values ('http://www.example.com/some/url', md5('http://www.example.com/some/url'));
```

To delete content from the table:
```
DELETE FROM realgraph_pings;

```