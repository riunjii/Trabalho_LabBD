import express from 'express'

const app = express()
const port = 4000

app.use(express.json())
app.use('/',express.static('public'))
//favicon
app.use('/favicon.ico', express.static('public/images/carro.png'))

app.get('/api',(req, res) => {
    res.status(200).json({
        message: 'API Carros 100% Funcional🚙',
        version: '1.0.0'
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