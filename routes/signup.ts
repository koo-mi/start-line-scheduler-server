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
        const { name, username, password, default_mode, default_target_time, home_street, home_city, home_province, work_city, work_province, work_street } = req.body;

        // Validate - Empty
        if (!name || !username || !password || !home_street || !home_city || !home_province || !work_street || !work_city || !work_province || !default_mode || !default_target_time) {
            return res.status(400).json({ message: "You must provide all fields." });
        }

        // Check is username exist
        const isUserExist: UserData = await prisma.user.findUnique({ where: { username: username } })

        // If username is already taken
        if (isUserExist) {
            return res.status(400).json({ message: 'Existing username. Please try different name.' })
        }

        // encrypt password
        const hashedPassword:string = bcrypt.hashSync(password);

        const default_home: string = `${home_street} ${home_city} ${home_province}`.replaceAll(' ', '+');

        const default_work: string = `${work_street} ${work_city} ${work_province}`.replaceAll(' ', '+');

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

                        Location: {
                            createMany: {
                                data: [
                                    {
                                        name: "Home",
                                        street: home_street,
                                        city: home_city,
                                        province: home_province,
                                        isHome: true,
                                    },
                                    {
                                        name: "Work",
                                        street: work_street,
                                        city: work_city,
                                        province: work_province,
                                        isWork: true,
                                    }
                            ]
                        },
                        }
                    }
                }
            }
        });
        res.send("Success!");
    })

module.exports = router;