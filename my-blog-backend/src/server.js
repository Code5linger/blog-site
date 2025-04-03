import express from 'express';
import { db, connectToDb } from './db.js';

const app = express();
app.use(express.json());

// ! Getting the POST
app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.send(article);
  } else {
    res.sendStatus(404);
  }
});

// ! UPVOTE
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
    res.json(article);
  } else {
    res.send("The article dosen't exist!");
  }
});

// ! Comment
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
    res.json(article);
  } else {
    res.send("The article dosen't exist!");
  }
});

connectToDb(() => {
  console.log('✅✅✅✅');
  app.listen(8000, () => {
    console.log('✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️');
  });
});
