/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mysql = require('mysql');

//module.exports.connectdb = function(callback){
    // connection configurations
   const mc = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'swappylabel'
   });   
//   callback(mc);
//}
//const pool = mysql.createPool(mc);
mc.connect();
module.exports = mc;