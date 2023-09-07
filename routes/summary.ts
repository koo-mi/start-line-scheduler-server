import express from "express";
import { Request, Response } from 'express';
const router = express.Router();

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const authorize = require("../utils/authorize");
import { directionApi } from "../controllers/direction-controller";
import { ChecklistData, DirectionData, LocationData, SummaryData } from "../model/type";

router.route("/")
    .get(async (req: Request, res: Response):Promise<Response> => {
        // Authorization
        const decode = authorize(req, res);
        if (!decode) { return };
        const { profile_id } = decode;

        try {
            const profileData = await prisma.user_Profile.findUnique({
                where: {
                    id: profile_id
                }
            })

            // If not found
            if (!profileData) {
                return res.status(400).json({message: "Cannot find the profile data."})
            }

            return res.status(200).json(profileData);
        } catch(err) {
            return res.status(500).json({message: "Failed to retrieve data"})
        }

    })

    // Get summarized data for the homepage
    .post(async (req: Request, res: Response): Promise<Response> => {
        // Authorization
        const decode = authorize(req, res);
        if (!decode) { return };
        const { profile_id } = decode;

        // Validate
        const { origin, dest, time, mode, type, timezone } = req.body;

        // Get location Data
        const locationData: LocationData[] = await prisma.location.findMany({
            where: {
                user_ProfileId: profile_id
            }
        });

        // Get direction Data
        const directionData: DirectionData = await directionApi(origin, dest, time, mode, type, Number(timezone))

        // Get checklist Data
        const checklistData: ChecklistData[] = await prisma.checklist.findMany({
            where: {
                user_ProfileId: profile_id
            }
        })

        const summaryRes: SummaryData = {
            locationData,
            directionData,
            checklistData
        }

        return res.json(summaryRes);
    })

module.exports = router;