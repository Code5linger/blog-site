import express from 'express';
import { db, connectToDb } from './db.js'; // Explicit extension

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  await db.collection('articles').updateOne(
    { name },
    {
      $push: { comments: { postedBy, text } },
    }
  );
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.send(article.comments);
  } else {
    res.send("That article dosen't exist.");
  }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  await db.collection('articles').updateOne(
    { name },
    {
      $inc: { upvotes: 1 },
    }
  );
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.send(`The ${name} article now has ${article.upvotes} upvotes❗`);
  } else {
    res.send("That article dosen't exist.");
  }
});

connectToDb(() => {
  console.log('Test');

  app.listen(8000, () => {
    console.log('👂 Port 8000');
  });
});
