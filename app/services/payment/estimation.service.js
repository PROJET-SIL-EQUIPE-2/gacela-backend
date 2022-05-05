

const getReservationById = async (id) => {
    try {
        const reservation = await prisma.Reservations.findUnique({
            where: {
                reservation_id: id
            },
           
        })
        if (reservation){
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        reservation
                    }
                }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No reservation with id ${id} that was found`
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



const getFacturationnById = async (id) => {
    try {
        const facturation = await prisma.Facturations.findUnique({
            where: {
                facturation_id: id
            },
           
        })
        if (facturation){
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        facturation
                    }
                }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No facturation with id ${id} that was found`
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

const getvehiculeById = async (id) => {
    try {
        const vehicule = await prisma.Vehicules.findUnique({
            where: {
                vehicule_id: id
            },
           
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

const getDuration = (reservation) => {
    departLong = reservation.data.departLong ; 
    departLat = reservation.data.departLat ;
    destlong = reservation.data.destLong ; 
    destLat = reservation.data.destLat ;
    return 1 ; 
}
const createFacturation = async (reservation_id , estimated_price) => {
    try { 
        newFacturation = await prisma.Facturation.create({
        data:  {
            reservation_id: reservation_id,
            estimated_price: estimated_price,
        }
    });

if (newFacturation){
    return {
        code: 201,
        data: {
            success: true,
            data: {
                msg: "Invoicing finished."
            }
        }
    }
}
return {
    code: 400,
    data: {
        success: false,
        errors: [{
            msg: 'Oops! Something went wrong.'
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

const calculEstimatedPrice = async (
    reservation_id
) => {
   
    let priceHour ;
    let vehicule_id ;
    let duration ; 
    let constante ; 
    reservation = await getReservationById(reservation_id) ;
    if (reservation.success = true ) {
         vehicule_id = Number(reservation.data.vehicule_id) ;
         vehicule = await getVehiculeById(vehicule_id) ;
        if (vehicule.success = true) {
            priceHour = parcseFloat(vehicule.data.price_per_hour) ;
        }

    }
    duration = getDuration(reservation) ; 
    let heure = reservation.data.date ;
    if(heure > '') constante = 1 ; 
    constante = 0 ; 


    const estimated_price = duration * priceHour + constante ;
    facturation = await createFacturation(reservation_id , estimated_price)  ; 
    return estimated_price ;


    /*facturation : prix_estim et prix_reel*/ 
    //ajouter date to reseration
    //donner a ladmin la possibilite de changer ces parametre
/*     const totalPrice = priceHour * duration + consante ; 
 */       
           
}

const calculRealPrice = (reservation_id) => {
     //time stamp when deverrouillage 
    //timestamp when the client arrives 
    let departHour ; 
    let finishHour ; 
    let duration = finishHour - departHour ; 
    let constante ; 
    
    reservation = await getReservationById(reservation_id) ;
    let heure = reservation.data.date ;
    if(heure > '') constante = 1 ; 
    constante = 0 ; 
    if (reservation.success = true ) {
         const vehicule_id = Number(reservation.data.vehicule_id) ;
         const vehicule = await getVehiculeById(vehicule_id) ;
        if (vehicule.success = true) {
           const priceHour = parcseFloat(vehicule.data.price_per_hour) ;
           return  duration* priceHour + constante ;  //return real price
           

        }

    }
   
   

}

const updateRealPrice = (id_facturation ) => {
    const reservation = await getFacturationnById(id_facturation) ;
    if (reservation.success = true) { 
    
    await prisma.Facturations.update({
        where: {
            facturation_id: id_facturation,

        },
        data: {
            real_price: calculRealPrice(reservation.data.reservation_id)
        }
    })
}
}

let stripeHandler = StripeCheckout.configure({
    key : stripePublicKey , 
    locale : 'en' , 
    token : (token ) => {
        fetch ('pay' , {
            method : 'POST',
            header : {
                'Content-Type': 'application/json' , 
                'Accept': 'application/json'
            } ,
            body : JSON.stringify({
                stripeTokenId : token.id ,
                
            })
        })

    }
})
/*in the front end we must add : 
<script src = "https://checkout.stripe.com/checkout.js" defer></script>
<script> let stripePublicKey = '<%= stripePublicKey %>'</script>
*/
const payment = (req , res) => {
    res.render({stripePublicKey : stripePublicKey })

}