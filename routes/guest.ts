import express from 'express';
const router = express.Router();
const { loginGuest } = require('../controllers/guest-controller');

router.route('/').post(loginGuest);

router.route('/signup').post();

module.exports = router;
