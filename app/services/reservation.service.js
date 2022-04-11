const createReservation = (req , res) => {
    //créer une reservation à partir de locataire_id, vehicule_id

    //récupérer les parametres
    vehicule_id = req.body.vehicule_id;
    locataire_id = req.body.locataire_id;
    depart = (req.body.departLong , req.body.departLat) ; 
    dest = (req.body.destLong , req.body.destLat) ; 
//verifier si la reservation existe
    let reserv = await prisma.DemandesReservation.find({ 
        where : {
        locataire_id: locataire_id,
        //vehicule_id = vehicule_id , 
        eta_reservation: 1 //en cours 
    }});
    if (!reserv) {
        token = await prisma.DemandesReservation.create({
            data : {
                locataire_id: locataire_id,
                //vehicule_id = vehicule_id , 
                eta_reservation: 1 ,
                date_reservation : new Date() , 
                //departLat : departLat , 
                //departLong : departLong ,
                //destLat : destLat ,
                //destLong : destLong

            }
        });
    }
    else {
        return res.status(400).send({message :"Cette réservation est toujours en cours"});

    }


}