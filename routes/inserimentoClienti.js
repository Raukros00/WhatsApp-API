const express = require('express')
const router = express.Router()
const db = require('../db')

/** Richiamo le variabili env **/
require('dotenv').config({
    path: `.env.production` 
})

/**
 *  @name : /
 *  @method : GET
 *  @reqParams : Nessuno
 *    
 *  Richiesta GET alla pagina del form di inserimento dell'utente.
 *  Invio il parametro type impostato a none per indicare che non ci sono alert da fare.
 */
router.get('/', (req,res) => {

    res.status(200).render('inserimento', {
        type: "none",
        alert: ""
    })

})

/**
 *  @name : /
 *  @method : GET
 *  @reqParams : 
 *      -ragSociale: Ragione sociale del cliente
 *      -pivaCf: Partita IVA o Codice fiscale del cliente
 *      -whatsAppUrl: URL per l'api (leggere documentazione)
 *      -whatsAppKey: Key per l'api (leggere la documentazione)
 *      -AuthKey: Chiave di autorizzazione per l'inserimento 
 * 
 *  Richiesta POST per l'inserimento dei dati nel DB.
 *  Una volta inserito l'utente viene lanciato un messaggio di avvenuto inserimento con allegato l'id utente.
 *  Se l'AuthKey è errato viene segnalato l'errore.
 */
router.post('/', async (req,res) => {

    const {ragSociale, pivaCf, whatsappUrl, whatsappKey, authKey} = req.body
    var dataUpdate = new Date();
    dataUpdate = dataUpdate.toISOString().slice(0, 19).replace('T', ' ');

    console.log(authKey + " " + process.env.AUTH_KEY)
    if(authKey === process.env.AUTH_KEY){
        await db.connection.promise().query(
            `
                INSERT INTO utenti (pivaCf, ragioneSociale, whatsappUrl, whatsappKey, TS) VALUES ("${pivaCf}", "${ragSociale}", "${whatsappUrl}", "${whatsappKey}", "${dataUpdate}")
            `
        )

        const idCliente = await db.connection.promise().query(
            `
                SELECT MAX(idUtente) AS idCliente 
                FROM utenti;
            `
        )

        res.status(200).render('inserimento', {
            type: "success",
            alert: `Inserimento avvenuto con successo l'id dell'utente è <b>(${idCliente[0][0].idCliente})</b>`
        })

    } else {
        res.status(500).render('inserimento', {
            type: "fail",
            alert: 'ERRORE: AuthKey non valido!'
        })
    }
})

module.exports = router