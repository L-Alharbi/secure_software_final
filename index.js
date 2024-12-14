const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())

//connect to database
mongoose.connect("mongodb+srv://ezra8473:5E4qyntirsiIVdPm@backenddb.t0gxh.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB")
.then(()=>{
    console.log("connected to database")
    //then turn on the server
    app.listen(3000, ()=>{
        console.log('server is running on port 3000');
    })
})
.catch(()=>{
    console.log("connection failed")
})


app.get('/', (req,res)=>{
    res.send("Hello from Node API");
})

app.post('/api/products',(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error)
    }
})