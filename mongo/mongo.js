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
        //Fazendo verificação de usuários existenstes
        let countUsers = await returnUsers(email)
    
        //Se não existir usuários com o email informado, permitir cadastro
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


//Função responsável por fazer o update no mongo
async function updateUser(req, res){
    const { newName, oldEmail, newEmail } = req.body
    try {
        await client.connect()
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
            console.log('Conectado ao Mongo!')
        //Fazendo verificação de usuários existenstes
        let countUsers = await returnUsers(oldEmail)

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

// Função responsável por deletar usuários existentes
async function deleteUser(req, res){
    const { email } = req.body
    try {
        await client.connect();
        const mongodb = client.db(`${process.env.MONGO_DATABASE}`).collection('Usuarios')
        console.log('Conectado ao Mongo!')
        //Verificação de usuários existentes
        let countUsers = await returnUsers(email)
        if(countUsers == 1){
            await mongodb.deleteOne({email: email})
            return res.status(200).send('Deletado com sucesso')
        }else{
            return res.status(400).send('Esse email não existe para que possa ser deletado')
        }
    } catch (error) {
        console.log(error)
    }finally{
        await client.close()
    }
}

module.exports = {
    createNewUser,
    getUsers,
    updateUser,
    deleteUser
}