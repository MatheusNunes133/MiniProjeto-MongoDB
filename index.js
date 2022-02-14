const express = require('express')
const cors = require('cors')


const app = express()
const port = 3000;

//Permitindo que o server express possa utilizar o formato JSON
app.use(express.json())

//Setando configurações do cors
app.use(function(req, res, next){
    app.use(cors())
    res.header("Access-Control-Allow-Origin", "*");
    next()
});


const mongodb = require('./mongo/mongo')

app.post('/createNewUser',mongodb.createNewUser)
app.get('/getUsers',mongodb.getUsers)
app.post('/updateUsers', mongodb.updateUser)


app.listen(port,()=>{
    console.log(`Server online na porta ${port}`)
})