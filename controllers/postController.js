const Post = require('../models/postModel');

exports.post_detail_get = function(req, res, next) {
  Post.findOne({slug: req.params.slug}, 'title text')
      .exec(function(err, post) {
        if (err) next(err);
        res.json(post);
      })
};
