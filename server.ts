import express from "express";
const app = express();
const cors = require('cors');
require('dotenv').config();

/* Routers */
const summaryRouter = require("./routes/summary");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const directionRouter = require("./routes/direction");
const cheklistRouter = require("./routes/checklist");

const PORT = process.env.PORT || "5050";

app.use(express.json);
app.use(cors());

/* ENDPOINTS */
app.use('/summary', summaryRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/direction', directionRouter);
app.use('/checklist', cheklistRouter);


/* LISTEN */
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
