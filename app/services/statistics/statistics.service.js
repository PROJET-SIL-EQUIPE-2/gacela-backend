const PrismaClient = require("@prisma/client").PrismaClient;

const { Client } = require('pg')


const prisma = new PrismaClient();

const getNbrDemandesAcceptSemaine = async (weekNumber , month , year ) => {
   
        const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."Reservations" WHERE EXTRACT(YEAR FROM date_reservation)=${year} AND EXTRACT(MONTH FROM date_demande)=${month} AND DATEPART(week, date_demande)= ${weekNumber} AND (etat=COMPLETED OR etat=ENCOURS) ;`)
        await client.end()
            return {                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
                }
            }
}

const getNbrDemandesRejetSemaine = async (weekNumber , month , year ) => {
   
        const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."Reservations" WHERE EXTRACT(YEAR FROM date_reservation)=${year} AND EXTRACT(MONTH FROM date_demande)=${month} AND DATEPART(week, date_demande)= ${weekNumber} AND etat=REJECTED ;`)
        await client.end()
            return {
                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
                }
            }
}

const getNbrDemandesAcceptMois = async (month , year) => {
    
  
        const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."Reservations" WHERE EXTRACT(MONTH FROM date_demande)=${month} AND DATEPART(week, date_demande)= ${weekNumber} AND (etat=COMPLETED OR etat=ENCOURS) ;`)
        await client.end()
            return {
                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
                }
            }
}

const getNbrDemandesRejetMois = async (month , year) => {
   
    
        const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."Reservations" WHERE EXTRACT(MONTH FROM date_demande)=${month} AND  etat=REJECTED ;`)
        await client.end()
            return {
                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
                }
            }
    
    

}




const getNbrDemandesAcceptAnnee = async (year) => {
    const client = new Client()
    await client.connect()
    console.log(year)
    const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."Reservations" WHERE EXTRACT(YEAR FROM date_reservation)=${year} AND etat=COMPLETED OR etat=ENCOURS;`)
    await client.end()
        return {
            code : 200 ,
            data: {
                success: true,
                year : year ,
                data: result

            }
        }
    



}

const getNbrDemandesRejetAnnee = async (year) => {
   
    const client = new Client()
    await client.connect()
    console.log(year)
    const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."Reservations" WHERE EXTRACT(YEAR FROM date_reservation)=${year} AND etat=REJECTED;`)
    await client.end()
        return {
            code : 200 ,
            data: {
                success: true,
                year : year ,
                data: result

            }
        }
    
}



const getNbrInscriptionsSemaine = async (weekNumber , month , year) => {
    
            const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."DemandesInscription" WHERE EXTRACT(YEAR FROM date_demande)=${year} AND EXTRACT(MONTH FROM date_demande)=${month} AND DATEPART(week, date_demande)= ${weekNumber} ;`)
        await client.end()
            return {
                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
                }
            }
        
}

const getNbrInscriptionsMois = async (month , year) => {
    
    
    const client = new Client()
    await client.connect()
    console.log(year)
    const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."DemandesInscription" WHERE EXTRACT(YEAR FROM date_demande)=${year} AND EXTRACT(MONTH FROM date_demande)=${month} ;`)
    await client.end()
        return {
            code : 200 ,
            data: {
                success: true,
                year : year ,
                data: result

            }
        }
    
}

const getNbrInscriptionsAnnee = async (year) => {
  

        const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT count(*) as TOTAL FROM learn.public."DemandesInscription" WHERE EXTRACT(YEAR FROM date_demande)=${year}  ;`)
        await client.end()
            return {
                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
                }
            }
}





const getFinanceSemaine = async (weekNumber , month , year) => {
    
    
        const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT sum(real_price) as TOTAL FROM learn.public."Paiment" WHERE EXTRACT(YEAR FROM date_paiment)=${year} AND  DATEPART(week, date_paiment) = ${weekNumber} AND EXTRACT(MONTH FROM date_paiment)=${month};`)
        await client.end()
            return {
                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
                }
            }
}

const getFinanceMois = async (month , year) => {
    
    const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT sum(real_price) as TOTAL FROM learn.public."Paiment" WHERE EXTRACT(YEAR FROM date_paiment)=${year} AND EXTRACT(MONTH FROM date_paiment)=${month};`)
        await client.end()
            return {
                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
                }
            }
}

const getFinanceAnnee = async (year) => {
  
    const client = new Client()
        await client.connect()
        console.log(year)
        const result = await client.query(`SELECT sum(real_price) as TOTAL FROM learn.public."Paiment" WHERE EXTRACT(YEAR FROM date_paiment)=${year} ;`)
        await client.end()
            return {
                code : 200 ,
                data: {
                    success: true,
                    year : year ,
                    data: result
    
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