const express = require('express')
const axios = require('axios')
const db = require('../db')
const router = express.Router()
const apiAuth = require('../middleware/apiAuth')
const _404 = require('./404')
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage })

/** Richiamo le variabili env **/
require('dotenv').config({
    path: `.env.production` 
})


/** Imposto la rotta per le risorse inesistenti **/
router.use(_404)

/** Applico il middleware a tutte le rotte, così da verificare l'API Key della richiesta **/
router.use(upload.any())
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
router.post('/sendFile', async (req,res) => {

    let {numero, linkFile, nomeFile, messaggio, idUtente} = req.body

	 console.log(linkFile)

    nomeFile = (nomeFile) ? nomeFile : "file"

    const data = await db.connection.promise().query(
        `
            SELECT whatsappUrl as url, whatsappKey as accessToken, counterMessages
            FROM utenti
            WHERE idUtente = ${idUtente}
        `
    )

    if(data[0].length > 0){

        await db.connection.promise().query(
            `
                INSERT INTO log (idCliente, telefonoDestinatario, messaggio, linkFile) VALUES (${idUtente}, "${numero}", "${messaggio}", "${linkFile}")
            `
        )
		
		        
        await db.connection.promise().query(
            `
                UPDATE utenti
                SET counterMessages = ${data[0][0].counterMessages + 1}
                WHERE idUtente = ${idUtente}
            `            
        )

        axios.post(data[0][0].url, {
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
                'Authorization': data[0][0].accessToken,
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
    }
    else{
        res.status(500).send()
    }

})

/**
 *  @name : sendText
 *  @method : POST
 *  @reqParams :
 *      -numero: Indica il numero telefonico (deve essere accompagnato dal prefisso, es: 390123456789)
 *      -messaggio: Testo del messaggio, è possibile utilizzare emoji e formattare il testo (*grassetto*, _italic_)
 *  Tramite Axios costruisco il JSON che verrà inviato all'API di WhatsApp 
 */
router.post('/sendText', async (req,res) => {

    const {numero, messaggio, idUtente} = req.body

    const data = await db.connection.promise().query(
        `
            SELECT whatsappUrl as url, whatsappKey as accessToken, counterMessages
            FROM utenti
            WHERE idUtente = ${idUtente}
        `
    )

    if(data[0].length > 0){


        await db.connection.promise().query(
            `
                INSERT INTO log (idCliente, telefonoDestinatario, messaggio) VALUES (${idUtente}, "${numero}", "${messaggio}")
            `
        )
		
		        
        await db.connection.promise().query(
            `
                UPDATE utenti
                SET counterMessages = ${data[0][0].counterMessages + 1}
                WHERE idUtente = ${idUtente}
            `            
        )

        axios.post(data[0][0].url, {
            messaging_product: "whatsapp",  
            recipient_type: "individual", 
            to: numero,
            type: "text", 
            text: { 
                body: messaggio
            }
        }, {
            headers: {
                'Authorization': data[0][0].accessToken,
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
    } else {
        res.status(500).send()
    }

})

module.exports = router