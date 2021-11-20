const Post = require('../models/postModel');

exports.posts_list_get = function(req, res, next) {
  Post.find({}, 'title description slug published')
      .exec(function(err, posts) {
        if (err) next(err);
        res.json(posts);
      })
};

exports.post_detail_get = function(req, res, next) {
  Post.findOne({slug: req.params.slug}, 'title text messages slug published')
      .exec(function(err, post) {
        if (err) next(err);
        res.json(post);
      })
};

exports.posts_publish_post = function(req, res, next) {
  Post.findOne({slug: req.body.slug}, (err, post) => {
    if (err) next(err);
    post.published = !post.published;
    post.save(err => {
      if (err) return next(err);
      res.status(200).send();
    })
  })
};
