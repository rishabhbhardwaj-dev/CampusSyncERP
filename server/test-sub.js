const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production');

fetch('http://localhost:5005/api/academic/subjects?courseId=1&semester=4', {
  headers: { Cookie: `token=${token}` }
}).then(r => r.json()).then(data => {
  console.log("DATA:", JSON.stringify(data, null, 2));
}).catch(e => {
  console.error("ERROR:", e);
});
