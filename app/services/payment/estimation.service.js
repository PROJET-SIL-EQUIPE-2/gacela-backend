const fetch = require("node-fetch")
const reservationService = require("../reservations/reservation.service")
const carsService = require("../vehicules/vehicles.service")
const typeService = require("../vehicules/types.service")

/**
 * Returns duration in seconds
 * */
const getDuration = async (departLat, departLong, destLat, destLong) => {
        const SECONDS_IN_MINUTE = 60
        const MINUTES_IN_HOUR = 60
        let endpoint = `https://api.tomtom.com/routing/1/calculateRoute/${departLat}%2C${departLong}%3A${destLat}%2C${destLong}/json?key=DGN137adravN52Y5SA1TMXip7GQusRQp`
        const response = await fetch(endpoint)
        const data = await response.json()
        return (data.routes[0].summary["travelTimeInSeconds"] + data.routes[0].summary["trafficDelayInSeconds"]) / (SECONDS_IN_MINUTE * MINUTES_IN_HOUR)
}


const calculateEstimatedPrice = async (
    carType, departLat, departLong, destLat, destLong
) => {
    try {
        let priceHour = await typeService.getPriceOfType(carType);
        let duration = await getDuration(departLat, departLong, destLat,destLong);
        let constant = 10;

        return (duration / 3600) * priceHour + constant
    }catch (e) {
        return {
            code: 500,
            data: {
                success: false,
                data: `Error while calculating estimated price`,
                log: `Error while calculating estimated price`
            }
        }
    }


           
}

const calculateRealPrice = async (reservation_id) => {
    let priceHour ;
    let vehicule_id ;
    let constant = 10;
    let vehicule;
    let reservation = await reservationService.getById(reservation_id)
    if (reservation){
        vehicule_id = Number(reservation.vehicule_id);
        vehicule = await carsService.getById(vehicule_id);
        if (vehicule) {
            priceHour = parseFloat(vehicule.type_car.price_per_hour);
            return (Math.abs((new Date(reservation.real_end_course)) - new Date(reservation.real_start_course)) / 36e5) * priceHour + constant
        }else{
            throw Error(`No car was found ??`)
        }

    }else {
        throw Error(`No reservation of that id was found`)
    }
}

module.exports = {
    calculateEstimatedPrice,
    calculateRealPrice,
    getDuration
}