const PrismaClient = require("@prisma/client").PrismaClient;
const locataireService = require("../../services/mailLoc.service");

const prisma = new PrismaClient();

const DEMAND_STATE_REJECTED = 3;

const getValidatedLocataires = async (req, res) => {
  try {
    const non_validated = await prisma.locataires.findMany({
      where: {
        validated: true,
      },
      select: {
        id: true,
        email: true,
        phone_number: true,
        photo_identity: true,
        personal_photo: true,
        name: true,
        family_name: true,
        validated: true,
      },
    });
    return res.send(non_validated);
  } catch (e) {
    console.error(e);
    return res.status(500).json("Server error");
  }
};

const getWaitingLocataires = async (req, res) => {
  try {
    const r = await prisma.DemandesInscription.findMany({
      where: {
        etat_demande: "PENDING",
      },
      include: {
        locataire: {
          select: {
            family_name: true,
            name: true,
            email: true,
            phone_number: true,
            personal_photo: true,
            photo_identity: true,
          },
        },
      },
    });

    res.send(r);
  } catch (e) {
    console.error(e);
    return res.status(500).json("Server error");
  }
};

const getRejectedLocataires = async (req, res) => {
  try {
    const r = await prisma.DemandesInscription.findMany({
      where: {
        etat_demande: "REJECTED",
      },
      include: {
        locataire: {
          select: {
            family_name: true,
            name: true,
            email: true,
            phone_number: true,
            personal_photo: true,
            photo_identity: true,
          },
        },
        rejected: {
          select: {
            justificatif: true,
          },
        },
      },
    });

    res.send(r);
  } catch (e) {
    console.error(e);
    return res.status(500).json("Server error");
  }
};

const getAllLocataires = async (req, res) => {
  try {
    const users = await prisma.locataires.findMany({
      include: {
        DemandesInscription: {
          select: {
            etat_demande: true,
            date_demande: true,
          },
        },
      },
    });

    return res.status(200).json({
      data: {
        success: true,
        data: users,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      code: 500,
      message: e.message,
    });
  }
};
const getBlockedLocataires = async (req, res) => {
  try {
    const blocked = await prisma.locataires.findMany({
      where: {
        blocked: true,
      },
      select: {
        id: true,
        email: true,
        phone_number: true,
        photo_identity: true,
        personal_photo: true,
        name: true,
        family_name: true,
        validated: true,
      },
    });
    return res.status(200).json({
      data: {
        success: true,
        data: blocked,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      code: 500,
      message: e.message,
    });
  }
};

const getNotBlockedLocataires = async (req, res) => {
  try {
    const non_blocked = await prisma.locataires.findMany({
      where: {
        blocked: false,
      },
      select: {
        id: true,
        email: true,
        phone_number: true,
        photo_identity: true,
        personal_photo: true,
        name: true,
        family_name: true,
        validated: true,
      },
    });
    return res.send({
      data: {
        success: true,
        data: non_blocked,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      code: 500,
      message: e.message,
    });
  }
};

//valider une demande d'inscription d'un locataire dans
const Demandevalidate = async (req, res) => {
  await locataireService.Demandevalidate(req, res);
};
//rejeter une demande d'inscription d'un locataire
const DemandeReject = (req, res) => {
  locataireService.DemandeReject(req, res);
};

module.exports = {
  getValidatedLocataires,
  getRejectedLocataires,
  getWaitingLocataires,
  Demandevalidate,
  DemandeReject,
  getAllLocataires,

  getBlockedLocataires,
  getNotBlockedLocataires,
};
