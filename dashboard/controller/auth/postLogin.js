// include libraries
var request = require('request'),
	common = require('../../helper/common');

/**
 * POST /login
 * Sign in using email and password.
 * @param email
 * @param password
*/

module.exports = function postLogin(req, res) {

	// reinit l10n with locale
	if (req.body && req.body.lang) {
		common.l10n.setLanguage(req.body.lang);
	}

	// validate
	req.assert('username', common.l10n.get('UsernameInvalid')).notEmpty();
	req.assert('password', common.l10n.get('PasswordBlank')).notEmpty();

	// get errors
	var errors = req.validationErrors();

	var role = ["admin", "teacher"];
	if (req.body.role == "teacher") {
		role = ["teacher"];
	} else if (req.body.role == "admin") {
		role = ["admin"];
	}

	//form data
	var form = {
		user: JSON.stringify({
			name: req.body.username,
			password: req.body.password,
			role: role
		})
	};
	
	//call
	if (!errors) {
		// call
		request({
			headers: {
				"content-type": "application/json",
			},
			json: true,
			method: 'POST',
			uri: common.getAPIUrl(req) + 'auth/login',
			body: form
		}, function(error, response, body) {

			if (response.statusCode == 200) {
				//store user and key in session
				req.session.user = response.body;

				// redirect to dashboard
				return res.redirect('/dashboard'+(req.body && req.body.lang ? "?lang="+req.body.lang : ""));
			} else {
				req.flash('errors', {
					msg: common.l10n.get('ErrorCode'+body.code)
				});
				return res.status(1000).send({
					message: "error inside postLogin in inner"
				});
			}
		});
	} else {
		req.flash('errors', errors);
		return res.status(1001).send({
			message: "error inside postLogin in outer"
		});
	}
};
