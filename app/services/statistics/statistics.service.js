const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

const getNbrDemandesAcceptSemaine = async (weekNumber , month , year ) => {
   
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *,  DATEPART(week, date_reservation) AS WEEK,  EXTRACT(MONTH FROM date_reservation) AS MONTH, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE MONTH=${month} AND YEAR=${year} AND WEEK=${weekNumber} AND etat=COMPLETED OR etat=ENCOURS`
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }
} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        } 

    
}
}

const getNbrDemandesRejetSemaine = async (weekNumber , month , year ) => {
   
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *,  DATEPART(week, date_reservation) AS WEEK,  EXTRACT(MONTH FROM date_reservation) AS MONTH, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE MONTH=${month} AND YEAR=${year} AND WEEK=${weekNumber} AND etat=REJECTED`
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }

} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }

}
}

const getNbrDemandesAcceptMois = async (month , year) => {
    
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(MONTH FROM date_reservation) AS MONTH, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE MONTH=${month} AND YEAR=${year} AND etat=COMPLETED OR etat=ENCOURS`
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }

} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }

}
}

const getNbrDemandesRejetMois = async (month , year) => {
   
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(MONTH FROM date_reservation) AS MONTH, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE MONTH=${month} AND YEAR=${year} AND etat=REJECTED`
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }

} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
} 
}

const getNbrDemandesAcceptAnnee = async (year) => {
    
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE YEAR=${year} AND etat=COMPLETED OR etat=ENCOURS`
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }

} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
} 
}

const getNbrDemandesRejetAnnee = async (year) => {
   
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE YEAR=${year} AND etat=REJECTED`
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }

} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
} 
}



const getNbrInscriptionsSemaine = async (weekNumber , month , year) => {
    
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *,  DATEPART(week, date_demande) AS WEEK,  EXTRACT(MONTH FROM date_demande) AS MONTH, EXTRACT(YEAR FROM date_demande) AS YEAR FROM DemandesInscription) WHERE MONTH=${month} AND YEAR=${year} AND WEEK=${weekNumber}`
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }

} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
} 
}

const getNbrInscriptionsMois = async (month , year) => {
    
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(MONTH FROM date_demande) AS MONTH, EXTRACT(YEAR FROM date_demande) AS YEAR FROM DemandesInscription) WHERE MONTH=${month} AND YEAR=${year} `
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }


} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
} 
}

const getNbrInscriptionsAnnee = async (year) => {
  
    try {
        const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(YEAR FROM date_demande) AS YEAR FROM DemandesInscription) WHERE YEAR=${year} `
    if(result) {
        return {
            code : 200 ,
            data: {
                success: true,
                data: result

            }
        }
    } 
    else {
        return {
            code : 400 ,
            data: {
                success: false,
                data: 0

            }
        }

    }


} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
} 
}





const getFinanceSemaine = async (weekNumber , month , year) => {
    
    try {
        const result = await prisma.$queryRaw`SELECT sum(real_price) FROM  (SELECT *,  DATEPART(week, date_paiment) AS WEEK,  EXTRACT(MONTH FROM date_paiment) AS MONTH, EXTRACT(YEAR FROM date_paiment) AS YEAR FROM Paiment) WHERE MONTH=${month} AND YEAR=${year} AND WEEK=${weekNumber}`
    return result ;

} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
} 
}

const getFinanceMois = async (month , year) => {
    
    try {
        const result = await prisma.$queryRaw`SELECT sum(real_price) FROM  (SELECT *, EXTRACT(MONTH FROM date_paiment) AS MONTH, EXTRACT(YEAR FROM date_paiment) AS YEAR FROM Paiment) WHERE MONTH=${month} AND YEAR=${year} `
    return result ;


} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
}
}

const getFinanceAnnee = async (year) => {
  
    try {
        const result = await prisma.$queryRaw`SELECT sum(real_price) FROM  (SELECT *, EXTRACT(YEAR FROM date_paiment) AS YEAR FROM Paiment) WHERE YEAR=${year} `
    return result ;


} catch(e) {
    return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            error: e
        }
    
}
}

module.exports = {
    getNbrDemandesAcceptAnnee , 
    getNbrDemandesAcceptMois , 
    getNbrDemandesAcceptSemaine , 
    getNbrDemandesRejetAnnee , 
    getNbrDemandesRejetMois , 
    getNbrDemandesRejetSemaine , 
    getNbrInscriptionsAnnee , 
    getNbrInscriptionsMois , 
    getNbrInscriptionsSemaine ,
    getFinanceSemaine , 
    getFinanceMois , 
    getFinanceAnnee
}