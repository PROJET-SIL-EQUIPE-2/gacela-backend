/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PrismaClient = require("@prisma/client").PrismaClient;
const Role = require('../../middlewares/auth/roles');

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
			.json({ success: false, errors: [{ msg: error.details[0].message }] });

	try {
		const { email, password } = req.body;
		// check if the user exist
		const user = await prisma.locataires.findFirst({
			where: { email },
		});

		if (!user)
			return res
				.status(400)
				.json({ success: false, errors: [{ msg: `User doesn't exist` }] });

		// Check the password
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
			return res
				.status(400)
				.json({ success: false, errors: [{ msg: "Email or Password incorrect" }] });

		if (!user.validated) {
			const demandesInscription = await prisma.demandesInscription.findFirst({
				where: {
					locataire_id: user.id,
				}
			})
			if (!demandesInscription)
				return res.status(401).json({
					success: false,
					errors: [{ msg: "The user isn't validated" }]
				});
			if (demandesInscription.etat_demande === 2)
				return res.status(401).json({
					success: false,
					errors: [{ msg: "Your demande is in qeue, wait for validation" }]
				});
			else if (demandesInscription.etat_demande === 3) {
				const rejection = await prisma.demandesInscriptionRejected.findFirst({
					where: {
						demande_id: demandesInscription.demande_id,
					}
				})
				const message = !rejection.justificatif ? "Your demande is rejected" : rejection.justificatif
				return res.status(401).json({
					success: false,
					errors: [{ msg: message }]
				});
			}
		}

		// The user exists and the password is correct
		// create jwt
		// TODO: Add role to signed jwt payload
		const token = jwt.sign({ id: user.id, role: Role.Locataire }, process.env.JWT_SECRET, {
			expiresIn: 36000,
		});

		/**
		 * FIXME:
		 * Discuss The tamplate of the response => Unique response in the whole application
		 * Complete the other attributes in case we need to
		 */
		return res.json({
			success: true,
			token,
			data: {
				id: user.id,
				email: user.email,
				phone_number: user.phone_number,
				name: user.name,
				family_name: user.family_name,
				validated: user.validated,
				personal_photo: user.personal_photo,
				photo_identity: user.photo_identity,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, errors: [{ msg: "Server error..." }] });
	}
};

const loginAM = async (req, res) => {
	// get the body of the request => validation
	const { error } = await loginValidation(req.body);
	if (error)
		return res
			.status(400)
			.json({ success: false, errors: [{ msg: error.details[0].message }] });

	try {
		const { email, password } = req.body;
		// check if the user exist
		const user = await prisma.agentsMaintenance.findFirst({
			where: { email },
		});

		if (!user)
			return res
				.status(400)
				.json({ success: false, errors: [{ msg: `User doesn't exist` }] });

		// Check the password
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
			return res
				.status(400)
				.json({ success: false, errors: [{ msg: "Email or password incorrect" }] });

		// The user exists and the password is correct
		// create jwt
		// TODO: Add role to signed payload
		const token = jwt.sign({ id: user.id, role: Role.Agent }, process.env.JWT_SECRET, {
			expiresIn: 36000,
		});

		/**
		 * FIXME:
		 * Discuss The tamplate of the response => Unique response in the whole application
		 * Complete the other attributes in case we need to
		 */
		return res.json({
			success: true,
			token,
			data: {
				id: user.agent_id,
				email: user.email,
				phone_number: user.phone_number,
				name: user.name,
				family_name: user.family_name,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, errors: [{ msg: "Server error..." }] });
	}
};

module.exports = {
	loginLocataire,
	loginAM,
};
