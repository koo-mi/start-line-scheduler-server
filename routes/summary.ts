import express from "express";
import { Request, Response } from 'express';
const router = express.Router();

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const authorize = require("../utils/authorize");

router.route("/")
    // Get summarized data for the homepage
    .get((req: Request, res: Response) => {
        const decode = authorize(req, res);

        // If not authorized
        if (!decode) {return};

        return res.send(decode);
    })

module.exports = router;