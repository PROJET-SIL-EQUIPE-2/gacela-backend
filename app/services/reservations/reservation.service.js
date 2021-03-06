const randomstring = require("randomstring")
const PrismaClient = require("@prisma/client").PrismaClient;
const odb = require("../odb/odb");
const regionsService = require("../regions/regions.service")

const prisma = new PrismaClient();

const paymentService = require("../payment/payment.service")

const getById = async (reservation_id) => {
    try {
        return await prisma.Reservations.findUnique({
            where: {
                reservation_id: reservation_id
            },
            include: {
                vehicule: true,
                locataire: true,
                Paiment: true,
                reservation_region: true
            }
        })
    } catch (e) {

    }
}
// Get pending reservations
const pending = async () => {
    try {
        let reservations = await prisma.Reservations.findMany({
            where: {
                etat: "INVALIDE"
            }
        }
        );
        return {
            code: 200,
            data: {
                success: true,
                reservations
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }
}

// Get validated reservations
const validated = async () => {
    try {
        let reservations = await prisma.Reservations.findMany({
            where: {
                etat: "ENCOURS"
            }
        }
        );
        return {
            code: 200,
            data: {
                success: true,
                reservations
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }
}

// Get completed reservations
const completed = async () => {
    try {
        let reservations = await prisma.Reservations.findMany({
            where: {
                etat: "COMPLETED"
            }
        }
        );
        return {
            code: 200,
            data: {
                success: true,
                reservations
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }
}

// Get rejected reservations
const rejected = async () => {
    try {
        let reservations = await prisma.Reservations.findMany({
            where: {
                etat: "REJECTED"
            }
        }
        );
        return {
            code: 200,
            data: {
                success: true,
                reservations
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }
}



const createReservation = async (matricule, locataire, departLat, departLong, destLat, destLong) => {
    try {

        let loc = await prisma.Locataires.findFirst({
            where: {
                email: locataire
            }
        })

        if (!loc) {
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No locataire of email ${locataire} was found`
                },
                log: `No locataire of email ${locataire} was found`
            }
        }
        if (!loc.validated) {
            return {
                code: 400,
                data: {
                    success: false,
                    data: `locataire of email ${locataire} was not validated yet`
                },
                log: `locataire of email ${locataire} was not validated yet`
            }
        }

        if (loc.blocked) {
            return {
                code: 400,
                data: {
                    success: false,
                    data: `locataire of email ${locataire} is blocked`
                },
                log: `locataire of email ${locataire} is blocked\``
            }
        }
        let car = await prisma.Vehicules.findFirst({
            where: {
                matricule: matricule
            }
        })
        if (!car) {
            return {
                code: 400,
                data: {
                    success: false,
                    message: `No car of matricule ${matricule} was found`
                },
                log: `No car of matricule ${matricule} was found`
            }
        }
        if (!car.disponible) {
            return {
                code: 400,
                data: {
                    success: false,
                    message: `Car of matricule ${matricule} is not disponible`
                },
                log: `Car of matricule ${matricule} is not disponible`
            }
        }

        let reservation = await prisma.Reservations.findFirst({
            where: {
                locataire_id: loc.id,
                vehicule_id: car.vehicule_id,
                etat: "INVALIDE"
            }
        }
        );

        if (!reservation) {
            reservation = await prisma.Reservations.create({
                data: {
                    locataire_id: loc.id,
                    vehicule_id: car.vehicule_id,
                    etat: "INVALIDE",
                    departLat: departLat,
                    departLong: departLong,
                    destLat: destLat,
                    destLong: destLong
                }
            });

            return {
                code: 201,
                data: {
                    success: true,
                    reservation,
                    message: "Votre reservation a ??t?? bien enregistr??e. Vous devez proceder a la paiment pour la validation"
                },
                log: `Une reservation de la voiture ${matricule} a ete cree par le locataire ${locataire}`
            }
        }

        else {
            return {
                code: 400,
                data: {
                    success: false,
                    data: `Cette r??servation ${reservation.reservation_id} est toujours en cours`
                },
                log: `Cette r??servation ${reservation.reservation_id} est toujours en cours`
            }

        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }


}

// Validate reservation
const validateReservation = async (reservation_id, locataire_email) => {

    try {
        let client = await prisma.Locataires.findFirst({
            where: {
                email: locataire_email
            }
        })
        if (!client) {
            return {
                code: 400,
                data: {
                    success: false,
                    message: `No client of that email ${locataire_email} was found`,
                },
                log: `No client of that email ${locataire_email} was found`,
            }
        }
        let reservation = await prisma.Reservations.findUnique({
            where: {
                reservation_id: reservation_id,
            },
            include: {
                locataire: true
            }
        })
        if (!reservation) {
            return {
                code: 400,
                data: {
                    success: false,
                    message: `No reservation of that id ${reservation_id} was found`,
                },
                log: `No reservation of that id ${reservation_id} was found`,
            }
        }

        // Check if this client has requested this reservation
        if (reservation.locataire.email !== locataire_email) {
            return {
                code: 400,
                data: {
                    success: false,
                    message: `Locataire of email ${locataire_email} has not requested this reservation`,
                },
                log: `Locataire of email ${locataire_email} has not requested this reservation`,
            }
        }

        switch (reservation.etat) {
            case "ENCOURS":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} is en cours`
                    },
                    log: `Reservation of id ${reservation_id} is en cours`
                }
            case "COMPLETED":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} was completed before`
                    },
                    log: `Reservation of id ${reservation_id} was completed before`
                }
            case "INVALIDE":
                // TODO: Checkout client here

                reservation = await prisma.Reservations.update({
                    data: {
                        etat: "ENCOURS", //completed
                        code: randomstring.generate(7)
                    },
                    where: {
                        reservation_id: reservation_id,
                    }
                });

                // TODO Update ReservationRegion
                let region_name = regionsService.getRegionNameByLatLong(reservation.departLat, reservation.departLong);
                let region =  await regionsService.getRegionByName(region_name)
                await prisma.ReservationRegion.create({
                    data: {
                        region_id: region.region_id,
                        reservation_id: reservation.reservation_id
                    }
                })


                if (reservation) {
                    //   Update car status
                    await prisma.Vehicules.update({
                        data: {
                            disponible: false
                        },
                        where: {
                            vehicule_id: reservation.vehicule_id
                        }
                    })

                    // TODO: Send code to device using MQTT
                    odb.send(reservation.code)

                    return {
                        code: 200,
                        data: {
                            success: true,
                            message: "La reservation a ??t?? valid??e."
                        },
                        log: `La reservation ${reservation_id} a ??t?? valid??e.`
                    }

                }
                break;
            case "REJECTED":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} was rejected and can not be validated`
                    },
                    log: `Reservation of id ${reservation_id} was rejected and can not be validated`
                }
        }

        return {
            code: 400,
            data: {
                success: false,
                message: "La reservation n'a pas pu ??tre valid??e."
            },
            log: `La reservation de l\'id ${reservation_id} n'a pas pu ??tre valid??e.`
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }

}

const rejectReservation = async (reservation_id) => {
    try {
        let reservation = await prisma.Reservations.findUnique({
            where: {
                reservation_id: reservation_id,
            }
        })
        if (!reservation) {
            return {
                code: 400,
                data: {
                    success: false,
                    message: `No reservation of that id ${reservation_id} was found`,
                },
                log: `No reservation of that id ${reservation_id} was found`,
            }
        }
        switch (reservation.etat) {
            case "ENCOURS":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} is en cours`
                    },
                    log: `Reservation of id ${reservation_id} is en cours`
                }
            case "COMPLETED":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} was completed before`
                    },
                    log: `Reservation of id ${reservation_id} was completed before`
                }
            case "INVALIDE":
                reservation = await prisma.Reservations.update({
                    data: {
                        etat: "REJECTED",
                    },
                    where: {
                        reservation_id: reservation_id,
                    }
                });

                //   Update car status
                await prisma.Vehicules.update({
                    data: {
                        disponible: true
                    },
                    where: {
                        vehicule_id: reservation.vehicule_id
                    }
                })

                if (reservation) {
                    return {
                        code: 200,
                        data: {
                            success: true,
                            message: "La reservation a ??t?? rejete."
                        },
                        log: `La reservation de l\'id ${reservation_id} a ??t?? rejete.`
                    }

                }
                break;
            case "REJECTED":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} was rejected before`
                    },
                    log: `Reservation of id ${reservation_id} was rejected before`
                }
        }

        return {
            code: 400,
            data: {
                success: false,
                message: "La reservation n'a pas pu ??tre valid??e."
            },
            log: "La reservation n'a pas pu ??tre valid??e."
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }
}

const verifyCode = async (reservation_id, code) => {

    try {
        let reservation = await prisma.Reservations.findUnique({
            where: {
                reservation_id: reservation_id,
            }
        });

        if (!reservation) {
            return {
                status: 400,
                data: {
                    success: false,
                    message: `No reservation of that id ${reservation_id} was found`
                },
                log: `No reservation of that id ${reservation_id} was found`
            }
        }
        if (reservation.code === code) {
            // TODO: Send unlock command to device
            odb.setStatus("unlocked");
            await unlockCar(reservation.vehicule_id)
            // deverouillerVoiture(reservation)  ;
            return {
                status: 200,
                data: {
                    success: true,
                    message: "Car unlocked"
                },
                log: `Car of code ${code} unlocked`
            }
        }
        // TODO: Send error message to device
        odb.setStatus("Locked, try again")

        // TODO: Retry ?

        return {
            status: 400,
            data: {
                success: false,
                message: "Le code est incorrect! "
            },
            log: "Le code est incorrect! "
        }
    } catch (e) {
        return {
            status: 500,
            data: `Server error, ${e.message}`,
            log: `Server error,${e.message}`,
            serviceError: e
        }
    }

}

const unlockCar = async (vehicule_id) => {

    let dev = await prisma.Vehicules.update({
        data: {
            locked: false
        },
        where: {
            vehicule_id: vehicule_id,
        }
    });
    return !!dev;
}


const lockCar = async (vehicule_id) => {

    let dev = await prisma.Vehicules.update({
        data: {
            locked: true
        },
        where: {
            vehicule_id: vehicule_id,
        }
    });
    return !!dev;
}

const validateTrajet = async (reservation_id) => {
    try {
        let reservation = await prisma.Reservations.findUnique({
            where: {
                reservation_id: reservation_id,
            }
        })
        if (!reservation) {
            return {
                code: 400,
                data: {
                    success: false,
                    message: `No reservation of that id ${reservation_id} was found`,
                },
                log: `No reservation of that id ${reservation_id} was found`,
            }
        }
        switch (reservation.etat) {
            case "ENCOURS":
                let valid = await prisma.Reservations.update({
                    data: {
                        etat: 'COMPLETED'
                    },
                    where: {
                        reservation_id: reservation_id,
                    }
                }
                );
                // Update Vehicule
                await prisma.Vehicules.update({
                    data: {
                        disponible: true
                    },
                    where: {
                        vehicule_id: reservation.vehicule_id
                    }
                })
                if (valid) {
                    // unlock car
                    // await unlockCar(reservation.vehicule_id)

                    // Update real price
                    await paymentService.update(reservation.reservation_id)

                    return {
                        code: 200,
                        data: {
                            success: true,
                            message: "Le trajet est marqu?? comme complet."
                        },
                        log: `Le trajet ${reservation_id} est marqu?? comme complet.`
                    }
                }
                break;
            case "COMPLETED":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} was completed before`
                    },
                    log: `Reservation of id ${reservation_id} was completed before`
                }
            case "INVALIDE":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} is not validated`
                    },
                    log: `Reservation of id ${reservation_id} is not validated`
                }
            case "REJECTED":
                return {
                    code: 400,
                    data: {
                        success: false,
                        message: `Reservation of id ${reservation_id} was rejected and can not be validated`
                    },
                    log: `Reservation of id ${reservation_id} is not validated`
                }
        }
        return {
            code: 400,
            data: {
                success: false,
                message: "Un probleme est survenue lors de la modification"
            },
            log: `Un probleme est survenue lors de la modification du trajet ${reservation_id}`
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }
}



const exists = async (reservation_id) => {
    try {

        let reservation = await prisma.Reservations.findUnique({
            where: {
                reservation_id: reservation_id
            }
        })

        return reservation != null
    } catch (e) {

        return false
    }
}
/**
 * Checks whether a reservation is finished or not
 * */
const isFinished = async (reservation_id) => {
    try {
        let reservation = await prisma.Reservations.findUnique({
            where: {
                reservation_id: reservation_id
            }
        })
        return reservation.etat === "COMPLETED";

    } catch (e) {
        return false
    }
}

const history = async (email) => {
    // Get user by email
    try {
        let locataire = await prisma.Locataires.findFirst({
            where: {
                email: email
            }
        })

        if(!locataire){
            return {
                code: 404,
                data: `No locataire of email ${email} was found`
            }
        }
        // Find reservations of that locataire
        let reservations = await prisma.Reservations.findMany({
            where: {
                locataire_id: locataire.id,
                etat: "COMPLETED"
            },
            include: {
                vehicule: true
            }
        })

        return {
            code: 200,
            data: {
                success: true,
                data: reservations
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`
        }
    }
}


module.exports = {
    createReservation,
    validateTrajet,
    verifyCode,
    validateReservation,
    rejectReservation,
    pending,
    validated,
    completed,
    rejected,
    lockCar,
    unlockCar,
    exists,
    isFinished,
    getById,
    history,

}
