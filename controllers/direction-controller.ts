import { Request, Response } from 'express';
const authorize = require("../utils/authorize");
const axios = require("axios");

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* Get all location data */
async function getDirectionData(req: Request, res: Response) {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };

    const { origin, dest, time, mode } = req.params;

    // Get data from Google Directions API
    const URL = "https://maps.googleapis.com/maps/api/directions";
    const API_KEY = process.env.GOOGLE_API_KEY;

    const data = await axios(`${URL}/json?origin=${origin}&destination=${dest}&arrival_time=${time}&mode=${mode}&key=${API_KEY}`);

    const directionData = data.data.routes[0].legs[0];

    // Get necessary info from the API response
    const arrivalTime = directionData.arrival_time.text;
    const departureTime = directionData.departure_time.text;
    const distance = directionData.distance.text;
    const duration = directionData.duration.text;
    const stepsFull = directionData.steps;

    const stepsSummary = stepsFull.map((step)=> {

        return {
            distance: step.distance.text,
            duration: step.duration.text,
            instruction: step.html_instructions,
        }
    })

    // Response Data
    const directionRes = {
        arrivalTime, departureTime, distance, duration, stepsSummary
    }

    res.status(200).json(directionRes);
}

module.exports = {
    getDirectionData
}