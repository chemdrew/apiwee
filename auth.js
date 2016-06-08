var fs = require('fs');
var apiKeysFileLocation = __dirname + '/applicationKeys.json';

var publicPaths = [];
var awsInfo = {
    region: undefined,
    environment: undefined,
    instanceName: undefined,
    protocol: undefined,
    port: undefined
}

module.exports = function(express, app, user, config) {
    publicPaths = config ? publicPaths.concat(config.publicPaths) || publicPaths : publicPaths;
    aws.region = config.awsRegion;
    aws.environment = config.awsEnvironment;
    aws.isntanceName = config.awsInstanceName;
    aws.protocol = config.protocol;
    aws.port = config.port;

    require(__dirname+'/configurationManager')(express, app, user, apiKeysFileLocation, fs, awsInfo);
    return auth;
};

function auth(req, res, next){
    var i = 0;
    for (i; i < publicPaths.length; i++) {
        var regex = regexify(publicPaths[i]);
        if (regex.test(`${req.method}:${req.path}`)) {
            return next();
        }
    }
    var requestKey = req.headers['x-api-key'];
    if (!requestKey) return res.sendStatus(401);

    fs.readFile(apiKeysFileLocation, (err, data) => {
        if (err) throw err;
        var applicationKeys = JSON.parse(data.toString());
        if (isValid(requestKey, applicationKeys, req)) return next();
        return res.sendStatus(401);
    });
}

function isValid(key, keys, req) {
    var path = req.path;
    if (path.charAt(path.length-1) == '/') path = path.substring(0, path.length-1);
    var permissionInfo = keys[key];
    if (!permissionInfo) return false;
    var validRoutes = permissionInfo.routes;
    var i = 0;
    for (i; i < validRoutes.length; i++) {
        var regex = regexify(validRoutes[i]);
        if (regex.test(`${req.method}:${path}`)) {
            if (!permissionInfo.locked) return true;
            break;
        }
    }
    return false;
}

function regexify(path) {
    var regexstr = path.replace(/\/:.*?\/\s?/, '\/(?:([^\/]+?))\/');
    regexstr = regexstr.replace(/\/:.*?.*\s?/, '\/(?:([^\/]+?))');
    regexstr += '\/?$';
    return new RegExp(regexstr);
}