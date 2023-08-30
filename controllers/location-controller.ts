import { Request, Response } from 'express';
const authorize = require("../utils/authorize");

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


/* Get all location data */
async function getAllLocations(req: Request, res: Response) {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
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
async function postNewLocation(req: Request, res: Response) {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;

    // Validating request
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({ message: "Must provide location name and address" })
    }

    // Check if name exist
    const isNameExist = await prisma.location.findFirst({
        where: { name, user_ProfileId: profile_id }
    });

    // If name is already taken
    if (isNameExist) {
        return res.status(400).json({ message: "Name Already in Use: Please select a different name" })
    }

    // Create new location
    await prisma.location.create({
        data: {
            name,
            address,
            user_ProfileId: profile_id,
        }
    })

    return res.status(200).json({ message: "Location successfully added" })
}


/* Get location info by ID */
async function getSingleLocation(req: Request, res: Response) {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
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
        return res.status(400).json({ message: `Unable to find your location with ID: ${locId}` });
    }

    return res.status(200).json(locationData);
}

// Util: Check if location data exist - use: Update / Delete
async function checkLocationExist(locId: string, profile_id: number) {
    const locationData = await prisma.location.findFirst({
        where: {
            id: Number(locId),
            user_ProfileId: profile_id
        }
    });

    return locationData;
}


/* Update location Info by ID */
async function updateLocation(req: Request, res: Response) {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;

    const { locId } = req.params;

    // Validating request
    const { name, address } = req.body

    if (!name || !address) {
        return res.status(400).json({ message: "Must provide location name and address" })
    }

    // If location data doesn't exist
    if (!checkLocationExist(locId, profile_id)) {
        return res.status(400).json({ message: `Unable to find your location with ID: ${locId}` });
    }

    // Updating the data
    await prisma.location.update({
        where: {
            id: Number(locId),
            user_ProfileId: profile_id
        },
        data: {
            name, address
        }
    });

    return res.status(400).json({ message: "Successfully updated" });
}


/* Delete location by ID */
async function deleteLocation(req: Request, res: Response) {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;

    const { locId } = req.params;

    // If location data doesn't exist
    if (!checkLocationExist(locId, profile_id)) {
        return res.status(400).json({ message: `Unable to find your location with ID: ${locId}` });
    };

    // Delete information
    await prisma.location.delete({
        where: {
            id: Number(locId),
            user_ProfileId: profile_id
        }
    });

    return res.sendStatus(204);
}


module.exports = {
    getAllLocations,
    postNewLocation,
    getSingleLocation,
    updateLocation,
    deleteLocation,
}