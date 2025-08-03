export default (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {

  }, {
    tableName: 'Follows', 
    timestamps: true, 
  });

  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
        as: 'follower',
        foreignKey: 'followerId',
    });
    Follow.belongsTo(models.User, {
        as: 'following',
        foreignKey: 'followingId',
    });
  };

  return Follow;
};