const express = require("express")
const bodyParser = require("body-parser")
const app = express()

const whatsappApi = require('./routes/whatsapp')
const _404 = require('./routes/404')

/** Abilito la codifica JSON urlencoded per accettare parametri nelle richieste POST */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

/** Richiamo le variabili env **/
require('dotenv').config({
    path: `.env.production` 
})

/** Imposto le rotte che richidono il percorso /whatsappApi */
app.use('/whatsappApi', whatsappApi)
/** Imposto la rotta per le risorse inesistenti */
app.use(_404)

/** Porta di ascolto del server **/
app.listen(process.env.PORT, () => {
    console.log(`Sono in ascolto sulla porta ${process.env.PORT}`)
})

