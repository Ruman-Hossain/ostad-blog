const jwt = require("jsonwebtoken");
module.exports = decoder = (req, res, next) => {
	const token = req.headers.token;
	if (!token) {
		res.status(401);
		throw new Error("Not authorized, please login");
	}
	// Verify Token and get user id
	const verified = jwt.verify(
		token,
		process.env.JWT_SECRET,
		(error, decoded) => {
			if (error) {
				res.status(201).json({ Error: error });
			} else {
				// console.log("Im from decoder");
				// console.log(JSON.stringify(decoded, null, 2));
				req.headers.user_id = decoded.userId;
				next();
			}
		}
	);
};