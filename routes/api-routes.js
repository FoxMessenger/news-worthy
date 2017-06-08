// ==============================
// Dependencies
// ==============================
// var Article = require("./models/Article.js")
// var Note = require("./models/Note.js")


// ==============================
// Routes
// ==============================

module.exports = function(app) {
	
	// Main Page
	app.get('/', function(req, res){
		res.redirect("/"); 
	});

	// Clicking on the Title or the Navbar Brand will scrape the Onion
	app.get('/scrape', function(req, res) {
		
		
		// GET request with 2 arguments: the website, and a function with 3 parameters: error, the response, and the html. 
		request("http://www.theonion.com/", function(err, res, html) {
		

			// Cheerio handles the the html portion of the request. We'll save that variable as a $
			var $ = cheerio.load(html);
		
			// Looking in the summary class tag for our titles and information	
			$(".summary").each(function(i, element) {
		   	
		   		// Store the result in an empty object 
				var result = {};

				// Result 1 is the Title name
		   		result.title = $(this).find('.headline').children('a').attr('title');
		    
		    	// Result 2 is the link
		      	result.link = $(this).find(".headline").attr("href");
				
				// Entry variable creates a new Article component with the results inside of it
				var entry = new Article(result);

				// Save the new entry, which now contains the Article results using the Mongoose method .save()
		      	entry.save(function(err, doc) {
			        
			        if (err) {
			          console.log(err);
			        } else {
			          console.log(doc);
		        	}
		        })
		        
			});

		})

		// With each link scraped, log the result to the terminal
		console.log("Finished Scrape");
		// Bring us back to the main screen
		res.redirect("/articles")
	});


	// ==============================
	// 				Routes
	// ==============================


	// 2. At the "/articles" path, display every entry in the collection that we've scraped
	app.get("/all-articles", function(req, res) {
	  
	  //  Query the collection, then "find" everything in it
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

	// // This will get the articles we scraped from the mongoDB
	// app.get("/articles", function(req, res) {
	//   // Grab every doc in the Articles array
	//   Article.find({}, function(error, doc) {
	//     // Log any errors
	//     if (error) {
	//       console.log(error);
	//     }
	//     // Or send the doc to the browser as a json object
	//     else {
	//       res.json(doc);
	//     }
	//   });
	// });

	// // Grab an article by it's ObjectId
	// app.get("/articles/:id/note", function(req, res) {
	//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	//   Article.findOne({ "_id": req.params.id })
	//   // ..and populate all of the notes associated with it
	//   .populate("note")
	//   // now, execute our query
	//   .exec(function(error, doc) {
	//     // Log any errors
	//     if (error) {
	//       console.log(error);
	//     }
	//     // Otherwise, send the doc to the browser as a json object
	//     else {
	//       res.json(doc);
	//     }
	//   });
	// });


	// // Create a new note or replace an existing note
	// app.post("/articles/:id", function(req, res) {
	//   // Create a new note and pass the req.body to the entry
	//   var newNote = new Note(req.body);

	//   // And save the new note the db
	//   newNote.save(function(error, doc) {
	//     // Log any errors
	//     if (error) {
	//       console.log(error);
	//     }
	//     // Otherwise
	//     else {
	//       // Use the article id to find and update it's note
	//       Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
	//       // Execute the above query
	//       .exec(function(err, doc) {
	//         // Log any errors
	//         if (err) {
	//           console.log(err);
	//         }
	//         else {
	//           // Or send the document to the browser
	//           res.send(doc);
	//         }
	//       });
	//     }
	//   });
	// });
}