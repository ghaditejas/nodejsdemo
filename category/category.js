/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mc = require('../connection');

class Category{
    
//    constructor(){
//        console.log('here');
//    }
    getCategory(){
        return new Promise(function(resolve,reject){
            mc.query("SELECT * FROM categories", function(error,results,fields){
               if(error){
                   reject(error);
               }else{
                   resolve(results);
               } 
            });
        });
    }
    
    insertCategory(categoryData){
        return new Promise( function(resolve,reject){
           mc.query("INSERT INTO categories(category_name,url_slug,status,show_status,created_by,updated_by) VALUES\n\
            ('"+categoryData.category_name+"','"+categoryData.url_slug+"',"+categoryData.status+",\n\
            "+categoryData.show_status+","+categoryData.created_by+","+categoryData.updated_by+")", function(error, results, fields){
               if(error){
                   reject({'error':true, 'result':error});
               }else{
                   resolve({'error':false, 'result':'Category inserted successfully'});
               } 
            }); 
        });
    }
    
    updateCategory(categoryData,id){
     return new Promise (function(resolve,reject){
        mc.query("UPDATE categories SET category_name = '"+categoryData.category_name+"', url_slug = '"+categoryData.url_slug+"',status = '"+categoryData.status+"', show_status = '"+categoryData.show_status+"' WHERE category_id = "+id, function(error, results, fields){
             if(error){
                 reject({'error':true, 'result':error});
             }else{
                 resolve({'error':false, 'result':'Category updated successfully'});
             }
        }); 
     });   
    }
}

module.exports = new Category();