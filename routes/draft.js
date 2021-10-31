const express = require('express');
const router = express.Router();

const draft_controller = require('../controllers/draftController');

// Admin Dashboard
router.get('/', draft_controller.drafts_list_get);
router.get('/:slug', draft_controller.draft_detail_get);

module.exports = router;
