const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {MongoClient, ServerApiVersion} = require("mongodb");
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

  const defaultCollection = client.db("TechVentureDB").collection("default");

  app.get("/", async (req, res) => {
    const result = await defaultCollection.find().toArray();
    res.send(result);
  });
}
run().catch(console.dir);

app.get("/status", (req, res) => {
  res.send("techventure server is running");
});

app.listen(port, () => {
  console.log(`techventer server is running on port ${port}`);
});
