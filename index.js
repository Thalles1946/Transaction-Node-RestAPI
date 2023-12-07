const express = require('express');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');
const app = express();


const PATH = './data/Mock-Data.json'
const rawData = fs.readFileSync(PATH)
const data = JSON.parse(rawData);
const PORT = 8000;


function createTransaction({title,amount,time}) {

    if(data.data.length>0){

        data.data.push({title:title,amount:amount,time:time,id:data.data[data.data.length-1].id+1})
    }else{
        data.data.push({title:title,amount:amount,time:time,id:0})

    }

    const dadosModificados = JSON.stringify(data,null,2)
    fs.writeFileSync(PATH,dadosModificados)
}


app.use('/api-docs/v1',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use(express.json())


/**
 * @swagger
 * /transactions:
 *   get:
 *      summary: Retorna uma lista das operações feitas
 *      description: Retorna os dados contidos na API sobre as operações feitas com o PUT
 *      responses:
 *          200:
 *              description: Sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          data:
 *                              type: array
 *                              properties:
 *                                  title:
 *                                      type:string
 *                                   
 */


app.get('/transactions',(req,res) => {


    const returnData = data.data


    res.status(200).send(returnData)
})



/**
 * @swagger
 * /transactions:
 *   put:
 *      summary: Adiciona operação
 *      description: Cria uma nova operação e adiciona-a na lista de operações feitas com o PUT, sendo possível acessá-la através do GET
 *      responses:
 *          201:
 *              description: Sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          data:
 *                              type: array
 *                              properties:
 *                                  title:
 *                                      type:string
 *                                   
 */
app.put('/transactions',(req,res)=>{
    const {title,amount,time} = req.body

    try {
        
        
        createTransaction({title:title, amount:amount,time:time})
     
        res.status(201).send();
        
    } catch (error) {
        
        res.status(418).send({message:error.message})
    }

})


app.post('/transactions/:id',(req,res) => {
    
    const { id } = req.params;
    const { logo } = req.body;

    if(!logo){
        res.status(418).send({message:"We need a logo!"})

    }

    res.send({
        tshirt:`Blusa with your ${logo} and ID of ${id}`
    })

})



app.listen(
    PORT,()=>{
        console.log(`Node server listening on http://localhost:${PORT}`);
    }
)