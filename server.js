// ==============================
// 			Dependencies
// ==============================

var express = require("express");
var bodyparser = require("body-parser")
var mongojs = require("mongojs");
var mongoose = require("mongoose");

var Article = require("./models/Article.js")
var Note = require("./models/Note.js")

// Snatches HTML from URLs
var request = require("request");

// Scrapes our HTML
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/news-worthy");
var db = mongoose.connection;

// Show any mongoose errs
db.on("err", function(err) {
  console.log("mongoose Err: ", err);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ==============================
// 				Routes
// ==============================

// create a GET request to scrape the website 
app.get('/scrape', function(req, res) {

	// send a GET request with 2 arguments, the website, and a function with 3 parameters—the err, the response, and the html. 
	request("http://therealnews.com/t2/", function(err, res, html) {

		// Cheerio handles the the html portion of the request. We'll save that variable as a $
		var $ = cheerio.load(html);

		// With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
		$("valign").each(function(i, element) {
	   	
	   		// Make an empty array for saving our scraped info
			var result = {};


	   		result.title = $(this).children("a").text();
	    
	      	result.link = $(this).children("a").attr("href");
			
			var entry = new Article(result);

			// Now, save that entry to the db
	      	entry.save(function(err, doc) {
		        // Log any errors
		        if (err) {
		          console.log(err);
		        } else {
		          console.log(doc);
	        	}
	        })
		});
	})

	// With each link scraped, log the result to the console
	console.log("Finished Scrape");
});


// ==============================
// 				Routes
// ==============================


app.get("/", function(req, res) {
  res.send("News World");
});

// 2. At the "/all" path, display every entry in the animals collection
app.get("/articles", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  Article.find({}, function(err, found) {
    // Log any errs if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});