var bodyParser = require('body-parser');

module.exports = function(express, app, apiKeysFileLocation, fs) {
    var sessionExpireation = 1800000; //30min
    var session = {
        key: '',
        expires: 0
    };

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use('/andrewsKeyManagementTool', express.static(__dirname + '/public'));

    app.get('/andrewsKeyManagementTool/admin',function(req, res){
        var loginPage = fs.readFileSync(__dirname + '/public/login.html').toString();
        return res.send( loginPage );
    });

    app.post('/andrewsKeyManagementTool/login',function(req, res){
        // use crypto here, add multiple users, check for default and force change
        var user = JSON.parse(fs.readFileSync(__dirname + '/user.json').toString());
        if (user.username == req.body.username && user.password == req.body.password) {
            session.key = randomString(25);
            session.expires  = Date.now() + sessionExpireation;
            return res.redirect( '/andrewsKeyManagementTool/admin/redirected?id='+session.key );
        } else {
            return res.sendStatus(401);
        }
    });

    app.get('/andrewsKeyManagementTool/admin/redirected',function(req, res){
        if (req.query.id === session.key && Date.now() <= session.expires) {
        // if (true) {
            session.expires  = Date.now() + sessionExpireation;
            var configurationPage = fs.readFileSync(__dirname + '/public/configuration.html').toString();

            var applicationKeys = JSON.parse(fs.readFileSync(apiKeysFileLocation).toString());
            var keysBuilder = [];
            var i = 0, j = 0;
            for (var apiKey in applicationKeys) {
                keysBuilder.push(
                `<li>
                    <div class="key-name">${apiKey}</div>
                    <div class="key-status">locked: ${applicationKeys[apiKey].locked}</div>
                    <div class="key-ips">${applicationKeys[apiKey].ips.join(', ')}</div>
                    <ul>`
                );
                for (i; i < applicationKeys[apiKey].routes.length; i++) {
                    keysBuilder.push(
                        `<li>
                            <div class="key-route">${applicationKeys[apiKey].routes[i]}</div>
                            <div class="key-count">${applicationKeys[apiKey].counts[i]}</div>
                        </li>`
                    );
                }
                keysBuilder.push(
                    `</ul>
                </li>`
                );
            }
            var routes = app._router.stack;
            var routesBuilder = [];
            i = 0, j = 0;
            for (i; i < routes.length; i++) {
                if (routes[i].route) {
                    j = 0;
                    for (j; j < routes[i].route.stack.length; j++) {
                        routesBuilder.push(
                        `<li>
                            <div class="routes-method">${routes[i].route.stack[j].method}</div>
                            <div class="routes-path">${routes[i].route.path}</div>
                        </li>`
                        );
                    }
                }
            }
            configurationPage = configurationPage.replace( '<^_^>', keysBuilder.join(''));
            configurationPage = configurationPage.replace( '<O.o>', routesBuilder.join(''));
            return res.send( configurationPage );
        } else {
            return res.sendStatus(401);
        }
    });
}

function randomString(length, characters) {
    var text = '';
    characters = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    length = length || 25;

    for( var i=0; i < length; i++ )
        text += characters.charAt(Math.floor(Math.random() * characters.length));
    return text;
}