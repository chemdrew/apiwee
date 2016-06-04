var bodyParser = require('body-parser');
var sessionId;

module.exports = function(express, app, user, apiKeysFileLocation, fs) {
    var apiweeApp = express();
    app.use(apiweeApp);

    apiweeApp.use(bodyParser.json({
        type: 'application/json'
    }));
    apiweeApp.use(bodyParser.urlencoded({
        extended: true
    }));

    apiweeApp.use('/apiwee', express.static(__dirname + '/public'));

    apiweeApp.get('/apiwee/admin',function(req, res){
        var loginPage = fs.readFileSync(__dirname + '/public/login.html').toString();
        return res.send( loginPage );
    });

    apiweeApp.post('/apiwee/login',function(req, res){
        if (user.username == req.body.username && user.password == req.body.password) {
            sessionId = randomString(50);
            return res.redirect( '/apiwee/configurations?id='+sessionId );
        } else {
            return res.redirect( '/apiwee/admin' );
        }
    });

    apiweeApp.get('/apiwee/configurations',function(req, res){
        if (sessionId && sessionId === req.query.id) {
            sessionId = undefined;
            var configurationPage = fs.readFileSync(__dirname + '/public/configuration.html').toString();

            var applicationKeys = JSON.parse(fs.readFileSync(apiKeysFileLocation).toString());
            var keysBuilder = [];
            var i = 0, j = 0;
            for (var apiKey in applicationKeys) {
                keysBuilder.push(
                `<li class="api-key-config">
                    <div class="drop-cover" ondrop="drop(event)" ondragover="dragover(event)" ondragleave="dragleave(event)"></div>
                    <div class="key-name" contenteditable="true">${apiKey}</div><div class="key-remove">delete</div>
                    <div class="active-toggle">
                        <div class="active-title">active</div>
                        <div class="toggle-button active-${!applicationKeys[apiKey].locked}">
                            <button></button>
                        </div>
                    </div>
                    <ul class="permitted-routes">`
                );
                for (i; i < applicationKeys[apiKey].routes.length; i++) {
                    keysBuilder.push(
                        `<li>
                            <div class="key-route">${applicationKeys[apiKey].routes[i]}</div>
                            <div class="key-remove">×</div>
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
                        `<li draggable="true" ondragstart="dragstart(event)" ondragend="dragend(event)">
                            <div class="available-route">${routes[i].route.stack[j].method.toUpperCase()}:${routes[i].route.path}</div>
                        </li>`
                        );
                    }
                }
            }
            configurationPage = configurationPage.replace( '<^_^>', keysBuilder.join(''));
            configurationPage = configurationPage.replace( '<O.o>', routesBuilder.join(''));
            res.send( configurationPage );
        } else {
            sessionId = undefined;
            return res.redirect( '/apiwee/admin' );
        }
    });

    apiweeApp.patch('/apiwee/configurations',function(req, res){
        if (req.body.username == user.username && req.body.password == user.password) {
            delete req.body.username;
            delete req.body.password;
            var applicationKeys = req.body;
            if (validApplicationKeys(applicationKeys)) {
                fs.writeFile(apiKeysFileLocation, JSON.stringify(applicationKeys), (err) => {
                    if (err) return res.sendStatus(500);
                    res.sendStatus(204);
                });
            } else {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(401);
        }
    });
}

function validApplicationKeys(applicationKeys) {
    if ( typeof applicationKeys !== 'object' ) return false;
    var keys = Object.keys(applicationKeys);
    var i = 0;
    for (i; i < keys.length; i++) {
        var keys2 = Object.keys(applicationKeys[keys[i]]);
        if ( keys2.length != 2 || !Array.isArray(applicationKeys[keys[i]].routes) || keys2.indexOf('locked') < 0 ) return false;
    }
    return true;
}

function randomString(length, characters) {
    var text = '';
    characters = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    length = length || 25;

    for( var i=0; i < length; i++ )
        text += characters.charAt(Math.floor(Math.random() * characters.length));
    return text;
}