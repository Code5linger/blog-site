import express from 'express';

let articlesInfo = [
  {
    name: 'learn-react',
    upvotes: 68,
    comments: [],
  },
  {
    name: 'learn-node',
    upvotes: 0,
    comments: [],
  },
  {
    name: 'my-thoughts-on-resumes',
    upvotes: 0,
    comments: [],
  },
];

const app = express();
app.use(express.json());

app.post('/api/articles/:name/comments', (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  const article = articlesInfo.find((a) => a.name === name);
  if (article) {
    article.comments.push({ postedBy, text });
    res.send(article.comments);
  } else {
    res.send("That article dosen't exist.");
  }
});

app.put('/api/articles/:name/upvote', (req, res) => {
  const { name } = req.params;
  const article = articlesInfo.find((a) => a.name === name);
  if (article) {
    article.upvotes += 1;
    res.send(`The ${name} article now has ${article.upvotes} upvotes❗`);
  } else {
    res.send("That article dosen't exist.");
  }
});

app.listen(8000, () => {
  console.log('👂 Port 8000');
});
