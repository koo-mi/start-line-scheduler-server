"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcrypt = require('bcryptjs');
router.route("/")
    // Creating new account
    .post(async (req, res) => {
    const { name, username, password, default_mode, default_target_time, home_street, home_city, home_province, work_city, work_province, work_street } = req.body;
    // Validate - Empty
    if (!name || !username || !password || !home_street || !home_city || !home_province || !work_street || !work_city || !work_province || !default_mode || !default_target_time) {
        return res.status(400).json({ message: "You must provide all fields." });
    }
    // Check is username exist
    const isUserExist = await prisma.user.findUnique({ where: { username: username } });
    // If username is already taken
    if (isUserExist) {
        return res.status(400).json({ message: 'Existing username. Please try different name.' });
    }
    // encrypt password
    const hashedPassword = bcrypt.hashSync(password);
    const default_home = `${home_street} ${home_city} ${home_province}`.replaceAll(' ', '+');
    const default_work = `${work_street} ${work_city} ${work_province}`.replaceAll(' ', '+');
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
    res.status(200).json({ message: "Account Successfully created" });
});
module.exports = router;
//# sourceMappingURL=signup.js.map