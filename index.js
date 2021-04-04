const express = require('express')
const app = express()
const port = process.env.PORT || 5050
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World I am Learning Node!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ps1cs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("eMarket").collection("products");

  app.post('/addProduct', (req, res) =>{
    const newProduct = req.body
    collection.insertOne(newProduct)
    .then(result => {
      console.log(result.insertedCount > 0)
      res.send(result.insertedCount > 0)
    })
    console.log('adding new product', newProduct)
  })

  app.get('/products', (req, res) => {
    collection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items)
    })
  })


  console.log('CONNECTION', err)
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})