require('dotenv').config()

const { MongoClient } = require('mongodb')

const client = new MongoClient(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`)

client.connect().then(()=>{
    console.log('Conectado ao mongo')
}).catch(error=>console.log(error))