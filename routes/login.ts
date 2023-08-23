import express from "express";
import { Request, Response } from 'express'
const router = express.Router();

router.route("/")
    .get((req : Request, res: Response) => {
        
    })

module.exports = router;