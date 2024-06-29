const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({
  origin: '*', // This allows all origins, you can restrict it to your app's domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.get('/', (req, res) => {
    res.send('Hello, Shabuj Global');
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w7xbhfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection

    const BudgetList = client.db("globalAccounts").collection("BudgetList")
    const SpentList =  client.db("globalAccounts").collection("SpentList")


//    getting budget
    app.get ("/budget", async(req, res)=>{
        let query = {};
        if (req.query.currentMonth && req.query.city) {
            query = {
              month: req.query.currentMonth,
              selectedCity: req.query.city
            };
          }
        const budget = await BudgetList.find(query).toArray();
        res.send(budget);
    })

    // setting budget
    app.post("/budget", async(req, res)=>{
        const budget = req.body;
        const result = await BudgetList.insertOne(budget)
        res.send(result)
    })

    // updating Budget budget
    app.put("/budget", async (req, res) => {
      let query = {};
      if (req.query.currentMonth && req.query.city) {
        query = {
          month: req.query.currentMonth,
          selectedCity: req.query.city
        };
      }
      const option = { upsert: true };
      const updatedData = req.body;
      console.log(updatedData);
      const updatedBudget = {
        $set: updatedData
      };
    
      try {
        const result = await BudgetList.updateOne(query, updatedBudget, option);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while updating the budget' });
      }
    });
    


    // getting spent data
    app.get("/spent", async(req, res)=>{
      let query ={}
      if(req.query?.city){
        query = {
          beanchName: req.query.city
        }
      }
      const result = await SpentList.find(query).toArray()
      res.send(result)
    })
    // getting spent data
    app.get("/spent1", async(req, res)=>{
      let query ={}
      if(req.query?.verify){
        query = {
          approve: req.query.verify
        }
      }
      const result = await SpentList.find(query).toArray()
      res.send(result)
    })

    // setting spent data
    app.post("/spent", async(req, res)=>{
        const budget = req.body;
        const result = await SpentList.insertOne(budget)
        res.send(result)
    })
    // setting spent data
    app.post("/spent", async(req, res)=>{
        const budget = req.body;
        const result = await SpentList.insertOne(budget)
        res.send(result)
    })

    // setting spent data
    app.put("/spent/:id", async(req, res)=>{
       const id = req.params.id
       const filter = {_id: new ObjectId(id)}
       const option = {upsert:true}
       const updatedData = req.body

       const updateSpentData = {
        $set:updatedData
       }
       const result = await  SpentList.updateOne(filter, updateSpentData, option)
       res.send(result)
    })



    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(PORT,"0.0.0.0", () => {
    console.log(`App listening at http://localhost:${PORT}`);
});