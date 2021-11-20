const { body, validationResult } = require('express-validator');
const slugify = require('slugify');

const Draft = require('../models/draftModel');

exports.drafts_list_get = function(req, res, next) {
  Draft.find({}, 'title description slug')
       .exec(function (err, drafts) {
          if (err) next(err);
          res.json(drafts);
       })
};

exports.draft_create_post = [
  body('title', 'Draft Title')
    .trim()
    .isLength({min: 3})
    .withMessage('Title must have at least 3 characters.')
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage('Title must have only alphanumeric characters.')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: errors.array({onlyFirstError:true})});
    } else {
      const draft = new Draft({
        title: req.body.title,
        description: req.body.description,
        text: req.body.text,
        notes: req.body.notes
      }).save((err, saved) => {
        if (err) res.status(400).json({message: "Draft dont't saved."});
        res.status(200).json({message: 'Draft saved.', saved});
      });
    }
  }
];

exports.draft_detail_get = function(req, res, next) {
  Draft.findOne({slug: req.params.slug}, 'title text description notes slug')
      .exec(function(err, draft) {
        if (err) res.status(400).json(err);
        res.status(200).json(draft);
      })
};

exports.draft_update_post = [
  body('title', 'Draft Title')
    .trim()
    .isLength({min: 3})
    .withMessage('Title must have at least 3 characters.')
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage('Title must have only alphanumeric characters.')
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: errors.array({onlyFirstError:true})});
    } else {
      const prevSlug = slugify(req.body.editTitle, {
        lower: true, 
        strict: true
      })
      const updatedDraft = {
        title: req.body.title,
        description: req.body.description,
        text: req.body.text,
        notes: req.body.notes,
        slug: slugify(req.body.title, {
          lower: true, 
          strict: true
        })
      };
      const response = await Draft.findOneAndUpdate(prevSlug, updatedDraft);
      if (response) res.status(200);
    }
  }
];
