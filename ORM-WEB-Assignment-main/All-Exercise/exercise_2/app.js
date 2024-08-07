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

// Get all articles
app.get('/articles', (req, res) => {
  res.json(data.articles);
});

// Get article by id
app.get('/articles/:id', (req, res) => {
  const article = data.articles.find(a => a.id === parseInt(req.params.id));
  if (article) {
    res.json(article);
  } else {
    res.status(404).send('Article not found');
  }
});

// Create new article
app.post('/articles', (req, res) => {
  const newArticle = { ...req.body, id: data.articles.length + 1 };
  data.articles.push(newArticle);
  writeDataToFile(data);
  res.status(201).json(newArticle);
});

// Update article by id
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

// Delete article by id
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

// Get all users
app.get('/users', (req, res) => {
  res.json(data.users);
});

// Get user by id
app.get('/users/:id', (req, res) => {
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// Create new user
app.post('/users', (req, res) => {
  const newUser = { ...req.body, id: data.users.length + 1 };
  data.users.push(newUser);
  writeDataToFile(data);
  res.status(201).json(newUser);
});

// Update user by id
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

// Delete user by id
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
