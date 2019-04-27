
// This code is just to check whether node is working or not.
//var http = require('http');
//
//var server = http.createServer(function (req, res) {
//    res.writeHead(200, {'Content-Type': 'text/html'});
//    res.end('Hello World!');
//});
//server.listen(8080, function(){
//    console.log('Node JS running');
//});

// This is express package with basic functionalities.
//var express=require('express');
//var app=express();
//app.set('view engine','jade');
//app.get('/sonal',function(req,res)
//{
//    return res.send({ error: false, message: 'Login Successful'})
//});
//var server=app.listen(8080,function()
//{
//    console.log('I am running node js');
//});

var express=require('express');
var app=express();
//var mysql = require('mysql');
var bodyParser = require('body-parser');
var request = require('request');
var api_login = require('./login/login');
var categories = require('./category/category');
var auth = require('./authentication');

//var crypto = require('crypto');
//var mc = require('./connection');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var server=app.listen(8080,function()
{
    console.log('I am running node js');
});

app.post('/login', function (req, res) {
    var login_data = req.body;
    api_login.login_auth(login_data).then( function(success){
        return res.send(success);
    }).catch( function(error){
        return res.send(error);
    });

//    api_login.login_auth(login_data, function (return_data) {
//        if (return_data) {
//             return res.send({ error: false, message: 'Login Successful' });
//
////            api_login.create_token(login_data.username, function (generated_token) {
////                if (generated_token) {
////                    return res.send({ error: false, message: 'Login Successful', token: generated_token });
////                } else {
////                    return res.send({ error: true, message: 'Invalid Credentials' })
////                }
////            });
//        } else {
//            return res.send({ error: true, message: 'Invalid Credentials' });
//        }
////    console.log(return_data);
////    return res.send({ error: false, message: 'Login Successful' });
//    });

});

app.post('/add_user', function(req, res){
    var user_data = req.body;
    var header_token = req.get('token');
    auth.authenticateUser(user_data.userid,header_token).then(function(success){
        return api_login.insertUser(user_data);
    }).then(function(success){
        return res.send(success);
     }).catch( function(error){
         return res.send(error);
     });

    
//app.post('/add_user', function(req, res){
//    var user_data = req.body;
//    api_login.insertUser(user_data, function(status){
//        if(status == '1'){
//            return res.send({ error: false, message: 'Added Successful' });
//        }else if(status == '2'){
//            return res.send({ error: true, message: 'Duplicate Username Detected'});
//        }else{
//            return res.send({ error: true, message: 'Not Added'});
//        }
//    }); 
});

app.get('/search_users/:search_key', function(req, res){
    var search_data = req.params.search_key;
    api_login.searchUser(search_data).then( function(success){
        console.log(success);
        return res.send(success);
    }).catch( function(error){
        console.log('error');
        return res.send(error);
    })
});


app.delete('/delete_user/:id', function(req, res){
   var userId = req.params.id;
   api_login.deleteUser(userId).then( function(success){
       return res.send(success);
   }).catch( function(error){
       return res.send(error);
   });
});

app.post('/add_multiple_users', function(req,res){
    var multipleUserData = req.body;
    console.log(multipleUserData);
    api_login.addMultipleUser(multipleUserData).then( function(success){
        return res.send(success);
    }).catch( function(error){
        return res.send(error);
    });
});

app.post('/edit_user/:userid', async function(req,res){
    var editUserData = req.body;
    var userId = req.params.userid;
    var result = await api_login.editUser(editUserData, userId);
    console.log('here');
    console.log(result);
});

app.get('/api_call_request_api', async function(req, res){
   request('http://localhost:8080/search_users/a', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  }); 
});

app.get('/getCategories', async function(req,res){
//    console.log(categories);
   var categories_data = await categories.getCategory();
   return res.send({'error': false, 'data':categories_data});
});

app.post('/insertCategory', async function(req,res){
   var categoryData = req.body;
   var result =  await categories.insertCategory(categoryData);
//   console.log(result);
   return res.send(result);
   
});

app.post('/updateCategory/:id', function(req,res){
    var category_id = req.params.id;
    var categoryData = req.body;
    categories.updateCategory(categoryData, category_id).then(function(success){
        res.send(success);
    }).catch(function(error){
        res.send(error);
    });
//    return res.send(result);
});