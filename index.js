const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
require('dotenv').config()
app.use(cors());
app.use(express.json());







// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.uwuwq9x.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();



    const collageBookingData
    = client.db('collageBooking').collection('collageBookingData')

 // app get 
 app.get('/allCollection', async (req, res) => {
  const cursor = collageBookingData.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.get('/allCollection/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const singleCollege = await collageBookingData.findOne(query)
  res.send(singleCollege)
})




 // search
 const indexKeys = { name: 1 }
 const indexOptions = { name: 'name' }
 const result = await collageBookingData.createIndex(indexKeys, indexOptions);

 app.get('/collegeSearch/:text', async (req, res) => {
   const searchText = req.params.text
   const result = await collageBookingData.find({

     $or: [
       { name: { $regex: searchText, $options: 'i' } }
     ]
   }).toArray()

   res.send(result)
 })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




















app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})