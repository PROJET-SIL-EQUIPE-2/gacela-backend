const router = require("express").Router();
const reservationController = require('../../controllers/reservations/reservation.controller')

router.get("/verifyCode", reservationController.verifyCode) ;
router.get("/create-reservation", reservationController.createReservation) ;
router.get("/deverouillage", reservationController.deverouillerVoiture) ;
router.get("/verrouillage", reservationController.verrouillerVoiture) ;
router.get("/valider-trajet", reservationController.validerTrajet) ;
router.get("/valider-reservation/:reservation_id", reservationController.validerReservation) ;


module.exports = router;

