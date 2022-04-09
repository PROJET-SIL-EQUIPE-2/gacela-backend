/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

const Joi = require("joi");
const mobileLoginService = require("../../services/auth/mobileLogin.service")


/**
 * HTTP response code
 * 400 Bad request
 * 500 Server error
 * 401 Unauthorized
 */

/**
 *
 * @param {the data must contains email and password} data
 * @returns true if data.email and data.password are corrects else false
 */
const loginValidation = (data) => {
	const validationSchema = new Joi.object({
		email: Joi.string().email().required().max(255),
		password: Joi.string().required().min(8).max(255),
	});
	return validationSchema.validate(data);
};

/**
 * @route   POST /api/mobile_login/locataire
 * @desc    Login for Locataire app
 * @body    { email, password }
 * @access  Public
 */
const loginLocataire = async (req, res) => {
	// get the body of the request => validation
	const { error } = await loginValidation(req.body);
	if (error)
		return res
			.status(400)
			.json({ success: false, errors: [{ msg: error.details[0].message }] });

	const { email, password } = req.body;
	const { code, data } = await mobileLoginService.loginLocataire(email, password)
	return res.status(code).json(data);
};

/**
 * @route   POST /api/mobile_login/agent
 * @desc    Login for agent app
 * @body    { email, password }
 * @access  Public
 */
const loginAM = async (req, res) => {
	// get the body of the request => validation
	const { error } = await loginValidation(req.body);
	if (error)
		return res
			.status(400)
			.json({ success: false, errors: [{ msg: error.details[0].message }] });

	const { email, password } = req.body;
	const { code, data } = await mobileLoginService.loginAM(email, password)
	return res.status(code).json(data)
};

module.exports = {
	loginLocataire,
	loginAM,
};
