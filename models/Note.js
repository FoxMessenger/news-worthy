// Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create the new Schema
var NoteSchema = new Schema({

	title: {
		type: String
	},

	body:{ 
		type: String
	}
});


var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;