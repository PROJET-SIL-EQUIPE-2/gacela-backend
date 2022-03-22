/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

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
			.json({ errors: [{ msg: error.details[0].message }] });

	try {
		const { email, password } = req.body;
		// check if the user exist
		const user = await prisma.locataires.findFirst({
			where: { email },
		});

		if (!user)
			return res
				.status(400)
				.json({ errors: [{ msg: `Utilisateur n'exist pas` }] });

		// Check the password
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
			return res
				.status(400)
				.json({ errors: [{ msg: "Email ou Mot de passe Incorrecte" }] });

		/**
		 * TODO:
		 * Add verification if the user status is validated => Need to fill états tables
		 * Add isEmailVerified to locataires table => to verify emails
		 */

		// The user exists and the password is correct
		// create jwt
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: 36000,
		});

		/**
		 * FIXME:
		 * Discuss The tamplate of the response => Unique response in the whole application
		 * Complete the other attributes in case we need to
		 */
		return res.json({
			accountType: "Locataire",
			message: "Login avec succès",
			token,
			data: {
				id: user.id,
				email: user.email,
				nom: user.nom,
				prenom: user.prenom,
				birthday: user.birthday,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server error...");
	}
};

const loginAM = async (req, res) => {
	// get the body of the request => validation
	const { error } = await loginValidation(req.body);
	if (error)
		return res
			.status(400)
			.json({ errors: [{ msg: error.details[0].message }] });

	try {
		const { email, password } = req.body;
		// check if the user exist
		const user = await prisma.agentsMaintenance.findFirst({
			where: { email },
		});

		if (!user)
			return res
				.status(400)
				.json({ errors: [{ msg: `Utilisateur n'exist pas` }] });

		// Check the password
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
			return res
				.status(400)
				.json({ errors: [{ msg: "Email ou Mot de passe Incorrecte" }] });

		// The user exists and the password is correct
		// create jwt
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: 36000,
		});

		/**
		 * FIXME:
		 * Discuss The tamplate of the response => Unique response in the whole application
		 * Complete the other attributes in case we need to
		 */
		return res.json({
			accountType: "Agent de maintenance",
			message: "Login avec succès",
			token,
			data: {
				email: user.email,
				nom: user.nom,
				prenom: user.prenom,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server error...");
	}
};

module.exports = {
	loginLocataire,
	loginAM,
};
