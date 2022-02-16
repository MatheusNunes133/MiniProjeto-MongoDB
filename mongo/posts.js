//Importando arquivos de configuração
require('dotenv').config()

//importando classe do mongodb
const { MongoClient } = require('mongodb')

//Setando configuração da classe para fazer a conexão
const client = new MongoClient(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,{
    useUnifiedTopology: true
})


//Função que faz a verificação de usuários existenstes
async function returnUsers(email){
    try {
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
        let results = []
        await mongodb.find().forEach(item=>{results.push(item)})
        let countUsers = 0
            results.forEach(item=>{
                if(item.email == email){
                    countUsers = 1
                }
            })
        return countUsers
    } catch (error) {
        console.log(error)
    }
}

//Criando função para adicionar os posts ao MongoDB
async function addPostToMongo(req, res){
    const { id, title, text } = req.body
    try{
        await client.connect();
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
        console.log('Cliente conectado!')
        console.log(id.email)
        let countUsers = await returnUsers(id.email)

        if(countUsers == 1){
            await mongodb.insertOne({
                id: id,
                title: title,
                post: text
            })
            return res.status(200).send('inserido ao mongo')
        }else{
            return res.status(400).send('Email não cadastrado')
        }
    }catch(error){
        console.log(error)
    }finally{
        await client.close();
        console.log('Cliente desconectado!')
    }
}

//Criando função para recuperar os posts ao MongoDB
async function getPostsMongo(req, res){
    try {
        await client.connect();
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
        
        let results = []
        await mongodb.find({id: {$exists: true}}).forEach(item=>{results.push(item)})

        return res.status(200).send(results)

    }catch(error){
        console.log(error)
    }finally{
        await client.close()
        console.log('Desconectado!')
    }
}

module.exports = {
    addPostToMongo,
    getPostsMongo
}
