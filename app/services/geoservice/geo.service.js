const carsService = require("../vehicules/vehicles.service")


const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();


function distance(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1/180
    let radlat2 = Math.PI * lat2/180
    let theta = lon1-lon2
    let radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit==="K") { dist = dist * 1.609344 }
    if (unit==="N") { dist = dist * 0.8684 }
    return dist
}
const findClosestCar = async (location, cars) => {
    let {lat, long} = location;
    let carLat, carLong;

    // Construct array of distances
    let distances = []
    for (let i = 0; i < cars.length; i++) {
        carLat = cars[i].lat;
        carLong = cars[i].long
        distances.push(distance(lat, long, carLat, carLong))
    }
    let minIdx = distances.indexOf(Math.min(...distances))
    if (minIdx >= 0){
        return cars[minIdx]
    }
    return null
}


/**
 * Returns cars current location in real time
 * */
const carsLocation = async (cars) => {
    let locations = []
    let status
    try {
        for (let i = 0; i < cars.length; i++) {
            status = await prisma.VehiculesStatus.findFirst({
                where: {
                    matricule: cars[i].matricule
                }
            })
            locations.push({
                matricule: status.matricule,
                lat: status.lat,
                long: status.long
            })
        }
        return locations
    }catch (e) {
        throw e
    }
}

module.exports = {
    findClosestCar,
    carsLocation
}