import express from "express";
import { Request, Response } from 'express'
const router = express.Router();

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');

router.route("/")
    // Creating new account
    .post(async (req: Request, res: Response) => {
        const { name, username, password, default_home, default_work, default_mode, default_target_time } = req.body;

        // Validate - Empty
        if (!name || !username || !password || !default_home || !default_work || !default_mode || !default_target_time) {
            return res.status(400).json({ message: "You must provide name, username nad password." });
        }

        // Check is username exist
        const isUserExist = await prisma.user.findUnique({ where: { username: username } })

        // If username is already taken
        if (isUserExist) {
            return res.status(400).json({ message: "Existing username. Please try different name." })
        }

        // encrypt password
        const hashedPassword = bcrypt.hashSync(password);

        // Create user into database + Create Profile
        await prisma.user.create({
            data: {
                name, username, password: hashedPassword,
                User_Profile: {
                    create: {
                        default_home,
                        default_work,
                        default_mode,
                        default_target_time,
                    }
                }
            }
        });
        res.send("Success!");
    })

module.exports = router;