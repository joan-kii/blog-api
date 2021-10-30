const express = require('express');
const router = express.Router();

const home_controller = require('../controllers/homeController');
const post_controller = require('../controllers/postController');
const draft_controller = require('../controllers/draftController');

// Home Page
router.get('/', home_controller.home_page);

// Post Detail
router.get('/:slug', post_controller.post_detail_get);

// Admin Dashboard
router.get('/drafts', draft_controller.drafts_list_get);
router.get('/drafts/:slug', draft_controller.draft_detail_get);

module.exports = router;
