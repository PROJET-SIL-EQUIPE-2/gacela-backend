const router = require("express").Router();
const reservationController = require('../../controllers/reservations/reservation.controller')

router.get("/invalide", reservationController.pending);

// router.get("/deverouillage", reservationController.deverouillerVoiture);
// router.get("/verrouillage", reservationController.verrouillerVoiture);
// router.get("/valider-trajet", reservationController.validerTrajet);
// router.get("/valider-reservation/:reservation_id", reservationController.validerReservation);

router.get("/encours", reservationController.validated);

router.get("/completed", reservationController.completed);

router.get("/rejected", reservationController.rejected)

// GET reservation history of a user
router.get("/history", reservationController.history)

router.post("/verify-code", reservationController.verifyCode);


router.post("/create-reservation", reservationController.createReservation);

// // TODO
// router.get("/unlock", reservationController.unlockCar) ;
// // TODO
// router.get("/lock", reservationController.lockCar) ;
//

router.patch("/validate-trajet/:reservation_id", reservationController.validateTrajet);



// Fixed
router.patch("/validate-reservation", reservationController.validateReservation);

router.patch("/reject-reservation/:reservation_id", reservationController.rejectReservation)

module.exports = router;

