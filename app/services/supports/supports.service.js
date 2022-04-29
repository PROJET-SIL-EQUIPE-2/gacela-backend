
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const notificationService = require("../notifications/notifications.service")


const demandeSupport = async (reservation_id, typeSupport, message) => {

    try {

        const Reservation = await prisma.Reservations.findFirst({
            where: {
                reservation_id: Number(reservation_id)
            },
            include: {
                Vehicules: {
                    select: {
                        responsable: true,
                    }
                }
            }
        });
        if (!Reservation)
            return {
                code: 400,
                data: { success: false, errors: [{ msg: `Reservation n'existe pas` }] }
            };


        const support = await prisma.demandesSupport.create({
            data: {
                locataire_id: Reservation.locataire_id,
                agent_id: Reservation.Vehicules.responsable,
                vehicule_id: Reservation.vehicule_id,
                type_support: typeSupport,
                message: message,
            }
        });


        // TODO: NOTIFY THE AGENT (push notification)
        if (support) {
            // send the notification
            await notificationService.sendNotification(Reservation.Vehicules.responsable,
                "Vous avez une demande de support",
                message)

            return {
                code: 200,
                data: {
                    success: true,
                    message: ' Demande de support envoyée',
                }
            };
        }
    } catch (e) {
        console.error(e);
        return {
            code: 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const getDemandeSupport = async (agent_id) => {

    try {
        const supports = await prisma.demandesSupport.findMany({
            where: {
                agent_id: Number(agent_id),
            }
        });

        if (supports)
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        supports,
                    },
                }
            };
    } catch (e) {
        console.error(e);
        return {
            code: 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const getAllDemandeSupport = async () => {

    try {
        const supports = await prisma.demandesSupport.findMany();

        if (supports)
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        supports
                    },
                }
            };
    } catch (e) {
        console.error(e);
        return {
            code: 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const readDemandeSupport = async (demande_id) => {

    try {
        const supports = await prisma.demandesSupport.update({
            where: {
                demande_id: Number(demande_id)
            },
            data: {
                read: true
            }
        });

        if (supports)
            return {
                code: 200,
                data: {
                    success: true,
                    message: ' Demande de support lue',
                }
            };
    } catch (e) {
        console.error(e);
        return {
            code: 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const replyDemandeSupport = async (demandeId, locataireId, adminId, message) => {
    try {
        // check if the demande exist
        const demande = await prisma.demandesSupport.findFirst({
            where: {
                demande_id: Number(demandeId),
            }
        })

        if (!demande)
            return {
                code: 400,
                data: {
                    success: false,
                    errors: [{ msg: `Demande de support n'existe pas` }]
                }
            }

        // check if the locataire exist
        const locataire = await prisma.locataires.findFirst({
            where: {
                id: Number(locataireId),
            }
        })

        if (!locataire)
            return {
                code: 400,
                data: {
                    success: false,
                    errors: [{ msg: `locataire n'existe pas` }]
                }
            }

        // check l'admin
        const admin = await prisma.admins.findFirst({
            where: {
                admin_id: Number(adminId),
            }
        })

        if (!admin)
            return {
                code: 400,
                data: {
                    success: false,
                    errors: [{ msg: `admin n'existe pas` }]
                }
            }

        const reply = await prisma.reply.create({
            data: {
                demande_id: Number(demandeId),
                locataire_id: Number(locataireId),
                admin_id: Number(adminId),
                message: message,
            }
        })

        if (!reply)
            return {
                code: 400,
                data: {
                    success: false,
                    errors: [{ msg: `votre demande n'a pas pu être créé` }]
                }
            }


        // le reply a été créé successfuly
        return {
            code: 201,
            data: {
                success: true,
                data: [{
                    msg: `votre reply a été envoyé`,
                    reply_id: reply.reply_id,
                    reply_msg: reply.message,
                }]
            }
        }

    } catch (e) {
        console.error(e);
        return {
            code: 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const getDemandeSupportReplies = async (demandeId) => {
    try {
        // check if the demande exist
        const demande = await prisma.demandesSupport.findFirst({
            where: {
                demande_id: Number(demandeId)
            }
        })

        if (!demande)
            return {
                code: 400,
                data: {
                    success: false,
                    errors: [{ msg: `votre demande n'existe pas` }]
                }
            }

        // get the replies
        const replies = await prisma.reply.findMany({
            where: {
                demande_id: Number(demandeId),
            }
        })

        return {
            code: 200,
            data: {
                success: true,
                replies,
            }
        }
    } catch (e) {
        console.error(e);
        return {
            code: 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

module.exports = {
    demandeSupport,
    getDemandeSupport,
    getAllDemandeSupport,
    readDemandeSupport,
    replyDemandeSupport,
    getDemandeSupportReplies,
}