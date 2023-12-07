const express = require('express');
const fs = require('fs');

const rawData = fs.readFileSync('./Data/Mock-Data.json')
const data = JSON.parse(rawData);

const app = express();

const PORT = 8000;


function createTransaction({title,amount,time}) {

    if(data.data.length>0){

        data.data.push({title:title,amount:amount,time:time,id:data.data[data.data.length-1].id+1})
    }else{
        data.data.push({title:title,amount:amount,time:time,id:0})

    }

    const dadosModificados = JSON.stringify(data,null,2)
    fs.writeFileSync('./Data/Mock-Data.json',dadosModificados)
}


app.use(express.json())

app.get('/transactions',(req,res) => {

    // console.log(data.data);
    // createTransaction({title:"Teste 1", amount:"3000",time:"03:00"})
    // console.log(data.data);

    const returnData = data.data


    res.status(200).send(returnData)
})

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