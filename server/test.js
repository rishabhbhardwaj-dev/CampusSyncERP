const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('hi'));
const server = app.listen(5000, () => console.log('listening 5000'));
server.on('error', (e) => console.log('server error:', e));
setInterval(() => {}, 10000);
