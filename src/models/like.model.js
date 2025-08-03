export default(sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      postId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Post', // The name of the table it references
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'User', // The name of the table it references
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      isLiked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'Likes',
      timestamps: false,
      underscored: false,
    }
  );

  // Define associations for the Like model
  Like.associate = (models) => {
    Like.belongsTo(models.Post, { foreignKey: 'postId' });
    Like.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Like;
};