const express = require('express')
const router = express.Router()

router.get('*', (req,res) => {

    res.status(404).send("<h1>Errore 404: La risorsa sembra non esistere!</h1>")

})

module.exports = router