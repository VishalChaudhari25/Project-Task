import { Sequelize, DataTypes } from 'sequelize';
import userModel from './user.model.js';
import postModel from './post.model.js';
import adminModel from './admin.model.js';
import commentModel from './comments.model.js';
import likeModel from './like.model.js';
import followModel from './follow.model.js';
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    }
  }
);

const db = {};
db.sequelize = sequelize;

// Initialize and attach the User model
db.User = userModel(sequelize, DataTypes);
db.Post = postModel(sequelize, DataTypes);
db.Comment = commentModel(sequelize, DataTypes);
db.Admin = adminModel(sequelize,DataTypes);
db.Like = likeModel(sequelize,DataTypes);
db.Follow = followModel(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database synchronized (altered)');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
  
export default db;
