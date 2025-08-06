import { Sequelize, DataTypes } from 'sequelize';
import userModel from './user.model.js';
import postModel from './post.model.js';
import adminModel from './admin.model.js';
import commentModel from './comments.model.js';
import likeModel from './like.model.js';
import followModel from './follow.model.js';
import blockModel from './block.model.js';
import reportModel from './report.model.js';
import statusModel from './status.model.js';
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
db.Block = blockModel(sequelize, DataTypes);
db.Report = reportModel(sequelize, DataTypes);
db.Status = statusModel(sequelize,DataTypes);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.User.hasMany(db.Block, { foreignKey: 'blockerId', as: 'BlocksMade' });
db.User.hasMany(db.Block, { foreignKey: 'blockedId', as: 'BlocksReceived' });
db.Post.hasMany(db.Report, { foreignKey: 'reportedPostId', as: 'Reports' });
db.User.hasMany(db.Report, { foreignKey: 'reporterId', as: 'ReportsMade' });
db.User.hasMany(db.Report, { foreignKey: 'reportedUserId', as: 'ReportsReceived' });
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database synchronized (altered)');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
  
export default db;
