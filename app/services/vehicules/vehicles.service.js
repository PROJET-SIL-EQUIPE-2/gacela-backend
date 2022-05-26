const upload = require("../../utils/upload");
const path = require("path");
const geo = require("../geoservice/geo.service");
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const uploadPath = "images/vehicles/";
const getAll = async (vehiculeType) => {
    try {
        let allVehicles;
        if (vehiculeType) {
            // Find id of that type
            const type = await prisma.VehiculeType.findFirst({
                type: vehiculeType
            })
            if (!type){
                return {
                    code: 400,
                    data: {
                        success: false,
                        data: "No vehicule of that type was found"
                    }
                }
            }
            allVehicles = await prisma.Vehicules.findMany({
                where: {
                    type_vehicule: type.type_id
                },
                include: {
                    AgentsMaintenance: {
                        select: {
                            agent_id: true,
                            email: true,
                            phone_number: true,
                            family_name: true,
                            name: true,
                            blocked: true
                        }
                    }
                },
                orderBy: {
                    vehicule_id: 'asc'
                }
            });
        }
        else {
            allVehicles = await prisma.Vehicules.findMany({
                include: {
                    AgentsMaintenance: {
                        select: {
                            agent_id: true,
                            email: true,
                            phone_number: true,
                            family_name: true,
                            name: true,
                            blocked: true
                        }
                    }
                },
                orderBy: {
                    vehicule_id: 'asc'
                }
            });
        }
        return {
            code: 200,
            data: {
                success: true,
                data: allVehicles

            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Service error, ${e.meta.cause}`,
            log: `Service error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const getDisponible = async (vehiculeType) => {
    try {
        let disponibles;

        if (vehiculeType) {
            // Find id of that type
            const type = await prisma.VehiculeType.findFirst({
                where :{
                    type: vehiculeType
                }
            })
            if (!type){
                return {
                    code: 400,
                    data: {
                        success: false,
                        data: "No vehicule of that type was found"
                    }
                }
            }
            disponibles = await prisma.Vehicules.findMany({
                where: {
                    type_vehicule: type.type_id,
                    disponible: true
                },
                include: {
                    AgentsMaintenance: {
                        select: {
                            agent_id: true,
                            email: true,
                            phone_number: true,
                            family_name: true,
                            name: true,
                            blocked: true
                        }
                    }
                },
                orderBy: {
                    vehicule_id: 'asc'
                }
            });
        }
        else {
            disponibles = await prisma.Vehicules.findMany({
                where: {
                    disponible: true
                },
                include: {
                    AgentsMaintenance: {
                        select: {
                            agent_id: true,
                            email: true,
                            phone_number: true,
                            family_name: true,
                            name: true,
                            blocked: true
                        }
                    }
                },
                orderBy: {
                    vehicule_id: 'asc'
                }
            });
        }
        return {
            code: 200,
            data: {
                success: true,
                data: disponibles

            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Service error, ${e.message}`,
            log: `Service error, ${e.message}`,
            serviceError: e
        }
    }
}
const getById = async (id) => {
    try {
        const vehicule = await prisma.Vehicules.findUnique({
            where: {
                vehicule_id: id
            },
            include: {
                AgentsMaintenance: {
                    select: {
                        agent_id: true,
                        email: true,
                        phone_number: true,
                        family_name: true,
                        name: true,
                        blocked: true
                    }
                },
                type_car: true
            }
        })
        if (vehicule) {
            return {
                code: 200,
                data: {
                    success: true,
                    data: vehicule

                }
            }
        }
        else {
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No vehicule with id ${id} that was found`
                },
                log: `No vehicule with id ${id} that was found`
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}


const getAvailable = async () => {
    try {
        const available = await prisma.Vehicules.findMany({
            where: {
                disponible: true,
                etat: "WORKING"
            },
            include: {
                AgentsMaintenance: {
                    select: {
                        agent_id: true,
                        email: true,
                        phone_number: true,
                        family_name: true,
                        name: true,
                        blocked: true
                    }
                }
            }
        })

        return {
            code: 200,
            data: {
                success: true,
                data: available
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const getReserved = async () => {
    try {
        const reserved = await prisma.Vehicules.findMany({
            where: {
                disponible: false,
                etat: "WORKING"
            },
            select: {
                vehicule_id: true,
                matricule: true,
                car_photo: true,
                responsable: true,
                type_vehicule: true,
                kilometrage: true,
                etat: true,
                disponible: true,
                locked: true,
                AgentsMaintenance: {
                    select: {
                        agent_id: true,
                        email: true,
                        phone_number: true,
                        family_name: true,
                        name: true,
                        blocked: true
                    }
                },
                Reservations: {
                    where: {
                        etat: "ENCOURS"
                    }
                }
            }
        })

        //TODO Include reservation details

        return {
            code: 200,
            data: {
                success: true,
                data: reserved
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const getDefective = async () => {
    try {
        const defective = await prisma.Vehicules.findMany({
            where: {
                etat: "OUTOFORDER"
            },
            include: {
                AgentsMaintenance: {
                    select: {
                        agent_id: true,
                        email: true,
                        phone_number: true,
                        family_name: true,
                        name: true,
                        blocked: true
                    }
                }
            }
        })

        return {
            code: 200,
            data: {
                success: true,
                data: defective
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const addVehicle = async (
    req,
    carType,
    mileage,
    matricule
) => {
    try {
        // if (req.file.car_photo){
        //
        // }
        const car_photo = req.file;
        upload(car_photo)
        let newVehicle
        // find vehicule type id
        let type = await prisma.VehiculeType.findFirst({
            type: carType
        })

        if (car_photo) {
            newVehicle = await prisma.Vehicules.create({
                data: {
                    type_vehicule: type.type_id,
                    kilometrage: mileage,
                    matricule: matricule,
                    car_photo: path.join(uploadPath, car_photo.filename)
                }
            });
        } else {
            newVehicle = await prisma.Vehicules.create({
                data: {
                    type_vehicule: type.type_id,
                    kilometrage: mileage,
                    matricule: matricule,
                }
            });
        }
        if (newVehicle) {
            return {
                code: 201,
                data: {
                    success: true,
                    data: {
                        msg: "Vehicle registered"
                    }
                },
                log: "Vehicle registered"
            }
        }
        return {
            code: 400,
            data: {
                success: false,
                data: 'Vehicle can not be added'
            },
            log: 'Vehicle can not be added'
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const deleteVehicule = async (id) => {
    try {
        const deleted = await prisma.Vehicules.delete({
            where: {
                vehicule_id: id
            }
        });

        if (deleted) {
            return {
                code: 200,
                data: {
                    success: true,
                    data: "Vehicule deleted"
                },
                log: "Vehicule deleted"
            }
        } else {
            return {
                code: 400,
                data: {
                    success: false,
                    data: "Vehicule could not be deleted"
                },
                log: "Vehicule could not be deleted"
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Service error, ${e.meta.cause}`,
            log: `Service error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const assign = async (matricule, email) => {
    try {
        const agent = await prisma.AgentsMaintenance.findUnique({
            where: {
                email: email
            }
        });

        if (!agent) {
            return {
                code: 400,
                data: {
                    success: false,
                    data: "No agent of this email was found"
                },

            }
        }
        // const car = await prisma.Vehicules.findFirst({
        //     where: {
        //         matricule: matricule,
        //     }
        // });
        // if (car.responsable){
        //     return {
        //         code: 400,
        //         data: {
        //             success: false,
        //             data: `Car of matricule ${matricule} is already assigned to agent ${email}`
        //         }
        //     }
        // }
        await prisma.Vehicules.updateMany({
            where: {
                matricule: matricule,

            },
            data: {
                responsable: agent.agent_id
            }
        })
        return {
            code: 200,
            data: {
                success: true,
                data: `Car of matricule ${matricule} assigned to agent ${email}`
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Service error`,
            serviceError: e
        }
    }
}


const unassign = async (matricule, email) => {
    try {
        const agent = await prisma.AgentsMaintenance.findUnique({
            where: {
                email: email
            }
        });

        if (!agent) {
            return {
                code: 400,
                data: {
                    success: false,
                    data: "No agent of this email was found"
                },

            }
        }
        const car = await prisma.Vehicules.findFirst({
            where: {
                matricule: matricule,
            }
        });
        if (!car.responsable) {
            return {
                code: 400,
                data: {
                    success: false,
                    data: `Car of matricule ${matricule} is not assigned to agent ${email}`
                }
            }
        }
        // if (car.responsable){
        //     return {
        //         code: 400,
        //         data: {
        //             success: false,
        //             data: `Car of matricule ${matricule} is already assigned to agent ${email}`
        //         }
        //     }
        // }
        await prisma.Vehicules.updateMany({
            where: {
                matricule: matricule,

            },
            data: {
                responsable: null
            }
        })
        return {
            code: 200,
            data: {
                success: true,
                data: `Car of matricule ${matricule} unassigned from agent ${email}`
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Service error`,
            serviceError: e
        }
    }
}

const search = async (type, departLat, departLong) => {
    try {
        let {data} = await getDisponible(type)
        let cars = data.data
        let locations = await geo.carsLocation(cars)
        let carsWithCurrentLocation = await geo.carsLocation(locations)
        let lat = departLat
        let long = departLong
        let closestIdx = await geo.findClosestCar({lat, long}, carsWithCurrentLocation)
        let closest
        if (closestIdx >= 0){
            closest = cars[closestIdx]
        }else{
            closest = null
        }
        if (!closest){
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No nearby car was found`
                }
            }
        }
        return {
            code: 200,
            data: {
                success: true,
                data: closest
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.message}`,

        }
    }
}

const getAssignedCars = async (email) => {
    try {
        let agent = await prisma.AgentsMaintenance.findFirst({
            where: {
                email: email
            }
        })
        if (agent){
            // Get cars
            let assignedCars = await prisma.Vehicules.findMany({
                where: {
                    responsable: agent.agent_id
                }
            })
            return {
                code: 200,
                data: {
                    success: true,
                    data: assignedCars
                }
            }
        }
        return {
            code: 404,
            data: {
                success: false,
                data: `No agent of email ${email} not found`
            }
        }
    }catch (e) {

    }
}

module.exports = {
    getAll,
    getById,
    getAvailable,
    getReserved,
    getDefective,
    addVehicle,
    deleteVehicule,
    assign,
    unassign,
    getDisponible,
    search,
    getAssignedCars
}