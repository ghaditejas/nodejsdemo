/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mc = require('./connection');

class Authentication{
    authenticateUser(userid,token){
        return new Promise(function(resolve,reject){
            mc.query('SELECT * FROM admin_users WHERE user_id = '+userid+' AND token = "'+token+'"', function(error,results,fields){
                if(error){
                   reject({error:'true', message:'Authentication failed'});
                } else if(results.length == 0){
                   reject({error:'true', message:'Authentication failed'});
                } else{
                    resolve({error:'false', message:'Authenticated user'});
                }
            });
        });
    }
}

module.exports = new Authentication();