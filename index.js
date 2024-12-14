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
    res.send("Congrats, you got the server working! -Ezra");
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
app.get('/api/product/:id', async (req,res)=>{
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

app.put('/api/product/:id', async (req,res)=>{
    try {
        const {id} = req.params
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body)
        
        console.log("looked for product")

        if(!updatedProduct){
            return res.status(404).json({message:"Product not found"})
        }

        console.log("product found")

        const productConfirmation = await Product.findById(id)
        res.status(200).json(productConfirmation)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

app.delete('/api/product/:id', async (req,res)=>{
    try {
        const {id} = req.params
    
        const product = await Product.findByIdAndDelete(id)

        if(!product){res.status(404).json({message:"product not found"})}

        res.status(200).json({"message":"successfully deleted "})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})