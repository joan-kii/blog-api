const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {type: String, required: true},
  text: {type: String, required: true},
  description: {type: String, required: true},
  slug: {type: String, required: true}
});

postSchema.pre('validate', function() {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true, 
      strict: true
    })
  }
});

module.exports = mongoose.model('Post', postSchema);
