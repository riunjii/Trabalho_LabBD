import express, { Router } from "express"


const app = express()
const port = 4000

//import das rotas
import rotasCarros from './routes/carros.js'

app.use(express.urlencoded({extended: true}))
app.use(express.json())
//rotas do public
app.use('/',express.static('public'))
//favicon
app.use('/favicon.ico', express.static('public/images/carro.png'))

//rotas API
app.use('/api/carros', rotasCarros)

app.get('/api',(req, res) => {
    res.status(200).json({
        message: 'API Carros 100% Funcional🚙',
        version: '1.0.1'
    })
})

app.use(function(req,res){
    res.status(404).json({
        errors:[{
            value: '${req.originalUrl}',
            msg:'A rota ${req.originalUrl} não existe nessa API!',
            param: 'invalid route'
        }]
    })
})

app.listen(port, function(){
    console.log('Servidor rodando na porta ${port}')
})

