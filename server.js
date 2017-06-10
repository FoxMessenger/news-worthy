// ==============================
// Dependencies
// ==============================

	var express 	= require('express');
	var bodyParser 	= require('body-parser')
	var handlebars 	= require('handlebars');
	var app 		= express();

	var mongojs 	= require('mongojs');
	var mongoose 	= require('mongoose');

	var exphbs 		= require('express-handlebars');
	var hbs 		= exphbs.create({
						defaultLayout: 'main',
						partialsDir: ['views/partials/']
	});

	// var Article 	= require('./models/Article.js')
	// var Note 		= require('./models/Note.js')


// ==============================
// Sets up the Express App and Data Parsing
// ==============================

	app.use(express.static('public'));
	var PORT 		= process.env.PORT || 3000;

	app.use(express.static(process.cwd() + '/public'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.text());
	app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// ==============================
// Mongoose
// ==============================

	// Mongoose Database configuration
	mongoose.Promise= Promise;
	mongoose.connect('mongodb://localhost/news-worthy');
	var db 			= mongoose.connection;

	// Mongoose err message
	db.on('err', function(err) {
	  console.log('mongoose Err: ', err);
	});
	// Mongoose success message
	db.once('open', function() {
	  console.log('Mongoose connection successful.');
	});

// ==============================
// Handlebars
// ==============================

	app.engine('handlebars', hbs.engine);
	app.set('view engine', 'handlebars');

// ==============================
// Controllers
// ==============================
	var scraper 	= require('./controllers/scraper_controller.js');
	var router		= require('./controllers/router_controller.js');
	

// ==============================
// Routes
// ==============================
	app.use('/', scraper);
	app.use('/', router);
	

	// require('./routes/html-routes.js')(app);
	// require('./routes/api-routes.js')(app);

// ==============================
// Run Server
// ==============================
	app.listen(PORT, function() {
		console.log('App running on port ' + PORT);
	});


