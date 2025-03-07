const errsole = require('errsole');
const ErrsoleMySQL = require('errsole-mysql');

errsole.initialize({
  storage: new ErrsoleMySQL({
    host: 'localhost', // Replace with your actual MySQL host
    user: 'root', // Replace with your actual MySQL user
    password: 'lekhwar2003', // Replace with your actual MySQL password
    database: 'spotfix', // Replace with the name of your MySQL database
    tablePrefix: 'spotfix' // Replace with your actual app name
  }),
  appName: 'spotfix' // Replace with your actual app name
});

module.exports = {errsole};