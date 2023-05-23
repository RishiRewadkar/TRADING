/*
https://www.youtube.com/watch?v=kvFQHgHZx4g&list=PLgWjD_CBfh0ACkCyg5Kjk0mh2Mcc-sZa3&index=4&ab_channel=SBSonlineclasses
*/
const http = require('http');
const app = require('./app')
const server = http.createServer(app);
const path = require('path')



server.listen(3000, console.log('app is UP'));