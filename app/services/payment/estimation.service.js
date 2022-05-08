const carsService = require("../vehicules/vehicles.service")
const facturationService = require("facturation.service")
const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

const getDuration = (reservation) => {
    let departLong = reservation.data.departLong;
    let departLat = reservation.data.departLat;
    let destLong = reservation.data.destLong;
    let destLat = reservation.data.destLat;
    return 1 ; 
}


const calculateEstimatedPrice = async (
    reservation_id
) => {
   
    let priceHour ;
    let vehicule_id ;
    let duration ; 
    let constant ;
    let reservation = await carsService.getById(reservation_id);
    let vehicule;
    if (reservation) {
        vehicule_id = Number(reservation.data.vehicule_id);
        vehicule = await carsService.getById(vehicule_id);
        if (vehicule) {
            priceHour = parseFloat(vehicule.data.price_per_hour);
        }

    }
    duration = getDuration(reservation) ; 
    let heure = reservation.data.date ;
    if(heure > '') constant = 1 ;
    constant = 0 ;


    const estimated_price = duration * priceHour + constant ;
    let facturation = await facturationService.createFacturation(reservation_id, estimated_price);
    return estimated_price ;


    /*facturation : prix_estim et prix_reel*/ 
    //ajouter date to reseration
    //donner a ladmin la possibilite de changer ces parametre
/*     const totalPrice = priceHour * duration + consante ; 
 */       
           
}

const calculateRealPrice = async (reservation_id) => {
    //time stamp when deverrouillage
    //timestamp when the client arrives 
    let departHour;
    let finishHour;
    let duration = finishHour - departHour;
    let constant;

    let reservation = await carsService.getById(reservation_id);
    let heure = reservation.data.date;
    if (heure > '') constant = 1;
    constant = 0;
    if (reservation) {
        const vehicule_id = Number(reservation.data.vehicule_id);
        const vehicule = await carsService.getById(vehicule_id);
        if (vehicule) {
            const priceHour = parseFloat(vehicule.data.price_per_hour);
            return duration * priceHour + constant;  //return real price
        }
    }
}


let stripeHandler = StripeCheckout.configure({
    key : stripePublicKey , 
    locale : 'en' , 
    token : (token ) => {
        fetch('pay', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,

            })
        }).then(r => {

        }).then(() => {

        }).catch(e => {

        })

    }
})
/*in the front  end we must add :
<script src = "https://checkout.stripe.com/checkout.js" defer></script>
<script> let stripePublicKey = '<%= stripePublicKey %>'</script>
*/
const payment = (req , res) => {
    res.render({stripePublicKey : stripePublicKey })
}

module.exports = {
    calculateEstimatedPrice,
    calculateRealPrice
}