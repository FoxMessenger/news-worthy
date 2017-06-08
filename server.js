// ==============================
// Dependencies
// ==============================

var express = require("express");
var bodyparser = require("body-parser")
var mongojs = require("mongojs");
var mongoose = require("mongoose");
// var env = require('dotenv').load();
var Article = require("./models/Article.js")
var Note = require("./models/Note.js")
var request = require("request");
var cheerio = require("cheerio");

// Without usage of Promise the value is depricated
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// ==============================
// Sets up the Express App
// ==============================
app.use(express.static("public"));
// var PORT = process.env.PORT || 3000;

// ==============================
// Mongoose
// ==============================
// Mongoose Database configuration
mongoose.connect("mongodb://localhost/news-worthy");
var db = mongoose.connection;

// Mongoose err message
db.on("err", function(err) {
  console.log("mongoose Err: ", err);
});
// Mongoose success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ==============================
// Handle data parsing set up
// ==============================
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.text());
// app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// ==============================
// Routes
// ==============================
require("./routes/api-routes.js")(app);


// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});