import express from "express";
import { Request, Response } from 'express'
const router = express.Router();

import { PrismaClient } from '@prisma/client'
import { UserData } from "../model/type";
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');

router.route("/")
    // Creating new account
    .post(async (req: Request, res: Response): Promise<Response> => {
        const { name, username, password, default_mode, default_target_time, home_address, work_address } = req.body;

        // Validate - Empty
        if (!name || !username || !password || !home_address || !work_address || !default_mode || !default_target_time) {
            return res.status(400).json({ message: "You must provide all fields." });
        }

        // Validate - Same address entry
        if (home_address === work_address) {
            return res.status(400).json({message: 'You must provide different address for your home and work.'})
        }

        // Check is username exist
        const isUserExist: UserData = await prisma.user.findUnique({ where: { username: username } })

        // If username is already taken
        if (isUserExist) {
            return res.status(400).json({ message: 'Existing username. Please try different name.' })
        }

        // encrypt password
        const hashedPassword:string = bcrypt.hashSync(password);

        // Create user into database + Create Profile
        await prisma.user.create({
            data: {
                name, username, password: hashedPassword,
                User_Profile: {
                    create: {
                        default_home: home_address,
                        default_work: work_address,
                        default_mode,
                        default_target_time,

                        Location: {
                            createMany: {
                                data: [
                                    {
                                        name: "Home",
                                        address: home_address,
                                        isHome: true,
                                    },
                                    {
                                        name: "Work",
                                        address: work_address,
                                        isWork: true,
                                    }
                            ]
                        },
                        }
                    }
                }
            }
        });
        res.status(200).json({message: "Account Successfully created"});
    })

module.exports = router;