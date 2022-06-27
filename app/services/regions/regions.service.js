const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const getAllRegions = async (name) => {
    try {
        let regions;
        if (!name) {
            regions = await prisma.Region.findMany();
        }else{
            regions = await prisma.Region.findMany({
                where: {
                    region_name: name
                }
            });
        }

        return {
            code: 200,
            data: {
                success: true,
                data: regions
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Could not fetch regions due to database error`,
            log: `Could not fetch regions due to database error`
        }
    }
}

const addRegion = async (name) => {
    try {
        const region = await prisma.Region.create({
            data: {
                region_name: name
            }
        })
        return {
            code: 201,
            data: {
                success: true,
                data: `Region of name ${name} created successfully`
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Could not creat region of name ${name} due database error`
        }
    }
}

const deleteRegion = async (id) => {
    try {
        const deleted = await prisma.Region.delete({
            where: {
                region_id: id
            }
        })
        return {
            code: 200,
            data: `Region of id ${id} and name ${deleted.region_name} deleted successfully`
        }
    }catch (e){
        return {
            code: 500,
            data: `Could not delete region with id ${id} due database error, may be the key does not exist`,
            log: `Could not delete region with id ${id} due database error, may be the key does not exist`
        }
    }
}

const getRegionByName = async (name) => {
    let region;
    if (!name) name = "Nord"

    region = await prisma.Region.findFirst({
        where: {
            region_name: name
        }
    });
    return region
}

const getRegionNameByLatLong = async (lat, long) => {
    const NORTH_SOUTH_LAT_THRESHOLD = 32.740517
    const EST_OUEST_LONG_THRESHOLD = 3.330900
    if (lat >= NORTH_SOUTH_LAT_THRESHOLD){
        return "Nord"
    }else if (lat <= NORTH_SOUTH_LAT_THRESHOLD){
        return "Sud"
    }else if (long >= EST_OUEST_LONG_THRESHOLD){
        return "Est"
    }else{
        return "Ouest"
    }
}


module.exports = {
    getAllRegions,
    addRegion,
    deleteRegion,
    getRegionByName,
    getRegionNameByLatLong
}
