// ==============================
// Dependencies
// ==============================
    var mongojs = require('mongojs');
    var express = require('express');
    var router = express.Router();
    
    var Article = require('../models/Article.js');
    var Note = require('../models/Note.js');

// ==============================
// Routes
// ==============================

// module.exports = function(app) {

    // Main Page
    router.get('/', function(req, res) {
        res.render('index');
    });

    // Articles Page
    router.get('/articles', function(req, res) {
        res.render('articles');
    });

    // retrieve all articles scraped
    router.get('/all-articles', function(req, res) {
        Article.find({}, function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
            }
        });
    });
    

    // All Notes
    router.get('/notes', function(req, res) {
        Note.find({}, function(err, doc) {
            
            if (err) {
                res.send(err);
            } else {
                res.send(doc);
            }
        });
    });


    // Populate Notes to Articles
    router.get('/article-notes/:id', function(req, res) {
        Article.findOne({ '_id': req.params.id }).populate('notes').exec(function(err, doc) {
            
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
            }
        })
    });


    // New note
    router.post('/notes/:id', function(req, res) {
      
        var new_note = new Note(req.body);

        new_note.save(function(err, doc) {
      
            if (err) {
                res.send(err);
            } else {
          
                Article.findOneAndUpdate({ '_id': req.params.id }, {$push:{ 'notes': doc._id }}).exec(function(err, doc) {
                        
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }
                });
            }
        });
    });


    // // Remove notes
    // router.get('/remove-note/:id', function(req, res) {
    //     var note_id = req.params.id;
    //     Note.findOneAndRemove({ '_id': req.params.id }, function(err, response) {
    //         if (err) throw err;
    //         Article.update({ 'notes': req.params.id }, {$pull: {'notes': req.params.id }})
    //         .exec(function(err, doc) {
    //             if (err) throw err;
    //             res.json(doc);
    //         })
    //     });
    // });


module.exports = router; // routers have more modular options than app.