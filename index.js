require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');

const keys = require('./config/keys');
const routes = require('./routes');
const { setupDB } = require('./utils/db'); // Force nodemon restart to load new env

const { port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);
app.use(cors());

setupDB().then(async () => {
  const User = require('./models/user');
  const bcrypt = require('bcryptjs');
  const adminEmail = 'admin@store.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({ email: adminEmail, password: 'PASSWORD#123', firstName: 'Super', lastName: 'Admin', role: 'ROLE ADMIN' });
    await admin.save();
    console.log('Admin user seeded automatically.');
  } else {
    admin.role = 'ROLE ADMIN';
    admin.password = 'PASSWORD#123';
    await admin.save();
    console.log('Admin user password forcefully updated to PASSWORD#123.');
  }
});
require('./config/passport')(app);
app.use(routes);

const server = app.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});
