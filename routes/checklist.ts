import express from "express";
const router = express.Router();
const checklistController = require("../controllers/checklist-controller");

router.route("/")
    .get()
    .post()

router.route("/:itemId")
    .put()
    .delete()

module.exports = router;