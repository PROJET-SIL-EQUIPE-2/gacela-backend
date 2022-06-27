const bcrypt = require("bcrypt");
const upload = require("../../utils/upload");
const path = require("path");

const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

const DEMAND_STATE_VALIDATED = 1;
const DEMAND_STATE_PENDING = 2;
const DEMAND_STATE_REJECTED = 3;
const uploadPath = "images/locataires/";

const signUpLocataire = async (req,
                                name,
                               family_name,
                               email,
                               phone_number,
                               password,) => {
    let uploaded1
    let uploaded2
    try {
        // Check if locataire already exists
        const locataire = await prisma.locataires.findUnique({
            where: {
                email: email
            }
        });
        if (locataire) {
            // User exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "Locataire already exists"
                    }]
                },
                log: "Locataire already exists"
            }
        }

        // Create a brand new locataire
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Rename uploaded files

        if (req.files.personal_photo && req.files.photo_identity){
            const personal_photo = req.files.personal_photo[0];
            uploaded1 = upload(personal_photo);

            const photo_identity = req.files.photo_identity[0]
            uploaded2 = upload(photo_identity);
            // TODO: Must be a transaction ?
            const newLocataire = await prisma.locataires.create({
                data: {
                    name: name,
                    family_name: family_name,
                    email: email,
                    phone_number: phone_number,
                    password: passwordHash,
                    personal_photo: path.join(uploadPath, personal_photo.filename + uploaded1.ext),
                    photo_identity: path.join(uploadPath, photo_identity.filename + uploaded2.ext)
                }
            })
            // console.log("LOCATAIRE ADDED")
            await prisma.DemandesInscription.create({
                data: {
                    locataire_id: newLocataire.id,
                }
            });
            // await prisma.$queryRaw`INSERT INTO "DemandesInscription" (locataire_id, etat_demande) VALUES (${new}, ${})`

            console.log("DEMANDE ADDED")

            return {
                code: 201,
                data: {
                    success: true,
                    data: {
                        msg: "Locataire registered"
                    }
                },
                log: "Locataire registered"
            }


        }else{
            return  {
                code: 400,
                data: {
                    success: false,
                    errors: [{
                        msg: 'Photos must be provided'
                    }]
                },
                log: "Photos must be provided"
            }
        }


    } catch (e) {
        console.log(e)
        return {
            code: 500,
            data: `Server error`,
            log: `Server error`,
            serviceError: e
        }
    }
}

const validateLocataire = async (email) => {
    try {
        // Find locataire demand
        const locataire = await prisma.locataires.findUnique({
            where: {
                email: email
            }
        });

        // Check if locataire doesn't exist
        if (!locataire) {
            return {
                code:  400,
                data: {
                    errors: [{
                        msg: "Locataire doesn't exist"
                    }]
                },
                log: "Locataire doesn't exist"
            }
        }

        // Check if locataire demand is validated
        if (locataire.validated){
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "Locataire is already validated"
                    }]
                },
                log: "Locataire is already validated"
            }
        }

        // Find demand
        let demand = await prisma.DemandesInscription.findMany({
            where: {
                locataire_id:locataire.id
            }
        });
        // res.json(demand);
        console.log(locataire.id);
        if (demand.length > 0){
            let demandRejected = await prisma.DemandesInscriptionRejected.findUnique({
                where: {
                    demande_id: demand[0].demande_id
                }
            })
            if (!demandRejected){
                // Locataire is not rejected before

                // Create a transaction that does the following
                // 1. Update DemandesInscription
                // 2. Update validated column

                const [updatedDemand, updatedLocataire] = await prisma.$transaction([
                    prisma.DemandesInscription.update({
                        where: {
                            demande_id: demand[0].demande_id
                        },
                        data: {
                            etat_demande: "VALIDATED"
                        }
                    }),
                    prisma.locataires.update({
                        where: {
                            id: locataire.id
                        },
                        data: {
                            validated: true
                        },
                        select: {
                            id: true,
                            email: true,
                            phone_number: true,
                            name: true,
                            family_name: true,
                            validated: true
                        }
                    })
                ]);
                return {
                    code: 200,
                    data: {
                        success: true,
                        data: {
                            validated: true,
                            updatedLocataire
                        }
                    },
                    log: "Locataire validated"
                }
            }
            // TODO: Should we handle the case where locataire was rejected before?
            return {
                code: 400,
                data: {
                    errors: [
                        {
                            msg: "This demand was rejected before"
                        }
                    ]
                },
                log: "This demand was rejected before"
            }

        }

        return {
            code: 400,
            data: {
                errors: [
                    {
                        msg: "No demand found"
                    }
                ]
            },
            log: "No demand found"
        }

    }catch (e){
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const rejectLocataire = async (email, justificatif) => {
    try {

        // 1. Find non validated locataire
        // 2. Create a rejection record
        // 3. Send an email along with a justification
        const locataire = await prisma.locataires.findUnique({
            where: {
                email: email
            }
        });

        // Check if locataire doesn't exist
        if (!locataire) {
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "Locataire doesn't exist"
                    }]
                },
                log: "Locataire doesn't exist"
            }
        }
        // Check if locataire demand is validated
        if (locataire.validated){
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "Locataire is already validated"
                    }]
                },
                log: "Locataire is already validated"
            }
        }

        // Check if locataire is rejected before
        let demand = await prisma.DemandesInscription.findFirst({
            where: {
                locataire_id:locataire.id
            }
        });

        if (demand) {
            let demandRejected = await prisma.DemandesInscriptionRejected.findUnique({
                where: {
                    demande_id: demand.demande_id
                }
            })
            if (demandRejected){
                return {
                    code: 400,
                    data: {
                        errors: [{
                            msg: "This demand is rejected before"
                        }]
                    },
                    log: "This demand is rejected before"
                }

            }

            // A transaction containing
            // 1. Create  a rejection record
            // 2. Update DemandesInscription
            await prisma.$transaction([
                prisma.DemandesInscriptionRejected.create({
                    data: {
                        demande_id: demand.demande_id,
                        justificatif: justificatif
                    }
                }),
                prisma.DemandesInscription.update({
                    where: {
                        demande_id: demand.demande_id
                    },
                    data: {
                        etat_demande: "REJECTED"
                    }
                })
            ]);
            // TODO: Send email and delete records
            // await sendEmail(email, "Motif de rejet", justificatif)

            // Delete records
            // await prisma.$transaction([
            //     prisma.DemandesInscriptionRejected.delete({
            //         where: {
            //             demande_id: demand.demande_id,
            //         }
            //     }),
            //     prisma.DemandesInscription.delete({
            //         where: {
            //             demande_id: demand.demande_id
            //         }
            //     }),
            //     prisma.Locataires.delete({
            //         where: {
            //             email: email
            //         }
            //     }),
            // ]);

            // Send success response
            return {
                code: 200,
                data: {
                    success: true,
                    data: "Locataire rejected",
                    message: "An email is sent to locataire"
                },
                log: "An email is sent to locataire"
            }
        }

        return {
            code: 400,
            data: {
                errors: [{
                    msg: "No demand found"
                }]
            },
            log: "No demand found"
        }

    }catch (e){
        console.log(e)
        return {
            code: 500,
            data: `Server error`,
            log: `Server error`,
            serviceError: e
        }
    }
}


const signUpAM = async (name,
                         family_name,
                         email,
                         phone_number,
                         password) => {
    try {
        // Check if agent already exits
        const agent = await prisma.AgentsMaintenance.findUnique({
            where: {
                email: email
            }
        });

        if (agent){
            // Agent exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "Agent already exists"
                    }]
                },
                log: "Agent already exists"
            }
        }
        // Create a brand new agent
        const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS || 10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAgent = await prisma.AgentsMaintenance.create({
            data: {
                name: name,
                family_name: family_name,
                email: email,
                phone_number: phone_number,
                password: passwordHash,
            }
        })

        return {
            code: 201,
            data: {
                success: true,
                data: {
                    msg: "New agent added"
                }
            },
            log: "New agent added"
        }
    }catch (e){
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const registerAdmin = async (name,
                             family_name,
                             email,
                             password) => {

    try {
        // Check if agent already exits
        const admin = await prisma.Admins.findUnique({
            where: {
                email: email
            }
        });

        if (admin){
            // Admin exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "Admin already exists"
                    }]
                },
                log: "Admin already exists"
            }

        }
        // Create a brand new Admin
        const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS || 10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = await prisma.Admins.create({
            data: {
                name: name,
                family_name: family_name,
                email: email,
                password: passwordHash,
            }
        })
        return {
            code: 201,
            data: {
                success: true,
                data: {
                    msg: "Admin added"
                }
            },
            log: "Admin added"
        }

    }catch (e){
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const registerDecideur = async (name,
                                family_name,
                                email,
                                phone_number,
                                password) => {
    try {
        // Check if agent already exits
        const decideur = await prisma.Decideurs.findUnique({
            where: {
                email: email
            }
        });

        if (decideur){
            // Decideur exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "Decideur already exists"
                    }]
                },
                log: "Decideur already exists"
            }

        }
        // Create a brand new agent
        const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS || 10);
        const passwordHash = await bcrypt.hash(password, salt);

        await prisma.Decideurs.create({
            data: {
                name: name,
                family_name: family_name,
                email: email,
                phone_number: phone_number,
                password: passwordHash,
            }
        })

        return {
            code: 201,
            data: {
                success: true,
                data: {
                    msg: "Decideur added"
                }
            },
            log: "Decideur added"
        }

    }catch (e){
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

module.exports = {
    signUpLocataire,
    validateLocataire,
    rejectLocataire,
    signUpAM,
    registerAdmin,
    registerDecideur
}