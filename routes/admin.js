const express = require('express');
const router = express.Router();

const admin_controller = require('../controllers/adminController');
const draft_controller = require('../controllers/draftController');
const post_controller = require('../controllers/postController');

// Create New Admin
router.post('/create', admin_controller.create_admin_post);

// Admin Dashboard Posts
router.get('/posts', post_controller.posts_list_get);
router.get('/posts/:slug', post_controller.post_detail_get);

// Admin Dashboard Draft
router.get('/drafts', draft_controller.drafts_list_get);
router.get('/drafts/:slug', draft_controller.draft_detail_get);

module.exports = router;
