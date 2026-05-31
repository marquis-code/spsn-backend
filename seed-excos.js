const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
    
    // We don't know the exact database name, let's find it.
    const dbs = await client.db().admin().listDatabases();
    const dbName = dbs.databases.find(db => db.name.includes('scpc') || db.name === 'test').name || 'test';
    
    console.log("Using DB:", dbName);
    const db = client.db(dbName);
    
    // Clear existing excos to avoid duplicates
    await db.collection("excos").deleteMany({});
    
    const excos = [
      {
        "name": "Bankole Julius k.",
        "position": "National President SCPSN",
        "bio": "",
        "profilePicture": "https://res.cloudinary.com/dt2xipxai/image/upload/v1780245283/scpsn/uploads/tyc6rdyjkmesptktw7wh.jpg",
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "__v": 0
      },
      {
        "name": "MLS Benard Solomon Adebayo",
        "position": "National Secretary",
        "bio": "",
        "profilePicture": "https://res.cloudinary.com/dt2xipxai/image/upload/v1780245283/scpsn/uploads/tyc6rdyjkmesptktw7wh.jpg",
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "__v": 0
      }
    ];

    const result = await db.collection("excos").insertMany(excos);
    console.log("Successfully seeded excos:", result);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
