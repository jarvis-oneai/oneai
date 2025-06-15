require('dotenv').config(); // Load .env variables

const express = require('express');
const cors = require('cors');
const sequelize = require('./db'); // DB connection
const passwordResetRoutes = require('./routes/passwordReset');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/password-reset', passwordResetRoutes);

// Import User model
const User = require('./models/Users');

// Test route
app.get('/', (req, res) => {
  res.send('ONEAI/Jarvis Backend is running!');
});

const PORT = process.env.PORT || 5050;

// Connect to the database and sync the User model
sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    // Sync models (creates/updates tables)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { app, User };
