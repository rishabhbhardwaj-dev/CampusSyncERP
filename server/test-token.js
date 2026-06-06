const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

const token = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production', { expiresIn: '1h' });

console.log("Token:", token);
