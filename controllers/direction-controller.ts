import { Request, Response } from 'express';
const authorize = require("../utils/authorize");
const axios = require("axios");

import { PrismaClient } from '@prisma/client'
import { DirectionData, LatLng, StepSummary } from '../model/type';
const prisma = new PrismaClient()

/* Get Direction data using Google Map API */
export async function getDirectionData(req: Request, res: Response): Promise<Response> {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };

    const { origin, dest, time, mode, type } = req.params;
    const {timezone} = req.headers;

    const directionRes = await directionApi(origin, dest, time, mode, type, Number(timezone));

    return res.status(200).json(directionRes);
}


/* For Google Map Direction API call - for direction & summary */
export async function directionApi(origin: string, dest: string, time: string, mode: string, type: string, timezone: number): Promise<DirectionData> {

    // Compare timezone
    const serverTime = new Date();
    const timezoneDiff: number = serverTime.getTimezoneOffset()/60-timezone;

    // Convert Time to today's target time
    const today = new Date().toString();
    const dateArr = today.split(' ');
    const timeSplit = time.split(' ');
    dateArr[4] = `${Number(timeSplit[0])}:${timeSplit[1]}:00`;

    const timeString = dateArr.join(' ');

    const targetTime = Date.parse(timeString) / 1000 - (timezoneDiff*3600);

    // Format the string 
    origin = origin.replaceAll(' ', '+');
    dest = dest.replaceAll(' ', '+');


    // Get data from Google Directions API
    const URL: string = process.env.GOOGLE_DIRECTION_URL;
    const API_KEY: string = process.env.GOOGLE_API_KEY;

    try {
        const data = await axios(`${URL}/json?origin=${origin}&destination=${dest}&${type}_time=${targetTime}&mode=${mode}&key=${API_KEY}`);

        const directionData = data.data.routes[0].legs[0];

        // Get necessary info from the API response
        const arrivalTime: string = directionData.arrival_time.text;
        const departureTime: string = directionData.departure_time.text;
        const distance: string = directionData.distance.text;
        const duration: string = directionData.duration.text;
        const stepsFull = directionData.steps;
        const start_location: LatLng = directionData.start_location;
        const end_location: LatLng = directionData.end_location;


        const stepsSummary = stepsFull.map((step) => {
            return {
                distance: step.distance.text,
                duration: step.duration.text,
                instruction: step.html_instructions,
            }
        })

        return {
            arrivalTime, departureTime, distance, duration, stepsSummary, start_location, end_location
        }
    } catch (err) {
        return err
    }
}
