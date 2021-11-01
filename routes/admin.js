const express = require('express');
const router = express.Router();

const draft_controller = require('../controllers/draftController');
const post_controller = require('../controllers/postController');

// Admin Dashboard Posts
router.get('/posts', post_controller.posts_list_get);
router.get('/posts/:slug', post_controller.post_detail_get);

// Admin Dashboard Draft
router.get('/drafts', draft_controller.drafts_list_get);
router.get('/drafts/:slug', draft_controller.draft_detail_get);

module.exports = router;
