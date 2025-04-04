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

  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400);
      // return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  req.user = req.user || {};

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

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});

// ! UPVOTE
app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
      await db.collection('articles').updateOne(
        { name },
        {
          $inc: { upvotes: 1 },
          $push: { upvoteIds: uid },
        }
      );
    }
    const updatedArticle = await db.collection('articles').findOne({ name });

    // if (!req.user) {
    //   return res.status(401).json({ error: 'Authentication required' });
    // }

    res.json(updatedArticle);
  } else {
    res.send("The article dosen't exist!");
  }
});

// ! Comment
app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;

  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  await db.collection('articles').updateOne(
    { name },
    {
      $push: { comments: { postedBy: email, text } },
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
