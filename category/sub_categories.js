/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mc = require('../connection');

class Sub_categories{
    
    getSubCategory(){
        return new Promise(function(resolve,reject){
            mc.query("SELECT * FROM sub_categories", function(error,results,fields){
               if(error){
                   reject(error);
               }else{
                   resolve(results);
               } 
            });
        });
    }
}
