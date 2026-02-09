const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    references: { model: 'Students', key: 'id' },
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  attendedHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  month: {
    type: DataTypes.STRING
  },
  year: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: true
});

module.exports = Attendance;
