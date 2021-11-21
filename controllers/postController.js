const Post = require('../models/postModel');

exports.posts_list_get = function(req, res, next) {
  Post.find({}, 'title description slug published comments')
      .exec(function(err, posts) {
        if (err) next(err);
        res.json(posts);
      })
};

exports.posts_detail_get = function(req, res, next) {
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

exports.posts_delete_comment_post = function(req, res, next) {
  Post.findOne({slug: req.body.slug}, (err, post) => {
    if (err) next(err);
    post.comments.splice(req.body.index, 1);
    post.save(err => {
      if (err) return next(err);
      res.status(200).send();
    })
  })
};
