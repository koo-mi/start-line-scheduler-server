"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors = require('cors');
require('dotenv').config();
/* Routers */
const summaryRouter = require("./routes/summary");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const directionRouter = require("./routes/direction");
const checklistRouter = require("./routes/checklist");
const PORT = process.env.PORT || "5050";
app.use(express_1.default.json());
app.use(cors());
/* ENDPOINTS */
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/summary', summaryRouter);
app.use('/direction', directionRouter);
app.use('/checklist', checklistRouter);
/* LISTEN */
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
//# sourceMappingURL=server.js.map