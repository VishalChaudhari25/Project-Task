// src/models/Status.js
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Status = sequelize.define(
    'Status',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User', // References the User table
          key: 'id',
        },
        onDelete: 'CASCADE', // If user is deleted, their statuses are deleted
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [1, 255], // Statuses typically have a character limit
        },
      },
    },
    {
      tableName: 'Status',
      timestamps: true, // Crucial for tracking when the status was created
      underscored: true,
    }
  );

  // Define associations for the Status model
  Status.associate = (models) => {
    Status.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Status;
};
