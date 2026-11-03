const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://abutalhaakash26_db_user:9SLvZMWGpJKA3DlL@cluster0.ud2umzq.mongodb.net/ielts-agent?retryWrites=true&w=majority";

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ielts-agent');
  const docs = await db.collection('writing-practices').find({}, { projection: { type: 1, pracNumber: 1, _id: 0 } }).sort({ type: 1, pracNumber: 1 }).toArray();
  console.log('Total docs:', docs.length);
  console.log(JSON.stringify(docs, null, 2));
  await client.close();
})();
