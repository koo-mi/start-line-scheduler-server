import express from 'express';

const app = express();
const cors = require('cors');

const PORT = process.env.PORT || '5050';

/* Routers */
const summaryRouter = require('./routes/summary');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const directionRouter = require('./routes/direction');
const checklistRouter = require('./routes/checklist');
const guestRouter = require('./routes/guest');

app.use(express.json());
app.use(cors());

/* ENDPOINTS */
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/guest', guestRouter);
app.use('/summary', summaryRouter);
app.use('/direction', directionRouter);
app.use('/checklist', checklistRouter);

/* LISTEN */
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
