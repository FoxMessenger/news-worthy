// ==============================
// Dependencies
// ==============================
    var mongojs     = require('mongojs');
    var express     = require('express');
    var router      = express.Router();
    var request     = require('request'); // I couldn't keep this in the server side for some reason
    var cheerio     = require('cheerio');

    var Article     = require('../models/Article.js');
    var Note        = require('../models/Note.js');

// ==============================
// Routes
// ==============================
module.exports  = function(app) {

    app.get('/scrape', function(req, res) {
        
        
        // GET request with 2 arguments: the website, and a function with 3 parameters: error, the response, and the html. 
        request('http://www.theonion.com/', function(err, res, html) {
        

            // Cheerio handles the the html portion of the request. We'll save that variable as a $
            var $ = cheerio.load(html);
        
            // Looking in the summary class tag for our titles and information  
            $('.summary').each(function(i, element) {
            
                // Store the result in an empty object 
                var result = {};

                result.title = $(this).find('.headline').children('a').attr('title');
                result.link = $(this).find('.headline').children('a').attr('href');
                result.image = $(this).find('.headline').children('a')
                
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
        console.log('Finished Scrape');
        // Bring us back to the main screen
        res.redirect('/')
    });

                // //add type, title, link, teaser and image into result object
                // result.type = $(this).children('h2').text();
                // result.title = $(this).find('h1').text();
                // result.link = $(this).children('a').attr('href');
                // result.teaser = $(this).children('a').eq(1).text();
                // result.image = $(this).parent().find('img').attr('src');
                // // console.log('The title is...' + result.title);
                // Article.findOne({ 'title': result.title}, function(err, response) {
                //     console.log('The response is.....' + response);
                //     if (response === null) {
                //         //Inserts a new entry in Article collection
                //         var entry = new Article(result);
                //         //If the title and link is valid insert the entry.
                //         if (result.title && result.link) {
                //             entry.save(function(err, doc) {
                //                 if (err) {
                //                     console.log(err);
                //                 } else {
                //                     console.log(doc);
                //                 }
                //             });
                //         }
                //     } else {
                //         console.log('Duplicate entry found');

}