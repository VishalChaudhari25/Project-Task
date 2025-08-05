import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize) => {
  const Report = sequelize.define(
    'Report',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reporterId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reportedUserId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reportedPostId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'Report',
      timestamps: false,
      underscored: true,
    }
  );

  Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: 'reporterId', as: 'reporter' });
    Report.belongsTo(models.User, { foreignKey: 'reportedUserId', as: 'reportedUser' });
    Report.belongsTo(models.Post, { foreignKey: 'reportedPostId', as: 'reportedPost' });
  };

  return Report;
};
