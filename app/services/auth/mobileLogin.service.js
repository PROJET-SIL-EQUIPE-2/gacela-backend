const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PrismaClient = require("@prisma/client").PrismaClient;
const Role = require("../../middlewares/auth/roles")
const prisma = new PrismaClient();

const PENDING = "PENDING";
const REJECTED = "REJECTED";
const VALIDATED = "VALIDATED";

const loginLocataire = async (email, password) => {
  try {
    const user = await prisma.locataires.findFirst({
      where: { email },
    });

    if (!user)
      return {
        code: 400,
        data: { success: false, errors: [{ msg: `User doesn't exist` }] }
      }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return {
        code: 400,
        data: { success: false, errors: [{ msg: "Email or Password incorrect" }] }
      }

    if (!user.validated) {
      const demandesInscription = await prisma.demandesInscription.findFirst({
        where: {
          locataire_id: user.id,
        }
      })
      console.log(demandesInscription);
      if (!demandesInscription)
        return {
          code: 401,
          data: {
            success: false,
            errors: [{ msg: "The user isn't validated" }]
          }
        }


      if (demandesInscription.etat_demande === PENDING)
        return {
          code: 401,
          data: {
            success: false,
            errors: [{ msg: "Your demande is in qeue, wait for validation" }]
          }
        }

      else if (demandesInscription.etat_demande === REJECTED) {
        const rejection = await prisma.demandesInscriptionRejected.findFirst({
          where: {
            demande_id: demandesInscription.demande_id,
          }
        })
        const message = !rejection.justificatif ? "Your demande is rejected" : rejection.justificatif
        return {
          code: 401,
          data: {
            success: false,
            errors: [{ msg: message }]
          }
        }
      }
    }

    // The user exists and the password is correct
    // create jwt
    // TODO: Add role to signed jwt payload
    const token = jwt.sign({ id: user.id, role: Role.Locataire }, process.env.SECRET, {
      expiresIn: 36000,
    });

    /**
     * FIXME: Done
     * Discuss The tamplate of the response => Unique response in the whole application
     * Complete the other attributes in case we need to
     */
    return {
      code: 200,
      data: {
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
      }
    }
  } catch (err) {
    console.error(err);
    return {
      code: 500,
      data: {
        success: false, errors: [{ msg: "Server error..." }]
      }
    };
  }
}

const loginAM = async (email, password) => {
  try {
    const user = await prisma.agentsMaintenance.findFirst({
      where: { email },
    });

    if (!user)
      return {
        code: 400,
        data: {
          success: false, errors: [{ msg: `User doesn't exist` }]
        }
      }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return {
        code: 400,
        data: {
          success: false, errors: [{ msg: "Email or password incorrect" }]
        }
      }

    // The user exists and the password is correct
    // create jwt
    // TODO: Add role to signed payload
    const token = jwt.sign({ id: user.id, role: Role.Agent }, process.env.SECRET, {
      expiresIn: 36000,
    });

    /**
     * FIXME: DONE
     * Discuss The tamplate of the response => Unique response in the whole application
     * Complete the other attributes in case we need to
     */
    return {
      code: 200,
      data: {
        success: true,
        token,
        data: {
          id: user.agent_id,
          email: user.email,
          phone_number: user.phone_number,
          name: user.name,
          family_name: user.family_name,
        },
      }
    }
  } catch (err) {
    console.error(err);
    return {
      code: 500,
      data: {
        success: false, errors: [{ msg: "Server error..." }]
      }
    }
  }
}

module.exports = { loginLocataire, loginAM }