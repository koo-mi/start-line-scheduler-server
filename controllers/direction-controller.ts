import { Request, Response } from 'express';
const authorize = require("../utils/authorize");
const axios = require("axios");

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* Get all location data */
async function getDirectionData(req: Request, res: Response) {

}

module.exports = {
    getDirectionData
}