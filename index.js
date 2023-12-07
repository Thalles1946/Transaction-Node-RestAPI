const express = require('express');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');
const app = express();


const PATH = './data/Mock-Data.json'
const rawData = fs.readFileSync(PATH)

var data;

try {
    data = JSON.parse(rawData)
} catch (error) {
    fs.writeFileSync(PATH,'{"data":[]}')
    data = JSON.parse(rawData)
}

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

function verifyNullData(props){

    if(props.title == null || props.amount == null || props.time == null){
        return true;

    }else{
        return false
    }

}


app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
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
 *      parameters:
 *          - in: query
 *            name: title
 *            schema:
 *              type: string
 *          - in: query
 *            name: amount
 *            schema:
 *              type: float
 *          - in: query
 *            name: time
 *            schema:
 *              type: string
 *      responses:
 *          201:
 *              description: Sucesso
 *              
 *                                   
 */
app.put('/transactions',(req,res)=>{
    const {title,amount,time} = req.query

    try {
        
        if(!verifyNullData(req.query)){
        createTransaction({title:title, amount:amount,time:time})
        res.status(201).send();
        }else{
            res.status(418).send({message:"We need a title, amount and time!"})
        }
        
    } catch (error) {
        
        res.status(418).send({message:error.message})
    }

})






app.listen(
    PORT,()=>{
        console.log(`Node server listening on http://localhost:${PORT}`);
    }
)