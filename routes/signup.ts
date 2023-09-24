import express from "express";
const router = express.Router();
const { registerUser } = require('../controllers/signup-controller');


router.route("/")
    // Creating new account
    .post(registerUser);

module.exports = router;