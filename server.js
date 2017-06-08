// ==============================
// Dependencies
// ==============================

var express 		= require("express");
var bodyparser 		= require("body-parser");
var mongojs 		= require("mongojs");
var mongoose 		= require("mongoose");
var exphbs			= require("express-handlebars");
var methodOverride	= require("method-override");

var router			= require("./controller/news_controller");
var app 			= express();
var PORT 			= process.env.PORT || 3000;

app.use(methodOverride("_method"));

var hbs 			= exphbs.create({
						defaultLayout: "main",
						partialsDir: ["views/partials/"]
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

var db 				= require("./models");

var request 		= require("request");
var cheerio 		= require("cheerio");

mongoose.Promise 	= Promise;


// ==============================
// Sets up the Express App
// ==============================
app.use(express.static("public"));

// Handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


// ==============================
// Mongoose
// ==============================
// Database configuration
mongoose.connect("mongodb://localhost/news-worthy");
var db 				= mongoose.connection;

// err message
db.on("err", function(err) {
  console.log("mongoose Err: ", err);
});
// success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ==============================
// Routes
// ==============================
app.use('/', router)
require("./routes/api-routes.js")(app);


// Set the app to listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port" + PORT);
});