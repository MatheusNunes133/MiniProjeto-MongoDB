//Importando arquivos de configuração
require('dotenv').config()

//importando classe do mongodb
const { MongoClient } = require('mongodb')

//Setando configuração da classe para fazer a conexão
const client = new MongoClient(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,{
    useUnifiedTopology: true
})

//Criando função para fazer conexão com o banco e adicionar novos usuários
async function createNewUser(req, res){
    const { name, email } = req.body
    try{
        await client.connect()
        console.log('Conectado ao Mongodb!')
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
            await mongodb.insertOne({
                name: name,
                email: email
            })
        res.status(200).send('inserido')
    }catch(error){
        console.log(error)
    }finally{
        await client.close()
        console.log('Desconectado!')
    }
}

//Criando função para recuperar os dados salvos no banco 
async function getUsers(req, res){
    try{
        await client.connect()
        console.log('Conectado ao Mongodb!')
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
        let results = []
        await mongodb.find().forEach(item=>{results.push(item)})

        return res.status(200).send(results)
        
    }catch(error){
        console.log(error)
    }finally{
        await client.close()
        console.log('Desconectado!')
    }

}

module.exports = {
    createNewUser,
    getUsers
}