const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test'); 
    
    const newCategories = [
      {
        title: "SCPSN General Newsletter",
        description: "Monthly updates on society events, news, and general announcements.",
        price: 2000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      },
      {
        title: "Cytopathology Quarterly Journal",
        description: "In-depth quarterly publications focusing on advancements in cytopathology.",
        price: 10000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      },
      {
        title: "Molecular Genetics Updates",
        description: "Weekly briefings on the latest research and findings in molecular genetics.",
        price: 8000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      },
      {
        title: "Histopathology Monthly Review",
        description: "Comprehensive monthly reviews covering key cases and methodologies in histopathology.",
        price: 5000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      }
    ];

    const result = await db.collection('newslettercategories').insertMany(newCategories);
    console.log(`Successfully inserted ${result.insertedCount} new newsletter categories.`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
