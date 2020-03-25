/**
 * validate session for dashboard
 */
module.exports = function validateSession(req, res, next) {
	if (!req.session.user) {
		return res.status(1002).send({
			message: "error inside validate session"
		});
	}
	if (req.session.user.user) req.role = req.session.user.user.role;
	next();
};
