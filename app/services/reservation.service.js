const createReservation = (req , res) => {
    //créer une reservation à partir de locataire_id, vehicule_id

    //récupérer les valeurs
    vehicule_id = req.body.vehicule_id;
    locataire_id = req.body.locataire_id;
    departLat =  req.body.departLat ;
    departLong =  req.body.departLong ;
    destLong = req.body.destLong  ; 
    destLat = req.body.destLat ;
//verifier si la reservation existe
    let reserv = await prisma.Reservations.find({ 
        where : {
        locataire_id: locataire_id,
        vehicule_id = vehicule_id , 
        etat: "invalid" //en cours 
    }});
    if (!reserv) {
        reservation = await prisma.Reservations.create({
            data : {
                locataire_id: locataire_id,
                vehicule_id = vehicule_id , 
                etat: "invalid" ,
              //date_reservation : new Date() , 
                departLat : departLat , 
                departLong : departLong ,
                destLat : destLat ,
                destLong : destLong

            }
        });
        return res.status(200).send({ reservation : reservation , message : "Votre reservation a été bien enregistrée. Veuillez attendre sa validation."}) ; 
        //return the reservation id 
    }

    else {
        return res.status(400).send({message :"Cette réservation est toujours en cours"});

    }


}

const validerReservation = (req, res) => {
    reservation_id = req.params.reservation_id ; 
    reserv = await prisma.Reservation.update({
        data : {
        etat : "en cours", //completed
       
        
        },
        where : {
            reservation_id : reservation_id,
        }
    });
    if (reserv) {
        return res.status(200).send({message :"La reservation a été validée."});

    }
    return res.status(400).send({message :"La reservation n'a pas pu être validée."});

   


}

const verifyCode = (req , res) => {
    const code = req.body.code ; 
    const reservation_id= req.body.reservation_id ;
   /*  const id_locataire= req.body.id_locataire ; 
    const id_vehicle = req.body.id_vehicle ; 
    let reserv = await prisma.Reservation.findUnique({ 
        where : {
        locataire_id: locataire_id,
        vehicule_id = vehicule_id , 
    }}); */
   
    let reserv = await prisma.Reservations.findUnique({ 
        where : {
            reservation_id: reservation_id,
    }});
    if(reserv.code == code) {
        deverouillerVoiture(reserv)  ;

    }
    return res.status(400).send({message :"Le code est incorrect! "});



}

const deverouillerVoiture = (reserv) => {
    const id_vehicule = reserv.vehicule_id ; 
    let dev = await prisma.Vehicules.update({ 
        data : {
            etat_voiture : 1 //deverouillé
        } ,
        where : {
        vehicule_id : id_vehicule,
    }});
    if (dev) {
        return res.status(200).send({message :"La voiture est déverrouillée "});
 
    }
    return res.status(400).send({message :"Il y'a un problème, la voiture n'a pas pu être déverrouillée."});


}


const verrouillerVoiture = (reserv) => {
    const id_vehicule = reserv.vehicule_id ; 
    let ver = await prisma.Vehicules.update({ 
        data : {
            etat_voiture : 0 //verouillé
        } ,
        where : {
        vehicule_id: id_vehicule,
    }});
    if (ver) {
        return res.status(200).send({message :"La voiture est verrouillée "});
  
    }
    return res.status(400).send({message :"Il y'a un problème, la voiture n'a pas pu être verrouillée."});


}

const validerTrajet = (req , res) => {
    const id_reservation = req.body.id_reservation ; 
    let valid = await prisma.Reservations.update({ 
        data : {
            etat: 'completed'
        } ,
        where : {
        reservation_id: id_reservation,
    }});
    if(valid) {
        deverouillerVoiture(valid) ;
        return res.status(200).send({message :"Le trajet est marqué comme complet."});

    }
    
    return res.status(400).send({message :"Il y'a un problème."});

}


module.exports = {
    deverouillerVoiture,
    verrouillerVoiture,
    createReservation , 
    validerTrajet ,
    verifyCode ,
    validerReservation ,

    
    
}
