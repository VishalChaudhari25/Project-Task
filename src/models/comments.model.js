export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      parentCommentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Comments',
          key: 'id',
        }
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Posts',  
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',  
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'Comments',
      timestamps: false,
      underscored: false,
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
  };

  return Comment;
};
