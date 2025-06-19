import express, { json } from 'express';
import db from './models/index.js';

const { sequelize } = db;

import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comments.routes.js'; 
import authRoutes from './routes/authroutes.js'; 

const app = express();
app.use(express.json()); // Don't forget to parse JSON bodies!

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Test root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Fallback route (keep this LAST)
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// DB connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync({ force: false }); 
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });