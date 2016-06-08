A fast and lightweight solution for quickly adding api keys to an Express application


## Installation

```bash
$ npm install apiwee
```


## the code to put it in

```js
var express = require('express');
var app = express();
var apiwee = require('apiwee')(
    express, app,
    {username: 'username', password: 'password'},
    {publicPaths: ['GET:/', 'GET:/health']}
);

app.use(apiwee);

app.listen(137);
```


## how it works

Apiwee is added to the Express middleware functionality, where it validates from a local file (slower than memory but can be updated dynamically).

then navigate to {yourDomain}:{yourPort}/apiwee/admin and login with the credentials provided in the instantiation
this will take you to the configurations page where you can define the keys and the routes. You can delete keys, add new ones, edit the key field, drag routes to the api key, and disable keys.

once your api keys are defined use them by using the header field `x-api-key`

this will work for all aws clusters if you pass in the following fields to the config
- awsRegion
- awsEnvironment
- awsInstanceName
- protocol
- port

## screenshots

![login](https://github.com/chemdrew/apiwee/raw/master/images/login.png "login")
![configure](https://github.com/chemdrew/apiwee/raw/master/images/configure.png "configure")