'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const router = express_1.default.Router();
const { getDirectionData } = require('../controllers/direction-controller');
const {
	getAllLocations,
	postNewLocation,
	getSingleLocation,
	updateLocation,
	deleteLocation
} = require('../controllers/location-controller');
router.route('/:origin/:dest/:time/:mode/:type').get(getDirectionData);
router.route('/location').get(getAllLocations).post(postNewLocation);
router
	.route('/location/:locId')
	.get(getSingleLocation)
	.put(updateLocation)
	.delete(deleteLocation);
module.exports = router;
//# sourceMappingURL=direction.js.map
