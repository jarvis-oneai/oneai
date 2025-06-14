const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }, // hashed password!
  premium: { type: DataTypes.BOOLEAN, defaultValue: false },
  superuser: { type: DataTypes.BOOLEAN, defaultValue: false }, // Admin/Superuser flag
  city: { type: DataTypes.STRING, allowNull: true },
  signupDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  latestLoginDate: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'users'
});

module.exports = User;
