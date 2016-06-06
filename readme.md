<img src="https://github.com/chemdrew/apiwee/raw/master/images/ooooWeeee.png" width="100" height="292">

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

the changes will only work for the instance it is running on, so if you are running multiple instances of the app you will need to add the api key configurations to each one. (already planning the best way to make this work across instances though)


## screenshots

![login](https://github.com/chemdrew/apiwee/raw/master/images/login.png "login")
![configure](https://github.com/chemdrew/apiwee/raw/master/images/configure.png "configure")