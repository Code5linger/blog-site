import express from 'express';
import { db, connectToDb } from './db.js';
import cors from 'cors';

const app = express();

// Middleware setup
app.use(express.json());

// CORS Configuration (Choose ONE of these options)
// Option 1: For development (specific origin)
app.use(
  cors({
    origin: 'http://localhost:5173', // Your React frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Option 2: For production (multiple allowed origins)
/*
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-production-domain.com'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
*/

// Routes
app.get('/api/articles/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const article = await db.collection('articles').findOne({ name });

    if (article) {
      res.json(article);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/articles/:name/comments', async (req, res) => {
  try {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    if (!postedBy || !text) {
      return res.status(400).send('Missing required fields');
    }

    await db
      .collection('articles')
      .updateOne({ name }, { $push: { comments: { postedBy, text } } });
    const article = await db.collection('articles').findOne({ name });

    if (article) {
      res.status(201).send(article.comments);
    } else {
      res.status(404).send("Article doesn't exist");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await db
      .collection('articles')
      .updateOne({ name }, { $inc: { upvotes: 1 } });

    if (result.modifiedCount === 0) {
      return res.status(404).send("Article doesn't exist");
    }

    const article = await db.collection('articles').findOne({ name });
    res.send(`The ${name} article now has ${article.upvotes} upvotes❗`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Database connection and server start
connectToDb(() => {
  app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
  });
});
