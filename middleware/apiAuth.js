function apiAuth(req,res,next) {

    if(req.body.apiKey === process.env.API_KEY){
        next()
    }
    else{
        res.status(404).send("API non accessibile senza Key!")
    }

}

module.exports = apiAuth