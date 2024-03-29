'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const authorize = require('../utils/authorize');
const client_1 = require('@prisma/client');
const prisma = new client_1.PrismaClient();
/* Get all location data */
async function getAllLocations(req, res) {
	// Authorization
	const decode = authorize(req, res);
	if (!decode) {
		return;
	}
	const { profile_id } = decode;
	// Get all location data for the user
	const locList = await prisma.location.findMany({
		where: {
			user_ProfileId: profile_id
		}
	});
	return res.status(200).json(locList);
}
/* Post new location data */
async function postNewLocation(req, res) {
	// Authorization
	const decode = authorize(req, res);
	if (!decode) {
		return;
	}
	const { profile_id } = decode;
	// Validating request
	const { name, address, isHome, isWork } = req.body;
	if (!name || !address) {
		return res
			.status(400)
			.json({ message: 'Must provide location name and address' });
	}
	// Check if name exist
	const isNameExist = await prisma.location.findFirst({
		where: { name, user_ProfileId: profile_id }
	});
	// If name is already taken
	if (isNameExist) {
		return res
			.status(400)
			.json({ message: 'Name Already in Use: Please select a different name' });
	}
	// Check if address exist
	const isAddressExist = await prisma.location.findFirst({
		where: {
			user_ProfileId: profile_id,
			address
		}
	});
	if (isAddressExist) {
		return res
			.status(400)
			.json({ message: 'Existing address. Please provide different address.' });
	}
	// Retrieve current default
	const defaultIds = await getDefault(profile_id);
	if (isHome) {
		// Update existing default to false
		await prisma.location.update({
			where: { id: defaultIds[0] },
			data: { isHome: false }
		});
		// Update profile
		await prisma.user_Profile.update({
			where: { id: profile_id },
			data: { default_home: address }
		});
	}
	if (isWork) {
		// Update existing default to false
		await prisma.location.update({
			where: { id: defaultIds[1] },
			data: { isWork: false }
		});
		// Update profile
		await prisma.user_Profile.update({
			where: { id: profile_id },
			data: { default_work: address }
		});
	}
	// Create new location
	await prisma.location.create({
		data: {
			name,
			address,
			isHome,
			isWork,
			user_ProfileId: profile_id
		}
	});
	return res.status(200).json({ message: 'Location successfully added' });
}
/* Get location info by ID */
async function getSingleLocation(req, res) {
	// Authorization
	const decode = authorize(req, res);
	if (!decode) {
		return;
	}
	const { profile_id } = decode;
	const { locId } = req.params;
	// Find location data using location ID
	const locationData = await prisma.location.findFirst({
		where: {
			id: Number(locId),
			user_ProfileId: profile_id
		}
	});
	if (!locationData) {
		return res
			.status(400)
			.json({ message: `Unable to find your location with ID: ${locId}` });
	}
	return res.status(200).json(locationData);
}
// Util: Check if location data exist - use: Update / Delete
async function checkLocationExist(locId, profile_id) {
	const locationData = await prisma.location.findFirst({
		where: {
			id: Number(locId),
			user_ProfileId: profile_id
		}
	});
	return locationData;
}
/* Update location Info by ID */
async function updateLocation(req, res) {
	// Authorization
	const decode = authorize(req, res);
	if (!decode) {
		return;
	}
	const { profile_id } = decode;
	const { locId } = req.params;
	// Validating request
	const { name, address, isHome, isWork } = req.body;
	if (!name || !address) {
		return res
			.status(400)
			.json({ message: 'Must provide location name and address' });
	}
	// If location data doesn't exist
	if (!checkLocationExist(locId, profile_id)) {
		return res
			.status(400)
			.json({ message: `Unable to find your location with ID: ${locId}` });
	}
	// Check if name exist
	const isNameExist = await prisma.location.findFirst({
		where: { name, user_ProfileId: profile_id }
	});
	// If name is already taken
	if (isNameExist && String(isNameExist.id) !== locId) {
		return res
			.status(400)
			.json({ message: 'Name Already in Use: Please select a different name' });
	}
	// Check if address exist
	const isAddressExist = await prisma.location.findFirst({
		where: {
			user_ProfileId: profile_id,
			address
		}
	});
	if (isAddressExist && String(isAddressExist.id) !== locId) {
		return res
			.status(400)
			.json({ message: 'Existing address. Please provide different address.' });
	}
	// Retrieve current default
	const defaultIds = await getDefault(profile_id);
	// If isHome is true
	if (isHome) {
		// If it was defaultWork don't allow
		if (Number(locId) === defaultIds[1]) {
			return res
				.status(400)
				.json({ message: 'Default work must always be present.' });
		}
		// If it was not originally defaultHome
		if (Number(locId) !== defaultIds[0]) {
			// Update existing default to false
			await prisma.location.update({
				where: { id: defaultIds[0] },
				data: { isHome: false }
			});
			// Update profile
			await prisma.user_Profile.update({
				where: { id: profile_id },
				data: { default_home: address }
			});
		} else {
			await prisma.user_Profile.update({
				where: { id: profile_id },
				data: { default_home: address }
			});
		}
	}
	// If isWork is true
	if (isWork) {
		// If it was defaultHome don't allow
		if (Number(locId) === defaultIds[0]) {
			return res
				.status(400)
				.json({ message: 'Default home must always be present.' });
		}
		// If it was not originally defaultWork
		if (Number(locId) !== defaultIds[1]) {
			// Update existing default to false
			await prisma.location.update({
				where: { id: defaultIds[1] },
				data: { isWork: false }
			});
			// Update profile
			await prisma.user_Profile.update({
				where: { id: profile_id },
				data: { default_work: address }
			});
		} else {
			await prisma.user_Profile.update({
				where: { id: profile_id },
				data: { default_work: address }
			});
		}
	}
	// Updating the data
	await prisma.location.update({
		where: {
			id: Number(locId),
			user_ProfileId: profile_id
		},
		data: {
			name,
			address,
			isHome,
			isWork
		}
	});
	return res.status(200).json({ message: 'Successfully updated' });
}
/* Delete location by ID */
async function deleteLocation(req, res) {
	// Authorization
	const decode = authorize(req, res);
	if (!decode) {
		return;
	}
	const { profile_id } = decode;
	const { locId } = req.params;
	// If location data doesn't exist
	if (!checkLocationExist(locId, profile_id)) {
		return res
			.status(400)
			.json({ message: `Unable to find your location with ID: ${locId}` });
	}
	// If it's default location
	const [homeId, workId] = await getDefault(profile_id);
	if (Number(locId) === homeId || Number(locId) === workId) {
		return res
			.status(400)
			.json({ message: 'You cannot delete default location.' });
	}
	// Delete information
	await prisma.location.delete({
		where: {
			id: Number(locId),
			user_ProfileId: profile_id
		}
	});
	return res.sendStatus(204);
}
// Check if user has default
async function getDefault(profile_id) {
	const home = await prisma.location.findFirst({
		where: {
			user_ProfileId: profile_id,
			isHome: { not: false }
		}
	});
	const work = await prisma.location.findFirst({
		where: {
			user_ProfileId: profile_id,
			isWork: { not: false }
		}
	});
	return [home.id, work.id];
}
module.exports = {
	getAllLocations,
	postNewLocation,
	getSingleLocation,
	updateLocation,
	deleteLocation
};
//# sourceMappingURL=location-controller.js.map
