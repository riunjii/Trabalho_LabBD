/*API REST dos Carros */

import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'

const router = express.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'carros'

/*API GET dos Carros */

router.get('/',async(req, res) =>{
    try{
        db.collection(nomeCollection).find().sort({marca: 1})
        .toArray((err, docs) => {
            if(!err){
                res.status(200).json(docs)
            }
        })
    } catch (err){
        res.status(500).json({
            errors: [{
                value: '${err.message}',
                msg: 'Erro ao obter a listagem das marcas',
                param: '/'
            }]
        })
    }
})

router.get('/id/:id', async(req, res) =>{
    try{
        db.collection(nomeCollection).find({'_id': {$eq: ObjectId(req.params.id)}})
        .toArrays((err, docs) => {
            if(err){
                res.status(400).json(err) //bad request
            }else {
                res.status(200).json(docs) //retorna o documento
            }
        })
    }catch( err ){
        res.status(500).json({"error": err.message})
    }
})

//Delete da api/carros



export default router