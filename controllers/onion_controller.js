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
        Article.find({}, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        });
    });
    
    // All Notes
    router.get('/notes', function(req, res) {
      Note.find({}, function(error, doc) {
        if (error) {
          res.send(error);
        } else {
          res.send(doc);
        }
      });
    });

    // Article Notes
    router.get('/article-notes', function(req, res) {
        Article.find({}).populate('notes')
        .exec(function(err, data) {
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        })
    });

    // Save Note to Article
    router.get('/article-notes/:id', function(req, res) {
        Article.findOne({ '_id': req.params.id })
        .populate('notes').exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
                res.json(doc);
            }
        });
    });

    // New note
    router.post('/submit', function(req, res) {
      
      var new_note = new Note(req.body);
      
      new_note.save(function(error, doc) {
      
        if (error) {
          res.send(error);
        } else {
      
          Article.findOneAndUpdate({}, { $push: { 'notes': doc._id } }, { new: true }, function(err, newdoc) {

            if (err) {
              res.send(err);
            } else {
              res.send(newdoc);
            }
          });
        }
      });
    });


    // // Saved notes
    // router.post('/note/:id', function(req, res) {
       
    //     var new_note = new Note(req.body);
       

    //     new_note.save(function(error, doc) {
    //         if (error) {
    //             console.log(error);
    //         } else {
    //             Article.findOneAndUpdate({ '_id': req.params.id}, {$push:{ 'note': doc._id }})
    //             .exec(function(err, doc) {
    //                 if (err) {
    //                     console.log(err);
    //                 } else {
    //                     res.send(doc);
    //                 }
    //             });
    //         }
    //     });
    // });

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