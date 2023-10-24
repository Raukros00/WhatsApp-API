const express = require("express")
const bodyParser = require("body-parser")
const mysql = require('mysql2/promise')
const https = require("https")
const fs = require("fs")
const cors = require('cors')
const app = express()

const whatsappApi = require('./routes/whatsapp')
const inserimentoClienti = require('./routes/inserimentoClienti')
const _404 = require('./routes/404')

/** Imposto il motore di rendering frontend EJS **
 ** Abilito la codifica JSON urlencoded per accettare parametri nelle richieste POST **/

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cors())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

/** Richiamo le variabili env **/
require('dotenv').config({
    path: `.env.production` 
})

/** Imposto le rotte **/
app.use('/whatsappApi', whatsappApi)
app.use('/inserimentoClienti', inserimentoClienti)
/** Imposto la rotta per le risorse inesistenti **/
app.use(_404)

/** Porta di ascolto del server e certificazioni HTTPS**/
https
    .createServer(
        {
            key: fs.readFileSync("C:\\SSL\\ipsonline_2023.key"),
            cert: fs.readFileSync("C:\\SSL\\ipsonline_2023.crt"),
        },
		app
    ).listen(process.env.PORT, () => {
        console.log(`Sono in ascolto sulla porta ${process.env.PORT}`)
    })

