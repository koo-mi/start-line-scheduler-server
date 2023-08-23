import express from "express";
const router = express.Router();
const directionController = require("../controllers/directions-controller");

router.route("/:originId/:destId")
    .get()


router.route("/location")
    .get()
    .post()

router.route("/location/:locId")
    .get()
    .put()
    .delete()

module.exports = router;