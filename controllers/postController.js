const Post = require('../models/postModel');

const { body, validationResult } = require('express-validator');

exports.posts_list_get = function(req, res, next) {
  Post.find({}, 'title description slug')
      .exec(function(err, posts) {
        if (err) next(err);
        res.json(posts);
      })
};

exports.post_detail_get = function(req, res, next) {
  Post.findOne({slug: req.params.slug}, 'title text messages slug')
      .exec(function(err, post) {
        if (err) next(err);
        res.json(post);
      })
};
