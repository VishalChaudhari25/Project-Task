const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/db.config');   // config folder is sibling to models

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, DataTypes);
db.Post = require('./post.model')(sequelize, DataTypes);

db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' });
db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

module.exports = db;
