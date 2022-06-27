const sendEmail = require("./sendEmail")

const sendFacturation = async (email, subject, clientName, reservationNumber, date, estimated, real) => {
    html = `
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <!-- Custom Style -->
<!--    <link rel="stylesheet" href="style.css">-->
    <style>
    :root {
    --body-bg: #C0C0C0;
    --white: #ffffff;
    --darkWhite: #EAAC8B;
    --black: #171717;
    --dark: #212121;
    --themeColor: #2196F3;
    --pageShadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
    
    --main-beige: #D1B48D;
    --main-gray-coco: #C0C0C0;
    --gacela-orange :  #EAAC8B;
    --gacela-black21 : #212121;
    --gacela-black17 : #171717;
    --gacela-blue-link : #2196F3;
    --gacela-grayEA : #EAEFF5;
    --size-big : 25px;
  --size-medium : 13px;
  --lora-font : 'Lora', serif;
  --roboto-font: 'Roboto', sans-serif;
  
}
/* 
--main-beige: #D1B48D;
  --main-gray-coco: #C0C0C0;
  --gacela-orange :  #EAAC8B;
  --gacela-black21 : #212121;
  --gacela-black17 : #171717;
  --gacela-blue-link : #2196F3;
  --gacela-grayEA : #EAEFF5;


  --size-big : 25px;
  --size-medium : 13px;
  --lora-font : 'Lora', serif;
  --roboto-font: 'Roboto', sans-serif;
 */
/* Font Include */
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600&display=swap');

body {
    background-color: var(--body-bg);
}

.page {
    background: var(--white);
    display: block;
    margin: 0 auto;
    position: relative;
    box-shadow: var(--pageShadow);
}

.page[size="A4"] {
    width: 21cm;
    height: 29.7cm;
    overflow: hidden;
}

.bb {
    border-bottom: 3px solid var(--darkWhite);
}

/* Top Section */
.top-content {
    padding-bottom: 15px;
}

.logo img {
    height: 60px;
}

.top-left p {
    margin: 0;
}

.top-left .graphic-path {
    height: 40px;
    position: relative;
}

.top-left .graphic-path::before {
    content: "";
    height: 20px;
    background-color: var(--dark);
    position: absolute;
    left: 15px;
    right: 0;
    top: -15px;
    z-index: 2;
}

.top-left .graphic-path::after {
    content: "";
    height: 22px;
    width: 17px;
    background: var(--black);
    position: absolute;
    top: -13px;
    left: 6px;
    transform: rotate(45deg);
}

.top-left .graphic-path p {
    color: var(--white);
    height: 40px;
    left: 0;
    right: -100px;
    text-transform: uppercase;
    background-color: var(--themeColor);
    font: 26px;
    z-index: 3;
    position: absolute;
    padding-left: 10px;
}

/* User Store Section */
.store-user {
    padding-bottom: 25px;
}

.store-user p {
    margin: 0;
    font-weight: 600;
}

.store-user .address {
    font-weight: 400;
}

.store-user h2 {
    color: var(--themeColor);
    font-family: 'Rajdhani', sans-serif;
}

.extra-info p span {
    font-weight: 400;
}

/* Product Section */
thead {
    color: var(--white);
    background: var(--themeColor);
}

.table td,
.table th {
    text-align: center;
    vertical-align: middle;
}

tr th:first-child,
tr td:first-child {
    text-align: left;
}

.media img {
    height: 60px;
    width: 60px;
}

.media p {
    font-weight: 400;
    margin: 0;
}

.media p.title {
    font-weight: 600;
}

/* Balance Info Section */
.balance-info .table td,
.balance-info .table th {
    padding: 0;
    border: 0;
}

.balance-info tr td:first-child {
    font-weight: 600;
}

tfoot {
    border-top: 2px solid var(--darkWhite);
}

tfoot td {
    font-weight: 600;
}

/* Cart BG */
.cart-bg {
    height: 250px;
    bottom: 32px;
    left: -40px;
    opacity: 0.3;
    position: absolute;
}

/* Footer Section */
footer {
    text-align: center;
    position: absolute;
    bottom: 30px;
    left: 75px;
}

footer hr {
    margin-bottom: -22px;
    border-top: 3px solid var(--darkWhite);
}

footer a {
    color: var(--themeColor);
}

footer p {
    padding: 6px;
    border: 3px solid var(--darkWhite);
    background-color: var(--white);
    display: inline-block;
}



    </style>
    <title>Facture Gacela</title>
</head>

<body>
    <div class="my-5 page" size="A4">
        <div class="p-5">
            <section class="top-content bb d-flex justify-content-between">
                <div class="logo">
                    <img src="https://media.discordapp.net/attachments/990556258765520986/990825602296709130/app_logo.png" alt="logo" class="img-fluid">
                </div>
                <div class="top-left">
                    <div class="graphic-path">
                        <p>Facture</p>
                    </div>
                    <div class="position-relative">
                        <p>Facture No. <span>${reservationNumber}</span></p>
                    </div>
                </div>
            </section>

            <section class="store-user mt-5">
                <div class="col-10">
                    <div class="row bb pb-3">
                        <div class="col-7">
                            <p>Application</p>
                            <h2>GACELA</h2>
                            <p class="address"> Algérie, Alger, Said Hamdine <br> lot n°11 16013  <br>Bir Mourad Rais </p>
                            <div class="txn mt-2">TEL: +212-668-117-9</div>
                        </div>
                        <div class="col-5">
                            <p>Client,</p>
                            <h2>${clientName}</h2>
<!--                            <p class="address"> Algérie, Alger, Said Hamdine <br> lot n°11 16013  <br>Bir Mourad Rais </p>-->
<!--                            <div class="txn mt-2">TEL: +212-668-117-9</div>-->
                        </div>
                    </div>
                    <div class="row extra-info pt-3">
                        <div class="col-7">
                            <p>Méthode de paiment: <span>Cash</span></p>
                            <p>Numéro de réservation: <span>${reservationNumber}</span></p>
                        </div>
                        <div class="col-5">
                            <p> Date: <span>${date}</span></p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="product-area mt-4">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <td>Prix estimé (DA)</td>
                            <td>Prix réel (DA)</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${estimated}</td>
                            <td>${real}</td>
                        </tr>
                        
                    </tbody>
                </table>
            </section>

            <section class="balance-info">
                <div class="row">
                    <div class="col-8">
                        <p class="m-0 font-weight-bold"> Note: </p>
                        <p>Merci d'avoir utilisé notre application. Si vous avez des questions ou des propositions, n'hésitez pas à nous contacter. Bonne journée.</p>
                    </div>
                    <div class="col-4">
                        <table class="table border-0 table-hover">
                            <tr>
                                <td>Somme Payée:</td>
                                <td>${estimated}</td>
                            </tr>
                            <tr>
                                <td>Remboursement:</td>
                                <td>${estimated - real}</td>
                            </tr>
                           
                            <tfoot>
                                <tr>
                                    <td>Prix Réel:</td>
                                    <td>${real}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <!-- Signature -->
                        <div class="col-12">
                            <img src="https://media.discordapp.net/attachments/990556258765520986/990825668176666654/signature.png" class="img-fluid" alt="signature">
                            <p class="text-center m-0"> Signature du directeur </p>
                        </div>
                    </div>
                </div>
            </section>


            <footer>
                <hr>
                <p class="m-0 text-center">
                    Visitez notre site - <a href="#!"> www.Gacela.com</a>
                </p>
                <div class="social pt-3">
                    <span class="pr-2">
                        <i class="fas fa-mobile-alt"></i>
                        <span>+212-668-117-9</span>
                    </span>
                    <span class="pr-2">
                        <i class="fas fa-envelope"></i>
                        <span>bdd.nexcode@gmail.com</span>
                    </span>
                    <span class="pr-2">
                        <i class="fab fa-facebook-f"></i>
                        <span>/gacela.7264</span>
                    </span>
                   
                    <span class="pr-2">
                        <i class="fa-solid fa-globe"></i>
                        <span>www.gacela.com</span>
                    </span>
                </div>
            </footer>
        </div>
    </div>

</body></html>`


    await sendEmail(email, subject, "", html)

}

module.exports = sendFacturation