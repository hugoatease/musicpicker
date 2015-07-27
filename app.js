var express = require('express');
var errorHandler = require('express-error-handler')
var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')

var config = require('config');

var passport = require('passport');

var auth = require('./routes/oauth');
var account = require('./routes/account');
var devices = require('./routes/devices');
var metadata = require('./routes/metadata');

var app = express();
app.use(errorHandler());
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

var expressStatsd = require('express-statsd');
var lynx = require('lynx');
var statsd = require('./statsd');
app.use(expressStatsd({
	client: new lynx(config.get('statsd.host'), config.get('statsd.port'))
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(cookieSession({
  'name': 'session',
  'keys': ['N7kgMzjcDlngLKDIyxKltffPLVRWMPhN/kT1hg/DHEE=']
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', account);
app.use('/oauth', auth);
app.use('/api/devices', devices);
app.use('/api', metadata);

app.get('*', statsd('home'),
  function(req, res) {
  res.render('home');
});

module.exports = app;
