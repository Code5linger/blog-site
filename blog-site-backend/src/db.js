import { MongoClient } from 'mongodb';

let db;

async function connectToDb(cb) {
  const client = new MongoClient('mongodb://localhost:27017/react-blog-db');
  await client.connect();
  db = client.db('react-blog-db');
  cb();
}

export { db, connectToDb };
