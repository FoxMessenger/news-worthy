var mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	link: {
		type: String,
		required: true,
		trim: true     
	},
	image: {
		type:String,
		required: false,
		trim: true
	},
	notes: [{
		type: Schema.Types.ObjectId,
		ref: 'Note'
	}]
});

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;