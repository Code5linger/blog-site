import express from 'express';

let articlesInfo = [
  {
    name: 'learn-react',
    upvotes: 5,
    comments: [],
  },
  {
    name: 'learn-node',
    upvotes: 10,
    comments: [],
  },
  {
    name: 'my-thoughts-on-resumes',
    upvotes: 15,
    comments: [],
  },
];

const app = express();
app.use(express.json());

// ! UPVOTE
app.put('/api/articles/:name/upvote', (req, res) => {
  const { name } = req.params;
  const article = articlesInfo.find((article) => article.name === name);
  if (article) {
    article.upvotes += 1;
    res.send(`The ${name} article now have ${article.upvotes} upvotes!`);
  } else {
    res.send("The article dosen't exist!");
  }
});

// ! Comment
app.post('/api/articles/:name/comments', (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  const article = articlesInfo.find((article) => article.name === name);

  if (article) {
    article.comments.push({ postedBy, text });
    res.send(article.comments);
  } else {
    res.send("The article dosen't exist!");
  }
});

app.listen(8000, () => {
  console.log('✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️✔️');
});

// GET => Load
// POST => Create
// PUT => Update
