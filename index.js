const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// this are my middleware
app.use(cors());
app.use(express.json());


// userName: codersrabbi
// password: Cg9A2ksAPBx1rihY




const uri = "mongodb+srv://codersrabbi:Cg9A2ksAPBx1rihY@cluster0.jeg7pmd.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect();
        const database = client.db("usersDB");
        const userCollections = database.collection('users');

        app.get('/users', async (req, res) => {
            const cursor = userCollections.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedUser = await userCollections.findOne(query);
            res.send(updatedUser);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(user);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await userCollections.updateOne(filter, updatedUser, options)
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log('NewUser:', user);
            const result = await userCollections.insertOne(user);
            res.send(result);
        })


        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from the database', id);
            const query = { _id: new ObjectId(id) }

            const result = await userCollections.deleteOne(query);
            res.send(result);

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
    res.send('SIMPLE CRUD IS RUNNING')
})


app.listen(port, () => {
    console.log(`simple crud is running on port, ${port}`);
})

