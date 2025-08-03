export default (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User', 
          key: 'id',      
        },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'Post',
      timestamps: false,
      underscored: false,
    }
  );

   Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Post.belongsToMany(models.User,{
      through: models.Like,
      foreignKey: 'postId',
      as: 'likingUsers',
    });
    Post.hasMany(models.Like, {foreignKey:'postId', as: 'likes '});
  };

  return Post;
};
