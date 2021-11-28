const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');

// Post List
router.get('/', post_controller.posts_list_get);

// Post Detail
router.get('/:slug', post_controller.posts_detail_get);

// Add a comment
router.post('/:slug', post_controller.add_comment_post);

module.exports = router;
