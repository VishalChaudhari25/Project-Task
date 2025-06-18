require('dotenv').config();
const express = require('express');
const db = require('./models');

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comments.routes'); 
const authRoutes = require('./routes/authroutes'); 

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Test root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Fallback route
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// DB connection
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return db.sequelize.sync({ force: false }); 
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
