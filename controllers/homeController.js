const Post = require('../models/postModel');

exports.home_page = function(req, res, next) {
  Post.find({}, 'title description slug messages')
    .exec(function (err, posts) {
      if (err) next(err);
      res.json(posts);
    })
};
