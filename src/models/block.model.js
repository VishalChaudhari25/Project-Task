import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize) => {
  const Block = sequelize.define(
    'Block',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      blockerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      blockedId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'Block',
      timestamps: false,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['blocker_id', 'blocked_id'],
        },
      ],
    }
  );

  Block.associate = (models) => {
    Block.belongsTo(models.User, { foreignKey: 'blockerId', as: 'blocker' });
    Block.belongsTo(models.User, { foreignKey: 'blockedId', as: 'blocked' });
  };

  return Block;
};
