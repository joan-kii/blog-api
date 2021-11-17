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
    .isAlphanumeric()
    .withMessage('Title must have only alphanumeric characters.')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).res.json({message: errors.array({onlyFirstError:true})});
    } else {
      const draft = new Darft({
        title: req.body.title,
        description: req.body.description,
        text: req.body.text,
        note: req.body.notes
      }).save((err, saved) => {
        if (err) res.staus(400).json({message: "Draft dont't saved."});
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
