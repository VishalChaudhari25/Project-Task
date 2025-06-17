require('dotenv').config();
const express = require('express');
const db = require('./models');

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comments.routes');


const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes); 
app.get('/', (req, res) => {
  res.send('Server is running!');
});
// 404 fallback
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Sequelize DB connect + sync + server start
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
