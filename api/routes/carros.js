/*API REST dos Carros */
import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, ExpressValidator, validationResult } from "express-validator"
import { MaxKey } from 'mongodb'


const router = express.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'carros'

const validaCarro = [
    check('cv de potencia')
            .not()
            .isEmpty()
            .trim()
            .isNumeric()
            .withMessage('Os Cvs do carro devem ser números')
            ,
    check('modelo')
            .not()
            .isEmpty()
            .trim()
            .withMessage('É obrigatório informar o modelo do carro'),
    check('marca')
            .not()
            .isEmpty()
            .trim()
            .withMessage('É obrigatório informar o modelo do carro'),
    check('chassi')
            .not()
            .isEmpty()
            .trim()
            .withMessage('É obrigatório informar o chassi do carro')
            .isLength({min:17, max: 17}).withMessage('o Chassi deve possuir 17 caractéres'),   
]

/*API GET dos Carros*/
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
                value: `${err.message}`,
                msg: 'Erro ao obter a lista dos produtos',
                param: '/'
            }]
        })
    }
})

router.get('/id/:id', async(req, res) => {
    try{
        db.collection(nomeCollection).find({'_id': {$eq: ObjectId(req.params.id)}}).toArray((err, docs) => {
            if(err){
                res.status(400).json(err) // bad request
            }else{
                res.status(200).json(docs) // retorna o documento
            }
        })
    }catch(err){
        res.status(500).json({"error": err.message})
    }
})

//API POST
router.post('/', validaCarro, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    }
})

//PUT da api carros
router.put('/', validaCarro, async(req, res) =>{
    let idDocumento = req.body._id
    delete req.body._id
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    }else{
        await db.collection(nomeCollection)
        .updateOne({'_id': {$eq: ObjectId(idDocumento)}},{$set: req.body})
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))
    }
})


//Delete da api/carros
router.delete('/:id', async(req, res) => {
    await db.collection(nomeCollection)
    .deleteOne({"_id": {$eq: ObjectId(req.params.id)}})
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).json(err))
})

export default router