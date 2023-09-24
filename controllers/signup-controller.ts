import { Request, Response } from 'express'
import { UserData } from "../model/type";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');

async function registerUser(req: Request, res: Response): Promise<Response> {
    const { name, username, password, default_mode, default_target_time, home_address, work_address } = req.body;

    // Validate - Empty
    if (!name || !username || !password || !home_address || !work_address || !default_mode || !default_target_time) {
        return res.status(400).json({ message: "You must provide all fields." });
    }

    // Validate - Same address entry
    if (home_address === work_address) {
        return res.status(400).json({ message: 'You must provide different address for your home and work.' })
    }

    // Check is username exist
    const isUserExist: UserData = await prisma.user.findUnique({ where: { username: username } })

    // If username is already taken
    if (isUserExist) {
        return res.status(400).json({ message: 'Existing username. Please try different name.' })
    }

    // encrypt password
    const hashedPassword: string = bcrypt.hashSync(password);

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
                    },

                    Checklist: {
                        createMany: {
                            data: {
                                title: "Add something to the checklist!",
                                description: "Description is optional",
                                isDaily: false,
                                priority: "high"
                            }
                        }
                    }
                }
            }
        }
    });
    res.status(200).json({ message: "Account Successfully created" });
}

module.exports = {
    registerUser
}