import { Request, Response } from 'express';
const authorize = require("../utils/authorize");
const axios = require("axios");

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* Get Direction data using Google Map API */
export async function getDirectionData(req: Request, res: Response) {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };

    const { origin, dest, time, mode } = req.params;

    const directionRes = await directionApi(origin, dest, time, mode);

    res.status(200).json(directionRes);
}


/* For Google Map Direction API call - for direction & summary */
export async function directionApi(origin: string, dest: string, time: string | number, mode: string) {
    // Get data from Google Directions API
    const URL: string = process.env.GOOGLE_DIRECTION_URL;
    const API_KEY: string = process.env.GOOGLE_API_KEY;

    const data = await axios(`${URL}/json?origin=${origin}&destination=${dest}&arrival_time=${time}&mode=${mode}&key=${API_KEY}`);

    const directionData = data.data.routes[0].legs[0];

    // Get necessary info from the API response
    const arrivalTime = directionData.arrival_time.text;
    const departureTime = directionData.departure_time.text;
    const distance = directionData.distance.text;
    const duration = directionData.duration.text;
    const stepsFull = directionData.steps;

    const stepsSummary = stepsFull.map((step) => {
        return {
            distance: step.distance.text,
            duration: step.duration.text,
            instruction: step.html_instructions,
        }
    })

    return {
        arrivalTime, departureTime, distance, duration, stepsSummary
    }
}
