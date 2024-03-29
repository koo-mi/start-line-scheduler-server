'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.directionApi = exports.getDirectionData = void 0;
const authorize = require('../utils/authorize');
const axios = require('axios');
const client_1 = require('@prisma/client');
const prisma = new client_1.PrismaClient();
/* Get Direction data using Google Map API */
async function getDirectionData(req, res) {
	// Authorization
	const decode = authorize(req, res);
	if (!decode) {
		return;
	}
	const { origin, dest, time, mode, type } = req.params;
	const { timezone } = req.headers;
	const directionRes = await directionApi(
		origin,
		dest,
		time,
		mode,
		type,
		Number(timezone)
	);
	return res.status(200).json(directionRes);
}
exports.getDirectionData = getDirectionData;
/* For Google Map Direction API call - for direction & summary */
async function directionApi(origin, dest, time, mode, type, timezone) {
	// Compare timezone
	const serverTime = new Date();
	const timezoneDiff = serverTime.getTimezoneOffset() / 60 - timezone;
	// Convert Time to today's target time
	const today = new Date().toString();
	const dateArr = today.split(' ');
	const timeSplit = time.split(' ');
	dateArr[4] = `${Number(timeSplit[0])}:${timeSplit[1]}:00`;
	const timeString = dateArr.join(' ');
	const targetTime = Date.parse(timeString) / 1000 - timezoneDiff * 3600;
	// Format the string
	origin = origin.replaceAll(' ', '+');
	dest = dest.replaceAll(' ', '+');
	// Get data from Google Directions API
	const URL = process.env.GOOGLE_DIRECTION_URL;
	const API_KEY = process.env.GOOGLE_API_KEY;
	try {
		const data = await axios(
			`${URL}/json?origin=${origin}&destination=${dest}&${type}_time=${targetTime}&mode=${mode}&key=${API_KEY}`
		);
		const directionData = data.data.routes[0].legs[0];
		// Get necessary info from the API response
		const arrivalTime = directionData.arrival_time.text;
		const departureTime = directionData.departure_time.text;
		const distance = directionData.distance.text;
		const duration = directionData.duration.text;
		const stepsFull = directionData.steps;
		const start_location = directionData.start_location;
		const end_location = directionData.end_location;
		const stepsSummary = stepsFull.map((step) => {
			return {
				distance: step.distance.text,
				duration: step.duration.text,
				instruction: step.html_instructions
			};
		});
		return {
			arrivalTime,
			departureTime,
			distance,
			duration,
			stepsSummary,
			start_location,
			end_location
		};
	} catch (err) {
		return err;
	}
}
exports.directionApi = directionApi;
//# sourceMappingURL=direction-controller.js.map
