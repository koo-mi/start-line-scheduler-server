import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { SECRET } = process.env;

/* Validate login and send token */
router
	.route('/')
	.post(async (req: Request, res: Response): Promise<Response> => {
		const { username, password } = req.body;

		// Validate - Empty
		if (!username || !password) {
			return res.status(400).json({ message: 'Please enter required fields.' });
		}

		// Get user info based on the username
		try {
			const user = await prisma.user.findUnique({
				where: {
					username: username
				},
				include: {
					User_Profile: true
				}
			});

			if (!user) {
				return res.status(400).json({ error: { message: 'Invalid Login' } });
			}
			const isPasswordCorrect: string = bcrypt.compareSync(
				password,
				user.password
			);

			// Check if username exist, password matches
			if (user && isPasswordCorrect) {
				// Create token with ID and username
				const token: string = jwt.sign(
					{
						id: user.id,
						username: user.username,
						profile_id: user.User_Profile[0].id
					},
					SECRET,
					{ expiresIn: '12h' }
				);
				res.status(200).json({ token });
			} else {
				res.status(400).json({ error: { message: 'Invalid Login' } });
			}
		} catch (err) {
			return res.status(500).json({ message: 'Unable to connect to server.' });
		}
	});

module.exports = router;
