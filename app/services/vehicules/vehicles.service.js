const upload = require("../../utils/upload");
const path = require("path");
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const uploadPath = "images/vehicles/";
const getAll = async () => {
    try {
        const allVehicles = await prisma.Vehicules.findMany({
            include: {
                AgentsMaintenance: true
            }
        });
        return {
            code: 200,
            data: {
                success: true,
                data: {
                    allVehicles
                }
            }
        }
    }catch (e){
        return {
            code: 500,
            data: "Server error",
            serviceError: e
        }
    }
}

const getById = async (id) => {
    try {
        const vehicule = await prisma.Vehicules.findUnique({
            where: {
                vehicule_id: id
            }
        })
        if (vehicule){
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        vehicule
                    }
                }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No vehicule with id ${id} that was found`
                }
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}


const addVehicle = async (
    req,
    type,
    mileage,
    price_per_hour,
    matricule
) => {
    try {
        // if (req.file.car_photo){
        //
        // }
        const car_photo = req.file;
        upload(car_photo)
        let newVehicle
        if (car_photo){
            newVehicle = await prisma.Vehicules.create({
                data:  {
                    type_vehicule: type,
                    kilometrage: mileage,
                    price_per_hour: price_per_hour,
                    matricule: matricule,
                    car_photo: path.join(uploadPath, car_photo.filename)
                }
            });
        }else{
            newVehicle = await prisma.Vehicules.create({
                data:  {
                    type_vehicule: type,
                    kilometrage: mileage,
                    price_per_hour: price_per_hour,
                    matricule: matricule,
                }
            });
        }
        if (newVehicle){
            return {
                code: 201,
                data: {
                    success: true,
                    data: {
                        msg: "Vehicle registered"
                    }
                }
            }
        }
        return {
            code: 400,
            data: {
                success: false,
                errors: [{
                    msg: 'Vehicle can not be added'
                }]
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
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

        if (deleted){
            return {
                code: 200,
                data: {
                    success: true,
                    data: "Vehicule deleted"
                }
            }
        }else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: "Vehicule could not be deleted"
                }
            }
        }
    }catch (e){
        return {
            code: 500,
            data: `Service error, ${e.meta.cause}`,
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

        if (!agent){
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
        if (car.responsable){
            return {
                code: 400,
                data: {
                    success: false,
                    data: `Car of matricule ${matricule} is already assigned to agent ${email}`
                }
            }
        }
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
    }catch (e){
        return {
            code: 500,
            data: `Service error`,
            serviceError: e
        }
    }
}


module.exports = {
    getAll,
    getById,
    addVehicle,
    deleteVehicule,
    assign
}