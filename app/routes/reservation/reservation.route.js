const router = require("express").Router();
const reservationController = require('../../controllers/reservations/reservation.controller')

router.get("/invalide", reservationController.pending);

router.get("/encours", reservationController.validated);

router.get("/completed", reservationController.completed);

router.get("/rejected", reservationController.rejected)

router.post("/verifyCode", reservationController.verifyCode) ;


router.post("/create-reservation", reservationController.createReservation) ;

// // TODO
// router.get("/unlock", reservationController.unlockCar) ;
// // TODO
// router.get("/lock", reservationController.lockCar) ;
//

router.patch("/validate-trajet/:reservation_id", reservationController.validateTrajet) ;

// Fixed
router.patch("/validate-reservation/:reservation_id", reservationController.validateReservation) ;


module.exports = router;

