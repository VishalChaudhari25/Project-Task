module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Posts', key: 'id' },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE'
    }
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
  };

  return Comment;
};
