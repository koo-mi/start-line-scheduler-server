import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function loginGuest(req:Request, res: Response) {
    const {userUuid} = req.body;
    const username = `${userUuid}@guestlogin.demo`

    let user = await getUser(username);

    // If userUuid is not registered, register guest account
    if (!user) {
        console.log("Creating ID")

        const password = `${userUuid}!${process.env.SECRET}`
        const name = "Guest";
    
        const address1 = "Finch, North York, ON M2M 3T2, Canada";
        const address2 = "220 Yonge St, Toronto, ON M5B 2H1, Canada"
        const address3 = "Kipling, St Albans Rd, Toronto, ON M9B, Canada"
    
        const hashedPassword: string = bcrypt.hashSync(password);
    
        // Creating user
        await prisma.user.create({
            data: {
                name, username, password: hashedPassword,
                User_Profile: {
                    create: {
                        default_home: address1,
                        default_work: address2,
                        default_mode: "transit",
                        default_target_time: "9 00",
    
                        Location: {
                            createMany: {
                                data: [
                                    {
                                        name: "Home",
                                        address: address1,
                                        isHome: true,
                                    },
                                    {
                                        name: "Work",
                                        address: address2,
                                        isWork: true,
                                    },
                                    {
                                        name: "Kipling",
                                        address: address3
                                    }
                                ]
                            },
                        },
    
                        Checklist: {
                            createMany: {
                                data: [
                                    {
                                    title: "Add something to the checklist!",
                                    description: "Description is optional",
                                    isDaily: false,
                                    priority: "high"
                                    },
                                    {
                                        title: "Drink water",
                                        description: "",
                                        isDaily: true,
                                        priority: "low"
                                    },
                                    {
                                        title: "Morning Workout",
                                        description: "",
                                        isDaily: true,
                                        priority: "medium"
                                    },
                                    {
                                        title: "Take Supplements",
                                        description: "Vitamin C, Omega3, Calcium, Protein",
                                        isDaily: true,
                                        priority: "high"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        })
    }

    // Login to guest account
    user = await getUser(username);
    const token: string = jwt.sign({id: user.id, username: user.username, profile_id: user.User_Profile[0].id}, process.env.SECRET, {expiresIn: "12h"});

    console.log("Success!");

    return res.status(200).json({ token })
}


async function getUser(username: string) {
    return await prisma.user.findUnique({
        where: {
            username
        },
        include: {
            User_Profile: true
        }
    })
}


module.exports = {
    loginGuest
}