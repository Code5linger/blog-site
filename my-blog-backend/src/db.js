import { MongoClient } from 'mongodb';

let db;

async function connectToDb(cb) {
  const client = new MongoClient(
    `mongodb+srv://codeslinger:zSxdhAZS8UGvseS8@cluster0.neiolvd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
  await client.connect();

  db = client.db('react-blog-db');
  cb();
}

export { db, connectToDb };

const data = [
  { name: 'learn-react', upvotes: 0, comments: [] },
  { name: 'learn-node', upvotes: 0, comments: [] },
  { name: 'mongodb', upvotes: 0, comments: [] },
];
