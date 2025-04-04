import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import { db, connectToDb } from './db.js';

const credentials = JSON.parse(
  fs.readFileSync('../my-blog-backend/credentials.json')
);
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;

  req.user = null; // Initialize req.user as null (for unauthenticated requests)

  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      // res.sendStatus(400);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }
  next();
});

// ! Getting the POST
app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;
  // const { uid } = req.user;
  const { uid } = req.user || {}; // Fallback if req.user is null

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.includes(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

// ! UPVOTE
app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

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

  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

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

// code@gmail.com
// codeslinger
