const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lecturer = sequelize.define('Lecturer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING
  },
  branch: {
    type: DataTypes.STRING
  },
  subjects: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  assignedClass: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Lecturer;
