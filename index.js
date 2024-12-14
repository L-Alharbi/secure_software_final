const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/product.model.js')
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

app.post('/api/products', async (req,res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

app.get('/api/products', async (req,res)=>{
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

//TODO
app.get('/api/products/:id', async (req,res)=>{
    try {
        const products = await Product.find({id})
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})