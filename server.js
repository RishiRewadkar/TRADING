
const http = require('http');
const app = require('./app')
const server = http.createServer(app);
const path = require('path')

const port = process.env.PORT || 800

server.listen(port, console.log('app is UP'));