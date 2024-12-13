const express = require('express')
const app = express()

app.listen(3000, ()=>{
    console.log('server is running on p');
})

app.get('/', (req,res)=>{
    res.send("Hello from Node API");
})