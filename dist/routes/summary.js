'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const router = express_1.default.Router();
const client_1 = require('@prisma/client');
const prisma = new client_1.PrismaClient();
const authorize = require('../utils/authorize');
const direction_controller_1 = require('../controllers/direction-controller');
router
	.route('/')
	.get(async (req, res) => {
		// Authorization
		const decode = authorize(req, res);
		if (!decode) {
			return;
		}
		const { profile_id } = decode;
		try {
			const profileData = await prisma.user_Profile.findUnique({
				where: {
					id: profile_id
				}
			});
			// If not found
			if (!profileData) {
				return res
					.status(400)
					.json({ message: 'Cannot find the profile data.' });
			}
			return res.status(200).json(profileData);
		} catch (err) {
			return res.status(500).json({ message: 'Failed to retrieve data' });
		}
	})
	// Get summarized data for the homepage
	.post(async (req, res) => {
		// Authorization
		const decode = authorize(req, res);
		if (!decode) {
			return;
		}
		const { profile_id } = decode;
		// Validate
		const { origin, dest, time, mode, type, timezone } = req.body;
		// Get location Data
		const locationData = await prisma.location.findMany({
			where: {
				user_ProfileId: profile_id
			}
		});
		// Get direction Data
		const directionData = await (0, direction_controller_1.directionApi)(
			origin,
			dest,
			time,
			mode,
			type,
			Number(timezone)
		);
		// Get checklist Data
		const checklistData = await prisma.checklist.findMany({
			where: {
				user_ProfileId: profile_id
			}
		});
		const summaryRes = {
			locationData,
			directionData,
			checklistData
		};
		return res.json(summaryRes);
	});
module.exports = router;
//# sourceMappingURL=summary.js.map
