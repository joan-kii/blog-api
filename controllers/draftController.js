const Draft = require('../models/draftModel');

const { body, validationResult } = require('express-validator');

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
      console.log(errors)
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
  Draft.findOne({slug: req.params.slug}, 'title text description notes')
      .exec(function(err, draft) {
        if (err) next(err);
        res.json(draft);
      })
};
