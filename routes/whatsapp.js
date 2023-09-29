const express = require('express')
const axios = require('axios')
const router = express.Router()

const apiAuth = require('../middleware/apiAuth')
const _404 = require('./404')

/** Richiamo le variabili env **/
require('dotenv').config({
    path: `.env.production` 
})

const url = process.env.WHATSAPP_URL
const accessToken = process.env.WHATSAPP_KEY

console.log(url)

/** Imposto la rotta per le risorse inesistenti **/
router.use(_404)

/** Applico il middleware a tutte le rotte, così da verificare l'API Key della richiesta **/
router.use(apiAuth)

/**
 *  @name : sendFile
 *  @method : POST
 *  @reqParams :
 *      -numero: Indica il numero telefonico (deve essere accompagnato dal prefisso, es: 390123456789)
 *      -linkFile: Indica il link diretto al file 
 *      -nomeFile: Indica il nome del file che verrà visualizzato nel messaggio (se vuoto verrà chiamato di default "file")
 *      -messaggio: Testo che accompagnerà il file, è possibile utilizzare emoji e formattare il testo (*grassetto*, _italic_)
 *  Tramite Axios costruisco il JSON che verrà inviato all'API di WhatsApp 
 */
router.post('/sendFile', (req,res) => {

    let {numero, linkFile, nomeFile, messaggio} = req.body

    nomeFile = (nomeFile) ? nomeFile : "file"

    axios.post(url, {
        messaging_product: "whatsapp",  
        recipient_type: "individual", 
        to: numero,
        type: "document", 
        document: { 
            filename: nomeFile, 
            link: linkFile, 
            caption: messaggio
        }
    }, {
        headers: {
            'Authorization': accessToken,
            'Content-Type': 'application/json'
          }
    })
    .then((response) => {
        console.log('Risposta dal server:', response.data);
    })
    .catch((error) => {
        console.error('Errore:', error);
    });

    res.status(200).send()
})

/**
 *  @name : sendText
 *  @method : POST
 *  @reqParams :
 *      -numero: Indica il numero telefonico (deve essere accompagnato dal prefisso, es: 390123456789)
 *      -messaggio: Testo del messaggio, è possibile utilizzare emoji e formattare il testo (*grassetto*, _italic_)
 *  Tramite Axios costruisco il JSON che verrà inviato all'API di WhatsApp 
 */
router.post('/sendText', (req,res) => {

    const {numero, messaggio} = req.body

    axios.post(url, {
        messaging_product: "whatsapp",  
        recipient_type: "individual", 
        to: numero,
        type: "text", 
        text: { 
            body: messaggio
        }
    }, {
        headers: {
            'Authorization': accessToken,
            'Content-Type': 'application/json'
          }
    })
    .then((response) => {
        console.log('Risposta dal server:', response.data);
    })
    .catch((error) => {
        console.error('Errore:', error);
    });

    res.status(200).send()

})

module.exports = router