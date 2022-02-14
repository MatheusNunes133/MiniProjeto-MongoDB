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
        let countUsers = 0
        let users = await returnUsers()
            users.forEach(item=>{
                if(item.email == email){
                    count = 1
                }
            })
        if(countUsers == 0){
            const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
                await mongodb.insertOne({
                    name: name,
                    email: email
                })
            res.status(200).send('inserido')
        }else{
            res.status(400).send('Email já registrado!')
        }
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

async function returnUsers(){
    try {
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
        let results = []
        await mongodb.find().forEach(item=>{results.push(item)})

        return results
    } catch (error) {
        console.log(error)
    }
}

async function updateUser(req, res){
    const { newName, oldEmail, newEmail } = req.body
    try {
        await client.connect()
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
            console.log('Conectado ao Mongo!')
        let users = await returnUsers()
        let countUsers = 0
        users.forEach(item=>{
            if(item.email == oldEmail){
                countUsers = 1
            }
        })
        if(countUsers == 1){
            const query = {email: oldEmail}
            const update = {$set: {name:newName, email: newEmail}}
                mongodb.updateOne(query,update)
                .then(()=>console.log('Atualizao com sucesso'))
                .finally(()=>client.close)
               return  res.status(200).send('atualizado')
        }else{
            return  res.status(400).send('Não existe esse email para ser atualizado!')
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createNewUser,
    getUsers,
    updateUser
}