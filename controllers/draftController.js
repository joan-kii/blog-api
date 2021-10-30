const Draft = require('../models/draftModel');

exports.drafts_list_get = function(req, res, next) {
  Draft.find({}, 'title description slug')
       .exec(function (err, drafts) {
          if (err) next(err);
          res.json(drafts);
       })
};

exports.draft_detail_get = function(req, res, next) {
  Draft.findOne({slug: req.params.slug}, 'title text description notes')
      .exec(function(err, draft) {
        if (err) next(err);
        res.json(draft);
      })
};
