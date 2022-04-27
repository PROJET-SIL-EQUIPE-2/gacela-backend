
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()




const demandeSupport = async(reservation_id,typeSupport,message) =>{
    
    try{

        const Reservation = await prisma.Reservations.findFirst({
            where : {
                reservation_id : Number(reservation_id)
            },
            include : {
                Vehicules : {
                select : {
                    responsable : true,
                }
            }
            }
        });
        if (!Reservation)
        return {
            code : 400,
            data: { success: false, errors: [{ msg: `Reservation n'existe pas` }] }
        };
        
       
        const support = await prisma.demandesSupport.create({
            data : {
                locataire_id : Reservation.locataire_id ,
                agent_id : Reservation.Vehicules.responsable,
                vehicule_id : Reservation.vehicule_id,
                type_support : typeSupport,
                message : message,
            }
        });

        if (support)
        return {
            code : 200,
            data: { success: true, 
                message : ' Demande de support envoyée',
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const getDemandeSupport = async(agent_id) =>{

    try{
        const supports = await prisma.demandesSupport.findMany({
            where : {
                agent_id : Number(agent_id),
            }
        });

        if (supports)
        return {
            code : 200,
            data: { success: true, 
                data : {
                    supports,
                },
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const getAllDemandeSupport = async() =>{

    try{
        const supports = await prisma.demandesSupport.findMany();

        if (supports)
        return {
            code : 200,
            data: { success: true, 
                data : {
                    supports
                },
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const readDemandeSupport = async(demande_id) =>{

    try{
        const supports = await prisma.demandesSupport.update({
            where : {
                demande_id : Number(demande_id)
            },
            data : {
                read : true
            }
        });

        if (supports)
        return {
            code : 200,
            data: { success: true, 
                message : ' Demande de support lue',
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}


module.exports = {
    demandeSupport,
    getDemandeSupport,
    getAllDemandeSupport,
    readDemandeSupport
}