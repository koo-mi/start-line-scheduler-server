'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jwt = require('jsonwebtoken');
function authorize(req, res) {
	if (!req.headers.authorization) {
		return res.status(401).json({ message: 'Please login' });
	}
	const token = req.headers.authorization.split(' ')[1];
	let response;
	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({ success: false, message: 'Invalid Token' });
		}
		response = decoded;
	});
	return response;
}
module.exports = authorize;
//# sourceMappingURL=authorize.js.map
