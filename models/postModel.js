const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {type: String, required: true},
  text: {type: String, required: true},
  description: {type: String, required: true},
  slug: {type: String, required: true},
  published: {type: Boolean, required: true},
  comments: {type: Array, required: true}
});

postSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true, 
      strict: true
    })
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
