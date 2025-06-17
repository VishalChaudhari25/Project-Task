const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/db.config');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, DataTypes);
db.Post = require('./post.model')(sequelize, DataTypes);
db.Comment = require('./comments.model')(sequelize, DataTypes);

// Associations with UUID foreign keys

// User-Post
db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' });
db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// User-Comment
db.User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comments' });
db.Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// Post-Comment
db.Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comments' });
db.Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });

module.exports = db;
