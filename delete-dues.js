const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test'); 
    
    const result = await db.collection('newslettercategories').deleteOne({ title: "Dues" });
    console.log(`Successfully deleted ${result.deletedCount} newsletter category.`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
