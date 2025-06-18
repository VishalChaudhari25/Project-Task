const { Sequelize } = require('sequelize');
const config = require('../config/db.config');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: false, // set true to see SQL queries
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, Sequelize);
db.Post = require('./post.model')(sequelize, Sequelize);
db.Comment = require('./comments.model')(sequelize, Sequelize);

// Define associations
db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' });
db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comments' });
db.Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comments' });
db.Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });

module.exports = db;
