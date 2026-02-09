const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' }
  },
  rollNo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: false
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guardianName: {
    type: DataTypes.STRING
  },
  guardianEmail: {
    type: DataTypes.STRING
  },
  guardianPhone: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Student;
