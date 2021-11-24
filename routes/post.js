const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');

// Post List
router.get('/', post_controller.posts_list_get);

// Post Detail
router.get('/:slug', post_controller.posts_detail_get);

module.exports = router;
