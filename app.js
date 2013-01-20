var express = require('express')
			  , path = require('path')
			  , stylus = require('stylus')
			  , nib = require('nib')
			  , i18n = require('i18next');

i18n.init({
    saveMissing: true,
    debug: true
});

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.configure(function(){
  app.use(express.bodyParser());
  app.use(i18n.handle);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(app.router);
  app.use(require('stylus').middleware(
     { src : __dirname + '/public' ,
	   compile: compile
	 } ));
  app.use(express.static(path.join(__dirname, 'public')));
});

i18n.registerAppHelper(app)
    .serveClientScript(app)
    .serveDynamicResources(app)
    .serveMissingKeyRoute(app);
	
app.get('/', function(req, res) {
	res.render('index', { title: 'Localization with Express, Jade and i18next-node' });
});

app.listen(process.env.VCAP_APP_PORT || 3000);
