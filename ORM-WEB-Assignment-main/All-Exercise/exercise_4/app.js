const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/Article');
const User = require('./models/User');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-db-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Advanced Search and Pagination for Articles
app.get('/articles', async (req, res) => {
  try {
    const { created_by, is_published, title, contents, page = 1, limit = 10 } = req.query;
    const query = {};

    if (created_by) query.created_by = created_by;
    if (is_published !== undefined) query.is_published = is_published === 'true';
    if (title) query.title = new RegExp(title, 'i'); // case-insensitive search
    if (contents) query.contents = new RegExp(contents, 'i'); // case-insensitive search

    const articles = await Article.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Article.countDocuments(query);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: articles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Advanced Search and Pagination for Users
app.get('/users', async (req, res) => {
  try {
    const { username, page = 1, limit = 10 } = req.query;
    const query = {};

    if (username) query.username = new RegExp(username, 'i'); // case-insensitive search

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Existing endpoints (updated to use Mongoose)

app.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      res.json(article);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/articles', async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/articles/:id', async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedArticle) {
      res.json(updatedArticle);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/articles/:id', async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (deletedArticle) {
      res.json(deletedArticle);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json(deletedUser);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
