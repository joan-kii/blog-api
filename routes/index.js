const express = require('express');
const router = express.Router();

const home_controller = require('../controllers/homeController');

// Home Page
router.get('/', home_controller.home_page);

module.exports = router;
