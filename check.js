const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test'); 
    const categories = await db.collection('newslettercategories').find().toArray();
    console.log(JSON.stringify(categories, null, 2));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
