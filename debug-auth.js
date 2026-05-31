const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test');
    
    // 1. Find user by email
    const user = await db.collection('members').findOne({ email: 'abahmarquis@gmail.com' });
    console.log("=== YOUR MEMBER DOCUMENT ===");
    console.log(JSON.stringify(user, null, 2));
    
    // 2. List all excos
    const excos = await db.collection('excos').find({}).toArray();
    console.log("\n=== ALL EXCOS ===");
    console.log(JSON.stringify(excos, null, 2));
    
    // 3. List all members with admin/super_admin roles
    const admins = await db.collection('members').find({ role: { $in: ['admin', 'super_admin'] } }).toArray();
    console.log("\n=== ALL ADMINS/SUPER_ADMINS ===");
    admins.forEach(a => console.log(`  ${a.email} => role: ${a.role}`));
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
