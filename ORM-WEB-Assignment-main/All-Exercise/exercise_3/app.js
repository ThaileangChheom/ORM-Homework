const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Load data from the JSON file
let rawData = fs.readFileSync('data.json');
let data = JSON.parse(rawData);

// Helper function to write data back to the JSON file
const writeDataToFile = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Advanced Search and Pagination for Articles
app.get('/articles', (req, res) => {
  let articles = data.articles;

  // Search parameters
  const { created_by, is_published, title, contents } = req.query;

  if (created_by) {
    articles = articles.filter(article => article.created_by === created_by);
  }

  if (is_published !== undefined) {
    articles = articles.filter(article => article.is_published.toString() === is_published);
  }

  if (title) {
    articles = articles.filter(article => article.title.includes(title));
  }

  if (contents) {
    articles = articles.filter(article => article.contents.includes(contents));
  }

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const paginatedArticles = articles.slice(offset, offset + limit);

  res.json({
    page,
    limit,
    total: articles.length,
    totalPages: Math.ceil(articles.length / limit),
    data: paginatedArticles
  });
});

// Advanced Search and Pagination for Users
app.get('/users', (req, res) => {
  let users = data.users;

  // Search parameters
  const { username } = req.query;

  if (username) {
    users = users.filter(user => user.username.includes(username));
  }

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const paginatedUsers = users.slice(offset, offset + limit);

  res.json({
    page,
    limit,
    total: users.length,
    totalPages: Math.ceil(users.length / limit),
    data: paginatedUsers
  });
});

// Existing endpoints (unchanged)
app.get('/articles/:id', (req, res) => {
  const article = data.articles.find(a => a.id === parseInt(req.params.id));
  if (article) {
    res.json(article);
  } else {
    res.status(404).send('Article not found');
  }
});

app.post('/articles', (req, res) => {
  const newArticle = { ...req.body, id: data.articles.length + 1 };
  data.articles.push(newArticle);
  writeDataToFile(data);
  res.status(201).json(newArticle);
});

app.put('/articles/:id', (req, res) => {
  const index = data.articles.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    data.articles[index] = { ...data.articles[index], ...req.body };
    writeDataToFile(data);
    res.json(data.articles[index]);
  } else {
    res.status(404).send('Article not found');
  }
});

app.delete('/articles/:id', (req, res) => {
  const index = data.articles.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    const deletedArticle = data.articles.splice(index, 1);
    writeDataToFile(data);
    res.json(deletedArticle);
  } else {
    res.status(404).send('Article not found');
  }
});

app.get('/users/:id', (req, res) => {
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/users', (req, res) => {
  const newUser = { ...req.body, id: data.users.length + 1 };
  data.users.push(newUser);
  writeDataToFile(data);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const index = data.users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    data.users[index] = { ...data.users[index], ...req.body };
    writeDataToFile(data);
    res.json(data.users[index]);
  } else {
    res.status(404).send('User not found');
  }
});

app.delete('/users/:id', (req, res) => {
  const index = data.users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    const deletedUser = data.users.splice(index, 1);
    writeDataToFile(data);
    res.json(deletedUser);
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
