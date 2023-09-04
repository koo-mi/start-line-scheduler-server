const jwt = require('jsonwebtoken');
import { Request, Response } from 'express'

function authorize(req: Request, res: Response) {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Please login" })
    }
  
    const token = req.headers.authorization.split(' ')[1];
    let response;
  
    jwt.verify(token, process.env.SECRET, (err, decoded)=> {
      if (err) {
        return res.status(401)
          .json({success: false, message: "Invalid Token"})
      } 
      response = decoded;
    })

    return response;
  }

module.exports = authorize;