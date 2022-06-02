const router = require("express").Router();
const statsController = require("../../controllers/statistics/statistics.controller");


router.get("/demandesAcceptYear", statsController.getNbrDemandesAcceptAnnee);
router.get("/demandesAcceptMonth", statsController.getNbrDemandesAcceptMois);
router.get("/demandesAcceptWeek", statsController.getNbrDemandesAcceptSemaine);
router.get("/demandesRejetYear", statsController.getNbrDemandesRejetAnnee);
router.get("/demandesRejetMonth", statsController.getNbrDemandesRejetMois);
router.get("/demandesRejetWeek", statsController.getNbrDemandesRejetSemaine);
router.get("/demandesInscriptionsYear", statsController.getNbrInscriptionsAnnee);
router.get("/demandesInscriptionsMonth", statsController.getNbrInscriptionsMois);
router.get("/demandesInscriptionWeek", statsController.getNbrInscriptionsSemaine);

router.get("/getFinanceWeek", statsController.getFinanceSemaine);
router.get("/getFinanceMonth", statsController.getFinanceMois);
router.get("/getFinanceAnnee", statsController.getFinanceAnnee);
