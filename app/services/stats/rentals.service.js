const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const rental = async (region_name) => {
    try {
        if (region_name){
            const region = await prisma.Region.findFirst({
                where: {
                    region_name: region_name
                }
            })
            if (!region){
                return {
                    code: 404,
                    data: {
                        success: false,
                        data: `No region of name ${region_name} was found`
                    }
                }
            }
            let agg = await prisma.ReservationRegion.aggregate({
                where: {
                    region_id: region.region_id
                },
                _count: true
            })
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        region: region,
                        rate: agg._count
                    }
                }
            }
        }else{
            // Group by region name and count
            const regions = await prisma.Region.findMany()

            const groupRentals = await prisma.ReservationRegion.groupBy({
                by: ["region_id"],
                _count: true
            })
            let rates = []
            for (let i = 0; i < regions.length; i++) {
                if (i < groupRentals.length){
                    rates.push({
                        region: await prisma.Region.findFirst({
                            where: {
                                region_id: regions[i].region_id
                            }
                        }),
                        rate: groupRentals[i]["_count"]
                    })
                }else{
                    rates.push({
                        region: await prisma.Region.findFirst({
                            where: {
                                region_id: regions[i].region_id
                            }
                        }),
                        rate: 0
                    })
                }

            }
            console.log(rates)
            return {
                code: 200,
                data: {
                    success: true,
                    data: rates
                }
            }
        }

    }catch (e){
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`
        }
    }
}


module.exports = {
    rental
}