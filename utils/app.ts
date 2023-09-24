import express from "express";
const app = express();
const cors = require('cors');

/* Routers */
const summaryRouter = require("../routes/summary");
const loginRouter = require("../routes/login");
const signupRouter = require("../routes/signup");
const directionRouter = require("../routes/direction");
const checklistRouter = require("../routes/checklist");

app.use(express.json());
app.use(cors());

/* ENDPOINTS */
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/summary', summaryRouter);
app.use('/direction', directionRouter);
app.use('/checklist', checklistRouter);

export default app;