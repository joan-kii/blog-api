const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');

// Post Detail
router.get('/:slug', post_controller.post_detail_get);

module.exports = router;