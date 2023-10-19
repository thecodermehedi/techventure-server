const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u0aecfc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  await client.connect();
  await client.db("admin").command({ping: 1});
  console.log("successfully connected to MongoDB!");

  const userCollection = client.db("techventureDB").collection("users");
  const brandCollection = client.db("techventureDB").collection("brands");
  const productCollection = client.db("techventureDB").collection("products");
  const userProductCollection = client.db("techventureDB").collection("userProducts");

  app.post("/users", async (req, res) => {
    const user = req.body;
    const result = await userCollection.insertOne(user);
    res.send(result);
  });
  app.patch("/users", async (req, res) => {
    const user = req.body;
    const filter = {email: user.email};
    const updateDoc = {
      $set: {
        name: user.name,
        photo: user.photoURL,
        lastSignInTime: user.lastSignInTime,
      },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  });
  app.get("/brands", async (req, res) => {
    const result = await brandCollection.find().toArray();
    res.send(result);
  });
  app.get("/brands/:name", async (req, res) => {
    const name = req.params.name;
    const query = {name: name};
    const result = await brandCollection.findOne(query);
    res.send(result);
  });

  app.get("/products", async (req, res) => {
    const result = await productCollection.find().toArray();
    res.send(result);
  });

  app.get("/products/brand/:brand", async (req, res) => {
    const brand = req.params.brand;
    const query = { brand: brand };
    const result = await productCollection.find(query).toArray();
    res.send(result);
  });

  app.get("/products/id/:id", async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await productCollection.findOne(query);
    res.send(result);
  });

  app.put("/products/id/:id", async (req, res) => {
    const id = req.params.id;
    const updateProduct = req.body;
    const filter = {_id: new ObjectId(id)};
    const updateDoc = {
      $set: {
        name: updateProduct.name,
        brand: updateProduct.brand,
        type: updateProduct.type,
        price: updateProduct.price,
        details: updateProduct.details,
        rating: updateProduct.rating,
        photoURL: updateProduct.photoURL
      }
    };
    const result = await productCollection.updateOne(filter, updateDoc);
    res.send(result);
  });

  app.post("/products", async (req, res) => {
    const product = req.body;
    const result = await productCollection.insertOne(product);
    res.send(result);
  });

  app.post("/userProducts", async (req, res) => {
    const userProduct = req.body;
    const result = await userProductCollection.insertOne(userProduct);
    res.send(result);
  })




}

run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("TechVenture Server is running ...");
});

app.listen(port, () => {
  console.log(`techventer server is running on port ${port}`);
});
