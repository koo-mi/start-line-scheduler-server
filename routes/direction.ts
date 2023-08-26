import express from "express";
const router = express.Router();
const {getDirectionData} = require("../controllers/direction-controller");
const {getAllLocations, postNewLocation, getSingleLocation, updateLocation, deleteLocation} = require("../controllers/location-controller");


router.route("/:origin/:dest/:time/:mode")
    .get(getDirectionData)

router.route("/location")
    .get(getAllLocations)
    .post(postNewLocation)

router.route("/location/:locId")
    .get(getSingleLocation)
    .put(updateLocation)
    .delete(deleteLocation)

module.exports = router;