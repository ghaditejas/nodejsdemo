/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//var mysql = require('mysql');
var crypto = require('crypto');
var async = require('async');

// connection configurations
//const mc = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: '',
//    database: 'swappylabel'
//});
//
//// connect to database
//mc.connect();

var mc = require('../connection');

//module.exports.login_auth = function (login_credentials, callback) {
//    var password = crypto.createHash('md5').update(login_credentials.password).digest('hex');
//    console.log(password);
//    mc.query("SELECT * FROM admin_users WHERE username = '" + login_credentials.username + "' AND password = '" + password + "'", function (error, results, fields) {
//        if (error) {
//            console.log(error);
//            return callback(false);
//        } else if (results.length == 0) {
//            return callback(false);
//        } else {
//            return callback(true);
//            // module.export. false;
//        }
//    });
//}

module.exports.login_auth = function (login_credentials) {
    return new Promise(function(resolve, reject) {
        var password = crypto.createHash('md5').update(login_credentials.password).digest('hex');
        mc.query("SELECT * FROM admin_users WHERE username = '" + login_credentials.username + "' AND password = '" + password + "'", function (error, results, fields) {
            if (error) {
                console.log(error);
                reject(error);
            } else if (results.length == 0) {
                reject({ error: true, message: 'Authentication Error' });
            } else {
                resolve({ error: false, message: 'Login Successful', token:results[0]['token'] });
            }
        });
    });
    
}

module.exports.insertUser = function (user_credentials) {
    return new Promise(function(resolve, reject) {
        insertUserData(user_credentials).then( function(success){
            resolve(success);
        }).catch( function(error){
            reject(error);
        });
    });
}

//module.exports.insertUser = function (user_credentials, callback) {
//    insertUserData(user_credentials, function (insert_flag) {
//        if (insert_flag == '1') {
//            console.log('TEJAS PAGAL HAI');
//            return callback('1');
//        } else if(insert_flag == '0'){
//            console.log('HENCE PROVED');
//            return callback('0');
//        }
//        else{
//            return callback('2');
//        }
//    });
//}

function insertUserData(user_credentials) {
    return new Promise(function(resolve, reject) {
        var password = crypto.createHash('md5').update(user_credentials.password).digest('hex');
    //    console.log(user_credentials);
        mc.query("SELECT * FROM admin_users WHERE username = '"+user_credentials.username+"'", function(error, results,fields){
            if(results.length == 0){
                mc.query("INSERT INTO admin_users(username, firstname, surname, email, usertype, password) VALUES ('" + user_credentials.username + "', '" + user_credentials.firstname + "', '" + user_credentials.surname + "', '" + user_credentials.email + "'," + user_credentials.usertype + ", '" + password + "')", function (error, results, fields) {
                    if (error) {
                        reject({ error: true, message: 'Not Added'});
                    } else {
                        resolve({ error: false, message: 'Added Successfuly'});
                    }
                });
            }else{
                reject({ error: true, message: 'Duplicate Username Detected'});
            }
        });
    });
}

module.exports.searchUser = function (search_data){
    return new Promise(function(resolve, reject){
        mc.query("SELECT username from admin_users WHERE username LIKE '"+search_data+"%'", function(error, results, fields){
           if(error){
               reject(error);
           } else if(results.length == 0){
               resolve({error:false, message:'No User Found'});
           }else{
               resolve({error:false, message:'Success', data:results});
           } 
        });
    });
}

module.exports.deleteUser = function(userId){
    return new Promise(function (resolve, reject){
       mc.query("DELETE FROM admin_users WHERE user_id = "+userId, function(error, results, fields){
           if(error){
               reject({error: true, message:'Error'});
           }else{
               resolve({error:false, message:'User Deleted Successfully'});
           }
       }) 
    });
}

module.exports.addMultipleUser = (multipleUserData) => {
    return new Promise (function (resolve, reject){
//         for (var user_credentials of multipleUserData['data']){
//             console.log(user_credentials);
//            var password = crypto.createHash('md5').update(user_credentials.password).digest('hex');
//            mc.query("INSERT INTO admin_users(username, firstname, surname, email, usertype, password) VALUES ('" + user_credentials.username + "', '" + user_credentials.firstname + "', '" + user_credentials.surname + "', '" + user_credentials.email + "'," + user_credentials.usertype + ", '" + password + "')", function (error, results, fields) {
//               if(error){
//                   reject(error);
//               }else{
//                   console.log('here');
////                   continue;
//               } 
//            });
//         }
    async.forEachOf(multipleUserData.data,function (user_credentials, key, call) {
//        console.log(key);
        var password = crypto.createHash('md5').update(user_credentials.password).digest('hex');
        mc.query("INSERT INTO admin_users(username, firstname, surname, email, usertype, password) VALUES ('" + user_credentials.username + "', '" + user_credentials.firstname + "', '" + user_credentials.surname + "', '" + user_credentials.email + "'," + user_credentials.usertype + ", '" + password + "')", function (error, results, fields) {
           if(error){
               reject(error);
           }else{
//               console.log('here');
               call();
           }
        });
    }, function (err) {
        if (!err){
             resolve({error:false, message:'Users Added Successfully'});
         }
    });
         
    });
}

module.exports.editUser = (edit_data, userid) => {
    return new Promise( function (resolve, reject){
        console.log('function enter');
        mc.query('UPDATE admin_users SET email = "'+edit_data.email+'" WHERE user_id = '+userid, function(error, results, fields){
           if(error){
               console.log('error');
               reject(error);
           } else{
               console.log('true');
               resolve({error:false, message:'Updated Successful'});
           }
        });
    });
    
}