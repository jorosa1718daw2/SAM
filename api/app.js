
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');
var methodOverride = require('method-override')
var user = require('./routes/users');
var http = require('http');
var path = require('path');
var errorhandler = require('errorhandler');
var cors = require('cors');


var app = express();

// all environments

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
//app.use(express.favicon());
app.use(logger('dev')); 
app.use(bodyParser());
app.use(methodOverride());

var whitelist = [ 'http://localhost:4200' , 'http://localhost:3000' ],
    corsOptions = {
        origin: function(origin, cb) {
            console.log(origin);
            cb(null, whitelist.indexOf(origin) != -1);
        },
        credentials: true
    };

app.use(cors( corsOptions) );
app.options('*', cors(corsOptions));
app.enable('trust proxy');
app.disable('etag');

//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorhandler());
}

require('./routes')(app);

//app.user('/',routes);


http.createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
});
