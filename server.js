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

// Without usage of Promise the value is depricated
mongoose.Promise = Promise;

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
	request("http://www.theonion.com/", function(err, res, html) {
	

		// Cheerio handles the the html portion of the request. We'll save that variable as a $
		var $ = cheerio.load(html);
	
		
		$(".summary").each(function(i, element) {
	   	
			var result = {};
			// console.log("result")

	   		result.title = $(this).text();
			// console.log("result.title")	    
	    
	      	result.link = $(this).find("a").attr("href");
			// console.log("result.link")	    
		
			var entry = new Article(result);
			// console.log("result.Article")
	    
	      	entry.save(function(err, doc) {
		        // Log any errors
		        if (err) {
		          console.log(err);
		        } else {
		          console.log(doc);
		          // console.log("result.doc")
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

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id/note", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});