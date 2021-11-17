const express = require('express');
const router = express.Router();
const passport = require('passport');

const admin_controller = require('../controllers/adminController');
const draft_controller = require('../controllers/draftController');
const post_controller = require('../controllers/postController');

// Create New Admin
router.post('/create', admin_controller.create_admin_post);

// Login Admin
router.post('/login', admin_controller.admin_login_post);

// Admin Dashboard Posts
router.get('/posts', passport.authenticate('jwt', {session: false}), post_controller.posts_list_get);
router.get('/posts/:slug', passport.authenticate('jwt', {session: false}), post_controller.post_detail_get);

// Admin Dashboard Draft
router.get('/drafts', passport.authenticate('jwt', {session: false}), draft_controller.drafts_list_get);
router.post('/drafts/create', passport.authenticate('jwt', {session: false}), draft_controller.draft_create_post);
router.get('/drafts/:slug', passport.authenticate('jwt', {session: false}), draft_controller.draft_detail_get);

module.exports = router;
