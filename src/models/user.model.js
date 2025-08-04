import { genSalt, hash, compare } from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      resetPasswordToken: {
      type: DataTypes.STRING, 
      allowNull: true, 
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true, 
    },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          len: [5,100] 
        }
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // UUID auto-generated
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
      role: {
      type: DataTypes.STRING,
      defaultValue: 'user', // Default role for new users
      allowNull: false
      },
      is_active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: 'User',
      timestamps: false,
      underscored: true,
    }
  );
  User.associate=(models)=>{
    User.belongsToMany(models.Post,{
      through: models.Like,
      foreignKey: 'userId',
      as: 'likedPosts',
    });
  
  User.hasMany(models.Follow, {
      as: 'followers',
      foreignKey: 'followingId', 
    });

    // User can follow many people
    User.hasMany(models.Follow, {
      as: 'following',
      foreignKey: 'followerId', 
    });
  };
  return User;
};
