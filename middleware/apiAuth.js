function apiAuth(req,res,next) {

    if(req.body.apiKey === process.env.API_KEY){
        next()
    }
    else{
		console.log(req.body.apiKey)
        res.status(404).send("API non accessibile senza Key! " + req.body.apiKey)
    }

}

module.exports = apiAuth