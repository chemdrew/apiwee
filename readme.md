A fast and lightweight solution for quickly adding api keys to an Express application


## Installation

```bash
$ npm install apiwee
```

## the code to put it in

```js
var express = require('express');
var app = express();
var apiweeConfig = {
    username: 'username', // required
    password: 'password', // required
    publicPaths: ['GET:/', 'GET:/health'] // optional
}
var apiwee = require('apiwee')(express, app,apiweeConfig);

app.use(apiwee);

app.listen(3000);
```


## how it works

Apiwee is added to the Express middleware functionality, where it validates from a local file (slower than memory but can be updated dynamically).

then navigate to {yourDomain}:{yourPort}/apiwee/admin and login with the credentials provided in the instantiation
this will take you to the configurations page where you can define the keys and the routes. You can delete keys, add new ones, edit the key field, drag routes to the api key, and disable keys.

once your api keys are defined use them by using the header field `x-api-key`

username and password are shown hard-coded in the config but use your best judgement on how to pass them into the instantiation.

## handling multiple instances


### aws asg group

ensure that each aws instance has permissions for running the aws cli command _describe-instances_
it also requires you to use the tags `Environment` and `Name` for the groups

below are the required fields for setting up the api keys on all instances in your aws asg group
```js
var apiweeConfig = {
    username: 'username',
    password: 'password',
    awsRegion: 'us-east-1',
    awsEnvironment: 'development',
    awsInstanceName: 'myApp',
    protocol: 'http/https',
    port: 3000
}
var apiwee = require('apiwee')(express,app,apiweeConfig);
```

### hard-coded ips

below is the required config for scaling your api keys across instances using their addresses
_Include *all* ips, including the address it is running on_
```js
var apiweeConfig = {
    username: 'username',
    password: 'password',
    ips: ['1.1.1.1', '1.1.1.2', '1.1.1.3'],
    protocol: 'http/https',
    port: 3000
}
var apiwee = require('apiwee')(express,app,apiweeConfig);
```

## screenshots

![login](https://github.com/chemdrew/apiwee/raw/master/images/login.png "login")
![configure](https://github.com/chemdrew/apiwee/raw/master/images/configure.png "configure")