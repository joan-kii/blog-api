const { body, validationResult } = require('express-validator');

const Post = require('../models/postModel');
const Draft = require('../models/draftModel');

exports.posts_list_get = function(req, res, next) {
  Post.find({published: true}, 'title description slug comments')
      .exec(function(err, posts) {
        if (err) next(err);
        res.json(posts);
      })
};

exports.posts_detail_get = function(req, res, next) {
  Post.findOne({slug: req.params.slug, published: true}, 'title text comments slug')
      .exec(function(err, post) {
        if (err) next(err);
        res.json(post);
      })
};

exports.add_comment_post = [
  body('name', 'Name')
    .trim()
    .isLength({min: 2})
    .withMessage('Your name must have at least 2 characters.')
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage('Your name must have only alphanumeric characters.')
    .escape(),
  body('comment', 'Comment')
    .trim()
    .isLength({min: 2})
    .withMessage('The comment must have at least 2 characters.')
    .matches(/^[a-z0-9 .,?!()]+$/i)
    .withMessage('Your name must have only alphanumeric characters.')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: errors.array({onlyFirstError: true}), errors});
    }
    Post.findOneAndUpdate({slug: req.params.slug}, 
         {$push: {comments: req.body}}, {new: true}, (err, post) => {
      if (err) next(err);
      res.status(200).json(post);
    })
  }
];

exports.posts_list_admin_get = function(req, res, next) {
  Post.find({}, 'title description slug published comments')
      .exec(function(err, posts) {
        if (err) next(err);
        res.json(posts);
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

exports.posts_delete = function(req, res, next) {
  Post.findOneAndRemove({slug: req.body.slug}, (err) => {
    if (err) next(err);
    res.status(200).send();
  })
};

exports.posts_convert_post = function(req, res, next) {
  Post.findOneAndDelete({slug: req.body.slug}, (err, post) => {
    if (err) next(err);
    const draft = new Draft({
      title: post.title,
      text: post.text,
      description: post.description,
      notes: '<p>Notes</p>'
    });
    draft.save(err => {
      if (err) next(err);
      return res.status(200).send();
    })
  })
};
